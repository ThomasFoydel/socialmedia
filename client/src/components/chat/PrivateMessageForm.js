import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const PrivateMessageForm = ({
  socket,
  currentFriend,
  userId,
  userName,
  currentFriendIsOnline,
  token,
  setMessages,
  messages
}) => {
  useEffect(() => {}, []);

  const [messageInput, setMessageInput] = useState('');

  const inputMessage = e => {
    setMessageInput(e.target.value);
  };

  const sendMessage = async () => {
    if (messageInput.length > 0) {
      if (currentFriendIsOnline) {
        socket.emit('newPrivateMessageFromClient', {
          currentFriend: currentFriend,
          message: messageInput,
          senderSocket: socket.id,
          senderId: userId,
          senderName: userName
        });
      } else if (!currentFriendIsOnline) {
        const offlineMessage = await Axios.post(
          `/message/messagetoofflineuser/${currentFriend.friendId}`,
          { message: messageInput },
          { headers: { 'x-auth-token': token } }
        );
        setMessages([...messages, offlineMessage.data]);
      }

      setMessageInput('');
    }
  };

  const keyDownHandler = e => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  return (
    <div className='privatemessageform'>
      <input
        type='text'
        value={messageInput}
        onChange={inputMessage}
        onKeyDown={keyDownHandler}
      />
      <div className='chatsendbutton' onClick={sendMessage}>
        send
      </div>
    </div>
  );
};

export default PrivateMessageForm;
