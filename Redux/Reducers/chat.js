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
  SET_CURRENT_CHAT,
  SET_MESSAGE,
  SET_ALL_MESSAGES,
} from "../constants";

const initialState = {
  chats: [],
  currentChat: "",
  socket: {},
  newMessageChats: [{ chatId: null, seen: null }],
  scrollBottom: 0,
  senderTyping: { typing: false },
  chatExists: false,
  messages: [],
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

    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: payload,
        scrollBottom: state.scrollBottom + 1,
      };

    case SET_MESSAGE:
      console.log(state.currentChat);
      if (state.currentChat == payload.chatId) {
        let allmessages = state.messages;
        allmessages.push(payload);
        // allmessages = payload;
        return {
          ...state,
          messages: allmessages,
        };
      } else {
        let sendChats = state.newMessageChats;
        sendChats = { chatId: payload.chatId, seen: false };
        return {
          ...state,
          newMessageChats: sendChats,
        };
      }

    case SET_ALL_MESSAGES:
      return {
        ...state,
        messages: payload,
      };
    default:
      return state;
  }
};

export default chat;
