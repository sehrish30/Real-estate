import { Platform } from "react-native";
// import { ANDROID_API, IOS_API } from "@env";

const IOS_API = "http://localhost:3000/";
const ANDROID_API = "http://192.168.1.34:3000/";
let baseURL = "";
{
  Platform.OS == "android" ? (baseURL = ANDROID_API) : (baseURL = IOS_API);
  // console.error(baseURL);
}
// let baseURL = "https://real-estate-app-server.herokuapp.com/";
// let baseURL = "http://localhost:3000/";
export default baseURL;
