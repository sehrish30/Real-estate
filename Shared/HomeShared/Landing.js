import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TextInput } from "react-native";

import PropertiesCards from "./PostProperties/PropertiesCards";

import Axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import SearchProperty from "./PostProperties/SearchProperty";

// import Navigation from "./Navigators/imageNavigation";

export default function Landing() {
  const [propertiesData, setPropertiesData] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const [status, setStatus] = useState("Loading....");

  useEffect(() => {
    console.log("Fetching222-------=========-");
    const keyword = route?.params?.title;

    Axios.get(`${baseURL}properties/allProperties`, {
      title: keyword,
    })
      .then((res) => {
        setPropertiesData(res.data),
          setStatus("No Data found"),
          console.error(res.data);
      })
      .catch((err) => setStatus("No Data Available"));
  }, []);

  console.log("Properties----", propertiesData);

  // const [loaded] = useFonts({
  //   "EBGaramond-Bold": require("./assets/fonts/EBGaramond-ExtraBold.ttf"),
  //   "EBGaramond-Regular": require("./assets/fonts/EBGaramond-Regular.ttf"),
  //   "EBGaramond-Italic": require("./assets/fonts/EBGaramond-Italic.ttf"),
  // });

  // if (!loaded) {
  //   return null;
  // }
  // return (
  //   <Provider store={store}>
  //     <NavigationContainer>
  //       {/* <DrawerNavigator /> */}
  //       <Main />
  //       <Toast ref={(ref) => Toast.setRef(ref)} />
  //     </NavigationContainer>
  //   </Provider>
  // );

  const changeText = (title) => {
    console.log("Title/////////////////////////", title);
    const keyword = route?.params?.title;
    Axios.get(`${baseURL}properties/searchProperty`, {
      title: title,
      type: keyword,
    }).then((res) =>
      console.log(
        "Response Data---",
        res.data.data,

        setPropertiesData(res.data.data)
      )
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SearchProperty")}
        style={{
          width: 80,
          backgroundColor: "#21534A",
          paddingVertical: 5,
          borderRadius: 4,
          margin: 8,
          marginLeft: "auto",
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>
          Filter
        </Text>
      </TouchableOpacity>
      <TextInput
        style={{
          backgroundColor: "#fff",
          paddingVertical: 8,
          paddingHorizontal: 6,
          borderRadius: 6,
          marginHorizontal: 12,
          marginVertical: 12,
        }}
        placeholder="Enter property name"
        onChangeText={(value) => changeText(value)}
      />
      {propertiesData.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          data={propertiesData}
          renderItem={({ item }) => <PropertiesCards item={item} />}
        />
      ) : (
        <Text
          style={{ textAlign: "center", fontSize: 24, marginTop: 155, flex: 1 }}
        >
          {status}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
