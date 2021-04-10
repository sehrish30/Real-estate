import baseURL from "../assets/common/baseUrl";
import socketIOClient from "socket.io-client";
import * as actions from "../Redux/Actions/consultation";
import store from "../Redux/store";

export function useSocket(user, dispatch) {
  const ENDPOINT = baseURL;

  const socket = socketIOClient(ENDPOINT);
}
