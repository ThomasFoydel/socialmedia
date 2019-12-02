import React, { useState } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { addCommentToPost } from '../../redux/posts/postActions';

import './CommentForm.scss';

const CommentForm = ({
  postId,
  token,
  userName,
  addCommentToPost,
  setCommentsArray,
  page
}) => {
  const [commentContent, setCommentContent] = useState('');

  const handleChange = e => {
    setCommentContent(e.target.value);
  };

  const handleSubmit = e => {
    if (!commentContent) {
      return;
    }
    Axios.post(
      `/comment/newcomment`,
      { commentContent, postId, authorName: userName },
      {
        headers: { 'x-auth-token': token }
      }
    ).then(result => {
      if (page !== 'individualpost') {
        addCommentToPost(result.data);
      }
      setCommentsArray(result.data.comments);
    });
    setCommentContent('');
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className='commentform'>
      <div className='commentformcontainer'>
        {/* <div className='flex'> */}
        <input
          type='text'
          name='commentContent'
          className='commentformtextarea'
          value={commentContent}
          onChange={handleChange}
          placeholder='comment...'
          onKeyDown={handleKeyDown}
        />
        {/* </div> */}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  userName: state.currentUser.userName,
  profilePicId: state.currentUser.profilePicId
});
const mapDispatchToProps = dispatch => {
  return {
    addCommentToPost: post => dispatch(addCommentToPost(post))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);
