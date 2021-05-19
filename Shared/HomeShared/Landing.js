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
import Loading from "../Loading";
import BadgesFilter from "./PostProperties/BadgesFilter";
import { set } from "date-fns";

// import Navigation from "./Navigators/imageNavigation";

export default function Landing() {
  const [loading, setLoading] = useState(false);
  const [categoryChosen, setCategoryChosen] = useState(null);
  const [propertiesData, setPropertiesData] = useState([]);
  const [residential, setResidential] = useState(false);
  const [commercial, setCommercial] = useState(false);
  const [industrial, setIndutrial] = useState(false);
  const [land, setLand] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const handleResidential = () => {
    setResidential(!residential);
    setCommercial(false);
    setIndutrial(false);
    setLand(false);
    setCategoryChosen("Residential");
    setPropertiesData([]);
    call();
  };
  const handleCommercial = () => {
    setCommercial(!commercial);
    setResidential(false);
    setIndutrial(false);
    setLand(false);
    setCategoryChosen("Commercial");
    setPropertiesData([]);
    call();
  };
  const handleIndustrial = () => {
    setIndutrial(!industrial);
    setResidential(false);
    setCommercial(false);
    setLand(false);
    setCategoryChosen("Industrial");
    setPropertiesData([]);
    call();
  };
  const handleLand = () => {
    setLand(!land);
    setResidential(false);
    setCommercial(false);
    setIndutrial(false);
    setCategoryChosen("Lands");
    setPropertiesData([]);
    call();
  };

  useEffect(() => {
    console.error("Fetching222-------=========-");
    const keyword = route?.params?.title;
    call();
  }, [page, categoryChosen]);
  const call = async () => {
    setLoading(true);
    Axios.get(`${baseURL}properties/allProperties`, {
      params: {
        page: page,
        category: categoryChosen,
      },
    }).then((res) => {
      setLoading(false);
      if (propertiesData.length > 0) {
        setPropertiesData((prev) => [...prev, ...res.data]);
      } else {
        setPropertiesData(res.data);
      }
    });
  };

  console.log("Properties----", propertiesData);

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
      {/* <TextInput
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
      /> */}
      <BadgesFilter
        residential={residential}
        commercial={commercial}
        industrial={industrial}
        land={land}
        handleCommercial={handleCommercial}
        handleIndustrial={handleIndustrial}
        handleResidential={handleResidential}
        handleLand={handleLand}
      />

      {propertiesData.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            setPage(page + 10);
          }}
          data={propertiesData}
          refreshing={refreshing}
          onRefresh={() => {
            setPropertiesData([]);
            setRefreshing(true);
            setPage(0);
            setLand(false);
            setResidential(false);
            setCommercial(false);
            setIndutrial(false);
            setCategoryChosen(null);
            call();
            console.error(page);

            wait(2000).then(() => {
              setRefreshing(false);
            });
          }}
          renderItem={({ item }) => <PropertiesCards item={item} />}
        />
      ) : (
        <>
          {loading ? (
            <Loading />
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
                  fontFamily: "EBGaramond-Bold",
                  color: "#214151",
                  fontSize: 20,
                }}
              >
                No Results found
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
