import React from 'react';
import Axios from 'axios';

const PostLikeButton = ({ postId, token, userId, setLikes }) => {
  const likeHandler = () => {
    Axios.post(
      `/post/likepost/${postId}`,
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
      <div onClick={likeHandler}>
        <i
          className='fa fa-thumbs-up fa-2x postlikebutton'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default PostLikeButton;
