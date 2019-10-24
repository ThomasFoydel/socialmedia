import React from 'react';
import StatusLikeButton from './StatusLikeButton';
import StatusDislikeButton from './StatusDislikeButton';
import StatusRemoveLikeButton from './StatusRemoveLikeButton';
import StatusRemoveDislikeButton from './StatusRemoveDislikeButton';

import './UserProfileStatusLikeDislikeButtons.scss';

const UserProfileStatusLikeDislikeButtons = ({
  userId,
  _id,
  token,
  setLikes,
  setDislikes,
  likes,
  dislikes
}) => {
  return (
    <div className='flex statuslikedislikebuttonscontainer'>
      <div className='flex statuslikedislikebuttonsinnercontainer'>
        {!likes.includes(userId) && !dislikes.includes(userId) && (
          <>
            <StatusLikeButton
              statusId={_id}
              token={token}
              setLikes={setLikes}
              className='statuslikebutton'
            />
            <StatusDislikeButton
              statusId={_id}
              token={token}
              userId={userId}
              setDislikes={setDislikes}
              className='statusdislikebutton'
            />
          </>
        )}
      </div>

      <>
        {likes.includes(userId) && (
          <StatusRemoveLikeButton
            statusId={_id}
            token={token}
            userId={userId}
            setLikes={setLikes}
            className='statusremovelikebutton'
          />
        )}
      </>

      <>
        {dislikes.includes(userId) && (
          <StatusRemoveDislikeButton
            statusId={_id}
            token={token}
            userId={userId}
            setDislikes={setDislikes}
            className='statusremovedislikebutton'
          />
        )}
      </>
    </div>
  );
};

export default UserProfileStatusLikeDislikeButtons;
