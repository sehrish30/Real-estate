import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
  useLayoutEffect,
} from "react";
import { requireNativeComponent } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  recommendations: [],
};

import { formatDistanceToNow } from "date-fns";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import PanoramaView from "@lightbase/react-native-panorama-view";
import VideoPlayer from "expo-video-player";
import { ScrollView } from "react-native-gesture-handler";
import { Input, Button, Image, Header, Divider } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import baseURL from "../../../assets/common/baseUrl";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";
import { Icon as Native } from "react-native-elements";
import openMap from "react-native-open-maps";
import {
  addWishLists,
  removeFromWishList,
  relevantProperties,
} from "../../Services/PropertyServices";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
var { width, height } = Dimensions.get("window");
import { getPropertyDetails } from "../../Services/PropertyServices";
import { useRoute, useNavigation } from "@react-navigation/native";

import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";
import RecommendedProperties from "./RecommendedProperties";
import AmenityIcon from "./AmenityIcon";

const PropertiesPosts = () => {
  const route = useRoute();

  const navigation = useNavigation();

  const playerRef = useRef();
  useEffect(() => {
    getData();
  }, []);

  const [{ recommendations }, dispatchRecommendations] = useReducer(
    reducer,
    initialState
  );

  const currentValue = new Animated.Value(1);
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);
  const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);
  let userId;
  if (agency.id) {
    userId = agency.id;
  } else if (user?.decoded) {
    userId = user?.decoded?.userId;
  }
  const getData = async () => {
    console.error("ROUTE", route.params);

    const res = await getPropertyDetails({
      property: route.params.id,
      userId: userId || null,
    });
    if (res) {
      setList([res.data]);
      setRecommended(res.data);
      setStar(res.exists);
    }
  };

  const [active, setActive] = useState(0);
  const [list, setList] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [animationVisibile, setAnimationVisible] = useState(false);
  const [mute, setMute] = useState("volume-mute");
  const [star, setStar] = useState(false);
  const [shouldPlay, setShouldPlay] = useState("pause");
  const [playing, setPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  useEffect(() => {
    if (star) {
      Animated.spring(currentValue, {
        toValue: 2,
        friction: 2,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(currentValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start(() => {
          setAnimationVisible(false);
        });
      });
    }
  }, [star]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
    });
  });

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);
  useEffect(() => {
    (async () => {
      if (recommended) {
        const result = await relevantProperties(
          {
            city: recommended.city,
            category: recommended.category,
            type: recommended.type,
            propertyId: recommended._id,
            cost: recommended.cost,
          },
          token
        );
        dispatchRecommendations({
          recommendations: result,
        });
        console.error("RECCOMENDED", result);
      }
    })();
    return () => {
      dispatchRecommendations({
        recommendations: [],
      });
    };
  }, [recommended]);

  const renderDayRow = ({ item }) => {
    const Like = async () => {
      let login = await AsyncStorage.getItem("isLoggedIn");
      let loginAgency = await AsyncStorage.getItem("isLoggedInAgency");

      if (login == "true" || loginAgency) {
        if (star) {
          const result = await removeFromWishList(
            {
              user_id: userId || null,
              property_id: item._id,
            },
            token
          );
          if (result) {
            console.error("UN");
            setStar(false);
          }
        } else {
          setAnimationVisible(true);
          const res = await addWishLists(
            {
              user_id: userId || null,
              property_id: item._id,
            },
            token
          );
          if (res) {
            console.error("YAY");
            setStar(true);
          }
        }
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
          <Swiper
            style={{ height: width }}
            showButtons={true}
            autoplay={true}
            autoplayTimeout={6}
            dotColor="#214151"
            activeDotColor="#a2d0c1"
          >
            {item?.propertyImages?.map((e, index) => (
              <Image
                key={e}
                resizeMode="stretch"
                style={styles.wrap}
                source={{ uri: e.url }}
              />
            ))}
            {/* {item?.images?.map((e, index) => (
              <Image
                key={e}
                resizeMode="stretch"
                style={styles.wrap}
                source={{ uri: e }}
              />
            ))} */}
          </Swiper>
        </View>

        {/* {images && images.length > 0 ? <Image style={styles.avatar} source={{ uri: images[0] }} /> : null} */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: width / 1.1,
          }}
        >
          {/* <Text style={styles.title}>{title}</Text> */}
          <Text style={styles.title}>{item.title}</Text>

          {userId && (
            <TouchableOpacity
              onPress={() => Like()}
              style={{ flexDirection: "row", marginTop: 10 }}
            >
              {star ? (
                <AntDesign name="heart" color="#fdb827" size={30} />
              ) : (
                <AntDesign name="hearto" color="#fdb827" size={30} />
              )}
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity style={{ marginLeft: 10 }}>
                                  <Icon name="cart-outline" color="red" size={30} />
                              </TouchableOpacity> */}
        </View>
        {/* <View style={styles.smallDivider} /> */}
        <View style={{ marginTop: 10 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ justifyContent: "flex-start", alignSelf: "center" }}>
            {/* <Text>{type}</Text> */}
            <Text style={styles.description}>{item.type}</Text>
            <Text style={styles.description}>{item.city || null}</Text>
            {/* <Text>Available/NotAvailable</Text> */}
          </View>
          <View style={{ justifyContent: "flex-end", alignSelf: "center" }}>
            {/* <Text style={{ color: 'red', fontWeight: 'bold' }}>{cost} BHD</Text> */}
            <Text style={{ color: "#214151", fontWeight: "bold" }}>
              {item.cost} BHD
            </Text>
            {/* <Text style={{ alignSelf: 'center' }}>for {category}</Text> */}
            <Text style={{ alignSelf: "center", color: "#214151" }}>
              for {item.category}
            </Text>
          </View>
        </View>
        <Text
          style={{
            alignSelf: "center",
            color: "#839b97",
          }}
        >
          {formatDistanceToNow(Date.parse(item.updatedAt), {
            includeSeconds: true,
          })}
        </Text>

        <View style={styles.divider} />
        <View style={styles.details}>
          <Icon name="sofa" color="#306968" size={18} />
          <Text style={styles.detailText}>Rooms: </Text>
          <Text style={styles.detailText}>{item.rooms}</Text>
          <Icon name="shower" color="#306968" size={18} />
          <Text style={styles.detailText}>Bathrooms:</Text>
          <Text style={styles.detailText}>{item.bathrooms}</Text>
        </View>
        <View style={styles.divider} />

        <View>
          <Text style={styles.bio}>Description</Text>
          {/* <Text style={styles.text}>{description}</Text> */}
          {showFullDescription ? (
            <Text style={styles.descriptionCrop}>{item.description}</Text>
          ) : (
            <Text
              ellipsizeMode="tail"
              numberOfLines={3}
              style={styles.descriptionCrop}
            >
              {item.description}
            </Text>
          )}
          <Text
            style={styles.readmore}
            onPress={() => {
              setShowFullDescription(!showFullDescription);
            }}
          >
            {item.description.length > 40 && (
              <>{!showFullDescription ? "Read more" : "Read less"}</>
            )}
          </Text>
          <View style={styles.divider} />

          <Text style={styles.bio}>Amenities</Text>
          <FlatList
            style={styles.amenities}
            horizontal={true}
            data={item.Amenities}
            renderItem={({ item }) => (
              <View
                showsVerticalScrollIndicator={true}
                style={{
                  flexDirection: "row",
                  width: width / 3,
                  paddingBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <AmenityIcon name={item} />
                <Text
                  style={[
                    styles.text,
                    {
                      color: "#214151",
                    },
                  ]}
                >
                  {item}
                </Text>
              </View>
            )}
          />
          <View style={styles.divider} />

          <Text style={styles.bio}>Network Coverage</Text>
          <FlatList
            showsHorizontalScrollIndicator={true}
            horizontal={true}
            data={item.network}
            renderItem={({ item, index }) => (
              <>
                {item.item == "Zain" && (
                  <Image
                    source={require(`../../../assets/Zain.png`)}
                    style={{
                      width: 60,
                      marginRight: 10,
                      height: 30,
                      resizeMode: "stretch",
                    }}
                  />
                )}
                {item.item == "STC" && (
                  <Image
                    source={require(`../../../assets/STC.png`)}
                    style={{
                      width: 60,
                      height: 40,
                      resizeMode: "cover",
                    }}
                  />
                )}
                {item.item == "Batelco" && (
                  <Image
                    source={require(`../../../assets/Batelco.png`)}
                    style={{
                      width: 60,
                      marginRight: 10,
                      height: 40,
                      resizeMode: "cover",
                    }}
                  />
                )}
              </>
            )}
          />

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
                  // latitude: 55.3781,
                  // longitude: 3.436,
                  // latitudeDelta: 0.0922,
                  // longitudeDelta: 0.0421,
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <MapView.Marker
                  pinColor="aqua"
                  coordinate={{
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                  }}
                  title={item.title}
                ></MapView.Marker>
              </MapView>
            </View>
            <Button
              title="Open Map"
              buttonStyle={{
                paddingBottom: 10,
              }}
              titleStyle={{
                color: "#214151",
                fontFamily: "EBGaramond-Bold",
              }}
              onPress={() => {
                openMap({
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                  zoom: 30,
                });
              }}
              type="clear"
            />
            {/* 
            <View>
              <Video
                source={{
                  uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
                }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="cover"
                isLooping={false}
                shouldPlay={false}
                useNativeControls={true}
                style={{ width: 330, height: 200, marginTop: 10 }}
              />
            </View> */}
            {item.video_url ? (
              <YoutubePlayer
                play={playing}
                onChangeState={onStateChange}
                height={300}
                width={width / 1.2}
                videoId={item.video_url.split("=")[1]}
              />
            ) : null}

            {/* <WebView
              scalesPageToFit={true}
              startInLoadingState={true}
              source={{
                uri: item.video_url,
              }}
              style={{
                marginTop: 20,
                width: 330,
                height: 300,
              }}
            /> */}

            {/* <View style={styles.container}>
              <PanoramaView
                style={styles.viewer}
                dimensions={{
                  height: 230,
                  width: Dimensions.get("window").width,
                }}
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
              source={{ uri: item.agency.logo.url }}
            />
            <Text style={styles.contactText}>{item.agency.name} </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignSelf: "center",
              }}
            >
              <Icon name="star" color="#fdb827" size={18} />
              <Text>{item.agency.totalRating}</Text>
            </View>
            <TouchableOpacity style={styles.superhost}>
              <Text
                onPress={() => {
                  navigation.navigate("AgencyDetail", {
                    id: item.agency.id,
                  });
                }}
                style={styles.superhostLabel}
              >
                View Agent Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.similar}>Similar Properties</Text>
          {recommendations.map((recommend) => (
            <RecommendedProperties
              item={recommend.item}
              images={recommend.images}
              type={recommend.type}
              agency={recommend.agency}
              title={recommend.title}
              cost={recommend.cost}
              category={recommend.category}
              city={recommend.city}
              id={recommend._id}
              propertyImages={recommend.propertyImages}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View>
      <ScrollView>
        {animationVisibile && (
          <AnimatedIcon
            style={{
              position: "absolute",
              top: 150,
              left: "40%",
              elevation: 4,
              zIndex: 3,
              transform: [{ scale: currentValue }],
            }}
            name="heart"
            size={50}
            color="#fdb827"
          />
        )}

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

export default PropertiesPosts;

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
    fontSize: 18,
    width: width / 1.4,
    lineHeight: 36,
    marginTop: 10,
    fontFamily: "EBGaramond-Bold",
    color: "#214151",
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
    color: "#214151",
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
  description: {
    color: "#214151",
  },
  descriptionCrop: {
    color: "#214151",
  },
  readmore: {
    fontFamily: "EBGaramond-Bold",
    fontSize: 14,
    color: "#214151",
  },
  amenities: {
    display: "flex",
    flexDirection: "row",
    maxWidth: width / 1.1,
  },
  similar: {
    fontFamily: "EBGaramond-Bold",
    fontSize: 16,
    color: "#214151",
  },
});
