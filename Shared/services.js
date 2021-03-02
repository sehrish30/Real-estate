import { Platform, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export async function uploadToCloudinary(image) {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "realestate");
  data.append("cloud_name", "dtxrrhfqj");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dtxrrhfqj/image/upload",
    {
      method: "post",
      body: data,
      mode: "cors",
    }
  );
  const final = await res.json();
  const sendData = {
    url: final.secure_url,
    public_id: final.public_id,
  };
  return final.secure_url;
}

export async function uploadImageFromPhone() {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sorry, we need camera roll permissions to upload your attachments!"
      );
    }
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [3, 2],
    quality: 0.8,
  });

  if (!result.cancelled) {
    let filename = result.uri.split("/").pop();

    let newfile = {
      uri: result.uri,
      type: `test/${result.uri.split(".")[1]}`,
      name: filename,
    };

    return newfile;
  }
}

export async function uploadLogoToCloudinary(image) {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "realestate");
  data.append("cloud_name", "dtxrrhfqj");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dtxrrhfqj/image/upload",
    {
      method: "post",
      body: data,
      mode: "cors",
    }
  );
  const final = await res.json();
  const sendData = {
    url: final.secure_url,
    public_id: final.public_id,
  };
  return sendData;
}

export async function validateRegisterAgencyForm(formData) {
  let errors = {};
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Please type a valid email";
  }

  if (!formData.name) {
    errors.name = "Name is required";
  }
  if (formData.locations.length === 0) {
    errors.location = "Please select atleast 1 location";
  }

  if (!formData.phone) {
    errors.phone = "Phone number is required";
  }
  return errors;
}
