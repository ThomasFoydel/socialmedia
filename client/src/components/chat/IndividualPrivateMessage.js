import React from 'react';

const IndividualPrivateMessage = ({
  message,
  senderId,
  currentUserId,
  currentFriendName,
  currentFriendProfilePicId,
  createdAt,
  currentFriendId
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
                <img
                  src={`http://localhost:8000/user/image/${currentFriendProfilePicId}`}
                  alt='friend profile'
                  className='privatemessagefriendporfilepic'
                />
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
