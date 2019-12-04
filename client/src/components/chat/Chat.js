import React, { useEffect } from 'react';
import ChatFriendlist from './ChatFriendList';
import PrivateMessageForm from './PrivateMessageForm';
import CurrentChatBox from './CurrentChatBox';

import { connect } from 'react-redux';

import './Chat.scss';

const Chat = ({
  token,
  userName,
  userId,
  setChatOpen,
  currentFriend,
  mainSocket,
  messages,
  modifiedFriendList,
  setMessages,
  setCurrentFriend,
  socket,
  setUpdatedFriendList,
  setMainSocket,
  updateCurrentUser
}) => {
  useEffect(() => {
    let isSubscribed = true;
    setMainSocket(socket);

    socket.on('friendList', modifiedFriendList => {
      if (isSubscribed) {
        setUpdatedFriendList(modifiedFriendList);
      }
    });

    return () => {
      if (socket) {
        isSubscribed = false;
        socket.removeAllListeners();
        socket.emit('disconnect', socket.id);
        socket.off();
      }
    };
  }, [setMainSocket, setUpdatedFriendList]);

  let currentFriendIsOnline;
  if (currentFriend) {
    const friend = modifiedFriendList.find(friend => {
      if (friend.friendId === currentFriend.friendId) {
        return friend;
      }
      return null;
    });
    currentFriendIsOnline = friend.isOnline;
  }

  return (
    <>
      {mainSocket && (
        <div className='chatcontainer'>
          <div className='chatboxicons'>
            {currentFriend && (
              <i
                className='fa fa-users fa-2x chatbacktofriendlistbutton'
                aria-hidden='true'
                onClick={() => setCurrentFriend(null)}
              />
            )}
            <i
              className='fa fa-times fa-2x closechatbutton'
              aria-hidden='true'
              onClick={() => setChatOpen(false)}
            />
          </div>
          <div className='chatfriendlistcontainer'>
            {modifiedFriendList.length === 0 && (
              <h4 className='chatnofriendsmessage'>no friends yet!</h4>
            )}
            {!currentFriend && (
              <ChatFriendlist
                friendList={modifiedFriendList}
                updateCurrentUser={updateCurrentUser}
              />
            )}
          </div>
          {currentFriend && (
            <>
              <CurrentChatBox
                messages={messages}
                setCurrentFriend={setCurrentFriend}
                currentFriend={currentFriend}
                currentFriendIsOnline={currentFriendIsOnline}
              />
              <PrivateMessageForm
                currentFriend={currentFriend}
                updateCurrentUser={updateCurrentUser}
                socket={mainSocket}
                userId={userId}
                userName={userName}
                currentFriendIsOnline={currentFriendIsOnline}
                token={token}
                setMessages={setMessages}
                messages={messages}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  userName: state.currentUser.userName,
  userId: state.auth.userId
});

export default connect(mapStateToProps)(Chat);
