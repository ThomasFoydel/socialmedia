import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import EditCommentForm from '../editcommentform/EditCommentForm.js';
import DeleteCommentButton from '../deletecommentbutton/DeleteCommentButton';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './Comment.scss';
import CommentLikeDislikeButtons from '../commentlikedislikebuttons/CommentLikeDislikeButtons.js';

const Comment = ({
  comment,
  userId,
  token,
  postId,
  setCommentsArray,
  commentsArray,
  isLoggedIn
}) => {
  const [foundComment, setFoundComment] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [commentProfilePicId, setCommentProfilePicId] = useState(null);
  const [foundUserName, setFoundUserName] = useState('');
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    const getUserProfilePicAndName = async authorId => {
      const foundUser = await Axios.get(`/user/getuser/${authorId}`);
      if (isSubscribed) {
        setCommentProfilePicId(foundUser.data.profilePicId);
        setFoundUserName(foundUser.data.name);
      }
    };
    const getComment = async () => {
      const response = await Axios.get(`/comment/getcomment/${comment}`);
      if (isSubscribed) {
        setFoundComment(response.data);
        getUserProfilePicAndName(response.data.authorId);
        setLikes(response.data.likes);
      }
    };
    getComment();

    return () => (isSubscribed = false);
  }, [comment]);

  const updateComment = updatedComment => {
    setFoundComment(updatedComment);
  };

  const toggleEdit = () => {
    setEditOpen(!editOpen);
  };

  return (
    <div className='feedpostcomment'>
      {foundComment && (
        <>
          <div className='flex'>
            {commentProfilePicId && (
              <img
                alt="original poster's profile"
                className='feedpostcommentauthorpic'
                src={`/user/image/${commentProfilePicId}`}
              ></img>
            )}

            <Link
              className='commentauthorname'
              to={`/userprofile/${foundComment.authorId}`}
            >
              {foundUserName}
            </Link>

            <div className='commentauthorbuttons'>
              {userId === foundComment.authorId && isLoggedIn ? (
                <div className='flex'>
                  <div>
                    {' '}
                    {openDelete ? (
                      <i
                        className='fa fa-pencil commenteditbuttongrayedout'
                        aria-hidden='true'
                      ></i>
                    ) : (
                      <>
                        {editOpen ? (
                          <i
                            className='fa fa-pencil commenteditbuttonopen'
                            aria-hidden='true'
                          ></i>
                        ) : (
                          <i
                            onClick={toggleEdit}
                            className='fa fa-pencil commenteditbutton'
                            aria-hidden='true'
                          ></i>
                        )}
                      </>
                    )}
                  </div>
                  {editOpen ? (
                    <div>
                      <i
                        className='fa fa-trash commentdeletebuttongrayedout'
                        aria-hidden='true'
                      ></i>
                    </div>
                  ) : (
                    <>
                      {openDelete ? (
                        <div>
                          <i
                            className='fa fa-trash commentdeletebuttonopen'
                            aria-hidden='true'
                          ></i>
                        </div>
                      ) : (
                        <div onClick={() => setOpenDelete(!openDelete)}>
                          <i
                            className='fa fa-trash commentdeletebutton'
                            aria-hidden='true'
                          ></i>
                        </div>
                      )}

                      {openDelete && (
                        <div className='flex commentdeleteoptions'>
                          <DeleteCommentButton
                            postId={postId}
                            commentId={foundComment._id}
                            setCommentsArray={setCommentsArray}
                            commentsArray={commentsArray}
                          />
                          <div
                            className='commentdeletebuttoncancel'
                            onClick={() => setOpenDelete(false)}
                          >
                            cancel
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <h3 className='commentcontent'>{foundComment.commentContent}</h3>
          <div className='commentuserresponsearea'>
            <div className='flex commentlikesdislikescounter'>
              {likes.length > 0 && (
                <p>
                  {likes.length} {likes.length > 1 ? <>likes</> : <>like</>}
                </p>
              )}{' '}
              {dislikes.length > 0 && (
                <p>
                  {dislikes.length}{' '}
                  {dislikes.length > 1 ? <>dislikes</> : <>dislike</>}
                </p>
              )}
            </div>

            {userId !== foundComment.authorId && (
              <CommentLikeDislikeButtons
                likes={likes}
                dislikes={dislikes}
                userId={userId}
                foundComment={foundComment}
                editOpen={editOpen}
                setLikes={setLikes}
                setDislikes={setDislikes}
                comment={comment}
                token={token}
                setEditOpen={setEditOpen}
                updateComment={updateComment}
              />
            )}

            {editOpen && (
              <EditCommentForm
                foundComment={foundComment}
                token={token}
                setEditOpen={setEditOpen}
                commentId={foundComment.commentId}
                updateComment={updateComment}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  userId: state.auth.userId,
  token: state.auth.token
});

export default connect(mapStateToProps)(Comment);
