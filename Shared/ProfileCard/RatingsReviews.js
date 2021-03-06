import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Dimensions,
  Pressable,
} from "react-native";
import {
  Text,
  Avatar,
  ListItem,
  BottomSheet,
  Button,
  Icon,
} from "react-native-elements";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
var { height, width } = Dimensions.get("screen");
import { getAllReviews, replyReview } from "../Services/RateServices";
import { useFocusEffect } from "@react-navigation/core";
import SortOverlay from "../Overlays/SortOverlay";

const RatingsReviews = ({ id, url }) => {
  const [visibleSort, setVisibleSort] = useState(false);
  const [comment, setComment] = useState("");
  const [showReply, setShowReply] = useState("");

  const [totalRating, setTotalRating] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [readMore, setReadMore] = useState("");
  const [limit, setLimit] = useState(3);
  const [userToBeReplied, setUserToBeReplied] = useState("");
  const [order, setOrder] = useState(1);
  const [showSeeMore, setShowSeeMore] = useState(true);
  const [visible, setVisible] = useState(false);
  const [another, setAnother] = useState([]);
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        (async () => {
          let res;
          if (order === 1) {
            res = await getAllReviews({ id, limit, order: -1 }, token);
          }
          if (order === 2) {
            res = await getAllReviews({ id, limit, order: 1 }, token);
          }
          if (order === 3) {
            res = await getAllReviews({ id, limit, time: -1 }, token);
          }
          if (order === 4) {
            res = await getAllReviews({ id, limit, time: 1 }, token);
          }

          setAgencyId(res.id);

          if (res?.rating?.length < limit) {
            setShowSeeMore(false);
          }

          setTotalRating(res.totalRating);
          // console.log("RES", res);
          if (res.rating) {
            setAnother(res.rating);
          }
        })();
      }
      // another
    }, [id, limit, order])
  );

  const toggleOverlay = () => {
    setVisibleSort(!visibleSort);
  };

  const renderItem = ({ item }) => (
    <View style={{ display: "flex" }}>
      <ListItem
        // bottomDivider
        containerStyle={{
          backgroundColor: "#e4fbff",
          textAlign: "left",
          alignItems: "flex-start",
          borderColor: "#839b97",
        }}
      >
        <Avatar
          rounded
          containerStyle={{
            alignSelf: "flex-start",
          }}
          source={{ uri: item?.user?.dp || "https:" }}
        />

        <ListItem.Content>
          <ListItem.Title
            style={{ color: "#214151", fontFamily: "EBGaramond-Italic" }}
          >
            {item?.user.email}
          </ListItem.Title>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#839b97", marginBottom: 5 }}>
              {item.rate}
            </Text>
            <FontAwesome
              style={{ marginLeft: 2 }}
              name="star"
              size={12}
              color="#f8dc81"
            />
          </View>

          {item?.text.length > 20 && item.user?.email !== readMore ? (
            <ListItem.Subtitle
              style={{ color: "#214151" }}
              onPress={() => {
                setReadMore(item.user?.email);
              }}
            >
              {item.text.substr(0, 100)}....
            </ListItem.Subtitle>
          ) : (
            <ListItem.Subtitle
              onPress={() => {
                if (readMore) {
                  setReadMore(null);
                }
              }}
              style={{ color: "#214151" }}
            >
              {item.text}
            </ListItem.Subtitle>
          )}

          <Text
            style={{ color: "#839b97", fontSize: 10, alignSelf: "flex-end" }}
          >
            {item.time ? formatDistanceToNow(Date.parse(item?.time)) : null}
          </Text>
        </ListItem.Content>
        {agency.id == id && (
          <Pressable
            style={{ padding: 5 }}
            onPressIn={() => {
              setUserToBeReplied(item.user.id);
              setVisible(true);
              if (item?.replies?.text) {
                setComment(item.replies.text);
              }
            }}
          >
            <FontAwesome
              style={{ alignSelf: "flex-start" }}
              name="mail-reply"
              size={15}
              color="#214151"
            />
          </Pressable>
        )}
      </ListItem>
      {item?.replies && (
        <>
          {showReply === item?._id ? (
            <Pressable onPressOut={() => setShowReply("")}>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontFamily: "EBGaramond-Italic",
                  color: "#214151",
                  padding: 10,
                }}
              >
                Close
              </Text>
            </Pressable>
          ) : (
            <Pressable onPressOut={() => setShowReply(item?._id)}>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontFamily: "EBGaramond-Regular",
                  color: "#214151",
                  padding: 10,
                }}
              >
                View reply
              </Text>
            </Pressable>
          )}
        </>
      )}

      {showReply === item?._id && (
        <>
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
              <View style={{ flexDirection: "row" }}>
                <Avatar
                  rounded
                  containerStyle={{
                    alignSelf: "flex-start",
                  }}
                  source={{ uri: url }}
                />

                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: "#214151",
                      fontFamily: "EBGaramond-Regular",
                    }}
                  >
                    By agency
                  </Text>
                  <ListItem.Subtitle
                    style={{
                      color: "#fff",
                      paddingLeft: 10,
                      justifyContent: "flex-end",
                      paddingRight: 30,
                    }}
                  >
                    {item?.replies?.text}
                  </ListItem.Subtitle>
                </View>
              </View>
              <Text
                style={{
                  alignSelf: "flex-end",
                  color: "#cfd3ce",
                  fontSize: 12,
                }}
              >
                {formatDistanceToNow(Date.parse(item.replies?.time))}
              </Text>
            </ListItem.Content>
          </View>
        </>
      )}
      <View
        style={{
          backgroundColor: "#839b97",
          padding: 0.2,
          borderRadius: 10,
          width: 50,
          marginLeft: width / 3,
        }}
      ></View>
    </View>
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
          Rating
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginVertical: 15 }}>
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color={totalRating >= 1 ? "#f8dc81" : "#cfd3ce"}
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color={totalRating >= 2 ? "#f8dc81" : "#cfd3ce"}
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color={totalRating >= 3 ? "#f8dc81" : "#cfd3ce"}
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color={totalRating >= 4 ? "#f8dc81" : "#cfd3ce"}
        />
        <FontAwesome
          style={{ marginRight: 10 }}
          name="star"
          size={25}
          color={totalRating > 4 ? "#f8dc81" : "#cfd3ce"}
        />
        <Text style={[styles.font, { fontSize: 18 }]}>{totalRating}/5</Text>
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
      {another.length !== 0 && (
        <Button
          onPress={toggleOverlay}
          containerStyle={{ alignSelf: "flex-end" }}
          title="Sort"
          titleStyle={{
            fontFamily: "EBGaramond-Regular",
            fontSize: 16,
            color: "#34626c",
          }}
          type="clear"
          iconRight={true}
          icon={
            <MaterialCommunityIcons
              style={{ marginLeft: 2 }}
              name="sort-variant"
              size={15}
              color="#34626c"
            />
          }
        />
      )}
      {another.length !== 0 ? (
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            padding: 0,
            alignItems: "flex-start",
          }}
        >
          {id && (
            <FlatList
              keyExtractor={(item) => item?._id}
              data={another}
              renderItem={renderItem}
            />
          )}
        </View>
      ) : (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "EBGaramond-Regular", fontSize: 16 }}>
            No Reviews
          </Text>
        </View>
      )}
      {showSeeMore && another.length !== 0 && (
        <Button
          icon={
            <Feather
              name="plus"
              size={15}
              color="#839b97"
              style={{ marginRight: 5 }}
            />
          }
          buttonStyle={{ borderColor: "#214151" }}
          containerStyle={{ marginTop: 15 }}
          titleStyle={{
            fontFamily: "EBGaramond-Bold",
            color: "#839b97",
          }}
          title="See more"
          type="outline"
          onPress={() => {
            setLimit(limit + 3);
          }}
        />
      )}
      <SortOverlay
        setOrder={setOrder}
        order={order}
        toggleOverlay={toggleOverlay}
        visible={visibleSort}
      />
      <BottomSheet
        isVisible={visible}
        onPress={() => setVisible(false)}
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
            autoFocus={true}
            style={{ borderColor: "red", color: "#214151", fontSize: 16 }}
            textAlign="left"
            multiline
            numberOfLines={4}
            onChangeText={(text) => setComment(text)}
            value={comment}
            placeholder="Reply your customer..."
          />
        </View>
        <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
          <View
            onPress={() => {
              setVisible(false);
              setComment("");
            }}
          >
            <Icon
              raised
              name="close"
              type="font-awesome"
              color="#214151"
              onPress={() => {
                setVisible(false);
                setComment("");
              }}
            />
          </View>
          <Icon
            reverse
            name="send-o"
            type="font-awesome"
            color="#214151"
            onPress={async () => {
              setVisible(false);
              let response;
              if (comment.length !== 0) {
                response = await replyReview(
                  { id, content: comment, userId: userToBeReplied },
                  token
                );
              }

              if (response) {
                console.log("USERTOBEREPLIEd", userToBeReplied, another);

                setAnother(
                  another.map((review) => {
                    if (review.user.id == userToBeReplied) {
                      return (review = {
                        ...review,
                        replies: {
                          text: comment,
                          time: new Date().toISOString(),
                        },
                      });
                    } else {
                      return review;
                    }
                  })
                );
              }
            }}
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
