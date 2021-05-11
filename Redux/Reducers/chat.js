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
  SET_SEEN_MESSAGE,
  DELETE_CHAT,
  BLOCK_CHAT,
  UNBLOCK_CHAT,
  FETCH_CHATS,
  EDIT_FETCH_CHATS,
  FETCH_CHAT_SEEN,
} from "../constants";

const initialState = {
  chats: [],
  currentChat: "",
  socket: {},
  newMessageChats: [{ chatId: null, seen: null }],
  currentChatBlocked: false,
  senderTyping: { typing: false },
  chatExists: false,
  messages: [],
  unseenCount: [],
  allChats: [],
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
      };

    case SET_MESSAGE:
      if (state.currentChat == payload.chatId) {
        return {
          ...state,
          messages: [...state.messages, payload],
        };
      } else {
        let sendChats = state.newMessageChats;
        sendChats = { chatId: payload.chatId, seen: false };
        return {
          ...state,
          newMessageChats: sendChats,
        };
      }

    case SET_SEEN_MESSAGE:
      if (state.currentChat == payload.chatId) {
        let sendChats = state.newMessageChats;
        sendChats = { chatId: payload.chatId, seen: true };
        return {
          ...state,
          newMessageChats: sendChats,
        };
      }

    case SET_ALL_MESSAGES:
      return {
        ...state,
        messages: payload,
        newMessageChats: { chatId: null, seen: true },
      };
    case DELETE_CHAT:
      return {
        ...state,
        messages:
          state.currentChat == payload.chatId
            ? state.messages.filter((msg) => msg.id != payload.msgId)
            : state.messages,
      };
    case BLOCK_CHAT:
      if (state.currentChat == payload.chatId) {
        return {
          ...state,
          currentChatBlocked: true,
        };
      }

    case UNBLOCK_CHAT:
      if (state.currentChat == payload.chatId) {
        return {
          ...state,
          currentChatBlocked: false,
        };
      }
    case FETCH_CHATS:
      return {
        ...state,
        allChats: action.payload,
      };
    case EDIT_FETCH_CHATS:
      return {
        ...state,
        allChats: [payload, ...state.allChats],
      };
    case FETCH_CHAT_SEEN:
      let allChatsCopy = state.allChats;
      allChatsCopy.map((chat) => {
        if (chat.id == payload) {
          console.log(chat.seen);
          chat.seen = true;
        }
      });
      return {
        ...state,
        allChats: allChatsCopy,
      };

    default:
      return state;
  }
};

export default chat;
