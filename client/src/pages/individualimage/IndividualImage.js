import React from 'react';
import './IndividualImage.scss';

const IndividualImage = ({ match }) => {
  return (
    <div className='individualimagecontainer'>
      <img
        src={`/post/contentimage/${match.params.id}`}
        alt='single'
        className='individualimage'
      />
    </div>
  );
};

export default IndividualImage;
