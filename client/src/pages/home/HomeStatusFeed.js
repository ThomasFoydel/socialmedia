import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import HomeIndividualStatus from './HomeIndividualStatus';

const HomeStatusFeed = ({ token, friendList }) => {
  const [statusArray, setStatusArray] = useState([]);

  useEffect(() => {
    const getStatuses = async () => {
      const foundStatuses = await Axios.post(
        `http://localhost:8000/status/getfriendstatuses/`,
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
          {/* <h1 className='homestatusfeedtitle'>friend status feed:</h1> */}
          {statusArray.map(status => (
            <HomeIndividualStatus key={status._id} status={status} />
          ))}
        </div>
      )}
    </>
  );
};

// const mapStateToProps = state => ({
//   token: state.auth.token
// });

// export default connect(mapStateToProps)(HomeStatusFeed);
export default HomeStatusFeed;
