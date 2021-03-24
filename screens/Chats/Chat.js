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
import { Badge } from "react-native-elements";
import { useSocket } from "../../hooks/socketConnect";
import { useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import EmojiSelector, { Categories } from "react-native-emoji-selector";
// import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Audio } from "expo-av";
import MenuOverlay from "../../Shared/Overlays/MenuOverlay";
import { Pressable } from "react-native";
import MessageInput from "../../Shared/Chats/MessageInput";
import ChatHeader from "../../Shared/Chats/ChatHeader";
import CreateChat from "../../Shared/Chats/CreateChat";
import {
  checkChatExists,
  fetchAllChats,
} from "../../Shared/Services/ChatServices";
import * as actions from "../../Redux/Actions/chat";
import Loading from "../../Shared/Loading";

var { width, height } = Dimensions.get("window");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Chat = ({ navigation, route }) => {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("");
  const [recording, setRecording] = useState(null);

  const [mainIndex, setMainIndex] = useState(null);
  const [chatExists, setChatExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myChats, setMyChats] = useState([]);
  const [otherChatName, setOtherchatName] = useState("");
  const [chatSend, setChatSend] = useState({});

  // const location =
  //   "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540sehrish%252FRealestate/Audio/recording-827930e5-7c25-4d0a-bb39-b30c392753e4.m4a";

  // showStates
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  // animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const receiverRef = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // sockets
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.user);
  let token = useSelector((state) => state.auth.token);
  let agency = useSelector((state) => state.auth.agency);
  let chats = useSelector((state) => state.chat.chats);
  let userId;
  if (agency) {
    userId = agency.id;
  } else {
    userId = user.decoded.userId;
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        console.log(route.params, "TESTING");
        if (route.params) {
          const res = await checkChatExists(route.params, token);
          console.error("RES", res);

          if (res.status) {
            setChatExists(true);
            setLoading(false);
            // fetchChats()
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

  useEffect(() => {
    (async () => {
      const res = await fetchAllChats(route.params, token);

      setMyChats(res.chats);
      let show = false;

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
    })();

    return () => {};
  }, [dispatch, chats]);

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
    });
    console.error(mainIndex, indexToAnimate);
    setShowTrash(false);
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
      {!loading ? (
        <View>
          <ChatHeader
            showTrash={showTrash}
            toggleOverlay={toggleOverlay}
            setShowTrash={setShowTrash}
            deleteMessageReceiever={deleteMessageReceiever}
            otherChatName={otherChatName}
          />
          <KeyboardAwareScrollView style={styles.content}>
            <View style={styles.badge}>
              <Badge
                badgeStyle={styles.badgeText}
                value={<Text style={{ color: "#a2d0c1" }}>Sept 30, 2020</Text>}
              />
            </View>
            {chatExists ? (
              <>
                {myChats.map((chat) =>
                  chat.author === userId ? (
                    <Pressable
                      onLongPress={() => {
                        setMainIndex(3);
                        deleteMessageReceiever(3);
                      }}
                    >
                      <Animated.View
                        style={[
                          styles.receiver,
                          {
                            transform: [
                              {
                                translateX: 3 == mainIndex ? receiverRef.x : 0,
                              },
                              {
                                translateY: receiverRef.y,
                              },
                            ],
                          },
                        ]}
                      >
                        <View>
                          <Text style={[styles.receiverText]}>
                            {chat.content}
                          </Text>
                          <Text
                            style={{
                              color: "#8dadb3",
                              marginTop: "auto",
                              marginLeft: "auto",
                              paddingRight: 5,
                              fontSize: 10,
                            }}
                          >
                            {chat.createdAt}
                          </Text>
                        </View>
                      </Animated.View>
                    </Pressable>
                  ) : (
                    <Pressable
                      onLongPress={() => {
                        setMainIndex(2);
                        console.error(mainIndex);
                        setShowTrash(true);
                      }}
                    >
                      <Animated.View
                        key={2}
                        style={[
                          styles.sender,
                          { opacity: fadeAnim },
                          {
                            transform: [
                              {
                                translateX: mainIndex === 2 ? receiverRef.x : 0,
                              },
                              {
                                translateY: receiverRef.y,
                              },
                            ],
                          },
                        ]}
                      >
                        <View>
                          <Text style={[styles.senderText]}>
                            {chat.content}
                          </Text>
                          <Text
                            style={{
                              marginLeft: "auto",
                              color: "#8dadb3",
                              marginTop: "auto",
                              paddingRight: 5,
                              fontSize: 10,
                            }}
                          >
                            {chat.createdAt}
                          </Text>
                        </View>
                      </Animated.View>
                    </Pressable>
                  )
                )}
              </>
            ) : (
              <View
                style={{
                  marginTop: height / 6,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CreateChat
                  data={route.params}
                  message="You don't have any conversation with this agency"
                  navigation={navigation}
                />
              </View>
            )}
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
                  setMessage={setMessage}
                  message={message}
                  recording={recording}
                  stopRecording={stopRecording}
                  startRecording={startRecording}
                  chatSend={chatSend}
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
        <Loading />
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
  badge: {
    marginTop: 10,
  },
  badgeText: { borderRadius: 5, padding: 10, backgroundColor: "#e4fbff" },
  receiver: {
    padding: 5,
    justifyContent: "flex-end",

    marginLeft: 35,
    flexDirection: "row",
  },
  sender: {
    padding: 5,

    marginRight: 45,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  chatArea: {
    paddingTop: 5,
    flexDirection: "row",
    width: width,
    backgroundColor: "#fff",
  },

  senderText: {
    color: "#e4fbff",
    backgroundColor: "#214151",
    padding: 10,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
  },
  receiverText: {
    color: "#214151",
    backgroundColor: "#e4fbff",
    padding: 10,
    borderRadius: 10,
    borderBottomRightRadius: 0,
  },
});
