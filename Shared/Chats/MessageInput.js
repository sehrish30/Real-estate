import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { sendChat } from "../../Shared/Services/ChatServices";
import { SafeAreaView } from "react-native";
import { uploadToCloudinary } from "../../Shared/services";

import EmojiSelector, { Categories } from "react-native-emoji-selector";

var { width, height } = Dimensions.get("window");
const MessageInput = ({ chatSend, chatId }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

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
  let loggedInuser;
  if (agency.id) {
    loggedInuser = agency.id;
  } else {
    loggedInuser = user.decoded.userId;
  }

  const sendMessageImageService = async (image) => {
    let data = {};

    data = {
      customer: chatSend.customer,
      agency: chatSend.agency,
      author: loggedInuser,
      type: "image",
      content: image.url,
      seen: false,
      chatId: chatId,
      timesent: new Date().toISOString(),
      contentImgPublicId: image.public_id,
    };

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

  const uploadImage = async () => {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("To upload image we need access to your gallery");
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log("RESULT", result);

        if (!result.cancelled) {
          console.log("FROM PHONE URI", result.uri);

          // Infer the type of the image
          // split url by dot
          let filename = result.uri.split("/").pop();
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          let newfile = {
            uri: result.uri,
            type: `test/${result.uri.split(".")[1]}`,
            name: filename,
          };
          uploadToCloudinary(newfile).then((image) => {
            sendMessageImageService(image);
          });
        }
      }
    }
  };

  const sendMessageService = async () => {
    let data = {};
    setMessage("");
    if (agency.id) {
      data = {
        customer: chatSend.customer,
        agency: chatSend.agency,
        author: agency.id,
        type: "text",
        content: message,
        seen: false,
        chatId: chatId,
        timesent: new Date().toISOString(),
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
        timesent: new Date().toISOString(),
      };
    }
    console.log("DATA I AM SENDING", data);
    const chatSendReponse = await sendChat(data, token);

    if (agency.id) {
      socket.emit("newMessage", {
        toUserId: chatSend.customer,
        ...data,
        id: chatSendReponse,
      });
    } else {
      console.log("COUNT");

      socket.emit("newMessage", {
        toUserId: chatSend.agency,
        ...data,
        id: chatSendReponse,
      });
    }
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
    <View style={{ flexDirection: "column" }}>
      <SafeAreaView style={{ flexDirection: "row" }}>
        {/* <TouchableOpacity
          onPress={() => setEmojiSelector(!emojiSelector)}
          style={{ marginTop: 15, marginLeft: 10 }}
        >
          <FontAwesome name="smile-o" size={24} color="#8dadb3" />
        </TouchableOpacity> */}
        <TextInput
          autoCorrect={false}
          autoFocus={false}
          multiline
          numberOfLines={20}
          style={{
            backgroundColor: "#fff",
            width: width / 1.3,
            paddingHorizontal: 0,
            paddingLeft: 10,
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

        <TouchableOpacity style={{ marginTop: 12, marginRight: 5 }}>
          <Ionicons
            onPress={() => {
              uploadImage();
            }}
            name="ios-camera-outline"
            size={26}
            color="#8dadb3"
          />
        </TouchableOpacity>

        {message.length > 0 ? (
          <TouchableOpacity style={{ marginTop: 15, marginLeft: 12 }}>
            <Ionicons
              onPress={sendMessageService}
              name="send"
              size={24}
              color="#214151"
            />
          </TouchableOpacity>
        ) : (
          <View style={{ marginTop: 15, marginLeft: 12 }}>
            <Ionicons name="send" size={24} color="#839b97" />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default MessageInput;

const styles = StyleSheet.create({});
