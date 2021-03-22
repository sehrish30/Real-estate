import {
  CHAT_EXISTS,
  USER_ONLINE,
  USER_OFFLINE,
  ALL_CHATS,
  FRIENDS_ONLINE,
  FRIEND_ONLINE,
  SET_CHATS,
} from "../constants";

const initialState = {
  chats: [],
  currentChat: {},
  socket: {},
  newMessage: { chatId: null, seen: null },
  scrollBottom: 0,
  senderTyping: { typing: false },
  chatExists: false,
};

const chat = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CHAT_EXISTS:
      return {
        ...state,
        chatExists: true,
      };

    case USER_ONLINE:
      const chats = state.chats?.Users?.map((user) => {
        if (user.id == payload) {
          return {
            ...state.chats,
            status: "online",
          };
        }
      });
      return {
        ...state,
        chats,
      };

    case USER_OFFLINE:
      return {
        ...state,
        online: false,
      };
    case ALL_CHATS:
      return {
        ...state,

        chats: action.payload,
      };
    case SET_CHATS:
      return {
        ...state,
        chats: payload,
      };
    case FRIEND_ONLINE:
      const data = state.chats.users.map((user) => {
        if (user.id == payload) {
          user.online = true;
        }
      });
      return {
        ...state,
        chats: data,
      };

    default:
      return state;
  }
};

export default chat;
