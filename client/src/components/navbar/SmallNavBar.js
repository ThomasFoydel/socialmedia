import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogOutButton from '../logoutbutton/LogOutButton';
import FriendRequests from '../friendrequests/FriendRequests';
import SearchBar from '../searchbar/SearchBar';

const SmallNavBar = ({
  isLoggedIn,
  userId,
  setFriendRequestsOpen,
  friendRequestsOpen
}) => {
  const [fullNavBarOpen, setFullNavBarOpen] = useState(false);

  const openFullNavBar = () => {
    setFullNavBarOpen(true);
  };

  const closeFullNavBar = () => {
    setFullNavBarOpen(false);
  };

  return (
    <div className='smallnavbarcontainer'>
      <ul className='smallmainnavbarinnercontainer'>
        {isLoggedIn ? (
          <>
            {fullNavBarOpen ? (
              <div className='smallnavbaropen'>
                <div className='flex'>
                  <li
                    className='smallmainnavbaritem smallnavbarhomelink'
                    onClick={closeFullNavBar}
                  >
                    <NavLink to='/'>
                      <i
                        className='fa fa-cloud smallnavbarcloudicon'
                        aria-hidden='true'
                      ></i>
                    </NavLink>
                  </li>
                  <div className='smallsearchbar'>
                    <SearchBar />
                  </div>
                  <div
                    onClick={closeFullNavBar}
                    className='smallclosefullnavbarbutton'
                  >
                    <i className='fa fa-bars' aria-hidden='true'></i>
                  </div>
                </div>
                <li className='smallmainnavbaritem smallnavbarsecondhomelink'>
                  <NavLink to='/'>
                    <i className='far fa-arrow-alt-circle-right'></i>
                    Home
                  </NavLink>
                </li>
                <li className='smallmainnavbaritem' onClick={closeFullNavBar}>
                  <NavLink to='/feed'>
                    <i className='far fa-arrow-alt-circle-right'></i>Feed
                  </NavLink>
                </li>
                <li className='smallmainnavbaritem' onClick={closeFullNavBar}>
                  <NavLink to={`/userprofile/${userId}`}>
                    <i className='far fa-arrow-alt-circle-right'></i>Profile
                  </NavLink>
                </li>
                <li
                  className={`smallfriendrequestopenbutton${friendRequestsOpen}`}
                >
                  <div
                    className={`smallfriendreqs smallfrobutton${friendRequestsOpen}`}
                    onClick={() => setFriendRequestsOpen(!friendRequestsOpen)}
                  >
                    <i
                      className={`far fa-arrow-alt-circle-${
                        friendRequestsOpen ? 'down' : 'right'
                      }`}
                    ></i>
                    Friend Requests
                  </div>
                  {friendRequestsOpen && <FriendRequests />}
                </li>
                <li>
                  <div
                    className='smallmainnavbarlogout'
                    onClick={closeFullNavBar}
                  >
                    <NavLink to='/'>
                      <LogOutButton />
                    </NavLink>
                  </div>
                </li>
              </div>
            ) : (
              <>
                <div className='flex'>
                  <li className='smallmainnavbaritem smallnavbarhomelink'>
                    <NavLink to='/'>
                      <i
                        className='fa fa-cloud smallnavbarcloudicon'
                        aria-hidden='true'
                      ></i>
                    </NavLink>
                  </li>
                  <div className='smallsearchbar'>
                    <SearchBar />
                  </div>
                  <div
                    onClick={openFullNavBar}
                    className='smallopenfullnavbarbutton'
                  >
                    <i className='fa fa-bars' aria-hidden='true'></i>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className='flex smallnavbarnotloggedin'>
              <li className='smallmainnavbaritem'>
                <i className='fa fa-cloud' aria-hidden='true'></i>
              </li>
              <li className='smallmainnavbaritem smallnavbarlogin'>
                <NavLink to='/login'>Login</NavLink>
              </li>
              <li className='smallmainnavbaritem smallnavbarregister'>
                <NavLink to='/register'>Register</NavLink>
              </li>
            </div>
          </>
        )}
      </ul>
    </div>
  );
};

export default SmallNavBar;
