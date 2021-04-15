import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function consultationRequest(data, token) {
  try {
    const res = await axios.post(
      `${baseURL}consultations/customer-requesting-consultation`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status == 200 || res.status == 201) {
      Toast.show({
        type: "success",
        text1: `Consultation session requested`,
        text2: `We will notify you agency's response`,
        visibilityTime: 4000,
        topOffset: 30,
      });
      return res.data;
    } else if (res.status == 404) {
      Toast.show({
        type: "error",
        text1: `Consultation request couldn't be sent`,
        text2: `Please! Try again`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    } else {
      Toast.show({
        type: "info",
        text1: `Our servers are down`,
        text2: `Please! Try again`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export async function agencyConsultations(agencyId, token) {
  try {
    const res = await axios.get(
      `${baseURL}consultations/agency-consultations/${agencyId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status == 200 || res.status == 201) {
      return res.data;
    } else {
      Toast.show({
        type: "info",
        text1: `Please! Refresh the page`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export async function userConsultations(userId, token) {
  try {
    const res = await axios.get(
      `${baseURL}consultations/user-consultations/${userId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200 || res.status == 201) {
      return res.data;
    } else {
      Toast.show({
        type: "info",
        text1: `Please! Refresh the page`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export async function declineConsultation(data, token) {
  try {
    const res = await axios.put(
      `${baseURL}consultations/decline-consultation-request`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200 || res.status == 201) {
      Toast.show({
        type: "success",
        text1: `Consultation declined`,
        text2: `We have notified them`,
        visibilityTime: 2000,
        topOffset: 30,
      });
      return res.data;
    }
    if (res.status == 401) {
      Toast.show({
        type: "info",
        text1: `Your agency isn't logged in`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    } else {
      Toast.show({
        type: "error",
        text1: `Consultation couldn't be declined`,
        text2: `Try again`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export async function acceptConsultationRequest(data, token) {
  try {
    const res = await axios.put(
      `${baseURL}consultations/accept-consultation-request`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200 || res.status == 201) {
      Toast.show({
        type: "success",
        text1: `Consultation request accepted`,
        visibilityTime: 4000,
        topOffset: 30,
      });
      return res.data;
    }
    if (res.status == 422) {
      Toast.show({
        type: "error",
        text1: `Consultation couldn't be accepted`,
        text2: `Try again`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

export async function rescheduleConsultationRequest(data, token) {
  try {
    const res = await axios.put(
      `${baseURL}consultations/reschedule-consultation-request`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `We have notified customer`,
        text2: `about your reschedule consultation request`,
        visibilityTime: 4000,
        topOffset: 30,
      });
      return res.data;
    }
    if (res.status == 422) {
      Toast.show({
        type: "error",
        text1: `Consultation couldn't be reschduled`,
        text2: `Try again`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.log(err);
  }
}
