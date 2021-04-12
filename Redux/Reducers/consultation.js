import { REQUEST_CONSULTATION, STORE_ALL_CONSULTATIONS } from "../constants";

const initialState = {
  notifications: [],
  consultations: [],
  new: false,
};

const consultation = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case REQUEST_CONSULTATION:
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        new: true,
      };
    case STORE_ALL_CONSULTATIONS:
      return {
        ...state,
        consultations: payload,
      };
    default:
      return state;
  }
};

export default consultation;
