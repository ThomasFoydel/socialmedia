import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import NavBar from '../../components/navbar/NavBar';

import './Register.scss';

export default function Register() {
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [ageValue, setAgeValue] = useState('');
  const [cityValue, setCityValue] = useState('');
  const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormSubmitSuccess(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  }, [errorMessage, setErrorMessage]);

  const handleChange = e => {
    switch (e.target.name) {
      case 'name':
        setNameValue(e.target.value);
        break;
      case 'email':
        setEmailValue(e.target.value.toLowerCase());
        break;
      case 'password':
        setPasswordValue(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPasswordValue(e.target.value);
        break;
      case 'age':
        setAgeValue(e.target.value);
        break;
      case 'city':
        setCityValue(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    Axios.post(
      '/user/register',
      {
        name: nameValue,
        email: emailValue,
        password: passwordValue,
        confirmPassword: confirmPasswordValue,
        age: ageValue,
        city: cityValue,
        profilePicId: '5dddc804fe5c4c0017a60faa'
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(response => {
        console.log('response: ', response);
        if (response.status === 201) {
          setFormSubmitSuccess(true);
        }
        if (response.data.err) {
          setErrorMessage(response.data.err);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const conditionalRenderComponentOrRedirect = formSubmitSuccess ? (
    <Redirect to='/login' />
  ) : (
    <>
      <NavBar />
      <form className='registerform' onSubmit={handleSubmit}>
        <div className='registerforminsidecontainer'>
          <label type='text' name='name'>
            <input
              placeholder='Name'
              name='name'
              type='text'
              className='registerforminput'
              value={nameValue}
              onChange={handleChange}
              maxLength={15}
            />
          </label>
          <label type='text' name='email'>
            <input
              placeholder='Email'
              name='email'
              type='email'
              className='registerforminput'
              value={emailValue}
              onChange={handleChange}
            />
          </label>

          <label type='text' name='age'>
            <input
              placeholder='Age'
              name='age'
              type='number'
              className='registerforminput'
              value={ageValue}
              onChange={handleChange}
            />
          </label>
          <label type='text' name='city'>
            <input
              placeholder='City'
              name='city'
              type='text'
              className='registerforminput'
              value={cityValue}
              onChange={handleChange}
              maxLength={15}
            />
          </label>

          <label type='password' name='password'>
            <input
              placeholder='Password'
              name='password'
              type='password'
              className='registerforminput'
              value={passwordValue}
              onChange={handleChange}
            />
          </label>
          <label type='password' name='confirmPassword'>
            <input
              placeholder='Confirm password'
              name='confirmPassword'
              type='password'
              className='registerforminput'
              value={confirmPasswordValue}
              onChange={handleChange}
            />
          </label>
          {errorMessage && <h6 style={{ color: 'red' }}>{errorMessage}</h6>}
          <input type='submit' className='registerbutton' value='Register' />
        </div>
        <div style={{ height: '10rem' }} />
      </form>
    </>
  );

  return conditionalRenderComponentOrRedirect;
}
