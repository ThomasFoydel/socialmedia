import React from 'react';
import Axios from 'axios';

const StatusRemoveLikeButton = ({ token, userId, statusId, setLikes }) => {
  const removeLikeHandler = () => {
    Axios.post(
      `http://localhost:8000/status/removelikestatus/${statusId}`,
      { likeAuthorId: userId },
      {
        headers: { 'x-auth-token': token }
      }
    ).then(result => {
      setLikes(result.data.likes);
    });
  };

  return (
    <div className='flex'>
      <div onClick={removeLikeHandler} className='statusremovelikebutton'>
        <i
          className='fa  fa-lg fa-thumbs-up statusremovelikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
      <div className='statusdislikebuttongrayedout'>
        <i
          className='fa  fa-lg fa-thumbs-down statusdislikebuttongrayedouticon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default StatusRemoveLikeButton;
