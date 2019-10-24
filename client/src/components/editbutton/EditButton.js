import React from 'react';
import './EditButton.scss';
import { Link } from 'react-router-dom';

export default function EditButton({ postId }) {
  const editLink = `/editpost/${postId}`;
  return (
    <div>
      <Link to={editLink}>
        <div className='editbutton'>
          <i className='fa fa-lg fa-pencil' aria-hidden='true'></i>
        </div>
      </Link>
    </div>
  );
}
