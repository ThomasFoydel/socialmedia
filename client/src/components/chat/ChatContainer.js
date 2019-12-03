import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Axios from 'axios';
import { connect } from 'react-redux';
import { useSpring, animated, config } from 'react-spring';

import Chat from './Chat';

let socket;

const ChatContainer = ({ isLoggedIn, token, userName, friendList }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [mainSocket, setMainSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [updatedFriendList, setUpdatedFriendList] = useState([]);

  const ENDPOINT = `http://localhost:8000?token=${token}`;

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
        socket.removeAllListeners();
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

  const animationProps = useSpring({
    opacity: chatOpen ? 1 : 0,
    background: chatOpen ? 'rgb(10, 125, 255)' : 'rgba(10, 125, 255, 0)',
    right: chatOpen ? 0 : -200,
    position: chatOpen ? 'fixed' : 'inherit',
    maxHeight: chatOpen ? '45rem' : '0.1rem',
    config: { mass: 0.8, tension: 300, friction: 40 }
  });

  const reverseAnimationProps = useSpring({
    opacity: chatOpen ? 0 : 1,
    background: chatOpen ? 'rgba(10, 125, 255, 0)' : 'rgb(10, 125, 255)',
    right: chatOpen ? -200 : 0,
    position: chatOpen ? 'inherit' : 'fixed',
    display: chatOpen ? 'none' : 'block',
    config: { mass: 0.8, tension: 300, friction: 40 }
  });

  return (
    <div>
      {isLoggedIn && (
        <>
          <div
            style={{
              overflow: chatOpen ? 'visible' : 'hidden',
              maxHeight: chatOpen ? '45rem' : '0.1rem',
              display: chatOpen ? 'inherit' : 'none'
            }}
          >
            <animated.div style={animationProps}>
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
            </animated.div>
          </div>

          <animated.div style={reverseAnimationProps}>
            <button className='openchatbutton' onClick={openChat}>
              chat
            </button>
          </animated.div>
        </>
      )}
    </div>
  );
};
const mapStateToProps = state => ({
  friendList: state.currentUser.friendList
});
export default connect(mapStateToProps)(ChatContainer);
