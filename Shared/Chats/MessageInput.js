import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Dimensions } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { sendChat } from "../../Shared/Services/ChatServices";
var { width, height } = Dimensions.get("window");
const MessageInput = ({
  setEmojiSelector,
  emojiSelector,
  recording,
  stopRecording,
  startRecording,
  chatSend,
  chatId,
}) => {
  const [message, setMessage] = useState("");
  let token = useSelector((state) => state.auth.token);
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let socket = useSelector((state) => state.chat.socket);
  let dispatch = useDispatch();
  let userId;
  if (agency.id) {
    userId = chatSend.customer;
  } else {
    userId = chatSend.agency;
  }

  const sendMessageService = async () => {
    let data = {};
    if (agency.id) {
      data = {
        customer: chatSend.customer,
        agency: chatSend.agency,
        author: agency.id,
        type: "text",
        content: message,
        seen: false,
        chatId: chatId,
        time: Date.now(),
      };
    } else {
      data = {
        customer: chatSend.customer,
        agency: chatSend.agency,
        author: user.decoded.userId,
        type: "text",
        content: message,
        seen: false,
        chatId: chatId,
        time: Date.now(),
      };
    }
    const chatSendReponse = await sendChat(data, token);

    if (agency.id) {
      socket.emit("newMessage", {
        toUserId: chatSend.customer,
        ...data,
        id: chatSendReponse,
      });
    } else {
      socket.emit("newMessage", {
        toUserId: chatSend.agency,
        ...data,
        id: chatSendReponse,
      });
    }

    setMessage("");
  };

  useEffect(() => {
    if (message.length > 2) {
      socket.emit("typing", userId);
    }
    if (message.length < 2) {
      socket.emit("stoppedTyping", userId);
    }
    return () => {};
  }, [message]);

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
        onChangeText={(text) => {
          setMessage(text);
        }}
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
            <Ionicons
              onPress={sendMessageService}
              name="send"
              size={24}
              color="#214151"
            />
          </>
        ) : (
          <>
            {/* {recording ? (
              <FontAwesome name="microphone" size={24} color="#fff" />
            ) : (
              <FontAwesome name="microphone" size={24} color="#214151" />
            )} */}
          </>
        )}
      </TouchableOpacity>
    </>
  );
};

export default MessageInput;

const styles = StyleSheet.create({});
