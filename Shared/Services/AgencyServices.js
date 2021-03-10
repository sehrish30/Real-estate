import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function getPendingAgencies() {
  try {
    const res = await axios.get(`${baseURL}agencies/pending-agencies`);

    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err, "ERROR");
    Toast.show({
      type: "error",
      text1: `It's an error on our end`,
      text2: `Thanks for your patience`,
      visibilityTime: 2000,
      topOffset: 30,
    });
  }
}

export async function getReportedProperties() {
  try {
    const res = await axios.get(`${baseURL}properties/reported-properties`);

    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err, "ERROR");
    Toast.show({
      type: "error",
      text1: `It's an error on our end`,
      text2: `Thanks for your patience`,
      visibilityTime: 2000,
      topOffset: 30,
    });
  }
}
