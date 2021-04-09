import { REQUEST_CONSULTATION } from "../constants";

export const requestConsultation = (payload) => (dispatch) => {
  dispatch({ type: REQUEST_CONSULTATION, payload });
};
