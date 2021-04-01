import React, { useState, useRef, useCallback } from "react";

import {
  KeyboardAvoidingView,
  Animated,
  LayoutAnimation,
  UIManager,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { useSelector, useDispatch } from "react-redux";
import { Icon } from "react-native-elements";

import MenuOverlay from "../../Shared/Overlays/MenuOverlay";

import MessageInput from "../../Shared/Chats/MessageInput";
import ChatHeader from "../../Shared/Chats/ChatHeader";

import {
  checkChatExists,
  fetchAllChats,
  seenChat,
} from "../../Shared/Services/ChatServices";
import * as actions from "../../Redux/Actions/chat";
import Loading from "../../Shared/Loading";
import store from "../../Redux/store";
import ChatsContent from "../../Shared/Chats/ChatsContent";

var { width, height } = Dimensions.get("window");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Chat = ({ navigation, route }) => {
  const [chatId, setChatId] = useState("");

  const [mainIndex, setMainIndex] = useState(null);
  const [chatExists, setChatExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myChats, setMyChats] = useState([]);
  const [otherChatName, setOtherchatName] = useState({ name: "", id: false });
  const [chatSend, setChatSend] = useState({});
  const [chatBlocked, setChatBlocked] = useState(false);
  const [personWhoBlocked, setPersonWhoBlocked] = useState("");

  // showStates

  const [visible, setVisible] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [deluser, setDeluser] = useState("");
  const [showNoMessages, setShowNoMessages] = useState(false);

  // animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const receiverRef = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // sockets
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.user);
  let token = useSelector((state) => state.auth.token);
  let agency = useSelector((state) => state.auth.agency);
  let chats = useSelector((state) => state.chat.chats);
  let socket = useSelector((state) => state.chat.socket);
  let messages = useSelector((state) => state.chat.messages);
  let blockstatus = useSelector((state) => state.chat.currentChatBlocked);

  let userId;
  if (agency.id) {
    userId = agency.id;
  } else {
    userId = user.decoded.userId;
  }

  useFocusEffect(
    useCallback(() => {
      let unsubscribe = () => {};
      let chatExistence = false;
      (async () => {
        console.log(route.params, "ROUTE PARAMS");
        if (route.params) {
          const res = await checkChatExists(
            { agency: route.params.agency, customer: route.params.customer },
            token
          );

          // Storing current chat ID in redux
          dispatch(actions.currentChat(route.params?.chatId));

          // Checking if chat exists
          if (res.status) {
            setChatExists(true);
            chatExistence = res.status;

            setLoading(false);

            // Checking if the chat is blocked or not
            setChatBlocked(res.isblocked);
            setPersonWhoBlocked(res?.personWhoBlocked);
          }
        } else {
          setChatExists(true);
          chatExistence = res.status;
          setLoading(false);
        }

        /*--------------------------------------
                 FETCH CHATS
      --------------------------------------*/

        if (chatExistence) {
          (async () => {
            const res = await fetchAllChats(
              { agency: route.params.agency, customer: route.params.customer },
              token
            );

            if (res.chats?.length === 0) {
              setShowNoMessages(true);
            }
            setMyChats(res.chats?.reverse());

            if (agency.id) {
              await seenChat(
                { chatId: route.params?.chatId, person: agency.id },
                token
              );
            } else {
              await seenChat(
                { chatId: route.params?.chatId, person: user.decoded.userId },
                token
              );
            }

            setChatId(res.id);

            // SAve all the messages in redux
            dispatch(actions.setallMessages(res.chats));
            let show = false;

            /*------------------------------------------------
                      CHAT ONLINE TYPING STATUS
           ------------------------------------------------*/
            const comparingOnlineStates = (chats) => {
              if (agency.id) {
                show = false;
                chats?.map((chat) => {
                  chat.users.map((userc) => {
                    if (userc.id == res.customer.id && userc.online == true) {
                      show = true;
                    }
                  });
                });

                setOtherchatName({
                  name: res.customer.email,
                  id: show,
                });
                setChatSend({
                  agency: res.agency.id,
                  customer: res.customer.id,
                });
              } else {
                show = false;
                chats?.map((chat) => {
                  chat.users.map((userc) => {
                    if (userc.id == res.agency.id && userc?.online == true) {
                      show = true;
                    }
                  });
                });

                setOtherchatName({
                  name: res.agency.name,
                  id: show,
                });

                setChatSend({
                  agency: res.agency.id,
                  customer: res.customer.id,
                });
              }
            };

            comparingOnlineStates(chats);

            unsubscribe = store.subscribe(() => {
              console.log("STORE", store.getState().chat.chats);

              const chatterInfo = store.getState().chat.chats;

              // console.log(chatterInfo);
              comparingOnlineStates(chatterInfo);
            });
          })();

          // return () => {};
        }
      })();
      setLoading(false);

      (async () => {
        if (agency.id) {
          await seenChat(
            { chatId: route.params?.chatId, person: agency.id },
            token
          );
        } else {
          await seenChat(
            { chatId: route.params?.chatId, person: user.decoded.userId },
            token
          );
        }
      })();

      return () => {
        unsubscribe();

        setLoading(true);

        setChatExists(false);
        chatExistence = false;
        setLoading(true);
        navigation.navigate("AllChats");
      };
    }, [])
  );

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const deleteMessageReceiever = (indexToAnimate) => {
    Animated.timing(receiverRef, {
      toValue: { x: 500, y: 0 },
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      LayoutAnimation.spring();

      Animated.timing(receiverRef, {
        toValue: { x: 0, y: 0 },
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        LayoutAnimation.spring();
        setMainIndex("");
      });
    });

    console.log("INDEX TO ANIMATR", mainIndex, indexToAnimate);
    setShowTrash(false);
    if (userId == chatSend.customer) {
      socket.emit("delMessage", {
        toUserId: chatSend.agency,
        chatId: route.params?.chatId,
        msgId: mainIndex,
        fromUserId: userId,
      });
    } else {
      socket.emit("delMessage", {
        toUserId: chatSend.customer,
        chatId: route.params?.chatId,
        msgId: mainIndex,
        fromUserId: userId,
      });
    }
  };

  const constDeleteAllMessages = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: 20, backgroundColor: "#98ded9" }}
    >
      {!loading && (!chatBlocked || personWhoBlocked === userId) ? (
        <View style={{ flex: 1 }}>
          <ChatHeader
            showTrash={showTrash}
            toggleOverlay={toggleOverlay}
            setShowTrash={setShowTrash}
            deleteMessageReceiever={deleteMessageReceiever}
            otherChatName={otherChatName}
            mainIndex={mainIndex}
            deluser={deluser}
            chatId={route.params?.chatId}
            setMainIndex={setMainIndex}
          />
          <KeyboardAvoidingView style={styles.content}>
            <ChatsContent
              chatExists={chatExists}
              messages={messages}
              setMainIndex={setMainIndex}
              setShowTrash={setShowTrash}
              setDeluser={setDeluser}
              route={route}
              navigation={navigation}
              receiverRef={receiverRef}
              userId={userId}
              fadeAnim={fadeAnim}
              mainIndex={mainIndex}
              showNoMessages={showNoMessages}
            />
          </KeyboardAvoidingView>

          {chatExists && !route.params.notsure && (
            <KeyboardAvoidingView>
              <View style={styles.chatArea}>
                <MessageInput chatSend={chatSend} chatId={chatId} />
              </View>
            </KeyboardAvoidingView>
          )}
          <MenuOverlay
            visible={visible}
            setVisible={setVisible}
            toggleOverlay={toggleOverlay}
            constDeleteAllMessages={constDeleteAllMessages}
            chatData={route.params}
            chatBlocked={chatBlocked}
            personWhoBlocked={personWhoBlocked}
            setPersonWhoBlocked={setPersonWhoBlocked}
          />
        </View>
      ) : (
        <>{!chatBlocked && <Loading />}</>
      )}
      {(chatBlocked || blockstatus) && personWhoBlocked !== userId && (
        <View
          style={{
            // marginTop: 30,
            // justifyContent: "center",
            // alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            height: height,
          }}
        >
          <View style={{ marginBottom: 20, marginRight: "auto" }}>
            <Icon
              // raised
              onPress={() => navigation.navigate("AllChats")}
              name="ios-arrow-back-circle"
              type="ionicon"
              color="#214151"
              size={30}
            />
          </View>
          <Text
            style={{
              fontFamily: "EBGaramond-Bold",
              color: "#214151",
              justifyContent: "center",
              alignItems: "center",
              marginTop: height / 3,
              textAlign: "center",
              fontSize: 20,
            }}
          >
            You can't send messages to this user
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  content: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    shadowColor: "#214151",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },

  chatArea: {
    paddingTop: 5,
    flexDirection: "row",
    width: width,
    backgroundColor: "#fff",
  },
});
