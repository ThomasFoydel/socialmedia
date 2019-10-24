import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/authReducer";
import postReducer from "./posts/postReducer";
import currentUserReducer from "./currentUser/currentUserReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "currentUser"]
};

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  auth: authReducer,
  posts: postReducer
});

export default persistReducer(persistConfig, rootReducer);
