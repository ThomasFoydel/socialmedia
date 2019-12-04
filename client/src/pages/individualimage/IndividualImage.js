import React from 'react';
import { Link } from 'react-router-dom';
import './IndividualImage.scss';

const IndividualImage = ({ match }) => {
  return (
    <Link to='/feed'>
      <div className='individualimagecontainer'>
        <img
          src={`/post/contentimage/${match.params.id}`}
          alt='single'
          className='individualimage'
        />
      </div>
    </Link>
  );
};

export default IndividualImage;
