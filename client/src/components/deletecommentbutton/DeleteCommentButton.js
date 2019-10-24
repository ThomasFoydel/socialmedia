import React from 'react';
import Axios from 'axios';

const DeleteCommentButton = ({
  commentId,
  postId,
  commentsArray,
  setCommentsArray
}) => {
  const handleDeleteComment = () => {
    Axios.delete(`/comment/deletecomment/${commentId}`, {
      data: { postId: postId }
    }).then(result => {
      if (result.status === 200) {
        // deleteCommentFromPost(result.data);

        const newCommentArray = commentsArray.filter(
          comment => comment !== commentId
        );
        setCommentsArray(newCommentArray);
      }
    });
  };
  return (
    <div>
      <div className='commentdeleteconfirmbutton' onClick={handleDeleteComment}>
        confirm
      </div>
    </div>
  );
};

export default DeleteCommentButton;
