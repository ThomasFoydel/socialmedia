import React from 'react';
import Axios from 'axios';

const HomeStatusLikeButton = ({ statusId, token, userId, setLikes }) => {
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
      <div onClick={likeHandler} className='homestatuslikebutton'>
        <i
          className='fa  fa-lg fa-thumbs-up homestatuslikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default HomeStatusLikeButton;
