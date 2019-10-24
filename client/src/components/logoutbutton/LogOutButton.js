import React from 'react';
import { connect } from 'react-redux';
import { logoutSession } from '../../redux/auth/authActions';
import { resetCurrentUserInfo } from '../../redux/currentUser/currentUserActions';

function LogOutButton({ logoutSession, resetCurrentUserInfo }) {
  const logoutHandler = () => {
    logoutSession();
    resetCurrentUserInfo();
  };
  return <span onClick={logoutHandler}>Log Out</span>;
}

const mapDispatchToProps = dispatch => {
  return {
    logoutSession: () => dispatch(logoutSession()),
    resetCurrentUserInfo: () => dispatch(resetCurrentUserInfo())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LogOutButton);
