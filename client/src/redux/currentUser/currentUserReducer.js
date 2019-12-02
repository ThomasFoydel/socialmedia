import { CurrentUserActionTypes } from './currentUserTypes';

const INITIAL_STATE = {
  userName: '',
  email: '',
  city: '',
  age: '',
  profilePicId: '',
  coverPicId: '',
  bio: '',
  friendList: []
};

const currentUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CurrentUserActionTypes.SET_CURRENT_USER_INFO:
      return {
        ...state,
        userName: action.payload.userName,
        email: action.payload.email,
        city: action.payload.city,
        age: action.payload.age,
        bio: action.payload.bio,
        friendList: action.payload.friendList
      };
    case CurrentUserActionTypes.RESET_CURRENT_USER_INFO:
      return {
        ...state,
        userName: '',
        email: '',
        city: '',
        age: '',
        profilePicId: '',
        coverPicId: '',
        bio: '',
        friendList: []
      };
    case CurrentUserActionTypes.SET_CURRENT_USER_PROFILE_PIC:
      return {
        ...state,
        profilePicId: action.payload
      };
    case CurrentUserActionTypes.SET_CURRENT_USER_COVER_PIC:
      return {
        ...state,
        coverPicId: action.payload
      };
    case CurrentUserActionTypes.ADD_FRIEND_TO_FRIENDLIST:
      return {
        ...state,
        friendList: [...state.friendList, action.payload]
      };
    case CurrentUserActionTypes.SET_FRIENDLIST:
      return {
        ...state,
        friendList: [...action.payload]
      };
    default:
      return state;
  }
};

export default currentUserReducer;
