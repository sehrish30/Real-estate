import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";

import { xorBy } from "lodash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Header } from "react-native-elements";
import SelectBox from "react-native-multi-selectbox";
import { items } from "../../Shared/Cities";
import { catgeories } from "../../Shared/Categories";
import { Button, Image } from "react-native-elements";

var { width, height } = Dimensions.get("window");

const RegisterAgent = ({ navigation }) => {
  const showMenu = () => {
    navigation.toggleDrawer();
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  // FORM STATES
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [locations, setLocations] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const deleteImage = (index) => {
    console.log("delet");
    const newAttachments = attachments.filter(
      (_, newindex) => index !== newindex
    );
    setAttachments(newAttachments);
  };

  useLayoutEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, [attachments]);

  function onMultiChange() {
    return (item) => setLocations(xorBy(locations, [item], "id"));
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const uri = result.uri;
      setAttachments((prev) => {
        return [...prev, { uri }];
      });
    }

    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    console.log(filename);
    console.log(match, type);

    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append("photo", { uri: localUri, name: filename, type });

    // return await fetch(YOUR_SERVER_URL, {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //   },
    // });
  };

  function onChange() {
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
    // return (val) => setSelectedTeam(val);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        containerStyle={{
          backgroundColor: "#eff7e1",
          justifyContent: "space-around",
        }}
        leftComponent={
          <View style={styles.rightNav}>
            <TouchableOpacity style={styles.menu}>
              <Icon
                onPress={showMenu}
                name="notifications"
                color={"#214151"}
                size={30}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu}>
              <Icon
                onPress={showMenu}
                name="ios-search"
                color={"#214151"}
                size={30}
              />
            </TouchableOpacity>
          </View>
        }
        rightComponent={
          <TouchableOpacity style={styles.menu}>
            <Icon onPress={showMenu} name="menu" color={"#214151"} size={30} />
          </TouchableOpacity>
        }
      />

      <KeyboardAwareScrollView
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={[styles.font, styles.heading]}>
            Register your agency
          </Text>

          <Input
            label="Name"
            leftIcon={<Icon name="people" size={24} color="#f8dc81" />}
            onChangeText={(value) => setName(value)}
            value={name}
          />
          <Input
            label="Email"
            leftIcon={<MaterialIcon name="email" size={24} color="#f8dc81" />}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          <Input
            label="Phone"
            leftIcon={<MaterialIcon name="phone" size={24} color="#f8dc81" />}
            onChangeText={(value) => setPhone(value)}
            value={phone}
          />
          <SelectBox
            label="Locations"
            options={items}
            selectedValues={locations}
            onMultiSelect={onMultiChange()}
            onTapClose={onMultiChange()}
            isMulti
            arrowIconColor="#f8dc81"
            searchIconColor="#f8dc81"
            toggleIconColor="#f8dc81"
            inputFilterContainerStyle={{
              backgroundColor: "#f7f6e7",
            }}
            optionsLabelStyle={{
              color: "#214151",
              paddingLeft: 10,
            }}
            multiOptionContainerStyle={{
              backgroundColor: "#214151",
            }}
            value={locations}
          />

          <View style={styles.attachments}>
            <Button
              titleStyle={styles.buttonStyle}
              buttonStyle={styles.addAttachment}
              title="Add attachments"
              onPress={pickImage}
              loading={loading}
              type="outline"
              icon={
                <Icon
                  style={{ paddingRight: 5 }}
                  name="ios-image-outline"
                  size={25}
                  color="#f8dc81"
                />
              }
            />

            <SelectBox
              label="Select single"
              options={catgeories}
              value={locations}
              onChange={onChange()}
              hideInputFilter={false}
            />

            <View style={styles.image}>
              {attachments.length > 0 &&
                attachments.map((image, index) => (
                  <Image
                    key={index}
                    onLongPress={() => deleteImage(index)}
                    transition
                    containerStyle={{ borderColor: "red" }}
                    source={{
                      uri: image.uri,
                    }}
                    style={{ width: 50, height: 50 }}
                  />
                ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterAgent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  menu: {
    paddingTop: 20,
    paddingLeft: 15,

    paddingRight: 10,
  },
  rightNav: {
    flexDirection: "row",
    justifyContent: "flex-end",
    order: 1,
  },
  navLeft: {
    order: 2,
    marginLeft: "auto",
  },
  font: {
    fontFamily: "EBGaramond-Regular",
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
    width: width / 1.2,
    justifyContent: "center",

    marginHorizontal: 20,
  },
  attachments: {
    marginTop: 15,
    alignItems: "left",
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
    flexDirection: "row",
    marginTop: 5,
  },
  attachmentsRow: {
    flexDirection: "row",
  },
});
