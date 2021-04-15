import {
  REQUEST_CONSULTATION,
  STORE_ALL_CONSULTATIONS,
  DECLINE_CONSULTATION,
  UPDATE,
  NOTIFY,
} from "../constants";

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
        consultations: payload.consultations,
      };
    case UPDATE:
      let consultationsCopy = state.consultations.map((cons) => {
        console.log("CONS", cons.id, payload.id);
        if (cons.id == payload.id) {
          cons.status = payload.status;
          return cons;
        }
        return cons;
      });
      return {
        ...state,
        consultations: consultationsCopy,
      };
    case DECLINE_CONSULTATION:
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        new: true,
      };
    case NOTIFY:
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        new: true,
      };
    default:
      return state;
  }
};

export default consultation;
