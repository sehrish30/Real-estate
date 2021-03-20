import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSocket } from "../../hooks/socketConnect";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import socketIOClient from "socket.io-client";
import ChatsCard from "../../Shared/Chats/ChatsCard";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    name: "Rija",
    message: "funky bunky",
    uri:
      "https://images.unsplash.com/photo-1600421719060-f18eba3cba4d?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8YkRvNDhjVWh3bll8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    name: "Dignity",
    message: "MEssage me asap",
    uri:
      "https://images.unsplash.com/photo-1602408960011-61d979be537e?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDN8YkRvNDhjVWh3bll8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    name: "Opara",
    message: "Hunky bujsjso",
    uri:
      "https://images.unsplash.com/photo-1532072918578-b5583b5b585e?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDR8YkRvNDhjVWh3bll8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];

const AllChats = ({ navigation }) => {
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.user);
  const ENDPOINT = "localhost:3000";

  const socket = socketIOClient(ENDPOINT);

  // WEBSOCKETE
  useFocusEffect(
    React.useCallback(() => {
      useSocket(user, dispatch);
      return () => {
        socket.emit("disconnect");
        // turn off instance of chat
        socket.off();
      };
    }, [dispatch])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
      title: "Messages",
      headerRight: () => (
        <TouchableOpacity>
          <AntDesign
            style={{ marginRight: 15 }}
            name="logout"
            color={"#a2d0c1"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <ChatsCard
      name={item.name}
      uri={item.uri}
      id={item.id}
      message={item.message}
      navigation={navigation}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </View>
  );
};

export default AllChats;

const styles = StyleSheet.create({
  card: {},
});
