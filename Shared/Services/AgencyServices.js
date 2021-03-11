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

export async function rejectAgency(id, token) {
  console.log("GOT", id, token);
  try {
    const res = await axios.delete(`${baseURL}agencies/rejected/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("RESPOSNSE", res.data);

    if (res.status == 200 || res.status == 201) {
      Toast.show({
        type: "success",
        text1: `Agency successfully Rejected`,
        visibilityTime: 2000,
        topOffset: 30,
      });
    }
    return id;
  } catch (err) {
    console.error(err);
    Toast.show({
      type: "error",
      text1: `Agency couldn't be rejected`,
      text2: `Try again!`,
      visibilityTime: 2000,
      topOffset: 30,
    });
  }
}

export async function acceptAgency(data, token) {
  try {
    const res = await axios.put(`${baseURL}agencies/approved`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200 || res.status == 201) {
      Toast.show({
        type: "success",
        text1: `Agency successfully Accepted`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
    return data.id;
  } catch (err) {
    console.error(err);
    Toast.show({
      type: "error",
      text1: `Agency couldn't be accepted`,
      text2: `Try again!`,
      visibilityTime: 4000,
      topOffset: 30,
    });
  }
}
