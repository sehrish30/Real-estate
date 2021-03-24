import {
  CHAT_EXISTS,
  USER_ONLINE,
  USER_OFFLINE,
  ALL_CHATS,
  FRIENDS_ONLINE,
  FRIEND_ONLINE,
  SET_CHATS,
  SENDER_TYPING,
  SET_SOCKET,
  STOP_TYPING,
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
    case SET_SOCKET:
      return {
        ...state,
        socket: payload,
      };

    case USER_ONLINE:
      let chatsBCopy = state.chats.map((chat) => {
        let users = chat?.users.map((user) => {
          if (user.id == payload) {
            return {
              ...user,
              online: true,
            };
          }
          return user;
        });
        return {
          users,
        };
      });
      return {
        ...state,
        chats: chatsBCopy,
      };

    case USER_OFFLINE:
      let chatsACopy = state.chats.map((chat) => {
        let users = chat?.users.map((user) => {
          if (String(user.id) == String(payload)) {
            return {
              ...user,
              online: false,
            };
          }
          return user;
        });
        return {
          users,
        };
      });
      return {
        ...state,
        chats: chatsACopy,
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
      let chatsCopy = state.chats.map((chat) => {
        let users = chat?.users.map((user) => {
          if (String(user.id) == String(payload)) {
            return {
              ...user,
              online: true,
            };
          }
          return user;
        });
        return {
          users,
        };
      });
      return {
        ...state,
        chats: chatsCopy,
      };

    case FRIENDS_ONLINE:
      let chatsFriendsCopy = state.chats.map((chat) => {
        let users = chat?.users.map((user) => {
          if (String(payload).includes(user.id)) {
            return {
              ...user,
              online: true,
            };
          }
          return user;
        });
        return {
          users,
        };
      });
      return {
        ...state,
        chats: chatsFriendsCopy,
      };
    case SENDER_TYPING:
      let sendertyping = state.chats.map((chat) => {
        let users = chat?.users.map((user) => {
          if (String(payload).includes(user.id)) {
            return {
              ...user,
              online: true,
              typing: true,
            };
          }
          return user;
        });
        return {
          users,
        };
      });
      return {
        ...state,
        chats: sendertyping,
        senderTyping: { typing: true, id: payload },
      };
    case STOP_TYPING:
      let senderstoptyping = state.chats.map((chat) => {
        let users = chat?.users.map((user) => {
          if (String(payload).includes(user.id)) {
            return {
              ...user,
              online: true,
              typing: false,
            };
          }
          return user;
        });
        return {
          users,
        };
      });
      return {
        ...state,
        chats: senderstoptyping,
        senderTyping: { typing: false, id: payload },
      };
    default:
      return state;
  }
};

export default chat;
