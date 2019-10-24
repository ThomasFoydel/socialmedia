import React from 'react';
import { Link } from 'react-router-dom';

const SearchResultUser = ({ user }) => {
  return (
    <Link className='searchresultusername' to={`/userprofile/${user._id}`}>
      <div className='searchresultuser'>
        <img
          alt={`${user.name} profile`}
          className='searchresultuserpic'
          src={`http://localhost:8000/user/image/${user.profilePicId}`}
        />
        <div>{user.name}</div>
        <div className='searchresultusercity'>{user.city}</div>
      </div>
    </Link>
  );
};

export default SearchResultUser;
