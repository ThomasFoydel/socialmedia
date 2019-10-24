import React from 'react';
import Axios from 'axios';

const StatusLikeButton = ({ statusId, token, userId, setLikes }) => {
  const likeHandler = () => {
    Axios.post(
      `/status/likestatus/${statusId}`,
      { likeAuthorId: userId },
      {
        headers: { 'x-auth-token': token }
      }
    ).then(result => {
      setLikes(result.data.likes);
    });
  };

  return (
    <div>
      <div onClick={likeHandler} className='statuslikebutton'>
        <i
          className='fa  fa-lg fa-thumbs-up statuslikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default StatusLikeButton;
