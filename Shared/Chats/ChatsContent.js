import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  FlatList,
} from "react-native";
import { Badge } from "react-native-elements";
import CreateChat from "../../Shared/Chats/CreateChat";
import { Pressable, ScrollView } from "react-native";

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
}) => {
  const scrollViewRef = useRef();

  {
    /* <ScrollView
ref={scrollViewRef}
onContentSizeChange={() =>
  scrollViewRef.current.scrollToEnd({ animated: true, duration: 500 })
} */
  }
  // >
  return (
    <SafeAreaView>
      <View style={styles.badge}>
        <Badge
          badgeStyle={styles.badgeText}
          value={<Text style={{ color: "#a2d0c1" }}>Sept 30, 2020</Text>}
        />
      </View>

      {chatExists ? (
        <>
          {messages.map((chat) =>
            chat.author === userId ? (
              <Pressable
                key={chat.id}
                onLongPress={() => {
                  setMainIndex(chat?.id || chat?.msgId);
                  setShowTrash(true);
                  setDeluser(chat.author);
                }}
              >
                <Animated.View
                  style={[
                    styles.receiver,
                    {
                      transform: [
                        {
                          translateX: chat.id == mainIndex ? receiverRef.x : 0,
                        },
                        {
                          translateY: receiverRef.y,
                        },
                      ],
                    },
                  ]}
                >
                  <View>
                    <Text style={[styles.receiverText]}>{chat.content}</Text>
                    <Text
                      style={{
                        color: "#8dadb3",
                        marginTop: "auto",
                        marginLeft: "auto",
                        paddingRight: 5,
                        fontSize: 10,
                      }}
                    >
                      {chat.time || chat.createdAt}
                    </Text>
                  </View>
                </Animated.View>
              </Pressable>
            ) : (
              <Pressable key={chat.id}>
                <Animated.View
                  key={2}
                  style={[
                    styles.sender,
                    { opacity: fadeAnim },
                    {
                      transform: [
                        {
                          translateX: chat.id === mainIndex ? receiverRef.x : 0,
                        },
                        {
                          translateY: receiverRef.y,
                        },
                      ],
                    },
                  ]}
                >
                  <View>
                    <Text style={[styles.senderText]}>{chat.content}</Text>
                    <Text
                      style={{
                        marginLeft: "auto",
                        color: "#8dadb3",
                        marginTop: "auto",
                        paddingRight: 5,
                        fontSize: 10,
                      }}
                    >
                      {chat.time || chat.createdAt}
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
});
