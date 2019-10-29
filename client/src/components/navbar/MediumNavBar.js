import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogOutButton from '../logoutbutton/LogOutButton';
import FriendRequests from '../friendrequests/FriendRequests';
import SearchBar from '../searchbar/SearchBar';
import { useSpring, animated, config } from 'react-spring';

const MediumNavBar = ({
  isLoggedIn,
  userId,
  setFriendRequestsOpen,
  friendRequestsOpen,
  fullNavBarOpen,
  setFullNavBarOpen
}) => {
  const openFullNavBar = () => {
    setFullNavBarOpen(true);
  };

  const closeFullNavBar = () => {
    setFullNavBarOpen(false);
  };

  const toggleFullNavBar = () => {
    setFullNavBarOpen(!fullNavBarOpen);
  };

  const arrowTag = friendRequestsOpen
    ? 'far fa-arrow-alt-circle-down mediumarrow'
    : 'far fa-arrow-alt-circle-right mediumarrow';

  const animationProps = useSpring({
    opacity: fullNavBarOpen ? 1 : 0,
    background: fullNavBarOpen ? 'rgb(10, 125, 255)' : 'rgba(10, 125, 255, 0)',
    color: fullNavBarOpen ? 'white' : 'red',
    marginLeft: fullNavBarOpen ? 0 : -200,
    config: { mass: 1, tension: 300, friction: 40 }
    // zIndex: 0
  });

  return (
    <div className='mediumnavbarcontainer'>
      <ul className='mediummainnavbarinnercontainer'>
        {isLoggedIn ? (
          <>
            {true ? (
              <div className='mediumnavbaropencontainer'>
                <div className='flex mediumnavbaropentopcontainer'>
                  <li
                    className='mediummainnavbaritem mediumnavbarhomelink'
                    onClick={closeFullNavBar}
                  >
                    <NavLink to='/'>
                      <i
                        className='fa fa-cloud mediumnavbarcloudicon'
                        aria-hidden='true'
                      ></i>
                      Home
                    </NavLink>
                  </li>
                  <div className='mediumsearchbar'>
                    <SearchBar />
                  </div>
                  <div
                    onClick={toggleFullNavBar}
                    className={`mediumclosefullnavbarbutton mediumclosefullnavbarbuttonopen${fullNavBarOpen}`}
                  >
                    <i className='fa fa-bars' aria-hidden='true'></i>
                  </div>
                </div>

                <animated.div style={animationProps}>
                  <div className='mediumnavbaropenbottomcontainer'>
                    <li
                      className='mediummainnavbaritem'
                      onClick={closeFullNavBar}
                    >
                      <NavLink to='/feed'>
                        <i className='far fa-arrow-alt-circle-right mediumarrow'></i>
                        Feed
                      </NavLink>
                    </li>
                    <li
                      className='mediummainnavbaritem'
                      onClick={closeFullNavBar}
                    >
                      <NavLink to={`/userprofile/${userId}`}>
                        {' '}
                        <i className='far fa-arrow-alt-circle-right mediumarrow'></i>
                        Profile
                      </NavLink>
                    </li>
                    <li
                      className={`mediumfriendrequestopenbutton${friendRequestsOpen}`}
                    >
                      <div
                        className={`mediumfriendreqs mediumfrobutton${friendRequestsOpen}`}
                        onClick={() =>
                          setFriendRequestsOpen(!friendRequestsOpen)
                        }
                      >
                        <i className={arrowTag}></i>
                        Friend Requests
                      </div>
                      {friendRequestsOpen && <FriendRequests />}
                    </li>
                    <li>
                      <div className='mediummainnavbarlogout'>
                        <NavLink to='/'>
                          <LogOutButton />
                        </NavLink>
                      </div>
                    </li>
                  </div>
                </animated.div>
              </div>
            ) : (
              <>
                <div className='flex'>
                  <li className='mediummainnavbaritem mediumnavbarhomelink'>
                    <NavLink to='/'>
                      <i
                        className='fa fa-cloud mediumnavbarcloudicon'
                        aria-hidden='true'
                      ></i>
                      Home
                    </NavLink>
                  </li>
                  <div className='mediumsearchbar'>
                    <SearchBar />
                  </div>
                  <div
                    onClick={openFullNavBar}
                    className='mediumopenfullnavbarbutton'
                  >
                    <i className='fa fa-bars' aria-hidden='true'></i>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className='flex'>
              <li className='mediummainnavbaritem'>
                <i className='fa fa-cloud' aria-hidden='true'></i>
              </li>
              <li className='mediummainnavbaritem mediumnavbarlogin'>
                <NavLink to='/login'>Login</NavLink>
              </li>
              <li className='mediummainnavbaritem mediumnavbarlogin'>
                <NavLink to='/register'>Register</NavLink>
              </li>
            </div>
          </>
        )}
      </ul>
    </div>
  );
};

export default MediumNavBar;
