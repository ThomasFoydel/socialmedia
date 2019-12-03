import React from 'react';
import Axios from 'axios';

const HomeStatusDislikeButton = ({ statusId, token, userId, setDislikes }) => {
  const dislikeHandler = () => {
    Axios.post(
      `/status/dislikestatus/${statusId}`,
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
      <div onClick={dislikeHandler} className='homestatusdislikebutton'>
        <i
          className='fa fa-lg fa-thumbs-down homestatusdislikebuttonicon'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default HomeStatusDislikeButton;
