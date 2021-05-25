import React, { useState, useReducer, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";

import { useSelector } from "react-redux";
import { Overlay } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  UploadProperty,
  PropertiesNotifications,
} from "../../Services/PropertyServices";
import { Input, Button, Image } from "react-native-elements";
import { uploadToCloudinary } from "../../../Shared/services";
import SelectBox from "react-native-multi-selectbox";
import MapView from "react-native-maps";
import SwitchSelector from "react-native-switch-selector";
import Counter from "react-native-counters";
import { connect } from "react-redux";
import { networks } from "../../../Shared/Networks";
import { amenities } from "../../../Shared/amenities";
import { items } from "../../../Shared/Items";
import { items as cities } from "../../../Shared/Cities";
import CustomHeader from "../CustomHeader";
import Photos from "./ImageUpload/Photos";

var { width, height } = Dimensions.get("window");

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  selectedPhotos: [],
  errors: {},
};

const PropertiesInfo = ({ navigation, image, imageUri }) => {
  const token = useSelector((state) => state.auth.token);
  const agency = useSelector((state) => state.auth.agency);
  const showMenu = () => {
    navigation.toggleDrawer();
  };

  const [{ selectedPhotos, errors }, dipatchPhotos] = useReducer(
    reducer,
    initialState
  );
  // FORM STATES
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState({});
  const [amenity, setAmenity] = useState([]);
  const [network, setNetwork] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [area, setArea] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [bathRooms, setBathRooms] = useState(1);
  const [extra, setExtra] = useState(false);
  const [mineproperty, setMineProperty] = useState("Rent");
  const [uploadPhotos, setUploadPhotos] = useState(false);
  const [map, setMap] = useState(false);
  const [city, setCity] = useState("");
  const [videourl, setVideourl] = useState("");
  const [Imageurl, setImageurl] = useState("");
  const [amn, setAmn] = useState([]);
  const nameRef = useRef();
  const priceRef = useRef();
  const sizeRef = useRef();
  const cityRef = useRef();
  const descriptionRef = useRef();
  const videoRef = useRef();

  const toggleOverlay = () => {
    setUploadPhotos(true);
  };

  useEffect(() => {
    if (nameRef.current.isFocused() && name.length < 5) {
      dipatchPhotos({
        errors: { ...errors, name: "Name is required atleast 5 characters" },
      });
    } else if (name.length > 0) {
      delete errors.name;
    }

    if (priceRef.current.isFocused() && price.length == 0) {
      dipatchPhotos({
        errors: { ...errors, price: "Price is required" },
      });
    } else if (price.length > 0) {
      delete errors.price;
    }

    if (sizeRef.current.isFocused() && area.length == 0) {
      dipatchPhotos({
        errors: { ...errors, size: "Size is required" },
      });
    } else if (area.length > 0) {
      delete errors.size;
    }
    // if (cityRef.current.isFocused() && city.length == 0) {
    //   dipatchPhotos({
    //     errors: { ...errors, city: "City is required" },
    //   });
    // } else if (city.length > 0) {
    //   delete errors.city;
    // }
    if (descriptionRef.current.isFocused() && description.length <= 10) {
      dipatchPhotos({
        errors: {
          ...errors,
          description: "Description should be atleast 40 characters",
        },
      });
    } else if (description.length > 0) {
      delete errors.description;
    }

    if (
      videoRef.current.isFocused() &&
      !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
        videourl
      ) &&
      videourl.length > 1
    ) {
      dipatchPhotos({
        errors: {
          ...errors,
          video: "url format incorrect",
        },
      });
    } else {
      delete errors.video;
    }
  }, [name, price, area, description, videourl]);

  //amenities
  function removeA(item) {
    const filteredAmenities = amenity.filter((amnty) => amnty !== item.item);
    const filteredAmn = amn.filter((amnty) => amnty.item !== item.item);
    setAmenity(filteredAmenities);
    setAmn(filteredAmn);
  }

  function onMultiChangeA() {
    return (item) => {
      for (let i = 0; i < amenity.length; i++) {
        if (amenity[i] === item.id) {
          removeA(item);
          return;
        }
      }
      setAmn([...amn, item]);
      setAmenity([...amenity, item.item]);
    };
  }
  function removeSelectA() {
    return (item) => {
      const filteredAmn = amn.filter((amnty) => amnty.id !== item.id);
      const filteredAmenities = amenity.filter((amnty) => amnty !== item.id);

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

      setType([...type, item]);
    };
  }

  function onMultiChangeCities() {
    return (item) => {
      setCity(item);
    };
  }

  function removeSelectT() {
    return (item) => {
      const filteredType = type.filter((net) => net.id !== item.id);
      setType(filteredType);
    };
  }

  function removeSelectCities() {
    return (item) => {
      setCity("");
    };
  }

  const onChange = () => {
    return (item) => {
      setType(item);
    };
  };

  const onChangeCities = () => {
    return (item) => {
      setCity(item);
    };
  };

  const [location, setLocation] = useState({
    latitude: 26.121393020640035,
    longitude: 50.5632703633697,
  });

  const onChangeRoomsConter = (number, type) => {
    setRooms(number);
    console.log(number, type); // 1, + or -
  };
  const onChangeBathsConter = (number, type) => {
    setBathRooms(number);
    console.log(number, type); // 1, + or -
  };

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const onSubmit = async () => {
    setLoading(true);
    let sentPhotos = [];

    let done = null;

    for (let i = 0; i < selectedPhotos.length; i++) {
      let filename = selectedPhotos[i].uri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let newfile = {
        uri: selectedPhotos[i].uri,
        type: `test/${selectedPhotos[i].uri.split(".")[1]}`,
        name: filename,
      };
      let cloudphotos = [];
      cloudphotos.push({ newfile, uri: selectedPhotos[i].uri });
      // setCloud((prev) => [...prev, { newfile, uri }]);
      const promises = cloudphotos.map(async (cloudPhoto) => {
        const imageURL = await uploadToCloudinary(cloudPhoto.newfile);

        sentPhotos.push(imageURL);
      });
      done = await Promise.all(promises);
    }
    if (done) {
      const variable = {
        title: name,
        type,
        amenity,
        network,
        location,
        description,
        cost: parseInt(price),
        rooms,
        bathrooms: bathRooms,
        category: mineproperty,
        area: parseInt(area),
        city,
        images: sentPhotos,
        panorama_url: Imageurl,
        video_url: videourl,
        agency: agency.id,
      };

      const property = await UploadProperty(variable, token);

      await PropertiesNotifications(
        {
          location: city.item,
          propertyId: property._id,
        },
        token
      );
    }

    // console.log("BaseUrl", baseURL);
    // Axios.post(`${baseURL}/uploadProperty`, variable).then((res) => {
    //   console.log("--------------------------------------");
    //   console.log("Response", res.data);
    //   console.log("--------------------------------------");
    // });
    // navigation.navigate("Home");
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { marginTop: StatusBar.currentHeight || 0 }]}
    >
      <CustomHeader showMenu={showMenu} title={"Post a property"} />

      {/* <KeyboardAwareScrollView
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
      > */}
      {/* <ScrollView contentContainerStyle={styles.form}> */}
      {!extra ? (
        <>
          <SwitchSelector
            initial={0}
            // onPress={value => this.setState({ gender: value })}
            textColor="#214151" //'#7a44cf'
            selectedColor="white"
            buttonColor="#214151"
            borderColor="#214151"
            hasPadding
            onPress={(value) => {
              setMineProperty(value);
            }}
            options={[
              { label: "rent", value: "rent" },
              { label: "buy", value: "buy" }, //images.feminino = require('./path_to/assets/img/feminino.png')
              //images.masculino = require('./path_to/assets/img/masculino.png')
              { label: "Both", value: "buyAndRent" },
            ]}
            testID="gender-switch-selector"
            accessibilityLabel="gender-switch-selector"
          />

          <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
          >
            <View style={{ marginTop: 20 }}></View>
            <Input
              ref={nameRef}
              inputStyle={styles.inputStyle}
              label="Property Name"
              labelStyle={styles.fieldLabels}
              inputContainerStyle={[styles.inputContainer]}
              onChangeText={(value) => setName(value)}
              value={name}
              errorMessage={errors.name}
            />

            <Input
              ref={priceRef}
              keyboardType={"numeric"}
              inputStyle={styles.inputStyle}
              label="Property Cost"
              labelStyle={styles.fieldLabels}
              inputContainerStyle={styles.inputContainer}
              onChangeText={(value) => setPrice(value)}
              value={price}
              errorMessage={errors.price}
            />

            <Input
              ref={sizeRef}
              keyboardType={"numeric"}
              inputStyle={styles.inputStyle}
              label="Property size(sqft)"
              labelStyle={styles.fieldLabels}
              inputContainerStyle={styles.inputContainer}
              onChangeText={(value) => setArea(value)}
              value={area}
              errorMessage={errors.size}
            />

            <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
              <Text
                style={{
                  paddingBottom: 10,
                  color: "#839b97",
                  fontWeight: "bold",
                }}
              >
                Rooms
              </Text>
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
              <Text
                style={{
                  paddingBottom: 10,
                  color: "#839b97",
                  fontWeight: "bold",
                }}
              >
                Bathrooms
              </Text>
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
            {/* 
        <Input
          label="Description"
          onChangeText={(value) => setDescription(value)}
          value={description}
          multiline={true}
          numberOfLines={5}
        /> */}

            <Input
              ref={descriptionRef}
              inputStyle={styles.inputStyle}
              label="Description"
              labelStyle={styles.fieldLabels}
              inputContainerStyle={styles.inputContainer}
              onChangeText={(value) => setDescription(value)}
              value={description}
              multiline={true}
              numberOfLines={10}
              errorMessage={errors.description}
            />

            {/* <TextInput
          value={city}
          onChangeText={(val) => setCity(val)}
          placeholder="Enter City name"
          style={styles.textInput}
        /> */}
            {/* <Input
              ref={cityRef}
              inputStyle={styles.inputStyle}
              label="City"
              labelStyle={styles.fieldLabels}
              inputContainerStyle={styles.inputContainer}
              onChangeText={(val) => setCity(val)}
              value={city}
              errorMessage={errors.city}
            /> */}
            <Input
              ref={videoRef}
              inputStyle={styles.inputStyle}
              label="Video URL"
              labelStyle={styles.fieldLabels}
              inputContainerStyle={styles.inputContainer}
              onChangeText={(val) => setVideourl(val)}
              value={videourl}
              errorMessage={errors.video}
            />

            <Input
              inputStyle={styles.inputStyle}
              label="360 View URL"
              labelStyle={styles.fieldLabels}
              inputContainerStyle={styles.inputContainer}
              onChangeText={(val) => setImageurl(val)}
              value={Imageurl}
              // errorMessage={errors.email}
            />

            <View style={{ height: 150, flex: 1, position: "relative" }}>
              <MapView
                initialRegion={{
                  latitude: location?.latitude || 26.1112803858752,
                  longitude: location?.longitude || 50.548977414102204,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.maps}
              >
                <MapView.Marker
                  pinColor="aqua"
                  coordinate={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  }}
                  title={"title"}
                ></MapView.Marker>
              </MapView>
            </View>

            <Button
              buttonStyle={{
                borderColor: "#214151",
              }}
              containerStyle={{
                marginVertical: 20,
              }}
              titleStyle={{
                color: "#214151",
                fontFamily: "EBGaramond-Bold",
              }}
              title="Select Map Location"
              type="outline"
              onPress={() => {
                setMap(true);
              }}
            />
            <Button
              buttonStyle={{
                borderColor: "#214151",
              }}
              titleStyle={{
                color: "#214151",
                fontFamily: "EBGaramond-Bold",
              }}
              title="Upload Photos"
              type="outline"
              onPress={() => {
                setUploadPhotos(true);
              }}
            />

            {selectedPhotos.length > 0 ? (
              <View
                style={{ flexDirection: "row", width: width, flexWrap: "wrap" }}
              >
                {selectedPhotos.map((photo, i) => (
                  <Image
                    key={i}
                    style={{ paddingTop: 20 }}
                    onPress={() => {
                      let copy = selectedPhotos;
                      copy = selectedPhotos.filter(
                        (filterPhoto, index) => index !== i
                      );

                      dipatchPhotos({
                        selectedPhotos: copy,
                      });
                    }}
                    style={{ height: 100, width: 100 }}
                    source={{ uri: photo?.uri }}
                  />
                ))}
              </View>
            ) : (
              <Text style={{ color: "#214151", marginTop: 10 }}>
                No images chosen
              </Text>
            )}

            <Button
              disabled={
                selectedPhotos.length < 2 && Object.keys(errors).length === 0
              }
              buttonStyle={styles.register}
              titleStyle={{ fontFamily: "EBGaramond-Bold" }}
              title="Next"
              onPress={() => {
                setExtra(true);
              }}
            />
          </KeyboardAwareScrollView>
        </>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <SelectBox
            containerStyle={{
              marginBottom: 10,
            }}
            label="Property Type"
            selectedItemStyle={{
              color: "#214151",
            }}
            options={items}
            onChange={onChange()}
            hideInputFilter={false}
            value={type}
            onMultiSelect={onMultiChangeT()}
            labelStyle={{
              color: "#8dadb3",
            }}
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
          <SelectBox
            containerStyle={{
              marginBottom: 10,
            }}
            label="Area"
            selectedItemStyle={{
              color: "#214151",
            }}
            labelStyle={{
              color: "#8dadb3",
            }}
            options={cities}
            onChange={onChangeCities()}
            hideInputFilter={false}
            value={city}
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
              flexWrap: "wrap",
            }}
            optionContainerStyle={{
              flexWrap: "wrap",
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
          <View style={{ flexDirection: "row" }}>
            <Button
              type="clear"
              buttonStyle={{ marginTop: 30, marginBottom: 20 }}
              containerStyle={{ width: width / 2.5 }}
              titleStyle={{ fontFamily: "EBGaramond-Bold", color: "#214151" }}
              title="Previous"
              onPress={() => {
                setExtra(false);
              }}
            />
            <Button
              loading={loading}
              disabled={Object.keys(type).length == 0}
              buttonStyle={styles.register}
              containerStyle={{ width: width / 2.5 }}
              titleStyle={{ fontFamily: "EBGaramond-Bold" }}
              title="Post Property"
              onPress={() => {
                onSubmit();
              }}
            />
          </View>
        </View>
      )}

      <Overlay isVisible={uploadPhotos} onBackdropPress={toggleOverlay}>
        <Photos
          setUploadPhotos={setUploadPhotos}
          navigation={navigation}
          selectedPhotos={selectedPhotos}
          dipatchPhotos={dipatchPhotos}
        />
      </Overlay>
      <Overlay
        isVisible={map}
        onBackdropPress={() => {
          setMap(!map);
        }}
      >
        <View style={{ height: height / 1.5, width: width }}>
          <MapView
            initialRegion={{
              latitude: 26.1112803858752,
              longitude: 50.548977414102204,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.maps}
            onPress={(e) => {
              setLocation(e.nativeEvent.coordinate);
            }}
          >
            <MapView.Marker
              pinColor="aqua"
              coordinate={{
                latitude: location?.latitude,
                longitude: location?.longitude,
              }}
              title={"This location will be entered in the property"}
              // description={"description"}
            ></MapView.Marker>
          </MapView>
          <Button
            containerStyle={{
              width: width,
            }}
            buttonStyle={{
              backgroundColor: "#214151",
            }}
            titleStyle={{
              fontFamily: "EBGaramond-Bold",
            }}
            title="Select Location"
            // onPress={() => {
            //   setMap(false);
            //   setUploadPhotos(false);
            // }}
          />
        </View>
      </Overlay>
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

export default connect(mapStateToProps, null)(PropertiesInfo);

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
    marginBottom: 20,
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
  inputStyle: {
    color: "#214151",
  },
  fieldLabels: {
    color: "#839b97",
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#214151",
    paddingHorizontal: 5,
  },
});
