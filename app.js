const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const socketio = require('socket.io');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');

const commentroutes = require('./routes/commentRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const searchRoutes = require('./routes/searchRoutes');
const statusRoutes = require('./routes/statusRoutes');

const User = require('./models/user');
const PrivateMessage = require('./models/privateMessage');

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.json());

app.use(
  expressSession({
    secret: process.env.SECRET || 'local development secret',
    saveUninitialized: false,
    resave: false
  })
);

// ##### ROUTES #####
app.use('/user', userRoutes);

app.use('/post', postRoutes);

app.use('/comment', commentroutes);

app.use('/message', messageRoutes);

app.use('/search', searchRoutes);

app.use('/status', statusRoutes);

let onlineUsers = {};

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
//production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join((__dirname = 'client/build/index.html')));
  });
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(res => {
    const expressServer = app.listen(process.env.PORT || 8000);
    console.log('listening on port 8000');

    // BEGIN SOCKET IO:
    const io = socketio(expressServer);

    io.on('connection', socket => {
      console.log('online users: ', onlineUsers, 'new user: ', socket.id);
      const setUpCurrentChatUser = async () => {
        const token = socket.handshake.query.token;
        if (!token) {
          console.log('no token auth denied');
        } else {
          try {
            const decoded = jwt.verify(token, process.env.SECRET);
            // console.log('DECODED: ', decoded);
            let current_time = Date.now() / 1000;
            if (decoded.exp < current_time) {
              console.log('expired');

              // token is expired, not authorized
            } else {
              let decodedUser = await User.findOne({
                _id: decoded.tokenUser.userId
              });
              const currentUser = {
                userId: decodedUser._id,
                socketId: socket.id
              };
              onlineUsers = addUser(onlineUsers, currentUser);

              const currentUserFriendList = decodedUser.friendList;

              const modifiedFriendList = currentUserFriendList.map(friend => {
                if (friend in onlineUsers) {
                  const newFriend = {
                    friendId: friend,
                    isOnline: true,
                    socketId: onlineUsers[friend].socketId
                  };
                  return newFriend;
                } else if (!(friend in onlineUsers)) {
                  const newFriend = {
                    friendId: friend,
                    isOnline: false,
                    socketId: null
                  };
                  return newFriend;
                }
              });

              socket.emit('friendList', modifiedFriendList);
            }
          } catch (error) {
            console.log('jwt error ');
          }
        }
      };

      setUpCurrentChatUser();

      const addUser = (userList, user) => {
        let newList = Object.assign({}, userList);
        newList[user.userId] = user;
        return newList;
      };

      socket.on('newPrivateMessageFromClient', async message => {
        console.log('newPrivateMessageFromClient: ', message);

        const friendId = message.currentFriend.friendId;
        const friendSocketId = onlineUsers[friendId].socketId;

        const newPrivateMessage = new PrivateMessage({
          sender: message.senderId,
          recipient: message.currentFriend.friendId,
          participants: [message.senderId, message.currentFriend.friendId],
          content: message.message
        });
        newPrivateMessage.save().then(result => {
          console.log('newPrivateMessage: ', result);

          //to friend
          io.to(`${friendSocketId}`).emit('privateMessageFromServer', result);

          //to sender
          const userSocketId = onlineUsers[message.senderId].socketId;
          console.log('USER SOCKET ID: ', userSocketId);
          io.to(`${userSocketId}`).emit('ownPrivateMessageFromServer', result);
        });
      });

      socket.on('updateFriendList', async friendList => {
        const modifiedFriendList = friendList.map(friend => {
          if (friend in onlineUsers) {
            const newFriend = {
              friendId: friend,
              isOnline: true,
              socketId: onlineUsers[friend].socketId
            };
            return newFriend;
          } else if (!(friend in onlineUsers)) {
            const newFriend = {
              friendId: friend,
              isOnline: false,
              socketId: null
            };
            return newFriend;
          }
        });

        socket.emit('friendList', modifiedFriendList);
      });

      socket.on('disconnect', async socketId => {
        try {
          const token = socket.handshake.query.token;
          const decoded = jwt.verify(token, process.env.SECRET);
          const userId = decoded.tokenUser.userId;
          console.log(
            'DISCONNECT, socket id: ',
            socketId,
            'decoded.tokenUser.userId: ',
            decoded.tokenUser.userId
          );
          delete onlineUsers[userId];
          console.log('updated online users after disconnect: ', onlineUsers);
        } catch (err) {
          console.log(err);
        }
      });
    });
  })
  .catch(err => console.log(err));
