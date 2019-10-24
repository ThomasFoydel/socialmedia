import React, { useState } from 'react';
import Axios from 'axios';

import './UserProfileUnfriendButton.scss';

const UserProfileUnfriendButton = ({
  friendId,
  token,
  setIsFriend,
  setExistingAdd
}) => {
  const [unfriendOpen, setUnfriendOpen] = useState(false);

  const unfriendHandler = async () => {
    let deletedFriendship = null;
    deletedFriendship = await Axios.post(
      'http://localhost:8000/user/unfriend',
      { friendId: friendId },
      { headers: { 'x-auth-token': token } }
    );
    if (deletedFriendship) {
      setIsFriend(false);
      setExistingAdd(false);
    }
  };

  const openUnfriend = () => {
    setUnfriendOpen(true);
  };

  const closeUnfriend = () => {
    setUnfriendOpen(false);
  };

  return (
    <div className='profileunfriendbuttoncontainer'>
      {!unfriendOpen ? (
        <div className='profileunfriendopenbutton' onClick={openUnfriend}>
          unfriend
        </div>
      ) : (
        <div className='flex'>
          <div className='profileunfriendcancelbutton' onClick={closeUnfriend}>
            cancel
          </div>
          <div
            className='profileunfriendconfirmbutton'
            onClick={unfriendHandler}
          >
            confirm
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileUnfriendButton;
