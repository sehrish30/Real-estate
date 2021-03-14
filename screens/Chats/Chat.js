import React, { useState } from "react";
import { KeyboardAvoidingView, TextInput } from "react-native";
import { SafeAreaView, Dimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Badge, Icon, Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

var { width, height } = Dimensions.get("window");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("");

  // showStates
  const [emojiSelector, setEmojiSelector] = useState(false);
  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: 20, backgroundColor: "#98ded9" }}
    >
      <View style={styles.header}>
        <Text style={styles.name}>Sehrish Waheed</Text>
      </View>
      <KeyboardAwareScrollView style={styles.content}>
        <View style={styles.badge}>
          <Badge
            badgeStyle={styles.badgeText}
            value={<Text style={{ color: "#a2d0c1" }}>Sept 30, 2020</Text>}
          />
        </View>
        <View style={styles.receiver}>
          <View>
            <Text style={styles.receiverText}>
              Hello, My name Hello, My name Hello, My name Hello, My name Hello,
              My name Hello, My name
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
        </View>
        <View style={styles.sender}>
          <View>
            <Text style={styles.senderText}>
              Hello, My name is Sehrish Hello, My name is SehrishHello, My name
              is SehrishHello, My name is Sehrish
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
          </View>
        </View>
        <View style={styles.receiver}>
          <View>
            <Text style={styles.receiverText}>Hello, My name</Text>
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
              width: width / 1.37,
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

          <TouchableOpacity style={{ marginTop: 15, marginRight: 15 }}>
            <Ionicons name="md-attach-sharp" size={26} color="#8dadb3" />
          </TouchableOpacity>
          <View
            style={{
              marginTop: 17,
              marginRight: 10,
            }}
          >
            <FontAwesome name="microphone" size={24} color="#214151" />
          </View>
        </View>
      </KeyboardAvoidingView>
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
