import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function searchAgencies(name, location) {
  console.log(name, location);
  try {
    let data;
    if (name && location) {
      data = { params: { name, location } };
    } else if (!name && location) {
      data = { params: { location } };
    } else {
      data = { params: { name } };
    }
    const res = await axios.get(`${baseURL}agencies`, data, config);
    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
}