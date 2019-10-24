import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTransition, animated, config } from 'react-spring';

import Axios from 'axios';

import IndividualFriendRequest from './IndividualFriendRequest';
import { addFriendToFriendList } from '../../redux/currentUser/currentUserActions';

import './FriendRequests.scss';

const FriendRequests = ({ token, userId, addFriendToFriendList }) => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    Axios.get(
      `http://localhost:8000/user/getfriendrequests/${userId}`,
      {},
      { headers: { 'x-auth-token': token } }
    ).then(result => {
      const requestsArray = result.data.filter(
        request => request.status === 'pending'
      );
      setRequests(requestsArray);
    });
  }, [token, userId]);

  const transition = useTransition(requests, request => request._id, {
    from: { opacity: 0, marginTop: -100 },
    enter: { opacity: 1, marginTop: 0 },
    leave: { opacity: 0, marginTop: -100 },
    config: config.wobbly
  });
  return (
    <div className='friendrequestcontainer'>
      {requests && (
        <>
          {transition.map(({ item, key, props }) => {
            return (
              <animated.div key={key} style={props} className='animatedstatus'>
                <IndividualFriendRequest
                  addFriendToFriendList={addFriendToFriendList}
                  info={item}
                  token={token}
                  setRequests={setRequests}
                  requests={requests}
                />
              </animated.div>
            );
          })}

          {requests.length < 1 && (
            <div className='friendrequest'>no friend requests</div>
          )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
  addFriendToFriendList: friendId => dispatch(addFriendToFriendList(friendId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendRequests);
