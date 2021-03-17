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

// const ChatsCard = ({ name, uri, id, message,  }) => (
//   <View style={styles.card}>
//     <ListItem
//       onPress={() => navigation.navigate("ChatMain")}
//       key={id}
//       bottomDivider
//       Component={TouchableScale}
//       friction={90} //
//       tension={100} // These props are passed to the parent component (here TouchableScale)
//       activeScale={0.95} //
//       linearGradientProps={{
//         colors: ["#a2d0c1", "#e4fbff"],
//         start: { x: 1, y: 0 },
//         end: { x: 0.7, y: 2 },
//       }}
//       ViewComponent={LinearGradient}
//     >
//       <Avatar source={{ uri }} />
//       <ListItem.Content>
//         <ListItem.Title
//           style={{ color: "#214151", fontFamily: "EBGaramond-Bold" }}
//         >
//           {name}
//         </ListItem.Title>
//         <ListItem.Subtitle style={{ color: "#214151" }}>
//           {message}
//         </ListItem.Subtitle>
//       </ListItem.Content>
//       <View>
//         <Badge
//           value="99+"
//           badgeStyle={{
//             backgroundColor: "#f8dc81",
//             paddingVertical: 10,
//           }}
//           containerStyle={{
//             borderRadius: 100,
//           }}
//           textStyle={{ color: "#214151" }}
//         />
//         <Text style={{ fontSize: 8, marginTop: 5, color: "#839b97" }}>
//           5:09PM
//         </Text>
//       </View>
//       <ListItem.Chevron color="white" />
//     </ListItem>
//   </View>
// );

const AllChats = ({ navigation }) => {
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
