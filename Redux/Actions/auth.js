import {
  loginUser,
  registerUser,
  checkUser,
} from "../../Shared/Services/AuthServices";
import { LOGIN, FILLSTATE, LOGOUT, LOGINAGENCY } from "../constants";
import Toast from "react-native-toast-message";

export const login = (data, navigation) => (dispatch) => {
  loginUser(data)
    .then((res) => {
      console.log("RESPONSE ACTION", res);
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Home");
    })
    .catch((err) => {
      console.log(err);
      Toast.show({
        type: "error",
        text1: `${err}`,
        visibilityTime: 2000,
        topOffset: 30,
      });
    });
};

export const register = (data, navigation) => async (dispatch) => {
  try {
    const res = await registerUser(data);
    if (res) {
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Home");
    }
  } catch (e) {
    console.error(e);
    Toast.show({
      type: "error",
      text1: `${e}`,
      visibilityTime: 2000,
      topOffset: 30,
    });
  }
};

export const fillStore = (data) => async (dispatch) => {
  try {
    const { jwt, user, isLoggedIn, isLoggedInAgency, agency } = data;
    dispatch({
      type: FILLSTATE,
      payload: { jwt, user, isLoggedIn, isLoggedInAgency, agency },
    });
  } catch (e) {
    console.log(e);
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const loginAgencyAction = (data) => (dispatch) => {
  dispatch({
    type: LOGINAGENCY,
    payload: data,
  });
};
