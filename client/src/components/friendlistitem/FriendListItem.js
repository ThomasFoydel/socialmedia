import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import UnfriendButton from '../unfriendbutton/UnfriendButton';
import { Link } from 'react-router-dom';

import './FriendListItem.scss';

const FriendListItem = ({
  friend,
  token,
  userId,
  profileBelongsToCurrentUser
}) => {
  const [friendInfo, setFriendInfo] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [openUnfriend, setOpenUnfriend] = useState(false);

  useEffect(() => {
    if (friend) {
      const getFriend = async () => {
        Axios.get(`http://localhost:8000/user/getuser/${friend}`).then(
          result => {
            setFriendInfo(result.data);
            if (result.data._id === userId) {
              setIsCurrentUser(true);
            }
          }
        );
      };
      getFriend();
    }
  }, [friend, userId]);
  return (
    <div className='friendlistitem'>
      <Link to={`/userprofile/${friendInfo._id}`}>
        <img
          src={`http://localhost:8000/user/image/${friendInfo.profilePicId}`}
          alt="friend's profile"
          className='friendlistprofilepic'
        />
        <div className='friendlistnamecontainer'>
          <h1 className='friendlistname'>{friendInfo.name}</h1>
        </div>
      </Link>

      {/* <p className='friendlistprofileemail'>{friendInfo.email}</p>
      <p className='friendlistprofilecity'>{friendInfo.city}</p> */}
      {!isCurrentUser && (
        <>
          {openUnfriend ? (
            <div className='flex'>
              <UnfriendButton
                userId={userId}
                friendId={friendInfo._id}
                token={token}
                setFriendInfo={setFriendInfo}
              />
              <div
                className='unfriendbuttoncancel'
                onClick={() => setOpenUnfriend(false)}
              >
                cancel
              </div>
            </div>
          ) : (
            <>
              {profileBelongsToCurrentUser && (
                <div
                  className='unfriendbutton'
                  onClick={() => setOpenUnfriend(true)}
                >
                  unfriend
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FriendListItem;
