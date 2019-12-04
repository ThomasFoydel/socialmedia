import { CurrentPageActionTypes } from './currentPageTypes';

export const setCurrentPage = page => ({
  type: CurrentPageActionTypes.SET_CURRENT_PAGE,
  payload: page
});
