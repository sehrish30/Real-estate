import React, { useState } from "react";
import { StyleSheet, TextInput, Dimensions } from "react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
var { width, height } = Dimensions.get("window");
const MessageInput = ({
  setEmojiSelector,
  emojiSelector,
  setMessage,
  message,
  recording,
  stopRecording,
  startRecording,
}) => {
  const [showSend, setShowSend] = useState(false);

  return (
    <>
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
        {message.length > 0 ? (
          <>
            <Ionicons name="send" size={24} color="#214151" />
          </>
        ) : (
          <>
            {recording ? (
              <FontAwesome name="microphone" size={24} color="#fff" />
            ) : (
              <FontAwesome name="microphone" size={24} color="#214151" />
            )}
          </>
        )}
      </TouchableOpacity>
    </>
  );
};

export default MessageInput;

const styles = StyleSheet.create({});
