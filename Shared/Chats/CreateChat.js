import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { createChat } from "../../Shared/Services/ChatServices";
import { useSelector } from "react-redux";

const CreateChat = ({
  data,
  searchAgency = false,
  navigation,
  message,
  dontshowBtn = false,
}) => {
  let token = useSelector((state) => state.auth.token);

  const createChatServiceCall = () => {
    if (searchAgency) {
      // navigation.navigate("Home", {
      //   screen: "SearchAgency",
      // });
      navigation.navigate("SearchAgency");
    } else {
      createChat(data, token);
      navigation.navigate("AllChats");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.bg}>
        <Image
          style={styles.stretch}
          source={require("../../assets/begin-chat.png")}
          alt="bg"
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          textAlign: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      </View>
      {!dontshowBtn && (
        <Button
          onPress={createChatServiceCall}
          buttonStyle={{ backgroundColor: "#f8dc81" }}
          titleStyle={{ color: "#214151", fontFamily: "EBGaramond-Regular" }}
          icon={
            <Ionicons
              style={{ marginRight: 10 }}
              name="ios-chatbox-ellipses"
              size={15}
              color="#214151"
            />
          }
          title="Let's start"
        />
      )}
    </View>
  );
};

export default CreateChat;

const styles = StyleSheet.create({
  stretch: {
    width: 200,
    height: 150,
    marginBottom: 5,
  },
  bg: {
    display: "flex",
    margin: "auto",
    alignItems: "center",
  },
});
