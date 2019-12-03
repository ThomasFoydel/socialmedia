import React from 'react';
import PostLikeButton from '../postlikedislikebuttons/PostLikeButton';
import PostDislikeButton from '../postlikedislikebuttons/PostDislikeButton';
import PostRemoveLikeButton from '../postlikedislikebuttons/PostRemoveLikeButton';
import PostRemoveDislikeButton from '../postlikedislikebuttons/PostRemoveDislikeButton';
import './PostLikeDislikeButtons.scss';

const PostLikeDislikeButtons = ({
  authorId,
  userId,
  _id,
  token,
  setLikes,
  setDislikes,
  likes,
  dislikes
}) => {
  return (
    <div className='postlikedislikebuttonsoutercontainer'>
      <>
        {authorId !== userId && (
          <div className='flex postlikedislikebuttonscontainer'>
            <>
              {!likes.includes(userId) && !dislikes.includes(userId) ? (
                <>
                  <PostLikeButton
                    postId={_id}
                    token={token}
                    setLikes={setLikes}
                    className='postlikebutton'
                  />
                  <PostDislikeButton
                    postId={_id}
                    token={token}
                    userId={userId}
                    setDislikes={setDislikes}
                    className='postdislikebutton'
                  />
                </>
              ) : null}
            </>

            <>
              {likes.includes(userId) && (
                <PostRemoveLikeButton
                  postId={_id}
                  token={token}
                  userId={userId}
                  setLikes={setLikes}
                  className='postremovelikebutton'
                />
              )}
            </>

            <>
              {dislikes.includes(userId) && (
                <PostRemoveDislikeButton
                  postId={_id}
                  token={token}
                  userId={userId}
                  setDislikes={setDislikes}
                  className='postremovedislikebutton'
                />
              )}
            </>
          </div>
        )}
      </>
    </div>
  );
};

export default PostLikeDislikeButtons;
