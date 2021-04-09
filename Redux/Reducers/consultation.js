import { REQUEST_CONSULTATION } from "../constants";

const initialState = {
  notifications: [],
  socket: {},
};

const consultation = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case REQUEST_CONSULTATION:
      return {
        notifications: [payload, ...state.notifications],
      };
    default:
      return state;
  }
};

export default consultation;
