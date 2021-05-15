import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
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
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { Input, Button, Image, Header, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Dialog from "react-native-dialog";
import SelectBox from "react-native-multi-selectbox";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import SwitchSelector from "react-native-switch-selector";
import Counter from "react-native-counters";

// import MainScreen from "./ImageUpload/MainScreen";
import { connect } from "react-redux";
import Axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import { items } from "../../Shared/Items";
import { amenities } from "../../Shared/amenities";
import { networks } from "../../Shared/Networks";
//property type list
// export const items = [
//   {
//     id: "Residential",
//     item: "Residential",
//   },
//   {
//     id: "Commercial",
//     item: "Commercial",
//   },
//   {
//     id: "Industrial",
//     item: "Industrial",
//   },
//   {
//     id: "Lands",
//     item: "Lands",
//   },
// ];

// //amenities list
// export const amenities = [
//   {
//     id: "Central heating",
//     item: "Central heating",
//   },
//   {
//     id: "Central cooling",
//     item: "Central cooling",
//   },
//   {
//     id: "Dirty kitchen",
//     item: "Dirty Kitchen",
//   },
//   {
//     id: "Lawn",
//     item: "Lawn",
//   },
//   {
//     id: "Swimming pool",
//     item: "Swimming pool",
//   },
//   {
//     id: "Parking space",
//     item: "Parking space",
//   },
//   {
//     id: "TV lounge",
//     item: "TV lounge",
//   },
//   {
//     id: "Drawing room",
//     item: "Drawing room",
//   },
//   {
//     id: "Home theatre",
//     item: "Home theatre",
//   },
//   {
//     id: "Corner house",
//     item: "Corner house",
//   },
//   {
//     id: "Elevators",
//     item: "Elevators",
//   },
//   {
//     id: "Study room",
//     item: "Study room",
//   },
//   {
//     id: "Security staff",
//     item: "Security staff",
//   },
//   {
//     id: "Nearby Landmark",
//     item: "Nearby Landmark",
//   },
//   {
//     id: "Wifi",
//     item: "Wifi",
//   },
//   {
//     id: "Balcony",
//     item: "Balcony",
//   },
//   {
//     id: "Laundry room",
//     item: "Laundry room",
//   },
//   {
//     id: "Servant quarter",
//     item: "Servant quarter",
//   },
//   {
//     id: "Fully Furnished",
//     item: "Fully Furnished",
//   },
//   {
//     id: "Semi furnished",
//     item: "Semi furnished",
//   },
//   {
//     id: "Dining room",
//     item: "Dining room",
//   },
//   {
//     id: "Kitchen",
//     item: "Kitchen",
//   },
//   {
//     id: "Store room",
//     item: "Store room",
//   },
//   {
//     id: "Powder room",
//     item: "Powder room",
//   },
//   {
//     id: "Accessible for specially abled persons",
//     item: "Accessible for specially abled persons",
//   },
// ];

// //networkCoverage
// export const networks = [
//   {
//     id: "STC",
//     item: "STC",
//   },
//   {
//     id: "Zain",
//     item: "Zain",
//   },
//   {
//     id: "Batelco",
//     item: "Batelco",
//   },
//   {
//     id: "Others",
//     item: "Others",
//   },
// ];

var { width, height } = Dimensions.get("window");

const PostProperty = ({ navigation, image, imageUri }) => {
  const showMenu = () => {
    navigation.toggleDrawer();
  };

  // FORM STATES
  const [name, setName] = useState("");
  const [type, setType] = useState({});
  const [amenity, setAmenity] = useState([]);
  const [network, setNetwork] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [area, setArea] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [bathRooms, setBathRooms] = useState(0);
  const [parking, setParking] = useState(false);
  const [property, setProperty] = useState("");
  const [uri, setUri] = useState([]);

  const [city, setCity] = useState("");
  const [amn, setAmn] = useState([]);

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  //amenities
  function removeA(item) {
    console.log(
      "1111111111111111111111111111111111111111111111111111111111111```````````"
    );
    const filteredAmenities = amenity.filter((amnty) => amnty !== item.item);
    const filteredAmn = amn.filter((amnty) => amnty.item !== item.item);
    console.log(
      "-------------------------",
      filteredAmn,
      filteredAmenities,
      "-----------------------------------------"
    );
    setAmenity(filteredAmenities);
    setAmn(filteredAmn);
  }

  function onMultiChangeA() {
    console.log("22222");
    return (item) => {
      for (let i = 0; i < amenity.length; i++) {
        if (amenity[i] === item.id) {
          removeA(item);
          return;
        }
      }
      console.log("Multi Change Item", item.item);
      setAmn([...amn, item]);
      setAmenity([...amenity, item.item]);
    };
  }
  console.log("Amenities--------------------", amenity);
  function removeSelectA() {
    return (item) => {
      const filteredAmn = amn.filter((amnty) => amnty.id !== item.id);
      const filteredAmenities = amenity.filter((amnty) => amnty !== item.id);
      console.log("Item", item, "Filtered Aminities", filteredAmenities);
      setAmn(filteredAmn);
      setAmenity(filteredAmenities);
    };
  }

  //networks
  function removeN(item) {
    const filteredNetworks = network.filter((net) => net.id !== item.id);
    setNetwork(filteredNetworks);
  }

  function onMultiChangeN() {
    return (item) => {
      for (let i = 0; i < network.length; i++) {
        if (network[i].id === item.id) {
          removeN(item);
          return;
        }
      }
      console.log("N multi", item);
      setNetwork([...network, item]);
    };
  }

  function removeSelectN() {
    return (item) => {
      const filteredNetworks = network.filter((net) => net.id !== item.id);
      setNetwork(filteredNetworks);
    };
  }

  function removeT(item) {
    const filteredType = type.filter((net) => net.id !== item.id);
    setType(filteredType);
  }

  function onMultiChangeT() {
    return (item) => {
      for (let i = 0; i < type.length; i++) {
        if (type[i].id === item.id) {
          removeT(item);
          return;
        }
      }
      console.log("T multi", item);
      setType([...type, item]);
    };
  }

  function removeSelectT() {
    return (item) => {
      const filteredType = type.filter((net) => net.id !== item.id);
      setType(filteredType);
    };
  }

  const onChange = () => {
    return (item) => {
      console.log("Type", item);
      setType(item);
    };
  };

  // const showDialog = () => {
  //   setVisible(true);
  // };

  const [location, setLocation] = useState({
    latitude: 34.0226741,
    longitude: 71.5877877,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  let route = useRoute();
  const { params } = route;

  console.log("Params============================", params);

  console.log("Uri???????????????????????????????????", uri);
  useEffect(() => {
    // (async () => {

    //   let { status } = await Location.requestPermissionsAsync();
    //   if (status !== "granted") {
    //     setErrorMsg("Permission to access location was denied");
    //     return;
    //   }

    //   let location = await Location.getCurrentPositionAsync({});
    //   setLocation(location.coords);
    //   console.log(location.coords);
    // })();
    console.log("-------------//////////////-------111112221");
    if (params?.photos) {
      setUri([]);
      console.log("-------------//////////////-------");

      //-----------------------------------
      params.photos.map((image) => {
        const imageData = new FormData();
        const newFile = {
          uri: image.uri,
          name: image.name,
          type: image.type,
        };
        imageData.append("file", newFile);
        imageData.append("cloud_name", "abikhan");
        imageData.append("upload_preset", "insta-clone");

        Axios.post(
          "https://api.cloudinary.com/v1_1/abikhan/image/upload",
          imageData
        )
          .then(async (res) => {
            console.log(
              "Response URI.....",
              res.data.url,
              "//////////////////////////////// uri array"
            );
            const responseURI = await res.data.url;
            console.log("Checking--------------------------", responseURI);
            // uri.push(responseURI);
            setUri((prev) => [...prev, responseURI]);
          })
          .catch((err) => console.log("Error---", err));
      });
    }
  }, [params?.photos]);
  const onChangeRoomsConter = (number, type) => {
    setRooms(number);
    console.log(number, type); // 1, + or -
  };
  const onChangeBathsConter = (number, type) => {
    setBathRooms(number);
    console.log(number, type); // 1, + or -
  };

  const onSubmit = async () => {
    const variable = {
      name,
      type,
      amenity,
      network,
      location,
      description,
      price: parseInt(price),
      rooms,
      bathRooms,
      property,
      uri,
      area: parseInt(area),
      city,
    };
    // console.log('Variable------------------------------------------', variable)
    // console.log('BaseUrl', baseURL)
    Axios.post(`${baseURL}/uploadProperty`, variable).then((res) => {
      console.log("--------------------------------------");
      console.log("Response", res.data);
      console.log("--------------------------------------");
    });
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
          <Text style={styles.heading}>Post a property</Text>
          <SwitchSelector
            initial={0}
            // onPress={value => this.setState({ gender: value })}
            textColor="#214151" //'#7a44cf'
            selectedColor="white"
            buttonColor="#214151"
            borderColor="#214151"
            hasPadding
            onPress={(value) => setProperty(value)}
            options={[
              { label: "Buy", value: "buy" }, //images.feminino = require('./path_to/assets/img/feminino.png')
              { label: "Rent", value: "rent" }, //images.masculino = require('./path_to/assets/img/masculino.png')
              { label: "Both", value: "buyAndRent" },
            ]}
            testID="gender-switch-selector"
            accessibilityLabel="gender-switch-selector"
          />
          <View style={{ paddingBottom: 10 }}></View>

          <SelectBox
            label="Property Type"
            options={items}
            onChange={onChange()}
            hideInputFilter={false}
            value={type}
            onMultiSelect={onMultiChangeT()}
            onTapClose={removeSelectT()}
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
          />
          <View style={{ paddingBottom: 10 }}></View>
          <Input
            label="Property Name"
            leftIcon={<Icon name="people" size={24} color="#f8dc81" />}
            onChangeText={(value) => setName(value)}
            value={name}
          />

          <Input
            label="Property Price"
            keyboardType={"numeric"}
            leftIcon={<MaterialIcon name="phone" size={24} color="#f8dc81" />}
            onChangeText={(value) => setPrice(value)}
            value={price}
          />
          <Input
            label="Area in Sqrt"
            keyboardType={"numeric"}
            leftIcon={<MaterialIcon name="phone" size={24} color="#f8dc81" />}
            onChangeText={(value) => setArea(value)}
            value={area}
          />

          {/* <Input
            label="Area (sqrt)"
            keyboardType={"numeric"}
            leftIcon={<MaterialIcon name="phone" size={24} color="#f8dc81" />}
            onChangeText={(value) => setArea(value)}
            value={area}
          /> */}

          <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
            <Text style={{ paddingBottom: 10 }}>Rooms</Text>
            <Counter
              start={1}
              onChange={onChangeRoomsConter}
              buttonStyle={{
                borderColor: "#214151",
                borderWidth: 2,
              }}
              buttonTextStyle={{
                color: "#214151",
              }}
              countTextStyle={{
                color: "#214151",
              }}
            />
          </View>

          <View
            style={{
              borderBottomColor: "#214151",
              borderBottomWidth: 1,
              marginHorizontal: 10,
            }}
          />
          <View style={{ paddingBottom: 10 }}></View>
          <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
            <Text style={{ paddingBottom: 10 }}>Bathrooms</Text>
            <Counter
              start={1}
              onChange={onChangeBathsConter}
              buttonStyle={{
                borderColor: "#214151",
                borderWidth: 2,
              }}
              buttonTextStyle={{
                color: "#214151",
              }}
              countTextStyle={{
                color: "#214151",
              }}
            />
          </View>

          <Input
            label="Description"
            leftIcon={<MaterialIcon name="email" size={24} color="#f8dc81" />}
            onChangeText={(value) => setDescription(value)}
            value={description}
            multiline={true}
            numberOfLines={5}
          />
          <SelectBox
            label="Amenities"
            options={amenities}
            selectedValues={amn}
            onMultiSelect={onMultiChangeA()}
            onTapClose={removeSelectA()}
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
            value={amn}
          />
          <View style={{ paddingBottom: 10 }}></View>

          <SelectBox
            label="Network Coverage"
            options={networks}
            selectedValues={network}
            onMultiSelect={onMultiChangeN()}
            onTapClose={removeSelectN()}
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
            value={network}
          />
          <View style={{ paddingBottom: 10 }}></View>
          <TextInput
            value={city}
            onChangeText={(val) => setCity(val)}
            placeholder="Enter City name"
            style={styles.textInput}
          />
          <View style={{ height: 150 }}>
            <MapView
              style={styles.maps}
              onPress={(e) => {
                setLocation(e.nativeEvent.coordinate),
                  console.log(e.nativeEvent);
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

          <View style={{ paddingBottom: 10 }}></View>
          <MainScreen />
          <View style={{ paddingBottom: 10 }}></View>

          <Button
            buttonStyle={styles.register}
            title="Register Agency"
            onPress={onSubmit}
          />
          {image ? (
            <Image
              style={{ height: 100, width: 100 }}
              source={{ uri: image[0]?.uri }}
            />
          ) : (
            <Text>No image available</Text>
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
const mapStateToProps = (state) => {
  console.log("State...........///--------", state);
  return {
    image: state.auth.images,
    imageUri: state.uri,
  };
};

export default connect(mapStateToProps, null)(PostProperty);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
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
  maps: {
    height: "100%",
  },
  textInput: {
    borderColor: "#A5A5A5",
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginVertical: 16,
  },
});
