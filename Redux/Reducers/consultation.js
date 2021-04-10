import { REQUEST_CONSULTATION } from "../constants";

const initialState = {
  notifications: [],
  new: false,
};

const consultation = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case REQUEST_CONSULTATION:
      return {
        notifications: [payload, ...state.notifications],
        new: true,
      };
    default:
      return state;
  }
};

export default consultation;
