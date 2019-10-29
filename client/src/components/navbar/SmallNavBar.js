import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogOutButton from '../logoutbutton/LogOutButton';
import FriendRequests from '../friendrequests/FriendRequests';
import SearchBar from '../searchbar/SearchBar';
import { useSpring, animated, config } from 'react-spring';

const SmallNavBar = ({
  isLoggedIn,
  userId,
  setFriendRequestsOpen,
  friendRequestsOpen,
  fullNavBarOpen,
  setFullNavBarOpen
}) => {
  // const [fullNavBarOpen, setFullNavBarOpen] = useState(false);

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
    marginLeft: fullNavBarOpen ? 0 : -170,
    config: { mass: 1, tension: 300, friction: 38 }
  });

  return (
    <div className='smallnavbarcontainer'>
      <ul className='smallmainnavbarinnercontainer'>
        {isLoggedIn ? (
          <>
            <div className=''>
              <div className='flex smallnavbaropentopcontainer'>
                <li
                  className='smallmainnavbaritem smallnavbarhomelink'
                  onClick={toggleFullNavBar}
                >
                  <NavLink to='/'>
                    <i
                      className='fa fa-cloud smallnavbarcloudicon'
                      aria-hidden='true'
                    ></i>
                    Home
                  </NavLink>
                </li>
                <div className='smallsearchbar'>
                  <SearchBar />
                </div>
                <div
                  onClick={toggleFullNavBar}
                  className={`smallclosefullnavbarbutton smallclosefullnavbarbuttonopen${fullNavBarOpen}`}
                >
                  <i className='fa fa-bars' aria-hidden='true'></i>
                </div>
              </div>

              <animated.div style={animationProps}>
                <div
                  className='smallnavbaropenbottomcontainer'
                  style={{ position: fullNavBarOpen ? 'inherit' : 'fixed' }}
                >
                  <li className='smallmainnavbaritem' onClick={closeFullNavBar}>
                    <NavLink to='/feed'>
                      <i className='far fa-arrow-alt-circle-right smallarrow'></i>
                      Feed
                    </NavLink>
                  </li>
                  <li className='smallmainnavbaritem' onClick={closeFullNavBar}>
                    <NavLink to={`/userprofile/${userId}`}>
                      {' '}
                      <i className='far fa-arrow-alt-circle-right smallarrow'></i>
                      Profile
                    </NavLink>
                  </li>
                  <li
                    className={`smallmainnavbaritem smallfriendrequestopenbutton${friendRequestsOpen}`}
                  >
                    <div
                      className={`smallfriendreqs smallfrobutton${friendRequestsOpen}`}
                      onClick={() => setFriendRequestsOpen(!friendRequestsOpen)}
                    >
                      <i className={arrowTag}></i>
                      Friend Requests
                    </div>
                    {friendRequestsOpen && <FriendRequests />}
                  </li>
                  <li>
                    <div className='smallmainnavbarlogout'>
                      <NavLink to='/'>
                        <LogOutButton />
                      </NavLink>
                    </div>
                  </li>
                </div>
              </animated.div>
            </div>
          </>
        ) : (
          <>
            <div className='flex'>
              <li className='smallmainnavbaritem'>
                <i className='fa fa-cloud' aria-hidden='true'></i>
              </li>
              <li className='smallmainnavbaritem smallnavbarlogin'>
                <NavLink to='/login'>Login</NavLink>
              </li>
              <li className='smallmainnavbaritem smallnavbarlogin'>
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

// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import LogOutButton from '../logoutbutton/LogOutButton';
// import FriendRequests from '../friendrequests/FriendRequests';
// import SearchBar from '../searchbar/SearchBar';
// import { useSpring, animated, config } from 'react-spring';

// const SmallNavBar = ({
//   isLoggedIn,
//   userId,
//   setFriendRequestsOpen,
//   friendRequestsOpen
// }) => {
//   const [fullNavBarOpen, setFullNavBarOpen] = useState(false);

//   const openFullNavBar = () => {
//     setFullNavBarOpen(true);
//   };

//   const closeFullNavBar = () => {
//     setFullNavBarOpen(false);
//   };

//   const arrowTag = friendRequestsOpen
//     ? 'far fa-arrow-alt-circle-down mediumarrow'
//     : 'far fa-arrow-alt-circle-right mediumarrow';

//   const animationProps = useSpring({
//     opacity: fullNavBarOpen ? 1 : 0,
//     background: fullNavBarOpen ? 'rgb(10, 125, 255)' : 'rgba(10, 125, 255, 0)',
//     color: fullNavBarOpen ? 'white' : 'red',
//     marginLeft: fullNavBarOpen ? 0 : -150,
//     config: config.slow
//     // zIndex: 0
//   });

//   return (
//     <div className='smallnavbarcontainer'>
//       <ul className='smallmainnavbarinnercontainer'>
//         {isLoggedIn ? (
//           <>
//             {fullNavBarOpen ? (
//               <div className=''>
//                 <div className='flex smallnavbaropentopcontainer'>
//                   <li
//                     className='smallmainnavbaritem smallnavbarhomelink'
//                     onClick={closeFullNavBar}
//                   >
//                     <NavLink to='/'>
//                       <i
//                         className='fa fa-cloud smallnavbarcloudicon'
//                         aria-hidden='true'
//                       ></i>
//                       Home
//                     </NavLink>
//                   </li>
//                   <div className='smallsearchbar'>
//                     <SearchBar />
//                   </div>
//                   <div
//                     onClick={closeFullNavBar}
//                     className='smallclosefullnavbarbutton'
//                   >
//                     <i className='fa fa-bars' aria-hidden='true'></i>
//                   </div>
//                 </div>

//                 <animated.div style={animationProps}>
//                   <div className='smallnavbaropenbottomcontainer'>
//                     <li
//                       className='smallmainnavbaritem'
//                       onClick={closeFullNavBar}
//                     >
//                       <NavLink to='/feed'>
//                         <i className='far fa-arrow-alt-circle-right smallarrow'></i>
//                         Feed
//                       </NavLink>
//                     </li>
//                     <li
//                       className='smallmainnavbaritem'
//                       onClick={closeFullNavBar}
//                     >
//                       <NavLink to={`/userprofile/${userId}`}>
//                         {' '}
//                         <i className='far fa-arrow-alt-circle-right smallarrow'></i>
//                         Profile
//                       </NavLink>
//                     </li>
//                     <li
//                       className={`smallmainnavbaritem smallfriendrequestopenbutton${friendRequestsOpen}`}
//                     >
//                       <div
//                         className={`smallfriendreqs smallfrobutton${friendRequestsOpen}`}
//                         onClick={() =>
//                           setFriendRequestsOpen(!friendRequestsOpen)
//                         }
//                       >
//                         <i className={arrowTag}></i>
//                         Friend Requests
//                       </div>
//                       {friendRequestsOpen && <FriendRequests />}
//                     </li>
//                     <li>
//                       <div className='smallmainnavbarlogout'>
//                         <NavLink to='/'>
//                           <LogOutButton />
//                         </NavLink>
//                       </div>
//                     </li>
//                   </div>
//                 </animated.div>
//               </div>
//             ) : (
//               <>
//                 <div className='flex'>
//                   <li className='smallmainnavbaritem smallnavbarhomelink'>
//                     <NavLink to='/'>
//                       <i
//                         className='fa fa-cloud smallnavbarcloudicon'
//                         aria-hidden='true'
//                       ></i>
//                       Home
//                     </NavLink>
//                   </li>
//                   <div className='smallsearchbar'>
//                     <SearchBar />
//                   </div>
//                   <div
//                     onClick={openFullNavBar}
//                     className='smallopenfullnavbarbutton'
//                   >
//                     <i className='fa fa-bars' aria-hidden='true'></i>
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         ) : (
//           <>
//             <div className='flex'>
//               <li className='smallmainnavbaritem'>
//                 <i className='fa fa-cloud' aria-hidden='true'></i>
//               </li>
//               <li className='smallmainnavbaritem smallnavbarlogin'>
//                 <NavLink to='/login'>Login</NavLink>
//               </li>
//               <li className='smallmainnavbaritem smallnavbarlogin'>
//                 <NavLink to='/register'>Register</NavLink>
//               </li>
//             </div>
//           </>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default SmallNavBar;

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

//
//
///
///
//
///

// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import LogOutButton from '../logoutbutton/LogOutButton';
// import FriendRequests from '../friendrequests/FriendRequests';
// import SearchBar from '../searchbar/SearchBar';
// import { useSpring, animated, config } from 'react-spring';

// const SmallNavBar = ({
//   isLoggedIn,
//   userId,
//   setFriendRequestsOpen,
//   friendRequestsOpen
// }) => {
//   const [fullNavBarOpen, setFullNavBarOpen] = useState(false);

//   const openFullNavBar = () => {
//     setFullNavBarOpen(true);
//   };

//   const closeFullNavBar = () => {
//     setFullNavBarOpen(false);
//   };

//   const animationProps = useSpring({
//     opacity: fullNavBarOpen ? 1 : 0,
//     background: fullNavBarOpen ? 'rgb(10, 125, 255)' : 'rgba(10, 125, 255, 0)',
//     color: fullNavBarOpen ? 'white' : 'red',
//     marginTop: fullNavBarOpen ? 0 : -160,
//     zIndex: 0
//   });

//   return (
//     <div className='smallnavbarcontainer'>
//       <ul className='smallmainnavbarinnercontainer'>
//         {isLoggedIn ? (
//           <>
//             {fullNavBarOpen ? (
//               <div className='smallnavbaropen'>
//                 <div className='flex smallnavbaropentopcontainer'>
//                   <li
//                     className='smallmainnavbaritem smallnavbarhomelink'
//                     onClick={closeFullNavBar}
//                   >
//                     <NavLink to='/'>
//                       <i
//                         className='fa fa-cloud smallnavbarcloudicon'
//                         aria-hidden='true'
//                       ></i>
//                     </NavLink>
//                   </li>
//                   <div className='smallsearchbar'>
//                     <SearchBar />
//                   </div>
//                   <div
//                     onClick={closeFullNavBar}
//                     className='smallclosefullnavbarbutton'
//                   >
//                     <i className='fa fa-bars' aria-hidden='true'></i>
//                   </div>
//                 </div>
//                 <animated.div style={animationProps}>
//                   <div className='smallnavbaropenbottomcontainer'>
//                     <li className='smallmainnavbaritem smallnavbarsecondhomelink'>
//                       <NavLink to='/'>
//                         <i className='far fa-arrow-alt-circle-right'></i>
//                         Home
//                       </NavLink>
//                     </li>
//                     <li
//                       className='smallmainnavbaritem'
//                       onClick={closeFullNavBar}
//                     >
//                       <NavLink to='/feed'>
//                         <i className='far fa-arrow-alt-circle-right'></i>Feed
//                       </NavLink>
//                     </li>
//                     <li
//                       className='smallmainnavbaritem'
//                       onClick={closeFullNavBar}
//                     >
//                       <NavLink to={`/userprofile/${userId}`}>
//                         <i className='far fa-arrow-alt-circle-right'></i>Profile
//                       </NavLink>
//                     </li>
//                     <li
//                       className={`smallfriendrequestopenbutton${friendRequestsOpen}`}
//                     >
//                       <div
//                         className={`smallfriendreqs smallfrobutton${friendRequestsOpen}`}
//                         onClick={() =>
//                           setFriendRequestsOpen(!friendRequestsOpen)
//                         }
//                       >
//                         <i
//                           className={`far fa-arrow-alt-circle-${
//                             friendRequestsOpen ? 'down' : 'right'
//                           }`}
//                         ></i>
//                         Friend Requests
//                       </div>
//                       {friendRequestsOpen && <FriendRequests />}
//                     </li>
//                     <li>
//                       <div
//                         className='smallmainnavbarlogout'
//                         onClick={closeFullNavBar}
//                       >
//                         <NavLink to='/'>
//                           <LogOutButton />
//                         </NavLink>
//                       </div>
//                     </li>
//                   </div>
//                 </animated.div>
//               </div>
//             ) : (
//               <>
//                 <div className='flex smallnavbarclosedcontainer'>
//                   <li className='smallmainnavbaritem smallnavbarhomelink'>
//                     <NavLink to='/'>
//                       <i
//                         className='fa fa-cloud smallnavbarcloudicon'
//                         aria-hidden='true'
//                       ></i>
//                     </NavLink>
//                   </li>
//                   <div className='smallsearchbar'>
//                     <SearchBar />
//                   </div>
//                   <div
//                     onClick={openFullNavBar}
//                     className='smallopenfullnavbarbutton'
//                   >
//                     <i className='fa fa-bars' aria-hidden='true'></i>
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         ) : (
//           <>
//             <div className='flex smallnavbarnotloggedin'>
//               <li className='smallmainnavbaritem'>
//                 <i className='fa fa-cloud' aria-hidden='true'></i>
//               </li>
//               <li className='smallmainnavbaritem smallnavbarlogin'>
//                 <NavLink to='/login'>Login</NavLink>
//               </li>
//               <li className='smallmainnavbaritem smallnavbarregister'>
//                 <NavLink to='/register'>Register</NavLink>
//               </li>
//             </div>
//           </>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default SmallNavBar;
