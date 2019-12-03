import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import FeedPost from '../feed/mainfeed/feedpost/FeedPost';

const IndividualPost = ({ match, token }) => {
  const [foundPost, setFoundPost] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      const post = await Axios.get(`/post/post/${match.params.id}`, {
        headers: { 'x-auth-token': token }
      });
      setFoundPost(post.data);
      setLoading(false);
    };
    getPost();
  }, [match.params.id, token]);
  return (
    <div>
      <div style={{ height: '10rem' }} />
      {loading ? (
        <h1>loading</h1>
      ) : (
        <FeedPost post={foundPost} page='individualpost' />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token
});

export default connect(mapStateToProps)(IndividualPost);
