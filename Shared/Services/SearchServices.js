import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function searchAgencies(
  name,
  location,
  highRating,
  lowRating,
  recent,
  isVerified
) {
  try {
    let data;
    if (name && location) {
      data = { params: { name, location } };
    } else if (!name && location) {
      data = { params: { location } };
    } else if (highRating) {
      data = { params: { highRating } };
    } else if (lowRating) {
      data = { params: { lowRating } };
    } else if (recent) {
      data = { params: { recent } };
    } else if (isVerified) {
      data = { params: { isVerified } };
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
