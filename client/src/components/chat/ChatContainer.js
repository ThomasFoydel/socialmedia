import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Axios from 'axios';
import { connect } from 'react-redux';

import Chat from './Chat';

let socket;

const ChatContainer = ({ isLoggedIn, token, userName, friendList }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [mainSocket, setMainSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [updatedFriendList, setUpdatedFriendList] = useState([]);

  const ENDPOINT = `?token=${token}`;

  socket = io(ENDPOINT);

  socket.on('privateMessageFromServer', message => {
    setMessages([...messages, message]);
  });

  socket.on('ownPrivateMessageFromServer', ownMessage => {
    setMessages([...messages, ownMessage]);
  });

  useEffect(() => {
    let isSubscribed = true;
    setMainSocket(socket);

    if (isSubscribed) {
      socket.on('friendList', modifiedFriendList => {
        setUpdatedFriendList(modifiedFriendList);
      });
    }

    return () => {
      isSubscribed = false;
      if (socket) {
        socket.emit('disconnect', socket.id);
        socket.off();
      }
    };
  }, []);

  const updateCurrentUser = async newUser => {
    if (newUser) {
      setCurrentFriend(newUser);
      const foundMessages = await Axios.get(
        `/message/getmessages/${newUser.friendId}`,
        {
          headers: { 'x-auth-token': token }
        }
      );
      setMessages(foundMessages.data);
    }
  };

  const openChat = () => {
    setChatOpen(true);
    socket.emit('updateFriendList', friendList);
  };

  return (
    <div>
      {isLoggedIn && (
        <>
          {chatOpen ? (
            <Chat
              userName={userName}
              token={token}
              setChatOpen={setChatOpen}
              className='chat'
              socket={socket}
              currentFriend={currentFriend}
              mainSocket={mainSocket}
              messages={messages}
              setMessages={setMessages}
              modifiedFriendList={updatedFriendList}
              setCurrentFriend={setCurrentFriend}
              updateCurrentUser={updateCurrentUser}
              setUpdatedFriendList={setUpdatedFriendList}
              setMainSocket={setMainSocket}
            />
          ) : (
            <button className='openchatbutton' onClick={openChat}>
              chat
            </button>
          )}
        </>
      )}
    </div>
  );
};
const mapStateToProps = state => ({
  friendList: state.currentUser.friendList
});
export default connect(mapStateToProps)(ChatContainer);
