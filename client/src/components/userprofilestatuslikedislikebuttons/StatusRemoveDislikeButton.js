import React from 'react';
import Axios from 'axios';

const StatusRemoveDislikeButton = ({
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
      <div className='statuslikebuttongrayedout'>
        <i
          className='fa  fa-lg fa-thumbs-up statuslikebuttongrayedouticon'
          aria-hidden='true'
        ></i>
      </div>
      <div onClick={removeDislikeHandler} className='statusremovedislikebutton'>
        <i
          className='fa  fa-lg fa-thumbs-down statusremovedislikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default StatusRemoveDislikeButton;
