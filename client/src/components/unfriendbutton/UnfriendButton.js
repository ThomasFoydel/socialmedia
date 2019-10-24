import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { setFriendList } from '../../redux/currentUser/currentUserActions';

import './UnfriendButton.scss';

const UnfriendButton = ({ friendId, token, setFriendInfo, setFriendList }) => {
  const unfriendHandler = async () => {
    const deletedFriendship = await Axios.post(
      '/user/unfriend',
      { friendId: friendId },
      { headers: { 'x-auth-token': token } }
    );
    setFriendInfo(deletedFriendship.data.updatedFriend);
    setFriendList(deletedFriendship.data.updatedUser.friendList);
  };
  return (
    <span className='unfriendbuttonconfirm' onClick={unfriendHandler}>
      confirm
    </span>
  );
};

const mapDispatchToProps = dispatch => ({
  setFriendList: friendList => dispatch(setFriendList(friendList))
});

export default connect(
  null,
  mapDispatchToProps
)(UnfriendButton);
