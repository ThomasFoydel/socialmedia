import React from 'react';
import { Link } from 'react-router-dom';

const SearchResultPost = ({ post }) => {
  let createdAtDate = new Date(post.createdAt);
  return (
    <Link to={`/post/${post._id}`}>
      <div className='searchresultpost'>
        <div className='searchresultposttitle'>{post.title}</div>
        {post.hasImage ? (
          <img
            className='searchresultpostimage'
            src={`http://localhost:8000/post/contentimage/${post.contentImageId}`}
            alt='search result post'
          />
        ) : (
          <div className='searchresultnoimageblankspace' />
        )}

        <div className='searchresultpostauthorname'>{post.authorName}</div>
        <div className='searchresultpostdate'>
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

        {post.content.length > 100 ? (
          <div className='searchresultpostcontent'>
            {post.content.slice(0, 100)}...
          </div>
        ) : (
          <div className='searchresultpostcontent'>{post.content}</div>
        )}
      </div>
    </Link>
  );
};

export default SearchResultPost;
