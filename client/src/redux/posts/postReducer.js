import { PostActionTypes } from './postTypes';

const INITIAL_STATE = {
  posts: {}
};

const postReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PostActionTypes.SET_POSTS:
      return { ...state, posts: [...action.payload] };
    case PostActionTypes.PUSH_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case PostActionTypes.DELETE_POST:
      const newPostsArray = state.posts.filter(
        post => post._id !== action.payload._id
      );
      return {
        ...state,
        posts: [...newPostsArray]
      };
    case PostActionTypes.ADD_COMMENT_TO_POST:
      const postToUpdate = state.posts.filter(
        post => post._id === action.payload._id
      )[0];

      const postsArrayMinusPostToUpdate = state.posts.filter(
        post => post._id !== action.payload._id
      );

      const newCommentsArray = [...postToUpdate.comments, action.payload._id];

      postToUpdate.comments = newCommentsArray;
      const updatedPostsArray = [postToUpdate, ...postsArrayMinusPostToUpdate];

      return {
        ...state,
        posts: [...updatedPostsArray]
      };
    case PostActionTypes.DELETE_COMMENT_FROM_POST:
      const updatedPost = action.payload;
      // take post array in state, filter it for all that dont match payload id
      const stateArrayMinusPost = state.posts.filter(
        post => post._id !== action.payload._id
      );
      const newArray = [...stateArrayMinusPost, updatedPost];
      return {
        state,
        posts: [...newArray]
      };
    default:
      return state;
  }
};

export default postReducer;
