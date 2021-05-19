import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

export async function getAllWishlistsUser(user_id, token) {
  try {
    const res = await axios.get(`${baseURL}wishlists/user/${user_id}`, {
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

export async function getAllWishlistsAdmin(user_id, token) {
  try {
    const res = await axios.get(`${baseURL}wishlists/agency/${user_id}`, {
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
