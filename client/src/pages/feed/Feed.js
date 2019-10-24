import React from 'react';
import MainFeed from '../../components/mainfeed/MainFeed';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

function Feed({ token, isLoggedIn }) {
  const conditionalRenderOrRedirect = token ? (
    <>
      <MainFeed isLoggedIn={isLoggedIn} />
    </>
  ) : (
    <Redirect to='/login' />
  );
  return conditionalRenderOrRedirect;
}

const mapStateToProps = state => ({
  token: state.auth.token,
  isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(Feed);
