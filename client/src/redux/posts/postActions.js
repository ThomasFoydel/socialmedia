import { PostActionTypes } from './postTypes';

export const setPosts = posts => {
  return {
    type: PostActionTypes.SET_POSTS,
    payload: posts
  };
};

export const pushPost = post => {
  return {
    type: PostActionTypes.PUSH_POST,
    payload: post
  };
};

export const deletePost = post => {
  return {
    type: PostActionTypes.DELETE_POST,
    payload: post
  };
};

export const addCommentToPost = post => {
  return {
    type: PostActionTypes.ADD_COMMENT_TO_POST,
    payload: post
  };
};

export const editCommentOnPost = post => {
  return {
    type: PostActionTypes.EDIT_COMMENT_ON_POST,
    payload: post
  };
};

export const deleteCommentFromPost = post => {
  return {
    type: PostActionTypes.DELETE_COMMENT_FROM_POST,
    payload: post
  };
};

// // // // LIKES / DISLIKES
export const addLikeToPost = post => {
  return {
    type: PostActionTypes.ADD_LIKE_TO_POST,
    payload: post
  };
};
export const addDislikeToPost = post => {
  return {
    type: PostActionTypes.ADD_DISLIKE_TO_POST,
    payload: post
  };
};
export const removeLikeFromPost = post => {
  return {
    type: PostActionTypes.ADD_LIKE_TO_POST,
    payload: post
  };
};
export const removeDislikeFromPost = post => {
  return {
    type: PostActionTypes.REMOVE_LIKE_FROM_POST,
    payload: post
  };
};
