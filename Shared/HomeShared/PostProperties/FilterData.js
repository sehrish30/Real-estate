import React, { useState, useEffect, useLayoutEffect } from "react";
import { FlatList, View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import PropertiesCards from "./PropertiesCards";

export default function FilterData({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Search Results",
    });
  }, [navigation]);

  const route = useRoute();
  console.error("PARAMS", route.params);
  const [propertiesData, setPropertiesData] = useState([]);
  useEffect(() => {
    const paramsData = route.params?.filterData;
    console.error("Params Data", paramsData.data);
    setPropertiesData(paramsData.data);
  }, [route.params?.filterData.data]);
  return propertiesData?.length > 0 ? (
    <FlatList
      style={{ flex: 1 }}
      data={propertiesData}
      renderItem={({ item }) => <PropertiesCards item={item} />}
    />
  ) : (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Text
        style={{
          color: "#214151",
          fontFamily: "EBGaramond-Bold",
        }}
      >
        No Property found
      </Text>
    </View>
  );
}
