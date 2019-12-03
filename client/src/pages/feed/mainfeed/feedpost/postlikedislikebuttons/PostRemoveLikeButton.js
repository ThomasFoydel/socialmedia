import React from 'react';
import Axios from 'axios';

const PostRemoveLikeButton = ({ token, userId, postId, setLikes }) => {
  const removeLikeHandler = () => {
    Axios.post(
      `/post/removelikepost/${postId}`,
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
      <div onClick={removeLikeHandler}>
        <i
          className='fa fa-thumbs-up fa-2x postremovelikebutton'
          aria-hidden='true'
        ></i>
      </div>
      <i
        className='fa fa-thumbs-down fa-2x postdislikebuttongrayedout'
        aria-hidden='true'
      ></i>
    </div>
  );
};

export default PostRemoveLikeButton;
