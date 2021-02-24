import { loginUser } from "../../Shared/Services/AuthServices";
import { LOGIN } from "../constants";

export const login = (data, navigation) => (dispatch) => {
  loginUser(data)
    .then((res) => {
      dispatch({ type: LOGIN, payload: res });
      navigation.navigate("Register");
    })
    .catch((err) => {
      console.log(err);
    });
};
