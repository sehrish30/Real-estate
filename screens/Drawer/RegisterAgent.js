import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Header } from "react-native-elements";
import SelectBox from "react-native-multi-selectbox";
import { catgeories } from "../../Shared/Categories";
import Dialog from "react-native-dialog";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Button, Image } from "react-native-elements";

// backend
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

// Services
import {
  uploadToCloudinary,
  validateRegisterAgencyForm,
} from "../../Shared/services";
import { items } from "../../Shared/Cities";
import CustomMessage from "../CustomMessage";

var { width, height } = Dimensions.get("window");

const RegisterAgent = ({ navigation }) => {
  const showMenu = () => {
    navigation.toggleDrawer();
  };

  // FORM STATES
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [locations, setLocations] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadImage, setUploadImage] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [send, setSend] = useState(false);

  const uploadbtn = useRef();

  const deleteImage = (index) => {
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
          alert(
            "Sorry, we need camera roll permissions to upload your attachments!"
          );
        }
      }
    })();
  }, [attachments, category]);

  useFocusEffect(
    useCallback(() => {
      if (category) {
        uploadbtn.current.handleOnPress();
      }
      return () => {
        setLoading(false);
      };
    }, [category])
  );

  const onChange = () => {
    return (val) => {
      setVisible(false);
      setShowUpload(true);
      // uploadbtn.current.handleOnPress()
      return setCategory(val);
    };
  };

  function remove(item) {
    const filteredLocations = locations.filter(
      (location) => location.id !== item.id
    );
    setLocations(filteredLocations);
  }

  function onMultiChange() {
    return (item) => {
      for (let i = 0; i < locations.length; i++) {
        if (locations[i].id === item.id) {
          remove(item);
          return;
        }
      }
      setLocations([...locations, item]);
    };
  }

  function removeSelect() {
    return (item) => {
      const filteredLocations = locations.filter(
        (location) => location.id !== item.id
      );
      setLocations(filteredLocations);
    };
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

      setAttachments((prev) => [...prev, { uri, category: category.item }]);
      setCategory("");
      setShowUpload(false);

      // Infer the type of the image
      // split url by dot
      let filename = result.uri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let newfile = {
        uri: result.uri,
        type: `test/${result.uri.split(".")[1]}`,
        name: filename,
      };
      setUploadImage((prev) => [
        ...prev,
        { newfile, uri, category: category.item },
      ]);
    }
  };

  const settingNewUploads = async () => {
    let secretImages = [];
    for (const image of uploadImage) {
      const imageURL = await uploadToCloudinary(image.newfile);

      let data = { category: image.category, file: imageURL };
      setImageUrls((prevUrls) => [...prevUrls, data]);
      secretImages.push(data);
    }

    return secretImages;
  };

  const registerAgent = async () => {
    try {
      const imageData = await settingNewUploads();

      const location = locations.map((location) => location.item);

      const formData = {
        name,
        phoneNumber: phone,
        email,
        location,
        attachments: imageData,
      };
      let modifiedEmail = email;
      setEmail(modifiedEmail.toLowerCase().trim());
      const validationErrors = await validateRegisterAgencyForm({
        name,
        email,
        phone,
        locations,
      });
      const errors = Object.keys(validationErrors).length === 0;

      if (errors) {
        setLoading(true);
        const res = await axios.post(`${baseURL}agencies/register`, formData);

        if (res.status == 200) {
          setLoading(false);

          Toast.show({
            type: "success",
            text1: `${res.data.name} has been registered successfully`,
            text2: "Our team will connect with you shortly",
            visibilityTime: 8000,
            topOffset: 30,
          });
          setVisibleModal(true);
          setName("");
          setEmail("");
          setAttachments([]);
          setLocations([]);
          setPhone("");
          setImageUrls([]);
          setUploadImage([]);
        } else {
          setLoading(false);
          setVisibleModal(true);
          setName("");
          setEmail("");
          setAttachments([]);
          setLocations([]);
          setImageUrls([]);
          setUploadImage([]);
          setPhone("");
          throw new Error(res.data);
        }
        setLoading(false);
        navigation.navigate("User");
      } else {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: `${Object.values(validationErrors).join(" ")}`,
          visibilityTime: 4000,
          topOffset: 30,
        });
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: `${name} could not be registered`,
        text2: "Please try again",
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  };

  const showDialog = () => {
    setVisible(true);
  };

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
        <CustomMessage
          visible={visibleModal}
          setVisible={setVisibleModal}
          message={
            "To become a part of Ionic Real estate team you should be be real estate broker or developer."
          }
          shortMsg={"If your request gets accepted we will email you."}
          heading={"Agency Register Request"}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={[styles.font, styles.heading]}>
            Register your agency
          </Text>

          <Input
            label="Name"
            labelStyle={[styles.font, { color: "#a2d0c1" }]}
            leftIcon={<Icon name="people" size={24} color="#f8dc81" />}
            onChangeText={(value) => setName(value)}
            value={name}
          />
          <Input
            labelStyle={[styles.font, { color: "#a2d0c1" }]}
            label="Email"
            leftIcon={<MaterialIcon name="email" size={24} color="#f8dc81" />}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          <Input
            labelStyle={[styles.font, { color: "#a2d0c1" }]}
            label="Phone"
            keyboardType={"numeric"}
            leftIcon={<MaterialIcon name="phone" size={24} color="#f8dc81" />}
            onChangeText={(value) => setPhone(value)}
            value={phone}
          />
          <SelectBox
            label="Locations"
            containerStyle={{
              borderRadius: 10,
            }}
            style={[styles.font, { color: "#a2d0c1" }]}
            options={items}
            selectedValues={locations}
            onMultiSelect={onMultiChange()}
            onTapClose={removeSelect()}
            isMulti
            arrowIconColor="#f8dc81"
            searchIconColor="#f8dc81"
            toggleIconColor="#f8dc81"
            inputFilterContainerStyle={{
              backgroundColor: "#f7f6e7",
              borderRadius: 10,
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
            <Text
              h4
              style={[styles.font, { color: "#a2d0c1", marginBottom: 10 }]}
            >
              You can upload photos of your documents below*
            </Text>
            <Button
              titleStyle={styles.buttonStyle}
              buttonStyle={styles.addAttachment}
              title={showUpload ? `Press to Upload` : `Choose photo Category`}
              onPress={!showUpload ? showDialog : pickImage}
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
            <Button
              ref={uploadbtn}
              buttonStyle={{ width: 0, height: 0, opacity: 0, display: "none" }}
              onPress={pickImage}
            />

            <View style={styles.dialogbackground}>
              <Dialog.Container
                headerStyle={styles.dialogbackground}
                contentStyle={styles.dialog}
                footerStyle={styles.dialogbackground}
                visible={visible}
              >
                <Dialog.Title>Choose Category for your image</Dialog.Title>

                <SelectBox
                  label="Select single"
                  options={catgeories}
                  value={category}
                  onChange={onChange()}
                  hideInputFilter={false}
                  arrowIconColor="#f8dc81"
                  searchIconColor="#e4fbff"
                  toggleIconColor="#f8dc81"
                  inputFilterContainerStyle={{
                    backgroundColor: "#e4fbff",
                    borderRadius: 10,
                  }}
                  optionsLabelStyle={{
                    color: "#214151",
                    paddingLeft: 10,
                    backgroundColor: "#e4fbff",
                  }}
                  optionContainerStyle={{
                    backgroundColor: "#e4fbff",
                  }}
                  containerStyle={{
                    backgroundColor: "#e4fbff",
                    borderRadius: 10,
                  }}
                />
              </Dialog.Container>
            </View>

            <View style={styles.image}>
              {attachments.length > 0 &&
                attachments.map((attach, index) => (
                  <View style={styles.imageSlide}>
                    <Image
                      key={index}
                      onLongPress={() => deleteImage(index)}
                      transition
                      containerStyle={{ borderColor: "red" }}
                      source={{
                        uri: attach.uri,
                      }}
                      style={{ width: 50, height: 50 }}
                    />
                    <Text
                      style={[
                        styles.buttonStyle,
                        { marginTop: 15, paddingLeft: 10 },
                      ]}
                    >
                      {attach.category}
                    </Text>
                    <Icon
                      style={styles.iconImage}
                      onPress={() => deleteImage(index)}
                      name="trash-outline"
                      color={"#214151"}
                      size={20}
                    />
                  </View>
                ))}
            </View>
          </View>
          <Button
            titleStyle={styles.btn}
            buttonStyle={[styles.font, styles.register]}
            title="Register Agency"
            onPress={registerAgent}
            disabled={loading}
          />
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
  menu: {
    paddingTop: 20,
    paddingRight: 10,
  },
  rightNav: {
    flexDirection: "row",
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
    position: "relative",
  },
  addAttachment: {
    borderColor: "#e4fbff",
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
    backgroundColor: "#e4fbff",
    width: width / 1.2,
  },
  dialogbackground: {
    backgroundColor: "#e4fbff",
    width: width / 1.2,
  },
  register: {
    backgroundColor: "#214151",
    marginTop: 30,
  },
  btn: {
    fontFamily: "EBGaramond-Bold",
  },
});
