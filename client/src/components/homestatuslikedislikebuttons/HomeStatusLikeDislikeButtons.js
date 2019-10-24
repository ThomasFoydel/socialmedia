import React from 'react';
import { connect } from 'react-redux';

// import HomeStatusLikeButton from './HomeStatusLikeButton';
import HomeStatusLikeButton from './HomeStatusLikeButton';
import HomeStatusDislikeButton from './HomeStatusDislikeButton';
import HomeStatusRemoveLikeButton from './HomeStatusRemoveLikeButton';
import HomeStatusRemoveDislikeButton from './HomeStatusRemoveDislikeButton';

import './HomeStatusLikeDislikeButtons.scss';

const HomeStatusLikeDislikeButtons = ({
  userId,
  _id,
  token,
  setLikes,
  setDislikes,
  likes,
  dislikes
}) => {
  return (
    <div className='flex homestatuslikedislikebuttonscontainer'>
      <div className='flex homestatuslikedislikebuttonsinnercontainer'>
        <>
          {!likes.includes(userId) && !dislikes.includes(userId) ? (
            <>
              <HomeStatusLikeButton
                statusId={_id}
                token={token}
                setLikes={setLikes}
                className='homestatuslikebutton'
              />
              <HomeStatusDislikeButton
                statusId={_id}
                token={token}
                userId={userId}
                setDislikes={setDislikes}
                className='homestatusdislikebutton'
              />
            </>
          ) : null}
        </>

        <>
          {likes.includes(userId) && (
            <HomeStatusRemoveLikeButton
              statusId={_id}
              token={token}
              userId={userId}
              setLikes={setLikes}
              className='homestatusremovelikebutton'
            />
          )}
        </>

        <>
          {dislikes.includes(userId) && (
            <HomeStatusRemoveDislikeButton
              statusId={_id}
              token={token}
              userId={userId}
              setDislikes={setDislikes}
              className='homestatusremovedislikebutton'
            />
          )}
        </>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  userId: state.auth.userId
});

export default connect(mapStateToProps)(HomeStatusLikeDislikeButtons);
