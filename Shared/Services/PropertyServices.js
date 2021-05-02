import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

export async function listAllReportedProperties(token) {
  try {
    const res = await axios.get(`${baseURL}properties/reported-properties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function deleteReportedProperty(data, token) {
  try {
    const res = await axios.delete(
      `${baseURL}properties/reported-property/${data.id}/${data.agencyId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          type: data.type,
        },
      }
    );
    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function undoReport(data, token) {
  console.error("GETTING", token, data);
  try {
    const res = await axios.put(`${baseURL}properties/undo-report`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function propertyLocation(data, token) {
  try {
    const res = await axios.put(`${baseURL}properties/choose-location`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      Toast.show({
        type: "success",
        text1: `Subscribed locations updated`,
        visibilityTime: 2000,
        topOffset: 30,
      });
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function propertyNotifications(data, token) {
  try {
    const res = await axios.put(`${baseURL}properties/choose-location`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getSubscribedLocations(userId, token) {
  try {
    const res = await axios.get(`${baseURL}properties/subscribed-locations`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId,
      },
    });

    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}
