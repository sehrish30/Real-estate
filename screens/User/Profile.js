import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Switch,
  View,
  Alert,
} from "react-native";
import { Card } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Actions/auth";
import { SimpleLineIcons } from "@expo/vector-icons";
import UserProfileMenuOverlay from "../../Shared/Overlays/UserProfileMenuOverlay";
import CustomModalPassword from "../../Shared/Input/CustomModalPassword";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {
  updateToken,
  removeToken,
  getUserInfo,
} from "../../Shared/Services/AuthServices";
var { height, width } = Dimensions.get("screen");

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [userDp, setUserDp] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [isGoogle, setIsGoogle] = useState("");
  const [pushtoken, setPushToken] = useState("");
  const dispatch = useDispatch();
  let token = useSelector((state) => state.auth.token);
  let cuser = useSelector((state) => state.auth.user);

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

      console.error(pushtokenCrude.substring(18, 40), finalStatus, cuser);
      updateToken(
        {
          id: cuser.decoded.userId,
          pushtoken: pushtokenCrude.substring(18, 40),
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
        lightColor: "#FF231F7C",
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
  }, [isEnabled]);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

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

        <Card.Divider />
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
      <CustomModalPassword
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        userPassword={true}
        userId={userId}
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
});
