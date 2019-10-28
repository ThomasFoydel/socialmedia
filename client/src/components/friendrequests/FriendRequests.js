import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTransition, animated, config } from 'react-spring';
import { Spring } from 'react-spring/renderprops';
import Axios from 'axios';

import IndividualFriendRequest from './IndividualFriendRequest';
import { addFriendToFriendList } from '../../redux/currentUser/currentUserActions';

import './FriendRequests.scss';

const FriendRequests = ({ token, userId, addFriendToFriendList }) => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    Axios.get(
      `/user/getfriendrequests/${userId}`,
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
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: config.molasses
  });
  return (
    <Spring
      from={{ opacity: 0, marginTop: -10 }}
      to={{ opacity: 100, marginTop: 0 }}
      config={config.molasses}
    >
      {props => (
        <div style={props}>
          <div className='friendrequestcontainer'>
            {requests && (
              <>
                {transition.map(({ item, key, props }) => {
                  return (
                    <animated.div
                      key={key}
                      style={props}
                      className='animatedstatus'
                    >
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
                  <div className='nofriendrequests'>no friend requests</div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Spring>
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
