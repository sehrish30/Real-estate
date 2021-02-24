import { LOGIN } from "../constants";
import * as SecureStore from "expo-secure-store";

const initialState = {
  token: SecureStore.getItemAsync("jwt") || "",
  user: "",
  isLoggedIn: !!SecureStore.getItemAsync("jwt"),
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default auth;
