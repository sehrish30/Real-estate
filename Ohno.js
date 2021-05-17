import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { requireNativeComponent } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import PanoramaView from "@lightbase/react-native-panorama-view";
import VideoPlayer from "expo-video-player";
import { ScrollView } from "react-native-gesture-handler";
import { Input, Button, Image, Header, Divider } from "react-native-elements";
import Axios from "axios";
import MapView, { Marker } from "react-native-maps";
import baseURL from "../../../assets/common/baseUrl";
// import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import SwitchSelector from "react-native-switch-selector";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Calendar } from 'react-native-calendars';
var { width, height } = Dimensions.get("window");
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";
const images = [
  "https://th.bing.com/th/id/Re2a4a7e212cacbf317c408356179ae84?rik=rBl5XPQzQ1xusA&riu=http%3a%2f%2fwww.e-architect.co.uk%2fimages%2fjpgs%2fsouth_africa%2fhouse-mosi-n120413-15.jpg",
  "https://th.bing.com/th/id/Re86b4a25d378003cd5decb63fc1d9f6d?rik=bwtHH3SpDhVxIw&riu=http%3a%2f%2f1.bp.blogspot.com%2f-ipy06jJr7lM%2fUcBy_kDc62I%2fAAAAAAAAT5U%2fcWBJGKpSq-Q%2fs1600%2fBeautiful_Modern_House_In_Desert_on_world_of_architecture_10.jpg",
  "https://www.soprovich.com/i-a86d0f95/real-estate/2075_57339.luxury-lg.default.jpg",
];

const Ohno = () => {
  const route = useRoute();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // axios.post("https://node.creativecodes.net/allProperties")
    // .then((response) => {
    //      console.log(response)
    // })
    let ID = await AsyncStorage.getItem("property");
    console.errors("ROUTE", route.params);
    fetch(`${baseURL}propertyDetails/${route.params.id}`)
      .then((response) => response.json())
      .then((responsejson) => {
        console.error("RESPONSE", responsejson);

        setList(responsejson.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [active, setActive] = useState(0);
  const [list, setList] = useState([]);
  const renderDayRow = ({ item }) => {
    const Like = async (ID) => {
      let login = await AsyncStorage.getItem("isLoggedIn");

      if (login == "true") {
        let user = await AsyncStorage.getItem("user");
        let parsedData = JSON.parse(user);
        let UID = parsedData.decoded.userId;

        //   this.setState({ loading: true });
        fetch("https://www.node.creativecodes.net/wishlist/add", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            user_id: UID,
            property_id: ID,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.message) {
              Toast.show({
                type: "success",
                text1: `Add to Favorites`,
                visibilityTime: 2000,
                topOffset: 30,
              });
            }
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        Toast.show({
          type: "error",
          text1: `Please Login First`,
          visibilityTime: 2000,
          topOffset: 30,
        });
      }
    };

    const change = (nativeEvent) => {
      // console.log("nativeEvent:", nativeEvent)
      if (nativeEvent) {
        const slide = Math.ceil(
          nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
        );
        if (slide !== active) {
          setActive(slide);
          setList([]);
        }
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.wrap}>
          <ScrollView
            onScroll={({ nativeEvent }) => change(nativeEvent)}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            style={styles.wrap}
          >
            {images.map((e, index) => (
              <Image
                key={e}
                resizeMode="stretch"
                style={styles.wrap}
                source={{ uri: e }}
              />
            ))}
          </ScrollView>
        </View>

        {/* {images && images.length > 0 ? <Image style={styles.avatar} source={{ uri: images[0] }} /> : null} */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* <Text style={styles.title}>{title}</Text> */}
          <Text style={styles.title}>{item.title}</Text>

          <TouchableOpacity
            onPress={() => Like(item.id)}
            style={{ flexDirection: "row", marginTop: 10 }}
          >
            <Icon name="heart-outline" color="red" size={30} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={{ marginLeft: 10 }}>
                                  <Icon name="cart-outline" color="red" size={30} />
                              </TouchableOpacity> */}
        </View>
        {/* <View style={styles.smallDivider} /> */}
        <View style={{ marginTop: 10 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ justifyContent: "flex-start", alignSelf: "center" }}>
            {/* <Text>{type}</Text> */}
            <Text>{item.type}</Text>
            <Text>manama</Text>
            {/* <Text>Available/NotAvailable</Text> */}
          </View>
          <View style={{ justifyContent: "flex-end", alignSelf: "center" }}>
            {/* <Text style={{ color: 'red', fontWeight: 'bold' }}>{cost} BHD</Text> */}
            <Text style={{ color: "red", fontWeight: "bold" }}>
              {item.cost} BHD
            </Text>
            {/* <Text style={{ alignSelf: 'center' }}>for {category}</Text> */}
            <Text style={{ alignSelf: "center" }}>for {item.category}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.details}>
          <Icon name="sofa" color="#306968" size={18} />
          <Text style={styles.detailText}>Rooms: </Text>
          {/* <Text style={styles.detailText}>{bathrooms}</Text> */}
          <Text style={styles.detailText}>{item.rooms}</Text>
          <Icon name="shower" color="#306968" size={18} />
          <Text style={styles.detailText}>Bathrooms:</Text>
          {/* <Text style={styles.detailText}>{bathrooms}</Text> */}
          <Text style={styles.detailText}>{item.bathrooms}</Text>
        </View>
        <View style={styles.divider} />

        <View>
          <Text style={styles.bio}>Description</Text>
          {/* <Text style={styles.text}>{description}</Text> */}
          <Text style={styles.text}>{item.description}</Text>
          <View style={styles.divider} />

          <Text style={styles.bio}>Amenities</Text>
          {/* <FlatList
                                  horizontal={true}
                                  data={Amenities}
                                  renderItem={({ item }) => <Text style={styles.text}>{item} |</Text>}
                              /> */}
          <View style={styles.divider} />

          <Text style={styles.bio}>Network Coverage</Text>
          {/* <FlatList
                                  showsHorizontalScrollIndicator={true}
                                  horizontal={true}
                                  data={network}
                                  renderItem={({ item }) => <Text style={styles.text}>{item?.item} |</Text>}
                              /> */}

          <View style={styles.divider} />

          <Text style={styles.bio}>Location </Text>
          <View>
            {/* {locations?.map((location) => (               
                                  <Badge
                                       key={location}
                                       value={location}
                                      badgeStyle={styles.location}
                                       textStyle={[styles.font, { color: "#214151", fontSize: 14 }]}
                                   />
                               ))} */}
            {/* <View style={{ height: 150 }}>
                                          <MapView
                                              style={styles.maps}
                                              initialRegion={{
                                                  latitude: location?.latitude,
                                                  longitude: location?.longitude,
                                                  latitudeDelta: 0.0922,
                                                  longitudeDelta: 0.0421
                                              }}
                                          >
                                              <MapView.Marker
                                                  coordinate={{
                                                      latitude: location?.latitude,
                                                      longitude: location?.longitude,
                                                  }}
                                                  title={"title"}
                                                  description={"description"}
                                              ></MapView.Marker>
                                          </MapView>
                                      </View>
                                       */}

            <View style={{ height: 150 }}>
              <MapView
                style={styles.maps}
                initialRegion={{
                  latitude: 55.3781,
                  longitude: 3.436,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <MapView.Marker
                  coordinate={{
                    latitude: 55.3781,
                    longitude: 3.436,
                  }}
                  title={"title"}
                  description={"description"}
                ></MapView.Marker>
              </MapView>
            </View>

            <View>
              <Video
                source={{ uri: item.video_url }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="cover"
                isLooping={false}
                shouldPlay={false}
                useNativeControls={true}
                style={{ width: 330, height: 200, marginTop: 10 }}
              />
            </View>

            <View>
              <WebView
                source={{
                  uri: "https://my.matterport.com/show/?m=9c5DwN3xAPx&back=1",
                }}
                style={{ marginTop: 20, width: 330, height: 300 }}
              />
            </View>

            {/* <View style={styles.container}>
                                          <PanoramaView
                                              style={styles.viewer}
                                              dimensions={{ height: 230, width: Dimensions.get("window").width }}
                                              inputType="stereo"
                                              imageUrl="https://raw.githubusercontent.com/googlevr/gvr-android-sdk/master/assets/panoramas/testRoom1_2kMono.jpg"
                                          />
                                      </View> */}
          </View>
          <View style={styles.divider} />

          <View style={{ alignSelf: "center" }}>
            <Text style={[styles.bio, { alignSelf: "center" }]}>
              Agent Info{" "}
            </Text>
            <Image
              style={styles.contact}
              source={require("../../../assets/home.jpg")}
            />
            <Text style={styles.contactText}>Agent Name </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignSelf: "center",
              }}
            >
              <Icon name="star" color="red" size={18} />
              <Icon name="star" color="red" size={18} />
              <Icon name="star" color="red" size={18} />
            </View>
            <TouchableOpacity style={styles.superhost}>
              <Text style={styles.superhostLabel}>View Agent Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
        </View>
      </View>
    );
  };
  return (
    <View>
      <ScrollView>
        <Text>Hello</Text>
        <FlatList
          pagingEnabled
          data={list}
          renderItem={renderDayRow}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </View>
  );
};

export default Ohno;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  viewer: {
    height: 230,
  },
  menu: {
    paddingTop: 20,
    paddingLeft: 15,

    paddingRight: 10,
  },
  rightNav: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  heading: {
    textAlign: "center",
    fontSize: 20,
    color: "#214151",
    marginBottom: 12,
    marginTop: 15,
  },
  form: {
    marginTop: 30,
    marginBottom: 400,
    flex: 1,
    justifyContent: "center",

    marginHorizontal: 20,
  },
  attachments: {
    marginTop: 15,
    position: "relative",
  },
  addAttachment: {
    borderColor: "#f8dc81",
    // width: "max-content",
  },
  buttonStyle: {
    color: "#214151",
    fontFamily: "EBGaramond-Regular",
  },
  image: {
    marginTop: 5,
  },

  imageSlide: {
    flexDirection: "row",
  },
  iconImage: {
    justifyContent: "flex-end",
    marginLeft: "auto",
    marginTop: 10,
  },
  dialog: {
    backgroundColor: "#f8dc81",
  },
  dialogbackground: {
    backgroundColor: "#f8dc81",
    borderColor: "#fff",
  },
  register: {
    backgroundColor: "#214151",
    marginTop: 30,
  },
  cancelbtn: {
    backgroundColor: "#a2d0c1",
    marginTop: 5,
  },
  maps: {
    height: "100%",
  },
  datepick: {
    width: 200,
  },
  divider: {
    height: 1,
    backgroundColor: "#DCDDDE",
    marginVertical: 16,
  },
  container: {
    padding: 16,
    overflow: "hidden",
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 18,

    overflow: "hidden",
    marginRight: 8,
    paddingLeft: 8,
    marginBottom: 6,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactDetails: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  detailText: {
    fontSize: 14,
    color: "grey",
    marginLeft: 4,
    marginRight: 16,
  },
  contactText: {
    alignSelf: "center",
    fontSize: 14,
    color: "grey",
    marginBottom: 10,
  },
  smallDivider: {
    height: 1,
    backgroundColor: "#DCDDDE",
    marginVertical: 16,
    width: width * 0.25,
  },
  divider: {
    height: 1,
    backgroundColor: "#DCDDDE",
    marginVertical: 16,
  },
  host: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: 300,
    alignSelf: "center",
    resizeMode: "cover",

    // borderRadius: 76 / 2,
  },
  contact: {
    width: 76,
    height: 76,
    borderRadius: 76 / 2,
    marginBottom: 10,
    alignSelf: "center",
    // borderRadius: 76 / 2,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 18,
  },
  imgSection: {
    display: "flex",
  },
  imageBlock: {
    alignItems: "center",
    alignContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  bio: {
    color: "#306968",
    marginBottom: 10,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  superhost: {
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 1,
    padding: 4,
    marginBottom: 10,
    width: 100,
    alignSelf: "center",
  },
  superhostLabel: {
    fontSize: 10,
    alignSelf: "center",
  },
  shost: {
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 2,
    padding: 4,
    width: 200,
  },
  shostLabel: {
    fontSize: 20,
    alignSelf: "center",
  },

  wrap: {
    width: 325,
    height: 300,
  },
  wrapDot: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    margin: 3,
    color: "#888",
  },
  dotActive: {
    margin: 3,
    color: "black",
  },
});
