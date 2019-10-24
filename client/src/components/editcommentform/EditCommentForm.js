import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import './EditCommentForm.scss';

const EditCommentForm = ({
  foundComment,
  token,
  setEditOpen,
  commentId,
  updateComment
}) => {
  const [newContent, setNewContent] = useState('');
  const [newContentEntered, setNewContentEntered] = useState(false);

  useEffect(() => {
    setNewContent(foundComment.commentContent);
  }, [foundComment]);

  const handleChange = e => {
    setNewContent(e.target.value);
    setNewContentEntered(true);
  };

  const handleCancel = () => {
    setEditOpen(false);
  };

  const handleSubmit = async () => {
    if (newContentEntered) {
      Axios.post(
        `/comment/editcomment/${foundComment._id}`,
        { newContent, commentId },
        { headers: { 'x-auth-token': token } }
      ).then(result => {
        updateComment(result.data.updatedComment);
        setEditOpen(false);
      });
    } else {
      setEditOpen(false);
    }
  };

  const keyDownHandler = e => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className='flex editcommentform'>
      <input
        type='text'
        onChange={handleChange}
        value={newContent}
        onKeyDown={keyDownHandler}
        className='editcommentforminput'
      ></input>

      <i
        onClick={handleCancel}
        className='fa fa-times editcommentformclosebutton'
        aria-hidden='true'
      ></i>
    </div>
  );
};

export default EditCommentForm;
