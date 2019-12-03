import React from 'react';
import Axios from 'axios';

const CommentLikeButton = ({ commentId, token, userId, setLikes }) => {
  const likeHandler = () => {
    Axios.post(
      `/comment/likecomment/${commentId}`,
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
      <div onClick={likeHandler} className='commentlikebutton'>
        <i className='fa fa-thumbs-up fa-lg' aria-hidden='true'></i>
      </div>
    </div>
  );
};

export default CommentLikeButton;
