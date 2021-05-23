import React, { useState, useEffect, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import {
  getAllWishlistsAdmin,
  getAllWishlistsUser,
} from "../../Shared/Services/WishlistServices";
import { SafeAreaView } from "react-native";
import CustomHeader from "../../Shared/HomeShared/CustomHeader";
const { width } = Dimensions.get("window");

const RenderDayRow = ({ item, navigation }) => {
  // console.log('ID: '+ item.property.id)
  console.error("SEHRISH", item.id);

  return (
    <TouchableWithoutFeedback
      style={{
        marginVertical: 10,
      }}
      onPress={() => {
        navigation.navigate("PropertiesPosts", {
          //   item: item.property,
          id: item.property.id,
        });
        // navigation.navigate("Home", {
        //   screen: "PropertiesPosts",
        //   params: { item: item },
        // });
      }}
    >
      {item?.property.propertyImages?.length > 0 ||
      item.property?.images?.length > 0 ? (
        <Image
          style={styles.image}
          source={{
            uri:
              item.property.propertyImages[0]?.url || item.property?.images[0],
          }}
        />
      ) : null}
      <View style={styles.card}>
        <View style={styles.details}>
          <View style={styles.superhost}>
            <Text style={styles.superhostLabel}>{item.property.type}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{}}>
            {item?.property.title?.length > 20 ? (
              <Text style={[styles.title, { fontFamily: "EBGaramond-Bold" }]}>
                {item.property.title.substring(0, 20)}....
              </Text>
            ) : (
              <Text style={[styles.title, { fontFamily: "EBGaramond-Bold" }]}>
                {item.property.title}
              </Text>
            )}

            <Text style={[styles.title, { fontSize: 15 }]}>
              {item.property.city || null}
            </Text>
            {/* <Text style={[styles.title, { fontSize: 15, color: "#839b97" }]}>
              By {item.agency.name}
            </Text> */}
          </View>
          <View style={{ justifyContent: "center" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginTop: 10,
                  color: "#F0C948",
                  fontFamily: "EBGaramond-Bold",
                  fontSize: 20,
                }}
              >
                {item.property.cost}{" "}
              </Text>
              {item.property.category == "Rent" ? (
                <Text
                  style={{
                    color: "#F0C948",
                    fontSize: 12,
                    marginTop: 15,
                  }}
                >
                  BD/month
                </Text>
              ) : (
                <Text
                  style={{
                    color: "#F0C948",
                    fontSize: 12,
                    marginTop: 15,
                  }}
                >
                  {" "}
                  BD
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Text style={{ color: "white" }}>for</Text>
              <Text style={{ color: "white" }}> {item.property.category}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Favorite = ({ navigation }) => {
  let token = useSelector((state) => state.auth.token);
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);

  const [wishlists, setWishlists] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        if (agency.id) {
          setWishlists(await getAllWishlistsAdmin(agency.id, token));
        } else {
          setWishlists(await getAllWishlistsUser(user.decoded.userId, token));
        }
      })();

      return () => {
        setWishlists([]);
      };
    }, [refreshing])
  );

  const showMenu = () => {
    navigation.toggleDrawer();
  };
  return (
    <SafeAreaView
      style={[styles.container, { marginTop: StatusBar.currentHeight || 0 }]}
    >
      <CustomHeader showMenu={showMenu} title={"Saved properties"} />
      <FlatList
        pagingEnabled
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(false);
        }}
        data={wishlists}
        renderItem={({ item }) => (
          <RenderDayRow item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  image: {
    height: 150,
    width: width - 20,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontFamily: "EBGaramond-Regular",
    fontSize: 20,
    color: "white",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingLabel: {
    fontFamily: "EBGaramond-Bold",
    marginLeft: 4,
    color: "white",
  },
  superhost: {
    borderColor: "#214151",
    borderRadius: 30,
    borderWidth: 1,
    padding: 4,
    backgroundColor: "#214151",
  },
  superhostLabel: {
    fontSize: 10,
    fontFamily: "EBGaramond-Regular",
  },
  card: {
    backgroundColor: "#214151",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
