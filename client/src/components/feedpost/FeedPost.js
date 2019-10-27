import React, { useState, useEffect } from 'react';
import CommentForm from '../commentform/CommentForm';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import PostLikeDislikeButtons from '../postlikedislikebuttons/PostLikeDislikeButtons';

import cloudloading from '../../imgs/cloudloading2.svg';

import './FeedPost.scss';
import EditPost from '../../components/editpost/EditPost';
import FeedPostCommentSection from './FeedPostCommentSection';

const FeedPost = ({ post, token, userId, profilePicId, page, isLoggedIn }) => {
  const [postAuthorProfilePicId, setPostAuthorProfilePicId] = useState(null);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [commentsArray, setCommentsArray] = useState(post.comments);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState(post);

  const {
    authorId,
    authorName,
    content,
    contentImageId,
    createdAt,
    title,
    lastEditedAt,
    _id
  } = currentPost;
  useEffect(() => {
    let isSubscribed = true;
    Axios.get(`/user/getuser/${authorId}`, {
      headers: { 'x-auth-token': token }
    }).then(result => {
      if (isSubscribed) {
        setPostAuthorProfilePicId(result.data.profilePicId);
      }
    });

    return () => (isSubscribed = false);
  }, [currentPost, authorId, token]);

  let createdAtDate = new Date(createdAt);
  let lastEditedAtDate = new Date(lastEditedAt);

  const updateCommentsArray = newArray => {
    setCommentsArray(newArray);
  };

  return (
    <div className='feedpost'>
      <div className='feedpostauthortab'>
        {postAuthorProfilePicId && (
          <Link to={`/userprofile/${authorId}`}>
            <img
              alt="original poster's profile"
              className='feedpostauthorpic'
              src={`/user/image/${postAuthorProfilePicId}`}
            ></img>
          </Link>
        )}
        <h5 className='feedpostauthorname'>
          <Link
            className='feedpostauthornamelink'
            to={`/userprofile/${authorId}`}
          >
            {authorName}
          </Link>
        </h5>
        <div className='feedposttopbuttons'>
          {authorId === userId && isLoggedIn && (
            <>
              {!editPostOpen && (
                <i
                  onClick={() => setEditPostOpen(!editPostOpen)}
                  className={`fa fa-lg fa-pencil feedposteditbutton feedposteditbutton${editPostOpen}`}
                  aria-hidden='true'
                ></i>
              )}

              <div className='posteditcontainer'>
                {editPostOpen && (
                  <EditPost
                    setCurrentPost={setCurrentPost}
                    setEditPostOpen={setEditPostOpen}
                    postId={_id}
                    currentPost={currentPost}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className='flex'>
        {page === 'individualpost' ? (
          <p className='feedpostcreatedat'>
            created:{' '}
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
          </p>
        ) : (
          <Link to={`/post/${_id}`}>
            <p className='feedpostcreatedat'>
              created:{' '}
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
            </p>
          </Link>
        )}

        {lastEditedAt !== null && (
          <p className='feedpostupdatedat'>
            last edited:{' '}
            {lastEditedAtDate.getHours() > 12 ? (
              <>
                {lastEditedAtDate.getHours() - 12}:
                {createdAtDate.getMinutes() < 10 ? (
                  <span>0{createdAtDate.getMinutes()}</span>
                ) : (
                  <span>{createdAtDate.getMinutes()}</span>
                )}{' '}
                PM
              </>
            ) : (
              <>
                {lastEditedAtDate.getHours()}:
                {createdAtDate.getMinutes() < 10 ? (
                  <span>0{createdAtDate.getMinutes()}</span>
                ) : (
                  <span>{createdAtDate.getMinutes()}</span>
                )}{' '}
                AM
              </>
            )}{' '}
            {lastEditedAtDate.getMonth()}/{lastEditedAtDate.getDate()}/
            {lastEditedAtDate.getFullYear()}
          </p>
        )}
      </div>
      {imageLoading && contentImageId && (
        <img alt='loading' className='feedpostcloudloader' src={cloudloading} />
      )}
      {contentImageId && (
        <Link to={`/postimage/${contentImageId}`}>
          <img
            alt='post content'
            className={
              imageLoading ? 'feedposthiddenimage' : 'feedpostcontentpic'
            }
            onLoad={() => setImageLoading(false)}
            src={`/post/contentimage/${contentImageId}`}
          ></img>
        </Link>
      )}
      <>
        <h1 className='feedposttitle'>{title}</h1>
      </>
      <p className='feedpostcontent'>{content}</p>
      <div className='tagsandlikes'>
        {currentPost.tags &&
          currentPost.tags[0] !== '' &&
          currentPost.tags.map((tag, i) => (
            <Link key={i} to={`/searchresult/${tag}`}>
              <span className='feedposttags'>#{tag} </span>
            </Link>
          ))}
        {likes && (
          <>
            <div className='flex postlikesdislikescounter'>
              {likes.length > 0 && (
                <span className='postlikescounter'>
                  {likes.length} {likes.length > 1 ? <>likes</> : <>like</>}
                </span>
              )}{' '}
              {dislikes.length > 0 && (
                <span className='postdislikescounter'>
                  {dislikes.length}
                  {dislikes.length > 1 ? <> dislikes</> : <> dislike</>}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      {authorId !== userId && (
        <div className='postlikedislikescontainer'>
          <PostLikeDislikeButtons
            likes={likes}
            dislikes={dislikes}
            authorId={authorId}
            userId={userId}
            _id={_id}
            token={token}
            setLikes={setLikes}
            setDislikes={setDislikes}
          />
        </div>
      )}

      <div className='commentsarray'>
        <FeedPostCommentSection
          commentsArray={commentsArray}
          _id={_id}
          setCommentsArray={updateCommentsArray}
          isLoggedIn={isLoggedIn}
        />
      </div>
      <div className='flex feedpostcommentformandpic'>
        <img
          alt='your profile'
          className='commentformprofilepic'
          src={`/user/image/${profilePicId}`}
        ></img>
        <CommentForm
          setCommentsArray={updateCommentsArray}
          postId={_id}
          page={page}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.auth.token,
  userId: state.auth.userId,
  profilePicId: state.currentUser.profilePicId
});

export default connect(mapStateToProps)(FeedPost);
