import { AuthActionTypes } from './authTypes';

export const setLoginSession = user => ({
  type: AuthActionTypes.SET_LOGIN_SESSION,
  payload: user
});

export const logoutSession = () => ({
  type: AuthActionTypes.LOGOUT_SESSION
});

export const setIsLoggedIn = loginstate => ({
  type: AuthActionTypes.SET_IS_LOGGED_IN,
  payload: loginstate
});
