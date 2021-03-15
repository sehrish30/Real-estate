import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  KeyboardAvoidingView,
  TextInput,
  Animated,
} from "react-native";
import { SafeAreaView, Dimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Badge, Icon, Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
// import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Audio } from "expo-av";
import MenuOverlay from "../../Shared/Overlays/MenuOverlay";
import { Pressable } from "react-native";

var { width, height } = Dimensions.get("window");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("");
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState();
  // const location =
  //   "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540sehrish%252FRealestate/Audio/recording-827930e5-7c25-4d0a-bb39-b30c392753e4.m4a";

  // showStates
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [visible, setVisible] = useState(false);

  // animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const receiverRef = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const senderRef = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const deleteMessageReceiever = (indexToAnimate) => {
    Animated.timing(receiverRef, {
      toValue: { x: 500, y: 0 },
      duration: 2000,
      useNativeDriver: true,
    }).start();
    console.error(receiverRef.indexToAnimate, indexToAnimate);
  };

  const deleteMessageSender = () => {
    Animated.timing(senderRef, {
      toValue: { x: -500, y: 0 },
      duration: 2000,
      useNativeDriver: true,
    }).start();
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

  // async function playSound() {
  //   console.log("Loading Sound");
  //   const { sound } = await Audio.Sound.createAsync(require(location));
  //   setSound(sound);

  //   console.log("Playing Sound");
  //   console.error("SOUND", sound);
  //   await sound.playAsync();
  // }

  const handleStoringFilesInPhone = async () => {};

  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: 20, backgroundColor: "#98ded9" }}
    >
      <View style={styles.header}>
        <View style={{ marginLeft: "auto" }}>
          <Text style={styles.name}>Dignity</Text>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            marginLeft: "auto",
            marginRight: 5,
          }}
        >
          <MaterialCommunityIcons
            onPress={toggleOverlay}
            name="dots-vertical"
            size={26}
            color="#8dadb3"
          />
        </View>
      </View>
      <KeyboardAwareScrollView style={styles.content}>
        <View style={styles.badge}>
          <Badge
            badgeStyle={styles.badgeText}
            value={<Text style={{ color: "#a2d0c1" }}>Sept 30, 2020</Text>}
          />
        </View>
        <Pressable onLongPress={() => deleteMessageReceiever(1)}>
          <Animated.View
            key={1}
            style={[
              styles.receiver,
              { opacity: fadeAnim },
              {
                transform: [
                  {
                    translateX:
                      1 == receiverRef.indexToAnimate ? receiverRef.x : 0,
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
                Hello, My name Hello, My name Hello, My name Hello, My name
                Hello, My name Hello, My name
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
                5:00 PM
              </Text>
            </View>
          </Animated.View>
        </Pressable>
        <Pressable onLongPress={() => deleteMessageSender()}>
          <Animated.View
            key={2}
            style={[
              styles.sender,
              { opacity: fadeAnim },
              {
                transform: [
                  {
                    translateX: senderRef.x,
                  },
                  {
                    translateY: senderRef.y,
                  },
                ],
              },
            ]}
          >
            <View>
              <Text style={[styles.senderText]}>
                Hello, My name is Sehrish Hello, My name is SehrishHello, My
                name is SehrishHello, My name is Sehrish
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
                5:00 PM
              </Text>
              {/* <View style={styles.container}>
              <Button title="Play Sound" onPress={playSound} />
            </View> */}
            </View>
          </Animated.View>
        </Pressable>
        <View style={[styles.receiver]}>
          <View>
            <Text style={[styles.receiverText]}>Hello, My name</Text>
            <Text
              style={{
                color: "#8dadb3",
                marginTop: "auto",
                marginLeft: "auto",
                paddingRight: 5,
                fontSize: 10,
              }}
            >
              5:00 PM
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <KeyboardAvoidingView>
        {emojiSelector && (
          <View style={{ height: height / 2, backgroundColor: "#fff" }}>
            <EmojiSelector
              columns={8}
              theme="#f8dc81"
              category={Categories.all}
              shouldInclude={(e) =>
                parseFloat(e["added_in"]) <= 11 && e["has_img_apple"] === true
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
          <TouchableOpacity
            onPress={() => setEmojiSelector(!emojiSelector)}
            style={{ marginTop: 15, marginLeft: 10 }}
          >
            <FontAwesome name="smile-o" size={24} color="#8dadb3" />
          </TouchableOpacity>
          <TextInput
            autoCorrect={false}
            autoFocus={true}
            multiline
            numberOfLines={20}
            style={{
              backgroundColor: "#fff",
              width: width / 1.43,
              paddingHorizontal: 5,
              paddingVertical: 5,
              color: "#214151",
              borderRadius: 5,
              height: 50,

              marginBottom: 4,
            }}
            onChangeText={(text) => setMessage(text)}
            value={message}
            placeholder="Type a message"
          />

          <TouchableOpacity style={{ marginTop: 15, marginRight: 8 }}>
            <Ionicons name="ios-camera-outline" size={26} color="#8dadb3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                marginTop: 10,
                marginRight: 3,
              },
              recording
                ? {
                    backgroundColor: "#214151",
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 100,
                  }
                : {
                    backgroundColor: "#fff",
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 100,
                  },
            ]}
            onPress={recording ? stopRecording : startRecording}
          >
            {recording ? (
              <FontAwesome name="microphone" size={24} color="#fff" />
            ) : (
              <FontAwesome name="microphone" size={24} color="#214151" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <MenuOverlay
        visible={visible}
        setVisible={setVisible}
        toggleOverlay={toggleOverlay}
        constDeleteAllMessages={constDeleteAllMessages}
      />
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#98ded9",
    paddingTop: 25,
    paddingBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    // justifyContent: "center",
  },
  name: {
    fontFamily: "EBGaramond-Bold",
    fontSize: 16,
    color: "#214151",
  },
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
