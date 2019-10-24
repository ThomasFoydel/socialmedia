import React, { useEffect } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';

import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Feed from './pages/feed/Feed';
import Home from './pages/home/Home';

import EditUser from './pages/editUser/EditUser';
import UserProfile from './pages/userprofile/UserProfile';
import SearchResult from './pages/searchresult/SearchResult';
import IndividualPost from './pages/individualpost/IndividualPost';
import IndividualImage from './pages/individualimage/IndividualImage';

import NavBar from './components/navbar/NavBar';
import ChatContainer from './components/chat/ChatContainer';

import './App.scss';
import { setCurrentUserInfo } from './redux/currentUser/currentUserActions';
import { setIsLoggedIn } from './redux/auth/authActions';

const App = ({
  token,
  setCurrentUserInfo,
  setIsLoggedIn,
  isLoggedIn,
  userName
}) => {
  useEffect(() => {
    // FROM REDUX
    if (!token) {
      console.log('no token');
      return;
    } else if (token) {
      const setAuthInfo = async () => {
        Axios.get(`/user/getauth/`, {
          headers: { 'x-auth-token': token }
        })
          .then(result => {
            const authInfoData = result.data;
            setCurrentUserInfo({
              userName: authInfoData.name,
              email: authInfoData.email,
              city: authInfoData.city,
              age: authInfoData.age,
              bio: authInfoData.bio,
              friendList: authInfoData.friendList
            });
            setIsLoggedIn(true);
          })
          .catch(error => {
            setCurrentUserInfo({
              userName: '',
              email: '',
              city: '',
              age: '',
              bio: ''
            });
            setIsLoggedIn(false);
          });
      };
      setAuthInfo();
    }
  }, [token, setCurrentUserInfo, setIsLoggedIn]);

  return (
    <div className='App'>
      <Router>
        {token && (
          <NavBar
            setIsLoggedIn={setIsLoggedIn}
            isAuthenticated={setIsLoggedIn}
          />
        )}

        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/feed' component={Feed} />
          <Route path='/register' component={Register} />
          <Route path='/edituser' component={EditUser} />
          <Route path='/userprofile/:userid' component={UserProfile} />
          <Route path='/postimage/:id' component={IndividualImage} />
          <Route
            path='/post/:id'
            component={props => <IndividualPost token={token} {...props} />}
          />
          <Route
            path='/searchresult/:searchinput'
            component={props => <SearchResult token={token} {...props} />}
          />
          <Route
            path='/login'
            component={() => (
              <Login
                setIsAuthenticated={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
              />
            )}
          />
        </Switch>
      </Router>
      <ChatContainer
        isLoggedIn={isLoggedIn}
        token={token}
        userName={userName}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userName: state.currentUser.userName,
    userId: state.auth.userId,
    token: state.auth.token,
    isLoggedIn: state.auth.isLoggedIn
  };
};
const mapDispatchToProps = dispatch => ({
  setCurrentUserInfo: user => dispatch(setCurrentUserInfo(user)),
  setIsLoggedIn: loginstate => dispatch(setIsLoggedIn(loginstate))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
