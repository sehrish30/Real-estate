import {
  CHAT_EXISTS,
  USER_ONLINE,
  USER_OFFLINE,
  ALL_CHATS,
} from "../constants";

const initialState = {
  chats: [],
  currentChat: {},
  socket: {},
  newMessage: { chatId: null, seen: null },
  scrollBottom: 0,
  senderTyping: { typing: false },
  chatExists: false,
  online: false,
};

const chat = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_EXISTS:
      return {
        ...state,
        chatExists: true,
        online: true,
      };
    case USER_ONLINE:
      return {
        ...state,
        online: true,
      };
    case USER_OFFLINE:
      return {
        ...state,
        online: false,
      };
    case ALL_CHATS:
      return {
        ...state,
        online: true,
        chats: action.payload,
      };
    default:
      return state;
  }
};

export default chat;
