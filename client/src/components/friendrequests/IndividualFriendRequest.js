import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const IndividualFriendRequest = ({
  info,
  token,
  requests,
  setRequests,
  addFriendToFriendList
}) => {
  const [sender, setSender] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const foundUser = await Axios.get(
        `http://localhost:8000/user/getuser/${info.sender}`
      );
      setSender(foundUser.data);
    };
    getUser();
  }, [info.sender]);

  const acceptHandler = async () => {
    Axios.post(
      `http://localhost:8000/user/acceptfriendrequest/`,
      {
        sender: sender
      },
      { headers: { 'x-auth-token': token } }
    )
      .then(result => {
        setRequests(result.data.updatedRequests);
        addFriendToFriendList(sender._id);
      })
      .catch(error => console.log('error: ', error));
  };

  const rejectHandler = async () => {
    Axios.post(
      `http://localhost:8000/user/rejectfriendrequest`,
      {
        sender: sender
      },
      { headers: { 'x-auth-token': token } }
    )
      .then(result => console.log('rejected friend request!'))
      .catch(error => console.log('error: ', error));
  };

  return (
    <div className='friendrequest'>
      {sender && (
        <>
          <div className='flex'>
            <Link to={`/userprofile/${sender._id}`}>
              <img
                alt="friend request sender's profile"
                className='friendrequestprofilepic'
                src={`http://localhost:8000/user/authorprofilepic/${sender._id}`}
              />
            </Link>

            <div className='ml-1'>
              <Link to={`/userprofile/${sender._id}`}>
                <h3 className='friendrequestname'>{sender.name}</h3>
              </Link>
              {sender.city && <span>{sender.city}</span>}
            </div>
          </div>

          <div className='flex'>
            <div className='friendrequestbuttonaccept' onClick={acceptHandler}>
              accept
            </div>
            <div className='friendrequestbuttonreject' onClick={rejectHandler}>
              reject
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IndividualFriendRequest;
