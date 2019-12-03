import React from 'react';
import Axios from 'axios';

const HomeStatusRemoveLikeButton = ({ token, userId, statusId, setLikes }) => {
  const removeLikeHandler = () => {
    Axios.post(
      `/status/removelikestatus/${statusId}`,
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
      <div onClick={removeLikeHandler} className='homestatusremovelikebutton'>
        <i
          className='fa  fa-lg fa-thumbs-up homestatusremovelikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
      <div className='homestatusdislikebuttongrayedout'>
        <i
          className='fa  fa-lg fa-thumbs-down homestatusdislikebuttongrayedouticon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default HomeStatusRemoveLikeButton;
