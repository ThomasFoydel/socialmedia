import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import onlineIcon from '../../imgs/online.png';

const ChatFriendListIndividual = ({
  isOnline,
  id,
  friendSocket,
  updateCurrentUser
}) => {
  const [friend, setFriend] = useState({});

  useEffect(() => {
    if (isOnline) {
    }
    const getFriend = async () => {
      const foundFriend = await Axios.get(`/user/getuser/${id}`);
      setFriend(foundFriend.data);
    };
    getFriend();

    return () => {};
  }, [id, isOnline]);

  const updateCurrentFriendOpenForPrivateMessage = () => {
    updateCurrentUser({ name: friend.name, friendSocket, friendId: id });
  };

  return (
    <div className='chatfriendlistindividual'>
      {friend && (
        <div onClick={updateCurrentFriendOpenForPrivateMessage}>
          <div className='flex'>
            <img
              src={`/user/image/${friend.profilePicId}`}
              alt='friend profile'
              className='chatfriendlistprofilepic'
            />
            <h4 className='chatlistindividualfriendname'>{friend.name}</h4>
          </div>
          {isOnline && (
            <img
              src={onlineIcon}
              className='onlinedot'
              alt='friend is online'
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatFriendListIndividual;
