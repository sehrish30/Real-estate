import { LOGIN, FILLSTATE, LOGOUT, LOGINAGENCY } from "../constants";

const initialState = {
  token: "",
  user: {},
  isLoggedIn: false,
  agency: {},
  isLoggedInAgency: false,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
      };
    case FILLSTATE:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.jwt,
        isLoggedIn: action.payload.isLoggedIn,
      };
    case LOGOUT:
      return {
        ...state,
        token: "",
        user: {},
        isLoggedIn: false,
      };
    case LOGINAGENCY:
      return {
        ...state,
        agency: action.payload.agency,
        token: action.payload.jwt,
        isLoggedInAgency: action.payload.isLoggedInAgency,
      };
    default:
      return state;
  }
};

export default auth;
