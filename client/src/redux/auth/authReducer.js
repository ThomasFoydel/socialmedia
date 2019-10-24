import { AuthActionTypes } from './authTypes.js';

const INITIAL_STATE = {
  userId: null,
  token: null,
  isLoggedIn: false
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_LOGIN_SESSION:
      return {
        ...state,
        userId: action.payload.userId,
        token: action.payload.token
      };
    case AuthActionTypes.LOGOUT_SESSION:
      return {
        ...state,
        userId: null,
        token: null,
        isLoggedIn: false
      };
    case AuthActionTypes.SET_IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
