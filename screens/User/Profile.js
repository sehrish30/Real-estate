import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, Dimensions, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Actions/auth";
import { SimpleLineIcons } from "@expo/vector-icons";
import UserProfileMenuOverlay from "../../Shared/Overlays/UserProfileMenuOverlay";
import CustomModalPassword from "../../Shared/Input/CustomModalPassword";

var { height, width } = Dimensions.get("screen");
const Profile = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [userDp, setUserDp] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [isGoogle, setIsGoogle] = useState("");
  const dispatch = useDispatch();

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
        const data = await AsyncStorage.getItem("user");
        const parsedData = JSON.parse(data);
        setUser(parsedData.email);

        setUserId(parsedData.decoded.userId);
        setUserDp(parsedData.dp);
        setIsGoogle(parsedData.isGoogle);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [navigation, logout]);

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
});
