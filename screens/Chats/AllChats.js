import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSocket } from "../../hooks/socketConnect";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import socketIOClient from "socket.io-client";
import ChatsCard from "../../Shared/Chats/ChatsCard";
import { agencyRooms, customerRooms } from "../../Shared/Services/ChatServices";
import CreateChat from "../../Shared/Chats/CreateChat";

var { width, height } = Dimensions.get("window");
const AllChats = ({ navigation }) => {
  const [allChats, setAllChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unseencount, setUnseencount] = useState([]);
  const [showNoagency, setShowNoAgency] = useState(false);
  const dispatch = useDispatch();

  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);

  let userId;
  if (agency.id) {
    userId = agency.id;
  } else {
    userId: user.decoded.userId;
  }

  // const ENDPOINT = "localhost:3000";

  const ENDPOINT = baseURL;

  const socket = socketIOClient(ENDPOINT);

  useFocusEffect(
    React.useCallback(() => {
      if (user.email) {
        (async () => {
          const res = await customerRooms(
            { customer: user.decoded.userId },
            token
          );

          if (!res) {
            setLoading(false);
          } else {
            setLoading(true);
            if (res.length === 0) {
              setShowNoAgency(true);
            }
            let unSeenCount = 0;
            let fastChats = [];
            console.error(res);
            const requests = res.map((r) => {
              for (let i = 0; i < r.chats.length; i++) {
                if (r.chats[i].seen == false) {
                  unSeenCount += 1;
                }
              }

              setUnseencount((prev) => [
                ...unseencount,
                { count: unSeenCount, id: r._id },
              ]);

              const info = {
                key: r.id,
                id: r.id,
                name: r.agency?.name,
                message: r?.chats[r.chats?.length - 1]?.content || "No message",
                uri: r.agency.logo.url,
                createdAt: r?.chats[r.chats?.length - 1]?.createdAt,
                unSeenCount,
                agencyId: r.agency.id,
                customerId: r.customer,
                searchId: r.agency.id,
                seen: r?.chats[r.chats?.length - 1]?.seen,
                lastchatauthor: r?.chats[r.chats?.length - 1]?.author,
                timesent: r?.chats[r.chats?.length - 1]?.timesent,
                type: r?.chats[r.chats?.length - 1]?.type,
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
              setLoading(false);
            });
          }
        })();
      } else if (agency.email) {
        (async () => {
          const res = await agencyRooms({ agency: agency.id }, token);

          if (!res) {
            setLoading(false);
          } else {
            setLoading(true);
            if (res.length === 0) {
              setShowNoAgency(true);
            }
            let unSeenCount = 0;
            let fastChats = [];
            const requests = res.map((r) => {
              for (let i = 0; i < r.chats.length; i++) {
                if (r.chats[i].seen == false) {
                  unSeenCount += 1;
                }
              }
              setUnseencount((prev) => [
                ...prev,
                { count: unSeenCount, id: r._id },
              ]);

              const info = {
                key: r.id,
                id: r.id,
                name: r.customer?.email,
                message: r?.chats[r.chats?.length - 1]?.content || null,
                uri: r.customer.dp,
                createdAt: r?.chats[r.chats?.length - 1]?.createdAt || null,
                unSeenCount,
                agencyId: r.agency,
                customerId: r.customer.id,
                searchId: r.customer.id,
                seen: r?.chats[r.chats?.length - 1]?.seen || null,
                lastchatauthor: r?.chats[r.chats?.length - 1]?.author,
                type: r?.chats[r.chats?.length - 1]?.type,
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
            // because userid is stored in user.decoded.id
            Promise.all(requests).then(() => {
              let data = {
                ...agency,
                decoded: {
                  userId: agency.id,
                },
              };

              useSocket({ user: data, allChats: fastChats }, dispatch);
              setLoading(false);
            });
          }
        })();
      }
      return () => {
        setAllChats([]);
        setUnseencount([]);
      };
    }, [useSocket, dispatch])
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
    return () => {
      setAllChats([]);
      setUnseencount([]);
    };
  }, [navigation]);

  const renderItem = ({ item }) => (
    <ChatsCard
      key={item.id}
      name={item.name}
      uri={item.uri}
      id={item.id}
      message={item.message}
      navigation={navigation}
      createdAt={item.createdAt}
      unSeenCount={item.unSeenCount}
      agencyId={item.agencyId}
      customerId={item.customerId}
      seen={item.seen}
      unSeenCount={item.unSeenCount}
      lastchatauthor={item.lastchatauthor}
      unseencount={unseencount}
      setUnseencount={setUnseencount}
      timesent={item.timesent}
      type={item.type}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      {allChats.length !== 0 && !loading ? (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
          <FlatList
            data={allChats}
            renderItem={renderItem}
            keyExtractor={(item) => {
              console.log("I AM CRYING", item.id);
              return item.id;
            }}
          />
        </View>
      ) : (
        <View style={{ marginTop: height / 6 }}>
          {!loading && showNoagency ? (
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
