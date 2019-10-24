import { CurrentUserActionTypes } from './currentUserTypes';

export const setCurrentUserInfo = user => ({
  type: CurrentUserActionTypes.SET_CURRENT_USER_INFO,
  payload: user
});

export const resetCurrentUserInfo = () => ({
  type: CurrentUserActionTypes.RESET_CURRENT_USER_INFO
});

export const setCurrentUserProfilePic = profPicInfo => ({
  type: CurrentUserActionTypes.SET_CURRENT_USER_PROFILE_PIC,
  payload: profPicInfo
});

export const setCurrentUserCoverPic = coverPicInfo => ({
  type: CurrentUserActionTypes.SET_CURRENT_USER_COVER_PIC,
  payload: coverPicInfo
});

export const addFriendToFriendList = friendId => ({
  type: CurrentUserActionTypes.ADD_FRIEND_TO_FRIENDLIST,
  payload: friendId
});

export const setFriendList = friendList => ({
  type: CurrentUserActionTypes.SET_FRIENDLIST,
  payload: friendList
});
