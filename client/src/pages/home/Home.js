import React from 'react';
import { connect } from 'react-redux';
import { logoutSession } from '../../redux/auth/authActions';
import './Home.scss';
import NavBar from '../../components/navbar/NavBar';
import Login from '../login/Login';
import HomeStatusFeed from './HomeStatusFeed';

const Home = ({ userName, profilePicId, isLoggedIn, token, friendList }) => {
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
                  <img
                    src={`/user/image/${profilePicId}`}
                    alt='your profilepic'
                    className='homecontainer__heading--profilepicture'
                  ></img>
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
  logoutSession: () => dispatch(logoutSession())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
