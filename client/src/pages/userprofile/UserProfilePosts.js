import React, { useEffect, useState } from 'react';
import Axios from 'axios';

import UserProfilePost from './UserProfilePost';

const UserProfilePosts = ({ userid }) => {
  const [postsArray, setPostsArray] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const foundPosts = await Axios.get(`/post/getpostsbyuser/${userid}`);
      setPostsArray(foundPosts.data);
    };
    getPosts();
  }, [userid]);

  return (
    <div className='userprofilepostlist'>
      {postsArray.map(post => (
        <UserProfilePost post={post} key={post._id} />
      ))}
    </div>
  );
};

export default UserProfilePosts;
