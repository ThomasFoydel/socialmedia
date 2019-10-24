import React, { useState, useEffect, useRef } from 'react';
import IndividualPrivateMessage from './IndividualPrivateMessage';
import onlineIcon from '../../imgs/online.png';
import Axios from 'axios';

import { connect } from 'react-redux';

const CurrentChatBox = ({
  messages,
  userId,
  currentFriend,
  currentFriendIsOnline
}) => {
  const [currentFriendProfilePicId, setCurrentFriendProfilePicId] = useState(
    null
  );
  useEffect(() => {
    const setProfilePic = async () => {
      if (currentFriend) {
        const foundFriend = await Axios.get(
          `http://localhost:8000/user/getuser/${currentFriend.friendId}`
        );
        setCurrentFriendProfilePicId(foundFriend.data.profilePicId);
      }
    };

    setProfilePic();
  }, [currentFriend]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <>
      <span className='currentchatfriendname'>{currentFriend.name}</span>
      {currentFriendIsOnline && (
        <img
          src={onlineIcon}
          className='individualchatonlinedot'
          alt='online icon'
        />
      )}

      <div className='currentchatmessagecontainer'>
        {messages && (
          <>
            {messages.map((message, i) => {
              return (
                <IndividualPrivateMessage
                  key={i}
                  message={message.content}
                  createdAt={message.createdAt}
                  currentUserId={userId}
                  currentFriendId={currentFriend.friendId}
                  currentFriendName={currentFriend.name}
                  senderId={message.sender}
                  currentFriendProfilePicId={currentFriendProfilePicId}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  userId: state.auth.userId
});
export default connect(mapStateToProps)(CurrentChatBox);
