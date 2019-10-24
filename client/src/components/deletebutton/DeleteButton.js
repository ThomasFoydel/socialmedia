import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deletePost } from '../../redux/posts/postActions';

import './DeleteButton.scss';

function DeleteButton({ postId, userId, userName, token, deletePost }) {
  // const deleteLink = `/deletepost/${postId}`;
  const sendDeleteToBackEnd = async postId => {
    const deletedPost = await Axios.post(
      `http://localhost:8000/post/deletepost/${postId}`,
      {
        postId,
        userId: userId,
        userName: userName
      },
      { headers: { 'x-auth-token': token } }
    );

    deletePost(deletedPost.data);
  };

  const handleClick = () => {
    sendDeleteToBackEnd(postId);
  };

  return (
    <div>
      <Link to='/feed'>
        <button onClick={handleClick} className='deletebutton'>
          confirm
        </button>
      </Link>
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    deletePost: post => {
      dispatch(deletePost(post));
    }
  };
};

const mapStateToProps = state => ({
  userId: state.auth.userId,
  userName: state.currentUser.userName,
  token: state.auth.token
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteButton);
