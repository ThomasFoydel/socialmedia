import { CurrentPageActionTypes } from './currentPageTypes';

const INITIAL_STATE = {
  currentPage: 'home'
};

const currentPageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CurrentPageActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };

    default:
      return state;
  }
};

export default currentPageReducer;
