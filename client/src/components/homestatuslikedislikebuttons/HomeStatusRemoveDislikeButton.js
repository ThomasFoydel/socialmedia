import React from 'react';
import Axios from 'axios';

const HomeStatusRemoveDislikeButton = ({
  token,
  userId,
  statusId,
  setDislikes
}) => {
  const removeDislikeHandler = () => {
    Axios.post(
      `/status/removedislikestatus/${statusId}`,
      { dislikeAuthorId: userId },
      {
        headers: { 'x-auth-token': token }
      }
    ).then(result => {
      setDislikes(result.data.dislikes);
    });
  };

  return (
    <div className='flex'>
      <div className='homestatuslikebuttongrayedout'>
        <i
          className='fa  fa-lg fa-thumbs-up homestatuslikebuttongrayedouticon'
          aria-hidden='true'
        ></i>
      </div>
      <div
        onClick={removeDislikeHandler}
        className='homestatusremovedislikebutton'
      >
        <i
          className='fa  fa-lg fa-thumbs-down homestatusremovedislikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default HomeStatusRemoveDislikeButton;
