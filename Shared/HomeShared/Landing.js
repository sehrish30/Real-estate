import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import PropertiesCards from "./PostProperties/PropertiesCards";
import Axios from "axios";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import { useRoute } from "@react-navigation/native";
import Loading from "../Loading";
import BadgesFilter from "./PostProperties/BadgesFilter";
import { set } from "date-fns";

// import Navigation from "./Navigators/imageNavigation";

export default function Landing({ category, setCategory }) {
  const [loading, setLoading] = useState(false);
  const [categoryChosen, setCategoryChosen] = useState(category);
  const [propertiesData, setPropertiesData] = useState([]);
  const [residential, setResidential] = useState(false);
  const [commercial, setCommercial] = useState(false);
  const [industrial, setIndutrial] = useState(false);
  const [land, setLand] = useState(false);

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
    setPage(0);

    if (categoryChosen === "Residential") {
      setCategoryChosen("");
    } else {
      setCategoryChosen("Residential");
    }
    setPropertiesData([]);
    call();
  };
  const handleCommercial = () => {
    setPage(0);
    setCommercial(!commercial);
    setResidential(false);
    setIndutrial(false);
    setLand(false);
    console.error(categoryChosen);
    if (categoryChosen === "Commercial") {
      setCategoryChosen("");
    } else {
      setCategoryChosen("Commercial");
    }

    setPropertiesData([]);
    call();
  };
  const handleIndustrial = () => {
    setPage(0);
    setIndutrial(!industrial);
    setResidential(false);
    setCommercial(false);
    setLand(false);
    if (categoryChosen === "Industrial") {
      setCategoryChosen("");
    } else {
      setCategoryChosen("Industrial");
    }

    setPropertiesData([]);
    call();
  };
  const handleLand = () => {
    setPage(0);
    setLand(!land);
    setResidential(false);
    setCommercial(false);
    setIndutrial(false);
    if (categoryChosen === "Lands") {
      setCategoryChosen("");
    } else {
      setCategoryChosen("Lands");
    }

    setPropertiesData([]);
    call();
  };

  useEffect(() => {
    if (category === "Residential") {
      setResidential(!residential);
      setCategory("");
    }
    if (category === "Commercial") {
      setCommercial(!commercial);
      setCategory("");
    }
    if (category === "Lands") {
      setLand(!land);
      setCategory("");
    }
    if (category === "Industrial") {
      setIndutrial(!industrial);
      setCategory("");
    }
    call();
  }, [page, categoryChosen]);

  const call = async () => {
    if (page === 0) {
      setLoading(true);
    }

    Axios.get(`${baseURL}properties/allProperties`, {
      params: {
        page: page,
        category: categoryChosen,
      },
    }).then((res) => {
      setLoading(false);
      // setCategory("");
      if (propertiesData.length > 0) {
        setPropertiesData((prev) => [...prev, ...res.data]);
      } else {
        setPropertiesData(res.data);
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
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
          ListFooterComponent={
            <>
              {propertiesData.length >= page && (
                <ActivityIndicator size="large" color="#f8dc81" />
              )}
            </>
          }
          ListFooterComponentStyle={{
            marginVertical: 10,
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
            setCategory("");
            call();
            wait(2000).then(() => {
              setRefreshing(false);
            });
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertiesCards item={item} />}
        />
      ) : (
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              {propertiesData.length === 0 && (
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
