import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
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
import { SearchBar } from "react-native-elements";
import * as actions from "../../Redux/Actions/chat";
var { width, height } = Dimensions.get("window");
const AllChats = ({ navigation, route }) => {
  const [allChats, setAllChats] = useState([]);
  const [safetyChats, setSafetyChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unseencount, setUnseencount] = useState([]);
  const [showNoagency, setShowNoAgency] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const searchField = useRef();
  const [debounceValue, setDebounceValue] = useState("");

  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);
  let fetchedChats = useSelector((state) => state.chat.allChats);

  let userId;
  if (agency.id) {
    userId = agency.id;
  } else {
    userId = user.decoded.userId;
  }

  // const ENDPOINT = "localhost:3000";

  const ENDPOINT = baseURL;

  const socket = socketIOClient(ENDPOINT);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(actions.sendChatNotifications(0));
      dispatch(actions.currentChat(null));
      if (user.email) {
        (async () => {
          let res;

          if (fetchedChats.length <= 0) {
            res = await customerRooms({ customer: user.decoded.userId }, token);
          } else {
            setAllChats(fetchedChats);
            setSafetyChats(fetchedChats);
          }

          if (!res) {
            setLoading(false);
          } else {
            setLoading(true);
            if (res.length === 0) {
              setShowNoAgency(true);
            }

            let fastChats = [];

            const requests = res.map((r) => {
              let unSeenCount = 0;
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
                message: r?.chats[r.chats?.length - 1]?.content || "",
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
                new: false,
              };

              setAllChats((prev) => [...prev, info]);
              setSafetyChats((prev) => [...prev, info]);
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
          let res;

          if (fetchedChats.length <= 0) {
            res = await agencyRooms({ agency: agency.id }, token);
          } else {
            setAllChats(fetchedChats);
            setSafetyChats(fetchedChats);
          }
          if (!res) {
            setLoading(false);
          } else {
            setLoading(true);
            if (res.length === 0) {
              setShowNoAgency(true);
            }

            let fastChats = [];

            const requests = res.map((r) => {
              let unSeenCount = 0;
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
                message: r?.chats[r.chats?.length - 1]?.content || "",
                uri: r.customer.dp,
                createdAt: r?.chats[r.chats?.length - 1]?.createdAt || null,
                unSeenCount,
                agencyId: r.agency,
                timesent: r?.chats[r.chats?.length - 1]?.timesent,
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
                new: false,
              };
              setAllChats((prev) => [...prev, info]);
              setSafetyChats((prev) => [...prev, info]);
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
        // setSafetyChats([]);
        // setUnseencount([]);
        socket.disconnect(true);
        socket.off();
      };
    }, [useSocket, dispatch])
  );

  /*-----------------------------------------------
          SEARCHING AGENCY CHATS
  ---------------------------------------------- */
  let timer;
  const useDebounce = (value, delay = 0) => {
    timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return debounceValue;
  };

  const searchedAgency = async (value) => {
    if (value.length > 0) {
      allChats.map((chat) => {
        if (chat.name.toLowerCase().includes(search.toLowerCase())) {
          let index = allChats.findIndex(
            (indexChat) => indexChat.id === chat.id
          );

          setAllChats(allChats.slice(index, index + 1));
        }
      });
    }
  };

  useEffect(() => {
    if (search.length === 0) {
      setAllChats(fetchedChats);
    }
    if (search.length > 0) {
      searchedAgency(useDebounce(search));
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search, debounceValue]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      title: "Messages",
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            setShowSearchBar(true);
          }}
        >
          <AntDesign name="search1" color={"#2c6e8f"} size={30} />
        </TouchableOpacity>
      ),
    });
    return () => {
      // setAllChats([]);
      // setSafetyChats([]);
      // setUnseencount([]);
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
      {showSearchBar && (
        <SearchBar
          ref={searchField}
          placeholder="Search..."
          onChangeText={(text) => setSearch(text)}
          value={search}
          leftIconContainerStyle={{ color: "#eff7e1" }}
          containerStyle={styles.searchBar}
          inputContainerStyle={styles.searchbarInput}
          inputStyle={styles.input}
          placeholderTextColor="#eff7e1"
        />
      )}

      {allChats.length !== 0 && !loading ? (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
          <FlatList
            data={allChats}
            renderItem={renderItem}
            keyExtractor={(item) => {
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
  searchBar: {
    backgroundColor: "#8dadb3",
    color: "#eff7e1",
    // borderColor: "transparent",
    marginVertical: 0,
    borderEndColor: "red",
    paddingVertical: 0,
  },
  searchbarInput: {
    backgroundColor: "#8dadb3",
    borderColor: "transparent",
  },
  input: {
    color: "#eff7e1",
    fontFamily: "EBGaramond-Regular",
  },
});
