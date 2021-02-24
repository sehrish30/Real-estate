import { Platform } from "react-native";
import { ANDROID_API, IOS_API } from "@env";

let baseURL = "";
console.log(IOS_API, ANDROID_API);
{
  Platform.OS == "android" ? (baseURL = ANDROID_API) : (baseURL = IOS_API);
}

export default baseURL;
