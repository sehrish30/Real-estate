import { REQUEST_CONSULTATION, STORE_ALL_CONSULTATIONS } from "../constants";

export const requestConsultation = (payload) => (dispatch) => {
  dispatch({ type: REQUEST_CONSULTATION, payload });
};

export const storeAllConsultations = (payload) => (dispatch) => {
  dispatch({ type: STORE_ALL_CONSULTATIONS, payload });
};
