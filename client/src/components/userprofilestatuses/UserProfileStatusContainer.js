import React, { useState, useEffect } from 'react';
import { useTransition, animated, config } from 'react-spring';
import Axios from 'axios';

import UserProfileIndividualStatus from './UserProfileIndividualStatus';
import UserProfileStatusForm from './UserProfileStatusForm';

import './UserProfileStatuses.scss';

const UserProfileStatusContainer = ({
  isCurrentUser,
  token,
  userid,
  profileUser,
  userId
}) => {
  const [statusesArray, setStatusesArray] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    const getStatuses = async () => {
      const foundStatuses = await Axios.get(
        `http://localhost:8000/status/getuserstatuses/${userid}`
      );
      if (isSubscribed) {
        setStatusesArray(foundStatuses.data);
      }
    };
    getStatuses();

    return () => (isSubscribed = false);
  }, [userid, statusesArray]);

  const transition = useTransition(statusesArray, status => status._id, {
    from: { opacity: 0, marginTop: -100 },
    enter: { opacity: 1, marginTop: 0 },
    leave: { opacity: 0, marginTop: -164 },
    config: config.wobbly
  });

  const handleUpdateStatusArrayFromIndividualStatus = newArray => {
    setStatusesArray(newArray);
  };

  return (
    <div className='userprofilestatusarea'>
      {isCurrentUser && (
        <UserProfileStatusForm
          setStatusesArray={setStatusesArray}
          statusesArray={statusesArray}
          token={token}
        />
      )}
      <div className='userprofilestatuses'>
        {transition.map(({ item, key, props }) => {
          return (
            <animated.div key={key} style={props} className='animatedstatus'>
              <UserProfileIndividualStatus
                isCurrentUser={isCurrentUser}
                profileUser={profileUser}
                status={item}
                token={token}
                userId={userId}
                handleUpdateStatusArrayFromIndividualStatus={
                  handleUpdateStatusArrayFromIndividualStatus
                }
                statusesArray={statusesArray}
              />
            </animated.div>
          );
        })}
      </div>
    </div>
  );
};

export default UserProfileStatusContainer;
