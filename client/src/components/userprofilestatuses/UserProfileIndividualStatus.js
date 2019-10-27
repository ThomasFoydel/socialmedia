import React, { useState } from 'react';
import UserProfileStatusLikeDislikeButtons from '../userprofilestatuslikedislikebuttons/UserProfileStatusLikeDislikeButtons';
import UserProfileStatusDeleteButton from './UserProfileStatusDeleteButton';

const UserProfileIndividualStatus = ({
  status,
  profileUser,
  isCurrentUser,
  token,
  userId,
  statusesArray,
  handleUpdateStatusArrayFromIndividualStatus,
  isLoggedIn
}) => {
  const [likes, setLikes] = useState(status.likes);
  const [dislikes, setDislikes] = useState(status.dislikes);

  let createdAtDate = new Date(status.createdAt);

  return (
    <div className='individualstatus'>
      <div className='flex'>
        <div className='individualstatusname'>{profileUser.name}</div>
        <div className='individualstatuscreatedat'>
          {createdAtDate.getHours() > 12 ? (
            <>
              {createdAtDate.getHours() - 12}:
              {createdAtDate.getMinutes() < 10 ? (
                <span>0{createdAtDate.getMinutes()}</span>
              ) : (
                <span>{createdAtDate.getMinutes()}</span>
              )}{' '}
              PM
            </>
          ) : (
            <>
              {createdAtDate.getHours()}:
              {createdAtDate.getMinutes() < 10 ? (
                <span>0{createdAtDate.getMinutes()}</span>
              ) : (
                <span>{createdAtDate.getMinutes()}</span>
              )}{' '}
              AM
            </>
          )}{' '}
          {createdAtDate.getMonth()}/{createdAtDate.getDate()}/
          {createdAtDate.getFullYear()}
        </div>
      </div>
      {isCurrentUser && isLoggedIn && (
        <div className='userprofilestatusdeletebuttoncontainer'>
          <UserProfileStatusDeleteButton
            status={status}
            token={token}
            handleUpdateStatusArrayFromIndividualStatus={
              handleUpdateStatusArrayFromIndividualStatus
            }
            statusesArray={statusesArray}
          />
        </div>
      )}

      <h1 className='individualstatuscontent'>{status.statusContent}</h1>

      <div className='flex individualstatuslikesdislikescounter'>
        {likes.length > 0 && (
          <span className='individualstatuslikescounter'>
            {likes.length} {likes.length > 1 ? <>likes</> : <>like</>}
          </span>
        )}
        {dislikes.length > 0 && (
          <span className='individualstatusdislikescounter'>
            {dislikes.length}
            {dislikes.length > 1 ? <> dislikes</> : <> dislike</>}
          </span>
        )}
      </div>

      {!isCurrentUser && isLoggedIn && (
        <UserProfileStatusLikeDislikeButtons
          userId={userId}
          _id={status._id}
          token={token}
          setLikes={setLikes}
          setDislikes={setDislikes}
          likes={likes}
          dislikes={dislikes}
        />
      )}
    </div>
  );
};

export default UserProfileIndividualStatus;
