import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Dimensions,
  BackHandler,
  Pressable,
} from "react-native";
import {
  Text,
  Avatar,
  ListItem,
  BottomSheet,
  Icon,
  Button,
} from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";

var { height, width } = Dimensions.get("screen");

const RatingsReviews = () => {
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [showReply, setShowReply] = useState("");

  const list = [
    {
      id: "545",
      user: "Amy Farha",
      dp: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
      text: "Vice President",
      time: new Date().toISOString(),
      replies: [
        {
          text: "Thank you for posting",
          time: new Date().toISOString(),
        },
      ],
    },
    {
      id: "544",
      user: "Chris Jackson",
      dp:
        "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
      text:
        "Vice Chairman Vice Chairman Vice Chairman Vice Chairman Vice Chairman Vice Chairman Vice Chairman Vice Chairman",
      time: new Date().toISOString(),
      replies: [],
    },
  ];

  const renderItem = ({ item }) => (
    <>
      <ListItem containerStyle={{ backgroundColor: "#e4fbff" }}>
        <Avatar
          rounded
          containerStyle={{ alignSelf: "flex-start" }}
          source={{ uri: item.dp }}
        />

        <ListItem.Content>
          <ListItem.Title
            style={{ color: "#214151", fontFamily: "EBGaramond-Italic" }}
          >
            {item.user}
          </ListItem.Title>

          <ListItem.Subtitle style={{ color: "#214151" }}>
            {item.text}
          </ListItem.Subtitle>
          <Text
            style={{ color: "#839b97", fontSize: 10, alignSelf: "flex-end" }}
          >
            1 month ago
          </Text>
        </ListItem.Content>
        <Pressable
          onPressOut={() => {
            setVisible(true);
          }}
        >
          <FontAwesome
            style={{ alignSelf: "flex-start" }}
            name="mail-reply"
            size={15}
            color="#214151"
          />
        </Pressable>
      </ListItem>
      {item.replies.length > 0 && (
        <>
          {showReply === item.id ? (
            <Pressable onPressIn={() => setShowReply("")}>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontFamily: "EBGaramond-Italic",
                  color: "#214151",
                }}
              >
                Close
              </Text>
            </Pressable>
          ) : (
            <Pressable onPressIn={() => setShowReply(item.id)}>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontFamily: "EBGaramond-Italic",
                  color: "#214151",
                }}
              >
                View reply
              </Text>
            </Pressable>
          )}
        </>
      )}

      {showReply === item.id && (
        <>
          {item?.replies?.map((reply) => (
            <View
              style={{
                marginLeft: 40,
                backgroundColor: "#8dadb3",
                color: "#fff",
                padding: 15,
                borderRadius: 5,
              }}
            >
              <ListItem.Content>
                <ListItem.Subtitle style={{ color: "#fff" }}>
                  {reply.text}
                </ListItem.Subtitle>
              </ListItem.Content>
            </View>
          ))}
        </>
      )}
    </>
  );
  return (
    <View style={styles.review}>
      <View style={{ flexDirection: "row" }}>
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star-o"
          size={20}
          color="#214151"
        />
        <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
          Ratings
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginVertical: 15 }}>
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color="#f8dc81"
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color="#f8dc81"
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color="#f8dc81"
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color="#f8dc81"
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color="#edeef7"
        />
        <Text style={[styles.font, { fontSize: 18 }]}>4.5</Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <FontAwesome
          style={{ marginRight: 10 }}
          name="comment-o"
          size={20}
          color="#214151"
        />
        <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
          Reviews
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: 10, padding: 0 }}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={list}
          renderItem={renderItem}
        />
      </View>
      <Button
        buttonStyle={{ borderColor: "#214151" }}
        containerStyle={{ marginTop: 15 }}
        titleStyle={{
          fontFamily: "EBGaramond-Bold",
          color: "#839b97",
        }}
        title="Load more"
        type="outline"
      />
      <BottomSheet
        isVisible={visible}
        containerStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
      >
        <View
          style={[
            styles.input,
            {
              //   textAlign: "left",
              backgroundColor: "#fff",
              flexDirection: "row",
            },
          ]}
        >
          <TextInput
            style={{ borderColor: "red", color: "#214151", fontSize: 16 }}
            textAlign="left"
            multiline
            numberOfLines={4}
            onChangeText={(text) => setComment(text)}
            value={comment}
            placeholder="Comment"
          />
        </View>
        <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
          <Icon
            underlayColor="red"
            raised
            name="close"
            type="font-awesome"
            color="#839b97"
            onPress={() => {
              setVisible(false);
              setComment("");
            }}
          />
          <Icon
            containerStyle={{}}
            reverse
            raised
            name="send-o"
            type="font-awesome"
            color="#214151"
            onPress={() => console.log("hello")}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default RatingsReviews;

const styles = StyleSheet.create({
  review: {
    alignItems: "center",
    justifyContent: "center",
  },
  font: {
    fontFamily: "EBGaramond-Regular",
    color: "#214151",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: "#214151",
    width: width,
  },
});
