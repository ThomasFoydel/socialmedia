import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogOutButton from '../logoutbutton/LogOutButton';
import { connect } from 'react-redux';
import FriendRequests from '../friendrequests/FriendRequests';
import SearchBar from '../searchbar/SearchBar';
import MediumNavBar from './MediumNavBar';
import SmallNavBar from './SmallNavBar';

import './NavBar.scss';

const NavBar = ({ isLoggedIn, userId, currentPage }) => {
  const [friendRequestsOpen, setFriendRequestsOpen] = useState(false);
  const [fullNavBarOpen, setFullNavBarOpen] = useState(false);
  console.log('currentPage: ', currentPage);

  return (
    <>
      <div className='navbarcontainer'>
        <ul className={`mainnavbar`}>
          {isLoggedIn ? (
            <>
              <li
                className={`mainnavbaritem navbarhomelink ${currentPage ===
                  'home' && 'navbar-currentpagelink'}`}
              >
                <NavLink to='/'>
                  <i
                    className='fa fa-cloud navbarcloudicon'
                    aria-hidden='true'
                  ></i>
                  Home
                </NavLink>
              </li>
              <li
                className='mainnavbaritem'
                className={`mainnavbaritem  ${currentPage === 'feed' &&
                  'navbar-currentpagelink'}`}
              >
                <NavLink to='/feed'>Feed</NavLink>
              </li>
              <li
                className={`mainnavbaritem  ${currentPage === 'profile' &&
                  'navbar-currentpagelink'}`}
              >
                <NavLink to={`/userprofile/${userId}`}>Profile</NavLink>
              </li>
              <li
                className={`mainnavbaritem friendrequestopenbutton${friendRequestsOpen}`}
              >
                <div
                  className={`frobutton${friendRequestsOpen}`}
                  onClick={() => setFriendRequestsOpen(!friendRequestsOpen)}
                >
                  Friend Requests
                </div>
                <FriendRequests
                  setFriendRequestsOpen={setFriendRequestsOpen}
                  friendRequestsOpen={friendRequestsOpen}
                />
              </li>
              <li className='mainnavbaritem mainsearchbar'>
                <SearchBar />
              </li>
              <div className='mainnavbarlogout'>
                <li className='mainnavbaritem '>
                  <NavLink to='/'>
                    <LogOutButton />
                  </NavLink>
                </li>
              </div>
            </>
          ) : (
            <>
              <li className='mainnavbaritem'>
                <i className='fa fa-cloud' aria-hidden='true'></i>
              </li>
              <li className='mainnavbaritem'>
                <NavLink to='/login'>Login</NavLink>
              </li>
              <li className='mainnavbaritem'>
                <NavLink to='/register'>Register</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <MediumNavBar
        className='mediumnavbar'
        isLoggedIn={isLoggedIn}
        userId={userId}
        friendRequestsOpen={friendRequestsOpen}
        setFriendRequestsOpen={setFriendRequestsOpen}
        fullNavBarOpen={fullNavBarOpen}
        setFullNavBarOpen={setFullNavBarOpen}
      />
      <SmallNavBar
        className='smallnavbar'
        isLoggedIn={isLoggedIn}
        userId={userId}
        friendRequestsOpen={friendRequestsOpen}
        setFriendRequestsOpen={setFriendRequestsOpen}
        fullNavBarOpen={fullNavBarOpen}
        setFullNavBarOpen={setFullNavBarOpen}
      />
    </>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    userId: state.auth.userId,
    currentPage: state.currentPage.currentPage
  };
};

export default connect(mapStateToProps)(NavBar);
