import {
  loginUser,
  registerUser,
  registerGoogleUser,
  loginGoogleUser,
  checkUser,
} from "../../Shared/Services/AuthServices";
import {
  LOGIN,
  FILLSTATE,
  LOGOUT,
  LOGINAGENCY,
  UPDATEAGENCYPROFILE,
} from "../constants";
import Toast from "react-native-toast-message";

export const login = (data, navigation, setLoading) => (dispatch) => {
  loginUser(data)
    .then((res) => {
      console.log("RESPONSE ACTION", res);
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Home");
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: `Email or password not correct`,
        text2: `Please try again`,
        visibilityTime: 2000,
        topOffset: 30,
      });
    });
};

export const googlelogin = (data, navigation) => (dispatch) => {
  console.log("DATA", data);
  loginGoogleUser(data)
    .then((res) => {
      console.log("RESPONSE ACTION", res);
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Home");
    })
    .catch((err) => {
      console.log(err);

      Toast.show({
        type: "error",
        text1: `Email or password not correct`,
        text2: `Please try again`,
        visibilityTime: 2000,
        topOffset: 30,
      });
    });
};

export const register = (data, navigation, setLoading) => async (dispatch) => {
  try {
    const res = await registerUser(data);
    if (res) {
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Home");
      setLoading(false);
    }
  } catch (e) {
    console.error(e);
    Toast.show({
      type: "error",
      text1: `Couldn't register user`,
      text2: `Please try again`,
      visibilityTime: 2000,
      topOffset: 30,
    });
    setLoading(false);
  }
};

export const googleRegister = (data, navigation) => async (dispatch) => {
  try {
    const res = await registerGoogleUser(data);
    if (res) {
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Home");
    }
  } catch (e) {
    console.error(e);
    Toast.show({
      type: "error",
      text1: `Couldn't register user`,
      text2: `Please try again`,
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

export const updateProfile = (data) => (dispatch) => {
  dispatch({
    type: UPDATEAGENCYPROFILE,
    payload: data,
  });
};
