import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { formatDistanceToNow } from "date-fns";
const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

// id is agency Object id in mongodb
// rate is rating
// userId is the person Object Id who is rating
// also pass the token which we can get from AsyncStorage
// data = {id="", rate="", userId=""}
export async function rateService(data, token) {
  try {
    const res = await axios.post(`${baseURL}agencies/rate`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

// id is agency object id
// content is user review
// data = {id="", userId="", content=""}
export async function reviewService(data, token) {
  try {
    const res = await axios.post(`${baseURL}agencies/review`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function replyReview(data, token) {
  // data = {id="", content="", userId=""}
  try {
    const res = await axios.post(`${baseURL}agencies/reply-review`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function checkUsersReview(id, userId, token) {
  try {
    const res = await axios.get(`${baseURL}agencies/check-users-review`, {
      params: {
        id: id,
        userId: userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.status);
    if (res.status == 200 || res.status == 201) {
      return res.data;
    } else if (res.status == 404) {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function checkUsersRate(id, userId, token) {
  try {
    const res = await axios.get(`${baseURL}agencies/check-users-rating`, {
      params: {
        id: id,
        userId: userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.status);
    if (res.status == 200 || res.status == 201) {
      return res.data;
    } else if (res.status == 404) {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getAllReviews(id, token, limit = 0) {
  try {
    const res = await axios.get(`${baseURL}agencies/all-reviews`, {
      params: {
        id: id,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.status);
    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}
