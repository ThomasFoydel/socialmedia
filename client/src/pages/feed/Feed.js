import React, { useEffect } from 'react';
import MainFeed from './mainfeed/MainFeed';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../redux/currentPage/currentPageActions';

function Feed({ token, isLoggedIn, setCurrentPage }) {
  useEffect(() => {
    setCurrentPage('feed');
  }, [setCurrentPage]);

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

const mapDispatchToProps = dispatch => ({
  setCurrentPage: page => dispatch(setCurrentPage(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
