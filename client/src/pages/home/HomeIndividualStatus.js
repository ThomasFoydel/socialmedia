import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import HomeStatusLikeDislikeButtons from '../../components/homestatuslikedislikebuttons/HomeStatusLikeDislikeButtons';
import { Link } from 'react-router-dom';

const HomeIndividualStatus = ({ status }) => {
  const [authorUser, setAuthorUser] = useState({});

  const { statusContent, createdAt, authorId, _id } = status;
  const [likes, setLikes] = useState(status.likes);
  const [dislikes, setDislikes] = useState(status.dislikes);
  const createdAtDate = new Date(createdAt);

  useEffect(() => {
    const getUser = async () => {
      const foundUser = await Axios.get(
        `http://localhost:8000/user/getuser/${authorId}`
      );
      setAuthorUser(foundUser.data);
    };
    getUser();
  }, [authorId]);

  return (
    <div className='homeindividualstatus'>
      <div className='flex'>
        {authorUser && (
          <Link to={`/userprofile/${authorUser._id}`}>
            <div className='homeindividualstatusname'>{authorUser.name}</div>
          </Link>
        )}
        <div className='homeindividualstatuscreatedat'>
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
      </div>

      <h1 className='homeindividualstatuscontent'>{statusContent}</h1>

      <div className='flex homeindividualstatuslikesdislikescounter'>
        {likes.length > 0 && (
          <span className='homeindividualstatuslikescounter'>
            {likes.length} {likes.length > 1 ? <>likes</> : <>like</>}
          </span>
        )}
        {dislikes.length > 0 && (
          <span className='homeindividualstatusdislikescounter'>
            {dislikes.length}
            {dislikes.length > 1 ? <> dislikes</> : <> dislike</>}
          </span>
        )}
      </div>

      <HomeStatusLikeDislikeButtons
        _id={_id}
        setLikes={setLikes}
        setDislikes={setDislikes}
        likes={likes}
        dislikes={dislikes}
      />
    </div>
  );
};

export default HomeIndividualStatus;
