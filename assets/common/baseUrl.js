import { Platform } from "react-native";
// import { ANDROID_API, IOS_API } from "@env";

const IOS_API = "http://localhost:3000/";
const ANDROID_API = "http://37.131.117.29:3000/";
let baseURL = "";
console.log(IOS_API, ANDROID_API);
{
  Platform.OS == "android" ? (baseURL = ANDROID_API) : (baseURL = IOS_API);
}

export default baseURL;
