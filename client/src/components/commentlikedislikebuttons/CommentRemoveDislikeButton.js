import React from 'react';
import Axios from 'axios';
const CommentRemoveDislikeButton = ({
  token,
  userId,
  commentId,
  setDislikes
}) => {
  const removeDislikeHandler = () => {
    Axios.post(
      `http://localhost:8000/comment/removedislikecomment/${commentId}`,
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
      <div className='commentlikebuttongrayedout'>
        <i className='fa fa-thumbs-up fa-lg' aria-hidden='true'></i>
      </div>
      <div
        onClick={removeDislikeHandler}
        className='commentremovedislikebutton'
      >
        <i className='fa fa-thumbs-down fa-lg' aria-hidden='true'></i>
      </div>
    </div>
  );
};

export default CommentRemoveDislikeButton;
