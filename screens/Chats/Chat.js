import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  KeyboardAvoidingView,
  Animated,
  LayoutAnimation,
  UIManager,
} from "react-native";
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import EmojiSelector, { Categories } from "react-native-emoji-selector";
// import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Audio } from "expo-av";
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
  const [emoji, setEmoji] = useState("");
  const [recording, setRecording] = useState(null);
  const [chatId, setChatId] = useState("");

  const [mainIndex, setMainIndex] = useState(null);
  const [chatExists, setChatExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myChats, setMyChats] = useState([]);
  const [otherChatName, setOtherchatName] = useState({ name: "", id: false });
  const [chatSend, setChatSend] = useState({});
  const [chatBlocked, setChatBlocked] = useState(false);

  // const location =
  //   "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540sehrish%252FRealestate/Audio/recording-827930e5-7c25-4d0a-bb39-b30c392753e4.m4a";

  // showStates
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [deluser, setDeluser] = useState("");

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

  let userId;
  if (agency.id) {
    userId = agency.id;
  } else {
    userId = user.decoded.userId;
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        console.log(route.params, "ROUTE PARAMS");
        if (route.params) {
          const res = await checkChatExists(route.params, token);
          dispatch(actions.currentChat(route.params?.chatId));
          console.log("RES", res);

          if (res.status) {
            setChatExists(true);
            setLoading(false);
          }
        } else {
          setChatExists(true);
          setLoading(false);
        }
      })();
      setLoading(false);
      return () => {
        setChatExists(false);
        setLoading(true);
        navigation.navigate("AllChats");
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      let unsubscribe = (() => {})();
      (async () => {
        const res = await fetchAllChats(route.params, token);
        console.error("IMPORTANT", res.chats);
        setMyChats(res.chats.reverse());

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

        dispatch(actions.setallMessages(res.chats));
        let show = false;

        /*------------------------------------------------
                    CHAT ONLINE TYPING STATUS
         ------------------------------------------------*/
        const comparingOnlineStates = (chats) => {
          if (agency.id) {
            chats?.map((chat) => {
              chat.users.map((userc) => {
                if (userc.id === res.customer.id && userc.online) show = true;
              });
            });
            setOtherchatName({
              name: res.customer.email,
              id: show,
            });
            setChatSend({ agency: res.agency.id, customer: res.customer.id });
          } else {
            chats?.map((chat) => {
              chat.users.map((userc) => {
                if (userc.id === res.agency.id && userc?.online) show = true;
              });
            });
            setOtherchatName({
              name: res.agency.name,
              id: show,
            });
            setChatSend({ agency: res.agency.id, customer: res.customer.id });
          }
        };
        comparingOnlineStates(chats);

        unsubscribe = store.subscribe(() => {
          console.log("STORE", store.getState());

          const chatterInfo = store.getState().chat.chats;
          console.log(chatterInfo);
          comparingOnlineStates(chatterInfo);
        });
      })();

      return () => {
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
        unsubscribe();
        setLoading(true);
      };
    }, [socket, dispatch])
  );

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const deleteMessageReceiever = (indexToAnimate) => {
    Animated.timing(receiverRef, {
      toValue: { x: 500, y: 0 },
      duration: 500,
      useNativeDriver: true,
    })
      .start(() => {
        LayoutAnimation.spring();
      })
      .start(() => {
        LayoutAnimation.spring();
        Animated.timing(receiverRef, {
          toValue: { x: 0, y: 0 },
          duration: 2000,
          useNativeDriver: true,
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

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.error("RECORDING", recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    handleStoringFilesInPhone(uri);
    console.log("Recording stopped and stored at", uri);
    console.error("URI", uri);
  }

  const handleStoringFilesInPhone = async () => {};

  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: 20, backgroundColor: "#98ded9" }}
    >
      {!loading && !chatBlocked ? (
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
          />
          <KeyboardAwareScrollView style={styles.content}>
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
            />
          </KeyboardAwareScrollView>

          {chatExists && (
            <KeyboardAvoidingView>
              {emojiSelector && (
                <View style={{ height: height / 2, backgroundColor: "#fff" }}>
                  <EmojiSelector
                    columns={8}
                    theme="#f8dc81"
                    category={Categories.all}
                    shouldInclude={(e) =>
                      parseFloat(e["added_in"]) <= 11 &&
                      e["has_img_apple"] === true
                    }
                    onEmojiSelected={(emoji) => {
                      setEmoji(emoji);
                      setEmojiSelector(false);

                      console.error(emoji);
                    }}
                  />
                </View>
              )}

              <View style={styles.chatArea}>
                <MessageInput
                  setEmojiSelector={setEmojiSelector}
                  emojiSelector={emojiSelector}
                  recording={recording}
                  stopRecording={stopRecording}
                  startRecording={startRecording}
                  chatSend={chatSend}
                  chatId={chatId}
                />
              </View>
            </KeyboardAvoidingView>
          )}
          <MenuOverlay
            visible={visible}
            setVisible={setVisible}
            toggleOverlay={toggleOverlay}
            constDeleteAllMessages={constDeleteAllMessages}
          />
        </View>
      ) : (
        <>{!chatBlocked && <Loading />}</>
      )}
      {chatBlocked && (
        <View
          style={{
            marginTop: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "EBGaramond-Bold", color: "#214151" }}>
            You cannot send messages to this user
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
