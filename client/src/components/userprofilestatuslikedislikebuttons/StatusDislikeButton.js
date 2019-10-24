import React from 'react';
import Axios from 'axios';

const StatusDislikeButton = ({ statusId, token, userId, setDislikes }) => {
  const dislikeHandler = () => {
    Axios.post(
      `http://localhost:8000/status/dislikestatus/${statusId}`,
      { likeAuthorId: userId },
      {
        headers: { 'x-auth-token': token }
      }
    ).then(result => {
      setDislikes(result.data.dislikes);
    });
  };

  return (
    <div>
      <div onClick={dislikeHandler} className='statusdislikebutton'>
        <i
          className='fa fa-lg fa-thumbs-down statusdislikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default StatusDislikeButton;
