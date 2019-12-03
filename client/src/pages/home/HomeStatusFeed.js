import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import HomeIndividualStatus from './HomeIndividualStatus';

const HomeStatusFeed = ({ token, friendList }) => {
  const [statusArray, setStatusArray] = useState([]);

  useEffect(() => {
    const getStatuses = async () => {
      const foundStatuses = await Axios.post(
        `/status/getfriendstatuses/`,
        { friendList },
        {
          headers: { 'x-auth-token': token }
        }
      );
      setStatusArray(foundStatuses.data);
    };
    getStatuses();
  }, [token, friendList]);

  return (
    <>
      {statusArray.length > 0 && (
        <div className='homepagestatusfeedcontainer'>
          {statusArray.map(status => (
            <HomeIndividualStatus key={status._id} status={status} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomeStatusFeed;
