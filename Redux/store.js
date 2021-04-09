import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import auth from "./Reducers/auth";
import chat from "./Reducers/chat";
import consultation from "./Reducers/consultation";

const reducers = combineReducers({
  // user Reducer
  auth: auth,
  chat: chat,
  consultation: consultation,
});

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export default store;
