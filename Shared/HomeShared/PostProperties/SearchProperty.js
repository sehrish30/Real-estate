import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Input,
  Button,
  BottomSheet,
  ListItem,
  Badge,
} from "react-native-elements";
import PropertyType from "../../Modals/PropertyType";
import SwitchSelector from "react-native-switch-selector";
import SelectBox from "react-native-multi-selectbox";
import { filterProperty } from "../../Services/PropertyServices";

import { useNavigation } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";
import Options from "../../Modals/Options";
import Amenities from "../../Modals/Amenities";
import { items as cities } from "../../Cities";
import { items } from "../../Items";
import { amenities } from "../../amenities";

var { width, height } = Dimensions.get("window");
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// import { amenities } from "../../amenities";
// import { items } from "../../Items";
// import { cities } from "../../Cities";

const SearchProperty = () => {
  const showMenu = () => {
    navigation.toggleDrawer();
  };

  const onChange = () => {
    return (item) => {
      setType(item);
    };
  };

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
  //aminities
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
      console.log("Item", item, "Filtered Aminities", filteredAmenities);
      setAmn(filteredAmn);
      setAmenity(filteredAmenities);
    };
  }

  //cities
  function removeC(item) {
    const filteredCities = locations.filter((city) => city.id !== item.id);
    setLocations(filteredCities);
  }

  function onMultiChangeC() {
    return (item) => {
      for (let i = 0; i < locations.length; i++) {
        if (locations[i].id === item.id) {
          removeC(item);
          return;
        }
      }
      setLocations([...locations, item]);
    };
  }

  function removeSelectC() {
    return (item) => {
      const filteredCities = locations.filter((city) => city.id !== item.id);
      setLocations(filteredCities);
    };
  }

  //keywords
  function removeK(item) {
    const filteredKeywords = keyword.filter((key) => key.id !== item.id);
    setKeyword(filteredKeywords);
  }

  function onMultiChangeK() {
    return (item) => {
      for (let i = 0; i < keyword.length; i++) {
        if (keyword[i].id === item.id) {
          removeK(item);
          return;
        }
      }
      console.log("Multi Change Item", item);
      setKeyword([...keyword, item]);
    };
  }

  function removeSelectK() {
    return (item) => {
      const filteredKeywords = keyword.filter((key) => key.id !== item.id);
      setKeyword(filteredKeywords);
    };
  }

  // FORM STATES
  const [loading, setLoading] = useState(false);
  const [switchInitial, setSwitchInitial] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAmenity, setModalAmenity] = useState(false);
  const [modalProperty, setModalProperty] = useState(false);
  const [keyword, setKeyword] = useState([]);
  const [type, setType] = useState("");
  const [amenity, setAmenity] = useState([]);
  const [property, setProperty] = useState("");
  const [locations, setLocations] = useState([]);
  const [priceMinimum, setPriceMinimum] = useState(null);
  const [areaMinimum, setAreaMinimum] = useState(null);
  const [priceMaximum, setPriceMaximum] = useState(null);
  const [areaMaximum, setAreaMaximum] = useState(null);
  const [city, setCity] = useState("");
  const [amn, setAmn] = useState([]);
  const navigation = useNavigation();
  const onSearch = async () => {
    setLoading(true);
    let filterLocations = [];
    locations.map((location) => {
      filterLocations.push(location.item);
    });
    const data = {
      priceMinimum: parseInt(priceMinimum),
      priceMaximum: parseInt(priceMaximum),
      areaMaximum: parseInt(areaMaximum),
      areaMinimum: parseInt(areaMinimum),
      type: type?.item,
      property,
      city: filterLocations,
      amenity,
    };

    const response = await filterProperty(data);

    navigation.navigate("FilterData", { filterData: response });
    setLoading(false);
    // Axios.post("https://1df05c8e9ef4.ngrok.io/filterProperty", data).then(
    //   (res) => {
    //     console.log("Response Data filter----------", res.data.data);
    //     navigation.navigate("FilterData", { filterData: res.data.data });
    //   }
    // );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Customized property search",
      headerRight: () => (
        <Pressable
          onPressIn={() => {
            setType("");
            setAmenity([]);
            setProperty("");
            setLocations([]);
            setPriceMinimum(null);
            setAreaMinimum(null);
            setPriceMaximum(null);
            setAreaMaximum(null);
            setCity("");
            setAmn([]);
            setLoading(false);
            setSwitchInitial(0);
          }}
        >
          <Text
            style={{
              textAlign: "right",
              color: "#214151",
              fontFamily: "EBGaramond-Regular",
              textDecorationLine: "underline",
              marginRight: 10,
            }}
          >
            Clear All
          </Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  console.log(
    locations,
    priceMaximum,
    priceMinimum,
    areaMinimum,
    areaMaximum,
    property,
    type
  );
  return (
    <ScrollView>
      <View style={styles.container}>
        <SwitchSelector
          initial={switchInitial}
          textColor="#214151" //'#7a44cf'
          selectedColor="white"
          buttonColor="#214151"
          borderColor="#214151"
          hasPadding
          onPress={(value) => setProperty(value)}
          options={[
            { label: "any", value: "" },
            { label: "rent", value: "rent" },
            { label: "buy", value: "buy" }, //images.feminino = require('./path_to/assets/img/feminino.png')
            //images.masculino = require('./path_to/assets/img/masculino.png')
          ]}
          testID="gender-switch-selector"
          accessibilityLabel="gender-switch-selector"
        />
        <Input
          containerStyle={{ marginTop: 10 }}
          inputStyle={styles.inputStyle}
          label="City name"
          labelStyle={styles.fieldLabels}
          inputContainerStyle={styles.inputContainer}
          onChangeText={(val) => setCity(val)}
          value={city}
        />
        {/* <View style={styles.divider} /> */}
        <Text style={[styles.bio, { marginLeft: 10 }]}>Area Range (sqrt)</Text>
        <View
          style={{
            padding: 12,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              keyboardType="numeric"
              style={styles.textInput}
              onChangeText={(val) => setAreaMinimum(val)}
              placeholder="Enter Area Min"
              value={areaMinimum}
            />
            <Text style={{ color: "#214151" }}>-</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.textInput}
              onChangeText={(val) => setAreaMaximum(val)}
              placeholder="Enter Area Max"
              value={areaMaximum}
            />
          </View>
        </View>
        <Text style={[styles.bio, { marginLeft: 10 }]}>Price Range (BD)</Text>
        <View
          style={{
            padding: 12,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              keyboardType="numeric"
              style={styles.textInput}
              onChangeText={(val) => setPriceMinimum(val)}
              placeholder="Enter Price Min"
              value={priceMinimum}
            />
            <Text style={{ color: "#214151" }}>-</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.textInput}
              onChangeText={(val) => setPriceMaximum(val)}
              placeholder="Enter Price Max"
              value={priceMaximum}
            />
          </View>
        </View>

        {/* LOCATION */}
        <Input
          placeholder="Tap to edit"
          containerStyle={{ marginTop: 10 }}
          inputStyle={styles.inputStyle}
          label="Location"
          labelStyle={styles.fieldLabels}
          inputContainerStyle={styles.inputContainer}
          // onChangeText={(val) => setCity(val)}
          onPress={() => setModalVisible(true)}
        />
        <View
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}
        >
          {locations.map((location) => (
            <Badge
              value={location.item}
              badgeStyle={{
                backgroundColor: "#214151",
                padding: 5,
              }}
            />
          ))}
        </View>
        {/* Property Type */}
        <Input
          placeholder="Tap to edit"
          containerStyle={{ marginTop: 10 }}
          inputStyle={styles.inputStyle}
          label="Amenities"
          labelStyle={styles.fieldLabels}
          inputContainerStyle={styles.inputContainer}
          // onChangeText={(val) => setCity(val)}
          onPress={() => setModalAmenity(true)}
        />
        <View
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}
        >
          {amn.map((amenity) => (
            <Badge
              value={amenity.item}
              badgeStyle={{
                backgroundColor: "#214151",
                padding: 5,
              }}
            />
          ))}
        </View>
        <Input
          placeholder="Tap to edit"
          containerStyle={{ marginTop: 10 }}
          inputStyle={styles.inputStyle}
          label="Property type"
          labelStyle={styles.fieldLabels}
          inputContainerStyle={styles.inputContainer}
          // onChangeText={(val) => setCity(val)}
          onPress={() => setModalProperty(true)}
          value={type.item}
        />
        <View
          style={{
            justifyContent: "flex-end",
            width: width / 1.1,
            margin: 0,
          }}
        >
          <Pressable
            onPressIn={() => {
              setType("");
            }}
          >
            <Text style={{ textAlign: "right", color: "#214151" }}>
              Clear Property
            </Text>
          </Pressable>
        </View>
        <Button
          loading={loading}
          titleStyle={{
            fontFamily: "EBGaramond-Bold",
          }}
          buttonStyle={[
            styles.register,
            {
              marginBottom: 20,
            },
          ]}
          title="Search Property"
          onPress={onSearch}
        />
        <Options
          label="Location"
          options={cities}
          values={locations}
          action={onMultiChangeC}
          close={removeSelectC}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
        />
        <Amenities
          label="Amenities"
          options={amenities}
          values={amn}
          action={onMultiChangeA}
          close={removeSelectA}
          setModalVisible={setModalAmenity}
          modalVisible={modalAmenity}
        />
        <PropertyType
          modalVisible={modalProperty}
          setModalVisible={setModalProperty}
          items={items}
          action={onChange}
          type={type}
          onTapClose={removeSelectT}
        />
      </View>
    </ScrollView>
  );
};

export default SearchProperty;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 15,
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
  bio: {
    color: "#839b97",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  textInput: {
    borderRadius: 10,
    borderColor: "#21415154",
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
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
