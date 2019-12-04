import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCurrentPage } from '../../redux/currentPage/currentPageActions';
import { logoutSession } from '../../redux/auth/authActions';
import NavBar from '../../components/navbar/NavBar';
import Login from '../login/Login';
import HomeStatusFeed from './HomeStatusFeed';

import './Home.scss';

const Home = ({
  userId,
  profilePicId,
  isLoggedIn,
  token,
  friendList,
  currentPage,
  setCurrentPage
}) => {
  useEffect(() => {
    setCurrentPage('home');
  }, [currentPage, setCurrentPage]);
  return (
    <>
      {isLoggedIn ? (
        <>
          <div className='homeoutercontainer'>
            <div className='homecontainer'>
              <div className='homecontainer-textbox'>
                <div className='homecontainer__heading'></div>
                <h1 className='homecontainer__heading--main'>HOME</h1>
                {profilePicId && (
                  <Link to={`/userprofile/${userId}`}>
                    <img
                      src={`/user/image/${profilePicId}`}
                      alt='your profilepic'
                      className='homecontainer__heading--profilepicture'
                    ></img>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {friendList && (
            <>
              {friendList.length > 0 && (
                <HomeStatusFeed token={token} friendList={friendList} />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <NavBar />
          <Login />
        </>
      )}
    </>
  );
};

const mapStateToProps = state => {
  return {
    userName: state.currentUser.userName,
    profilePicId: state.currentUser.profilePicId,
    userId: state.auth.userId,
    token: state.auth.token,
    isLoggedIn: state.auth.isLoggedIn,
    friendList: state.currentUser.friendList
  };
};

const mapDispatchToProps = dispatch => ({
  logoutSession: () => dispatch(logoutSession()),
  setCurrentPage: page => dispatch(setCurrentPage(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
