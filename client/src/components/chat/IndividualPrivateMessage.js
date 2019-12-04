import React from 'react';
import { Link } from 'react-router-dom';

const IndividualPrivateMessage = ({
  message,
  senderId,
  currentUserId,
  currentFriendProfilePicId
}) => {
  const senderIsSelf = senderId === currentUserId;
  const conditionalStyleTag = senderIsSelf
    ? 'privatemessage privatemessagecurrentuser'
    : 'privatemessage privatemessagefriend';
  return (
    <>
      <div className='privatemessagecontainer'>
        <div className={conditionalStyleTag}>
          <div>
            {senderIsSelf ? (
              <span className='ownprivatemessagecontent'>{`${message}`}</span>
            ) : (
              <>
                <Link to={`/userprofile/${senderId}`}>
                  <img
                    src={`/user/image/${currentFriendProfilePicId}`}
                    alt='friend profile'
                    className='privatemessagefriendporfilepic'
                  />
                </Link>
                <span className='privatemessagecontent'>{`${message}`}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualPrivateMessage;
