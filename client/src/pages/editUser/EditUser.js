import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUserInfo } from '../../redux/currentUser/currentUserActions';
import UploadProfilePic from '../../components/uploadProfilePic/UploadProfilePic';
import UploadCoverPic from '../../components/uploadcoverpic/UploadCoverPic';

import './EditUser.scss';

function EditUser({
  userId,
  userName,
  token,
  email,
  city,
  age,
  setCurrentUserInfo,
  bio
}) {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [bioInput, setBioInput] = useState(bio);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (userName) {
      setNameInput(userName);
      setEmailInput(email);
      setCityInput(city);
      setAgeInput(age);
      setBioInput(bio);
    }
  }, [userName, email, city, age, bio]);

  const handleChange = e => {
    e.preventDefault();
    switch (e.target.name) {
      case 'name':
        setNameInput(e.target.value);
        break;
      case 'email':
        setEmailInput(e.target.value);
        break;
      case 'city':
        setCityInput(e.target.value);
        break;
      case 'age':
        setAgeInput(e.target.value);
        break;
      case 'password':
        setPasswordInput(e.target.value);
        break;
      case 'bio':
        setBioInput(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    Axios.post(
      '/user/edituser',
      {
        name: nameInput,
        email: emailInput,
        city: cityInput,
        age: ageInput,
        password: passwordInput,
        bio: bioInput,
        userId,
        userName,
        token
      },
      { headers: { 'x-auth-token': token } }
    )
      .then(response => {
        setCurrentUserInfo({
          userName: nameInput,
          email: emailInput,
          city: cityInput,
          age: ageInput,
          bio: bioInput
        });
        setAuthError(false);
        setPasswordInput('');
      })
      .catch(err => {
        setAuthError(true);
      });
  };

  return (
    <div className='edituserformoutsidecontainer'>
      <div className='edituserformcontainer'>
        <form className='edituserform' onSubmit={handleSubmit}>
          <h1 className='editusertitletext'>edit your info</h1>
          <div className='form-group'>
            <div className='editusercurrentvaluelabel'>name:</div>
            <input
              className='edituserforminput'
              type='text'
              value={nameInput}
              name='name'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <div className='editusercurrentvaluelabel'>email:</div>
            <input
              className='edituserforminput'
              type='email'
              value={emailInput}
              name='email'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <div className='editusercurrentvaluelabel'>city: </div>
            <input
              className='edituserforminput'
              type='text'
              value={cityInput}
              name='city'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <div className='editusercurrentvaluelabel'>age:</div>
            <input
              className='edituserforminput'
              type='number'
              value={ageInput}
              name='age'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <div className='editusercurrentvaluelabel'>bio:</div>
            <input
              className='edituserforminput'
              type='text'
              name='bio'
              value={bioInput}
              onChange={handleChange}
              maxLength='160'
            />
          </div>
          <div>
            <div className='editusercurrentvaluelabel'>
              enter password to confirm changes:
            </div>
            <input
              className='edituserforminput'
              type='password'
              name='password'
              value={passwordInput}
              onChange={handleChange}
            ></input>
          </div>
          <div className='edituserformbuttoncontainer'>
            <button type='submit' value='submit' className='edituserformbutton'>
              submit
            </button>
          </div>
          {authError ? (
            <h3 className='incorrectpassworderrormessage'>
              incorrect password
            </h3>
          ) : null}
        </form>
        <div>
          <div className='edituserpicturesection flex'>
            <UploadProfilePic />
            <UploadCoverPic />
          </div>
          <div style={{ height: '10rem' }} />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUserInfo: userInfo => {
      dispatch(setCurrentUserInfo(userInfo));
    }
  };
};

const mapStateToProps = state => {
  const { userId, token } = state.auth;
  const { userName, email, city, age, bio } = state.currentUser;
  return {
    userId: userId,
    userName: userName,
    token: token,
    email: email,
    city: city,
    age: age,
    bio: bio
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
