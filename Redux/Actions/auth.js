import {
  loginUser,
  registerUser,
  checkUser,
} from "../../Shared/Services/AuthServices";
import { LOGIN, FILLSTATE, LOGOUT } from "../constants";

export const login = (data, navigation) => (dispatch) => {
  loginUser(data)
    .then((res) => {
      console.log("RESPONSE ACTION", res);
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Home");
    })
    .catch((err) => {
      console.log(err);
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
  }
};

export const fillStore = (data) => async (dispatch) => {
  try {
    const { jwt, user, isLoggedIn } = data;
    const res = await checkUser(user.decoded.userId, jwt);

    dispatch({
      type: FILLSTATE,
      payload: { jwt, user, isLoggedIn },
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
