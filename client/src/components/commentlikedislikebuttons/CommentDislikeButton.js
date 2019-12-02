import React from 'react';
import Axios from 'axios';

const CommentDislikeButton = ({ commentId, token, userId, setDislikes }) => {
  const dislikeHandler = () => {
    Axios.post(
      `/comment/dislikecomment/${commentId}`,
      { dislikeAuthorId: userId },
      {
        headers: { 'x-auth-token': token }
      }
    ).then(result => {
      setDislikes(result.data.dislikes);
    });
  };

  return (
    <div>
      <div onClick={dislikeHandler} className='commentdislikebutton'>
        <i className='fa fa-thumbs-down fa-lg ' aria-hidden='true'></i>
      </div>
    </div>
  );
};

export default CommentDislikeButton;
