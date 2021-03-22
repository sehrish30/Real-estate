import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSocket } from "../../hooks/socketConnect";
import { useSelector, useDispatch } from "react-redux";

import socketIOClient from "socket.io-client";
import ChatsCard from "../../Shared/Chats/ChatsCard";
import { userOnline, userOffline } from "../../Redux/Actions/chat";
import { agencyRooms, customerRooms } from "../../Shared/Services/ChatServices";
import CreateChat from "../../Shared/Chats/CreateChat";

const AllChats = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);

  const ENDPOINT = "localhost:3000";

  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    dispatch(userOnline());

    if (user.email) {
      (async () => {
        const res = await customerRooms(
          { customer: user.decoded.userId },
          token
        );

        if (!res) {
          setChatRooms([]);
          setLoading(false);
        } else {
          setChatRooms(res);
          setLoading(false);

          let unSeenCount = 0;
          let fastChats = [];
          const requests = res.map((r) => {
            for (const i of r.chats) {
              if ((i.seen = false)) {
                unSeenCount++;
              }
            }
            const info = {
              id: r._id,
              name: r.agency?.name,
              message: r?.chats[r.chats?.length - 1]?.content || "No message",
              uri: r.agency.logo.url,
              createdAt: r?.chats[r.chats?.length - 1]?.createdAt || null,
              unSeenCount,
              agencyId: r.agency.id,
              customerId: r.customer,
              users: [
                {
                  id: r.agency.id,
                  online: false,
                },
                {
                  id: r.customer,
                  online: false,
                },
              ],
            };

            setAllChats((prev) => [...prev, info]);
            fastChats.push(info);
          });
          Promise.all(requests).then(() => {
            useSocket({ user, allChats: fastChats }, dispatch);
          });
        }
        setLoading(false);
      })();
    } else if (agency.email) {
      (async () => {
        const res = await agencyRooms({ agency: agency.decoded.userId }, token);
        if (!res) {
          setChatRooms([]);
          setLoading(false);
        } else {
          setChatRooms(res);
          setLoading(false);

          let unSeenCount = 0;
          let fastChats = [];
          const requests = res.map((r) => {
            for (const i of r.chats) {
              if ((i.seen = false)) {
                unSeenCount++;
              }
            }
            const info = {
              id: r._id,
              name: r.customer?.name,
              message: r?.chats[r.chats?.length - 1].content || "No message",
              uri: r.customer.dp,
              createdAt: r?.chats[r.chats?.length - 1].createdAt || null,
              unSeenCount,
              agencyId: r.agency,
              customerId: r.customer.id,

              users: [
                {
                  id: r.agency,
                  online: false,
                },
                {
                  id: r.customer.id,
                  online: false,
                },
              ],
            };

            setAllChats((prev) => [...prev, info]);
            fastChats.push(info);
          });
          Promise.all(requests).then(() => {
            useSocket({ user, allChats: fastChats }, dispatch);
          });
        }
      })();
    }
    return () => {
      // socket.emit("disconnect");
      dispatch(userOffline());
      // turn off instance of chat
      socket.off();
    };
  }, [dispatch, ENDPOINT]);

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
      createdAt={item.createdAt}
      unSeenCount={item.unSeenCount}
      agencyId={item.agencyId}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      {allChats.length !== 0 && !loading ? (
        <ScrollView
          style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}
        >
          <FlatList
            data={allChats}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      ) : (
        <View>
          {!loading ? (
            <CreateChat
              navigation={navigation}
              searchAgency={true}
              message="You don't have any conversation with any agency"
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 100,
              }}
            >
              <ActivityIndicator size="large" color="#f8dc81" />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AllChats;

const styles = StyleSheet.create({
  card: {},
});
