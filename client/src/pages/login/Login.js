import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { setLoginSession } from '../../redux/auth/authActions';
import {
  setCurrentUserInfo,
  setCurrentUserCoverPic
} from '../../redux/currentUser/currentUserActions';
import { setCurrentUserProfilePic } from '../../redux/currentUser/currentUserActions';
import { Redirect } from 'react-router-dom';

import NavBar from '../../components/navbar/NavBar';

import './Login.scss';

function Login({
  setLoginSession,
  setCurrentUserInfo,
  setCurrentUserProfilePic,
  setCurrentUserCoverPic,
  userName,
  isLoggedIn
}) {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const handleChange = e => {
    switch (e.target.name) {
      case 'email':
        setEmailValue(e.target.value);
        break;
      case 'password':
        setPasswordValue(e.target.value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    Axios.post(
      '/user/login',
      {
        email: emailValue,
        password: passwordValue
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(response => {
        setCurrentUserInfo({
          userName: response.data.data.user.name,
          email: response.data.data.user.email,
          city: response.data.data.user.city,
          age: response.data.data.user.age
        });
        setCurrentUserCoverPic(response.data.data.user.coverPicId);
        setCurrentUserProfilePic(response.data.data.user.profilePicId);
        setLoginSession({
          token: response.data.data.token,
          userId: response.data.data.user._id
        });
      })
      .catch(err => {
        console.log('login error: ', err);
      });
  };

  const conditionalRenderComponentOrRedirect = isLoggedIn ? (
    <Redirect to='/' />
  ) : (
    <>
      <NavBar />
      <form className='loginform' onSubmit={handleSubmit}>
        <div className='loginforminsidecontainer'>
          <h1 className='titletext'>log in</h1>
          {userName && <h1>name: {userName}</h1>}
          <div className='formborder'>
            <input
              placeholder='Email'
              name='email'
              type='text'
              className='loginforminput'
              value={emailValue}
              onChange={handleChange}
            />

            <input
              placeholder='Password'
              name='password'
              type='password'
              className='loginforminput'
              value={passwordValue}
              onChange={handleChange}
            />
            <h6 style={{ color: 'red', marginBottom: '-3rem' }}>
              test login <br />
              email: address@gmail.com <br />
              password: password
            </h6>
            <input type='submit' className='loginbutton' value='login' />
          </div>
        </div>
      </form>
    </>
  );

  return conditionalRenderComponentOrRedirect;
}

const mapStateToProps = state => {
  const { userId, token } = state.auth;
  const userName = state.currentUser.name;
  return {
    userId: userId,
    userName: userName,
    token: token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUserInfo: userInfo => {
      dispatch(setCurrentUserInfo(userInfo));
    },
    setLoginSession: loginInfo => {
      dispatch(setLoginSession(loginInfo));
    },
    setCurrentUserProfilePic: profPicInfo => {
      dispatch(setCurrentUserProfilePic(profPicInfo));
    },
    setCurrentUserCoverPic: coverPicInfo => {
      dispatch(setCurrentUserCoverPic(coverPicInfo));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
