import React, { useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  SafeAreaView,
} from "react-native";
import { Badge } from "react-native-elements";
import CreateChat from "../../Shared/Chats/CreateChat";
import { Pressable } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { Image } from "react-native-elements";
import { ActivityIndicator } from "react-native";
import SingleImageOverlay from "../Overlays/SingleImageOverlay";

var { width, height } = Dimensions.get("window");
const ChatsContent = ({
  chatExists,
  route,
  navigation,
  receiverRef,
  messages,
  userId,
  setMainIndex,
  setShowTrash,
  setDeluser,
  mainIndex,
  fadeAnim,
  showNoMessages,
}) => {
  let scrollViewRef = useRef(null);

  // scrollViewRef.scrollToOffset({offset: 0, animated: true})

  const [visible, setVisible] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState("");

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const scrollY = useRef(new Animated.Value(0)).current;
  const ITEM_SIZE = height / 9.3;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {visible && (
        <SingleImageOverlay
          toggleOverlay={toggleOverlay}
          setVisible={setVisible}
          visible={visible}
          showFullScreenImage={showFullScreenImage}
        />
      )}
      {chatExists && !route.params.notsure ? (
        <>
          <View style={styles.badge}>
            <Badge
              onPress={() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }}
              badgeStyle={styles.badgeText}
              value={
                <Text style={{ color: "#a2d0c1" }}>
                  Exceeding limit 50 will delete old messages
                </Text>
              }
            />
          </View>
          <Animated.FlatList
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({
                animated: true,
                duration: 500,
              })
            }
            data={messages}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              // beyond -1 animation stays 0
              // when it reaches 0 start
              // then at the top edge current item
              // then finish the animation when 2 item reached

              const inputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 0.5),
              ];
              // opacity animattion a bit fast we want
              const opacityInputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 1),
              ];

              // keeing the scale 0 no matter where the item is
              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0],
              });

              // stay at opacity 1 until you meet your top edge
              const opacity = scrollY.interpolate({
                inputRange: opacityInputRange,
                outputRange: [1, 1, 1, 0],
              });
              return (
                <Animated.View style={{ transform: [{ scale }], opacity }}>
                  {item.author === userId ? (
                    <Animated.View
                      style={[
                        styles.receiver,
                        {
                          transform: [
                            {
                              translateX:
                                item.id == mainIndex ? receiverRef.x : 0,
                            },
                            {
                              translateY: 0,
                            },
                          ],
                        },
                      ]}
                    >
                      <Pressable
                        key={item.id}
                        onLongPress={() => {
                          setMainIndex(item?.id || item?.msgId);
                          setShowTrash(true);
                          setDeluser(item.author);
                        }}
                      >
                        <View>
                          {item.type === "text" ? (
                            <Text
                              style={[
                                styles.receiverText,
                                mainIndex === item?.id
                                  ? { backgroundColor: "#f8dc81" }
                                  : null,
                              ]}
                            >
                              {item.content}
                            </Text>
                          ) : (
                            <Image
                              onPress={() => {
                                setShowFullScreenImage(item.content);
                                toggleOverlay();
                              }}
                              onLongPress={() => {
                                setMainIndex(item?.id || item?.msgId);
                                setShowTrash(true);
                                setDeluser(item.author);
                              }}
                              source={{ uri: item.content }}
                              style={[
                                styles.image,
                                mainIndex === item?.id
                                  ? { borderColor: "#f8dc81" }
                                  : null,
                              ]}
                              PlaceholderContent={
                                <ActivityIndicator color="#f8dc81" />
                              }
                            />
                          )}
                          <Text
                            style={{
                              color: "#8dadb3",
                              marginTop: "auto",
                              marginLeft: "auto",
                              paddingRight: 5,
                              fontSize: 10,
                            }}
                          >
                            {item.timesent
                              ? formatDistanceToNow(Date.parse(item.timesent))
                              : item.createdAt}
                          </Text>
                        </View>
                      </Pressable>
                    </Animated.View>
                  ) : (
                    <View
                      key={2}
                      style={[
                        styles.sender,
                        // { opacity: fadeAnim },
                        {
                          transform: [
                            {
                              translateX:
                                item.id === mainIndex ? receiverRef.x : 0,
                            },
                            {
                              translateY: 0,
                            },
                          ],
                        },
                      ]}
                    >
                      <Pressable key={item.id}>
                        <View>
                          {item.type === "text" ? (
                            <Text style={[styles.senderText]}>
                              {item.content}
                            </Text>
                          ) : (
                            <Image
                              onPress={() => {
                                setShowFullScreenImage(item.content);
                                toggleOverlay();
                              }}
                              source={{ uri: item.content }}
                              style={styles.image}
                              PlaceholderContent={
                                <ActivityIndicator color="#f8dc81" />
                              }
                            />
                          )}
                          <Text
                            style={{
                              marginLeft: "auto",
                              color: "#8dadb3",
                              marginTop: "auto",
                              paddingRight: 5,
                              fontSize: 10,
                            }}
                          >
                            {item.timesent
                              ? formatDistanceToNow(Date.parse(item.timesent))
                              : item.createdAt}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                </Animated.View>
              );
            }}
          />
        </>
      ) : (
        <View
          style={{
            marginTop: height / 10,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {chatExists && route.params.notsure ? (
            <CreateChat
              data={route.params}
              message="Seems like you are already in contact with this agency. Kindly, visit your messages."
              navigation={navigation}
              dontshowBtn={true}
            />
          ) : (
            !chatExists && (
              <CreateChat
                data={route.params}
                message="You don't have any conversation with this agency"
                navigation={navigation}
              />
            )
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatsContent;

const styles = StyleSheet.create({
  badge: {
    marginTop: 10,
  },
  badgeText: { borderRadius: 5, padding: 10, backgroundColor: "#e4fbff" },
  sender: {
    padding: 5,

    marginRight: 45,
    justifyContent: "flex-start",
    flexDirection: "row",
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
  receiver: {
    padding: 5,
    justifyContent: "flex-end",

    marginLeft: 35,
    flexDirection: "row",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: "#214151",
    borderWidth: 5,
  },
});
