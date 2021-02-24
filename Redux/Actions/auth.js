import { loginUser, registerUser } from "../../Shared/Services/AuthServices";
import { LOGIN } from "../constants";

export const login = (data, navigation) => (dispatch) => {
  loginUser(data)
    .then((res) => {
      console.log("RESPONSE ACTION", res);
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Register");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const register = (data, navigation) => async (dispatch) => {
  try {
    const res = await registerUser(data);
    dispatch({ type: LOGIN, payload: res });
    navigation.navigate("Login");
  } catch (e) {
    console.error(e);
  }
};
