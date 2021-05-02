import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useReducer,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Switch,
  View,
  Alert,
} from "react-native";
import { Card, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Actions/auth";
import { SimpleLineIcons } from "@expo/vector-icons";
import UserProfileMenuOverlay from "../../Shared/Overlays/UserProfileMenuOverlay";
import CustomModalPassword from "../../Shared/Input/CustomModalPassword";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Entypo } from "@expo/vector-icons";

import {
  updateToken,
  removeToken,
  getUserInfo,
} from "../../Shared/Services/AuthServices";
import SubscribeLocations from "../../Shared/Modals/SubscribeLocations";
var { height, width } = Dimensions.get("screen");
import { getSubscribedLocations } from "../../Shared/Services/PropertyServices";
import { items } from "../../Shared/Cities";

// Reducer for checked locations
const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  locations: [],
};
const Profile = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [userDp, setUserDp] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [isGoogle, setIsGoogle] = useState("");
  const [pushtoken, setPushToken] = useState("");
  const [notify, setNotify] = useState("");
  const [originalLocations, setOriginalLocations] = useState([]);
  const dispatch = useDispatch();
  let token = useSelector((state) => state.auth.token);
  let cuser = useSelector((state) => state.auth.user);
  const [{ locations }, dispatchLocations] = useReducer(reducer, initialState);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("jwt");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("isLoggedIn");

      dispatch(logoutUser());
      // navigation.navigate("Home");
      navigation.reset({
        index: 1,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleOverlay = () => {
    setOpenMenu(!openMenu);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      title: "Account",
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <AntIcon
            style={{ verticalAlign: "middle", marginRight: 15 }}
            name="logout"
            color={"#a2d0c1"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });

    const getUser = async () => {
      try {
        if (loading) {
          const data = await AsyncStorage.getItem("user");

          let info;
          (async () => {
            info = await AsyncStorage.getItem("isEnabled");

            setIsEnabled(info === "true" ? true : false);
          })();

          const parsedData = JSON.parse(data);
          setUser(parsedData.email);

          setUserId(parsedData.decoded.userId);
          setUserDp(parsedData.dp);
          setIsGoogle(parsedData.isGoogle);

          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [navigation, logout]);

  const registerForPushNotifications = async () => {
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("We are not allowed to send push notification to you");
        return;
      }
      const pushtokenCrude = (await Notifications.getExpoPushTokenAsync()).data;

      setPushToken(pushtokenCrude.substring(18, 40));

      // console.error(pushtokenCrude.substring(18, 40), finalStatus, cuser);
      updateToken(
        {
          id: cuser.decoded.userId,
          pushtoken: pushtokenCrude,
        },
        token
      );
    } else {
      Alert.alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "red",
      });
    }
  };

  useEffect(() => {
    if (isEnabled && !loading) {
      registerForPushNotifications();
      (async () => await AsyncStorage.setItem("isEnabled", "true"))();
    }
    if (!isEnabled && !loading) {
      removeToken({ id: cuser.decoded.userId }, token);
      (async () => await AsyncStorage.removeItem("isEnabled", null))();
    }

    if (!loading) {
      (async () => {
        let data = await getSubscribedLocations(cuser.decoded.userId, token);
        // console.error(data);
        let value = [];
        data.locations.map((location) => {
          let index = items.findIndex((item) => item.item === location);
          value[index] = true;
        });
        // console.error("VALUE", value);
        dispatchLocations({
          locations: value,
        });
        setOriginalLocations(value);
      })();
    }
  }, [isEnabled]);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    registerForPushNotificationsAsync().then((token) => {
      setPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification.request.content.data);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.error("REALESTATE", response);
        navigation.navigate("Notifications");
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // ZAHRA - Remove it enough demo
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ICONIC properties",
        body: "Here is the notification body",
        data: { data: "goes here" },
      },
      trigger: { seconds: 2 },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "red",
      });
    }

    return token;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <UserProfileMenuOverlay
        visible={openMenu}
        toggleOverlay={toggleOverlay}
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
      />
      <Card containerStyle={styles.bg}>
        {!isGoogle && (
          <SimpleLineIcons
            style={{ marginLeft: "auto" }}
            name="options-vertical"
            color={"#839b97"}
            size={30}
            onPress={toggleOverlay}
          />
        )}

        <Card.Title style={styles.font}>
          <Card.Image
            style={{ width: 50, height: 50, borderRadius: 100 }}
            source={{ uri: userDp }}
          ></Card.Image>
        </Card.Title>
        <Text
          style={[
            styles.font,
            { fontSize: 18, alignSelf: "center", marginBottom: 10 },
          ]}
        >
          {user}
        </Text>
        {/* <Button
          title="Send notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        /> */}
      </Card>
      <View style={styles.enableNotification}>
        <Text style={styles.textNotify}>Enable Notifications</Text>
        <Switch
          trackColor={{ false: "#839b97", true: "#214151" }}
          thumbColor={isEnabled ? "#f8dc81" : "#cfd3ce"}
          ios_backgroundColor="#839b97"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {isEnabled && (
        <Button
          icon={
            <Entypo
              style={{ marginRight: 15 }}
              name="location"
              size={15}
              color="#214151"
            />
          }
          iconLeft
          title="Subscribe Locations"
          buttonStyle={styles.subscribe}
          titleStyle={styles.subscribeText}
          containerStyle={{ marginTop: 15, marginHorizontal: 10 }}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        />
      )}
      <CustomModalPassword
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        userPassword={true}
        userId={userId}
      />

      <SubscribeLocations
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        dispatchLocations={dispatchLocations}
        locations={locations}
        originalLocations={originalLocations}
      />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: height,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
    color: "#214151",
  },
  text: {
    color: "#214151",
  },
  bg: {
    backgroundColor: "#eff7e1",
    borderRadius: 10,
  },
  enableNotification: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    borderColor: "#a2d0c1",
    borderWidth: 1,
  },
  textNotify: {
    // fontFamily: "EBGaramond-Bold",
    color: "#214151",
    marginTop: 5,
    fontSize: 14,
    marginRight: 10,
  },
  subscribe: {
    backgroundColor: "#f8dc81",
  },
  subscribeText: { fontFamily: "EBGaramond-Bold", color: "#214151" },
});
