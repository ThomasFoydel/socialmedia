import React from 'react';
import Axios from 'axios';
const CommentRemoveLikeButton = ({ token, userId, commentId, setLikes }) => {
  const removeLikeHandler = () => {
    Axios.post(
      `/comment/removelikecomment/${commentId}`,
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
      <div onClick={removeLikeHandler} className='commentremovelikebutton'>
        <i className='fa fa-thumbs-up fa-lg' aria-hidden='true'></i>
      </div>
      <div className='commentdislikebuttongrayedout'>
        <i className='fa fa-thumbs-down fa-lg' aria-hidden='true'></i>
      </div>
    </div>
  );
};

export default CommentRemoveLikeButton;
