import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
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
import { catgeories } from "../../Shared/Categories";
import Dialog from "react-native-dialog";

import { items } from "../../Shared/Cities";

import { Button, Image } from "react-native-elements";

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

  useLayoutEffect(() => {
    if (category) {
      setVisible(false);
    }
  });

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
        return [...prev, { uri, category: category.item }];
      });
      setCategory("");
    }

    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // const handleCancel = () => {
    //   setVisible(false);
    // };

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

  useLayoutEffect(() => {
    if (category) {
      pickImage();
    }
  }, [category]);

  const onChange = () => {
    return (val) => setCategory(val);
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
            keyboardType={"numeric"}
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
              onPress={showDialog}
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
                  searchIconColor="#f8dc81"
                  toggleIconColor="#f8dc81"
                  inputFilterContainerStyle={{
                    backgroundColor: "#f8dc81",
                  }}
                  optionsLabelStyle={{
                    color: "#214151",
                    paddingLeft: 10,
                    backgroundColor: "#f8dc81",
                  }}
                  optionContainerStyle={{
                    backgroundColor: "#f8dc81",
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
                      onPress={deleteImage(index)}
                      name="trash-outline"
                      color={"#214151"}
                      size={30}
                    />
                  </View>
                ))}
            </View>
          </View>
          <Button
            buttonStyle={[styles.font, styles.register]}
            title="Register Agency"
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
    marginTop: 5,
  },
  attachmentsRow: {
    flexDirection: "row",
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
});
