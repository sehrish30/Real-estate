import { LOGIN, FILLSTATE, LOGOUT } from "../constants";
// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  //   token: SecureStore.getItemAsync("jwt") || "",
  token: "",
  user: {},
  isLoggedIn: false,
  //   isLoggedIn: !!SecureStore.getItemAsync("jwt"),
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
      };
    case FILLSTATE:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.jwt,
        isLoggedIn: action.payload.isLoggedIn,
      };
    case LOGOUT:
      return {
        ...state,
        token: "",
        user: {},
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default auth;
