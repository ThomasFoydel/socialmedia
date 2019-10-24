import React from 'react';
import Axios from 'axios';

const PostDislikeButton = ({ postId, token, userId, setDislikes }) => {
  const dislikeHandler = () => {
    Axios.post(
      `http://localhost:8000/post/dislikepost/${postId}`,
      { likeAuthorId: userId },
      {
        headers: { 'x-auth-token': token }
      }
    ).then(result => {
      // addDislikeToPost({ data: result.data, currentUserId: userId });
      setDislikes(result.data.dislikes);
    });
  };

  return (
    <div>
      <div onClick={dislikeHandler}>
        <i
          className='fa fa-thumbs-down fa-2x postdislikebutton'
          aria-hidden='true'
        ></i>
      </div>
    </div>
  );
};

export default PostDislikeButton;
