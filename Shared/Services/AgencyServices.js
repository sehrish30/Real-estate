import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function getAgencyDetails(id) {
  try {
    if (id) {
      const res = await axios.get(`${baseURL}agencies/${id}`);
      if (res.status == 200 || res.status == 201) {
        return res.data;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

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
      topOffset: StatusBar.currentHeight + 10,
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
      topOffset: StatusBar.currentHeight + 10,
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
        text1: `Seller successfully Rejected`,
        visibilityTime: 2000,
        topOffset: StatusBar.currentHeight + 10,
      });
    }
    return id;
  } catch (err) {
    console.error(err);
    Toast.show({
      type: "error",
      text1: `Seller couldn't be rejected`,
      text2: `Try again!`,
      visibilityTime: 2000,
      topOffset: StatusBar.currentHeight + 10,
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
        text1: `Seller successfully Accepted`,
        visibilityTime: 4000,
        topOffset: StatusBar.currentHeight + 10,
      });
    }
    return data.id;
  } catch (err) {
    console.error(err);
    Toast.show({
      type: "error",
      text1: `Seller couldn't be accepted`,
      text2: `Try again!`,
      visibilityTime: 4000,
      topOffset: StatusBar.currentHeight + 10,
    });
  }
}

export async function checkIfEmailExists(email) {
  try {
    const res = await axios.get(
      `${baseURL}agencies/email-exists/${email}`,
      config
    );

    if (res.status == 200) {
      return res.data;
    } else {
      Toast.show({
        type: "error",
        text1: `Sorry, we have no agency registered with this email`,
        text2: `Try again!`,
        visibilityTime: 4000,
        topOffset: StatusBar.currentHeight + 10,
      });
    }
  } catch (err) {
    Toast.show({
      type: "error",
      text1: `Our servers are down`,
      text2: `Try again!`,
      visibilityTime: 4000,
      topOffset: StatusBar.currentHeight + 10,
    });
  }
}

export async function resetPasswordAgency(data) {
  try {
    const res = await axios.post(
      `${baseURL}agencies/reset-password`,
      data,
      config
    );
    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function checkCodeAgency(data, token) {
  try {
    const res = await axios.post(`${baseURL}agencies/check-code`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function enterpassword(data, token) {
  try {
    const res = await axios.post(`${baseURL}agencies/enter-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function changeOfficeTiming(data, token) {
  try {
    const res = await axios.put(`${baseURL}agencies/office-hours`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `Office hours updated`,
        visibilityTime: 4000,
        topOffset: StatusBar.currentHeight + 10,
      });
      return res.data;
    }
  } catch (err) {
    Toast.show({
      type: "error",
      text1: `Office hours couldn't be updated`,
      text2: `Try again`,
      visibilityTime: 4000,
      topOffset: StatusBar.currentHeight + 10,
    });
    console.error(err);
  }
}

export async function changePropertyVisitTimings(data, token) {
  try {
    const res = await axios.put(`${baseURL}agencies/visit-hours`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `Property visit hours updated`,
        visibilityTime: 4000,
        topOffset: StatusBar.currentHeight + 10,
      });
      return res.data;
    }
  } catch (err) {
    Toast.show({
      type: "error",
      text1: `Property visit time couldn't be updated`,
      text2: `Try again`,
      visibilityTime: 4000,
      topOffset: StatusBar.currentHeight + 10,
    });
  }
}

export async function agentProperties(id, token) {
  try {
    const response = await axios.get(`${baseURL}agencies/my-properties`, {
      params: {
        agency: id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 200) {
      return response.data;
    }
  } catch (err) {
    console.error(err);
  }
}
