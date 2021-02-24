import { LOGIN } from "../constants";
// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

let getUser = {};
const userData = async () => {
  getUser = await AsyncStorage.getItem("user");
  console.log("GET", getUser);
};

userData();
const initialState = {
  //   token: SecureStore.getItemAsync("jwt") || "",
  token: AsyncStorage.getItem("jwt") || "",
  user: !getUser ? JSON.parse(getUser) : {},
  isLoggedIn: !!AsyncStorage.getItem("jwt"),
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
    default:
      return state;
  }
};

export default auth;
