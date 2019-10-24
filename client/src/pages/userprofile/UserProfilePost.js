import React from 'react';
import { Link } from 'react-router-dom';

const UserProfilePost = ({ post }) => {
  return (
    <Link to={`/post/${post._id}`}>
      <div className='userprofilepost'>
        {post.hasImage ? (
          <img
            alt='post'
            className='userprofilepostimage'
            src={`/post/contentimage/${post.contentImageId}`}
          />
        ) : (
          <div className='userprofilepostemptyspace' />
        )}
        <h4 className='userprofileposttitle'>{post.title}</h4>
      </div>
    </Link>
  );
};

export default UserProfilePost;
