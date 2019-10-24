import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import SearchResultUser from './SearchResultUser';
import SearchResultPost from './SearchResultPost';

import './SearchResult.scss';

const SearchResult = ({ match, token }) => {
  const [foundUsers, setFoundUsers] = useState([]);
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUsersOrPosts, setShowUsersOrPosts] = useState('users');

  useEffect(() => {
    const getSearchResult = async () => {
      const searchResult = await Axios.post(
        `http://localhost:8000/search/mainsearch/${match.params.searchinput}`,
        {
          searchinput: match.params.searchinput
        },
        { headers: { 'x-auth-token': token } }
      );
      setFoundUsers(searchResult.data.users[0]);
      setFoundPosts(searchResult.data.posts);
      setLoading(false);
    };
    getSearchResult();
  }, [match.params.searchinput, token]);

  return (
    <div className='searchresulttotalcontainer'>
      {loading ? (
        <h1>loading</h1>
      ) : (
        <>
          <div className='searchresultusersorpostsbuttonoutercontainer flex'>
            <div className='searchresultusersorpostsbuttoncontainer flex'>
              {showUsersOrPosts === 'users' ? (
                <>
                  <div className='searchresultusersbuttonselected'>users</div>
                  <div
                    className='searchresultpostsbutton'
                    onClick={() => setShowUsersOrPosts('posts')}
                  >
                    posts
                  </div>
                </>
              ) : (
                <>
                  <div
                    className='searchresultusersbutton'
                    onClick={() => setShowUsersOrPosts('users')}
                  >
                    users
                  </div>
                  <div className='searchresultpostsbuttonselected'>posts</div>
                </>
              )}
            </div>
          </div>
          <div className='searchresultinnercontainer'>
            {showUsersOrPosts === 'users' && (
              <>
                {foundUsers ? (
                  <>
                    <h1 className='searchresultuserscontainertitle'>users</h1>
                    <div className='searchresultuserscontainer'>
                      {foundUsers &&
                        foundUsers.map(user => (
                          <SearchResultUser key={user._id} user={user} />
                        ))}
                    </div>
                  </>
                ) : (
                  <h1 className='nousersfound'>no users found</h1>
                )}
              </>
            )}
            {showUsersOrPosts === 'posts' && (
              <>
                {foundPosts.length ? (
                  <>
                    <h1 className='searchresultpostscontainertitle'>posts</h1>
                    <div className='searchresultpostscontainer'>
                      {foundPosts &&
                        foundPosts.map(post => (
                          <SearchResultPost key={post._id} post={post} />
                        ))}
                    </div>
                  </>
                ) : (
                  <h1 className='nopostsfound'>no posts found</h1>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResult;
