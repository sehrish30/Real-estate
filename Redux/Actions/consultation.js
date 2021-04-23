import {
  REQUEST_CONSULTATION,
  STORE_ALL_CONSULTATIONS,
  DECLINE_CONSULTATION,
  UPDATE,
  NOTIFY,
  DELETE_CONSULTATION,
  STORE_NOTIFICATIONS,
} from "../constants";

export const requestConsultation = (payload) => (dispatch) => {
  dispatch({ type: REQUEST_CONSULTATION, payload });
};

export const storeAllConsultations = (payload) => (dispatch) => {
  dispatch({ type: STORE_ALL_CONSULTATIONS, payload });
};

export const decline = (data) => (dispatch) => {
  dispatch({ type: DECLINE_CONSULTATION, payload: data });
};

export const updateConsultations = (data) => (dispatch) => {
  dispatch({ type: UPDATE, payload: data });
};

export const notification = (data) => (dispatch) => {
  dispatch({ type: NOTIFY, payload: data });
};

export const deleteConsultation = (payload) => (dispatch) => {
  dispatch({ type: DELETE_CONSULTATION, payload });
};

export const storeAllNotifications = (payload) => (dispatch) => {
  dispatch({ type: STORE_NOTIFICATIONS, payload });
};
