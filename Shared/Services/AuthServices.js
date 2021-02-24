import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function loginUser(data) {
  try {
    const res = await axios.post(`${baseURL}users/login`, data, config);
    console.log(res.data);
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `${res.data.email} successfully logged in`,
        visibilityTime: 2000,
        topOffset: 30,
      });
      await SecureStore.setItemAsync("jwt", res.data.token);
      const decoded = jwt_decode(res.data.token);
      return { decoded, ...res };
      //   dispatch(setCurrentUser(decoded, user));
    }
  } catch (err) {
    console.log(err);
  }
}
