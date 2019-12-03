import React from 'react';
import CommentLikeButton from './CommentLikeButton';
import CommentRemoveLikeButton from './CommentRemoveLikeButton';
import CommentDislikeButton from './CommentDislikeButton';
import CommentRemoveDislikeButton from './CommentRemoveDislikeButton';
import EditCommentForm from '../editcommentform/EditCommentForm.js';

import './CommentLikeDislikeButtons.scss';

const CommentLikeDislikeButtons = ({
  likes,
  dislikes,
  userId,
  foundComment,
  editOpen,
  setLikes,
  setDislikes,
  comment,
  token,
  setEditOpen,
  updateComment
}) => {
  return (
    <div className='flex commentlikedislikebuttoncontainer'>
      <>
        {!likes.includes(userId) && !dislikes.includes(userId) && !editOpen ? (
          <div className='commentlikedislikeinnercontainer'>
            <CommentLikeButton
              commentId={foundComment._id}
              token={token}
              userId={userId}
              setLikes={setLikes}
            />
            <CommentDislikeButton
              commentId={foundComment._id}
              token={token}
              userId={userId}
              setDislikes={setDislikes}
            />
          </div>
        ) : (
          <div className='commentlikedislikeinnercontainer'>
            {likes.includes(userId) && (
              <CommentRemoveLikeButton
                commentId={foundComment._id}
                token={token}
                userId={userId}
                setLikes={setLikes}
              />
            )}
            {dislikes.includes(userId) && (
              <CommentRemoveDislikeButton
                commentId={foundComment._id}
                token={token}
                userId={userId}
                setDislikes={setDislikes}
              />
            )}{' '}
          </div>
        )}
      </>
      {editOpen && (
        <EditCommentForm
          token={token}
          foundComment={foundComment}
          setEditOpen={setEditOpen}
          commentId={comment}
          updateComment={updateComment}
        />
      )}
    </div>
  );
};

export default CommentLikeDislikeButtons;
