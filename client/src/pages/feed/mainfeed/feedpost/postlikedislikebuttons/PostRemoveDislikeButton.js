import React from 'react';
import Axios from 'axios';

const PostRemoveDislikeButton = ({ token, userId, postId, setDislikes }) => {
  const removeDislikeHandler = () => {
    Axios.post(
      `/post/removedislikepost/${postId}`,
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
      <i
        className='fa fa-thumbs-up fa-2x postlikebuttongrayedout'
        aria-hidden='true'
      ></i>
      <div onClick={removeDislikeHandler}>
        <i
          className='fa fa-thumbs-down fa-2x postremovedislikebutton'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default PostRemoveDislikeButton;
