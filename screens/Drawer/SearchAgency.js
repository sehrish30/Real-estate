import React, {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StyleSheet, View, Image } from "react-native";
import { SearchBar } from "react-native-elements";
import { Card, ListItem, Button, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Fontisto";
import { Avatar } from "react-native-elements";
import SelectBox from "react-native-multi-selectbox";
import { useFocusEffect } from "@react-navigation/native";

import { items } from "../../Shared/Cities";
import { searchAgencies } from "../../Shared/Services/SearchServices";

const SearchAgency = ({ navigation }) => {
  const [search, setSearch] = useState(null);
  const [location, setLocation] = useState("");
  const searchField = useRef();
  const [agencies, setAgencies] = useState([]);
  const [debounceValue, setDebounceValue] = useState("");
  const [loading, setLoading] = useState(false);
  let timer;

  const useDebounce = (value, delay = 500) => {
    timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return debounceValue;
  };

  const searchTypedAgency = async (value) => {
    if (value?.length > 2 || location) {
      setLoading(true);
      const res = await searchAgencies(value, location.item);
      setAgencies(res);
      setLoading(false);
      console.log(res);
    }
  };

  useLayoutEffect(() => {
    searchTypedAgency(useDebounce(search));
    return () => {
      clearTimeout(timer);
    };
  }, [search, debounceValue, location]);

  const onChange = () => {
    return (val) => {
      setLocation(val);
    };
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
      headerTitle: "Search Agencies",
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      searchField.current.focus();
    }, [])
  );

  return (
    <SafeAreaView>
      <SearchBar
        ref={searchField}
        placeholder="Search Agencies..."
        onChangeText={(search) => setSearch(search)}
        value={search}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.searchbarInput}
        inputStyle={styles.input}
        placeholderTextColor="#eff7e1"
        leftIconContainerStyle={{ color: "#eff7e1" }}
        rightIconContainerStyle={{
          backgroundColor: "#8dadb3",
          color: "#eff7e1",
        }}
      />

      <View style={{ marginHorizontal: 15, marginTop: 5 }}>
        <SelectBox
          label="Select location"
          options={items}
          value={location}
          onChange={onChange()}
          hideInputFilter={false}
          arrowIconColor="#faeda5"
          searchIconColor="#8dadb3"
          style={[styles.font, { color: "#214151" }]}
          inputFilterContainerStyle={{
            backgroundColor: "#f8dc81",
          }}
          optionsLabelStyle={{
            color: "#214151",
            paddingLeft: 10,
            backgroundColor: "#faeda5",
          }}
          optionContainerStyle={{
            backgroundColor: "#faeda5",
          }}
          containerStyle={{
            backgroundColor: "#8dadb3",
            padding: 5,
          }}
          inputFilterStyle={{
            color: "#214151",
            fontFamily: "EBGaramond-Regular",
            fontSize: 16,
            paddingHorizontal: 5,
          }}
        />
      </View>
      {agencies.length > 0 ? (
        !loading ? (
          agencies.map((agency, index) => (
            <TouchableOpacity key={index}>
              <Card containerStyle={styles.card}>
                <Card.Title style={{ textAlign: "left" }}>
                  {agency.name}
                </Card.Title>
                <Card.Divider />
                <View style={styles.agency}>
                  <Avatar
                    style={{ width: 50, height: 50 }}
                    rounded
                    source={{
                      uri: agency.logo.url,
                    }}
                  />
                  <View style={styles.basicInfo}>
                    <Text h2 h2Style={styles.name}>
                      {agency.bio
                        ? `${agency.bio?.substring(0, 30)}...`
                        : "No bio"}
                    </Text>
                    <Text
                      style={[styles.name, { color: "#8dadb3", marginTop: 10 }]}
                    >
                      Rent 40 | Sale 50 | Commercial 60
                    </Text>
                  </View>
                  <View style={{ marginLeft: "auto", flexDirection: "row" }}>
                    <Text
                      style={[styles.font, { fontSize: 18, color: "#f8dc81" }]}
                    >
                      {agency.rating || 0}
                    </Text>
                    <Icon
                      // onPress={showMenu}

                      name="star"
                      color={"#f8dc81"}
                      size={18}
                    />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.notFound}>
            <ActivityIndicator size="large" color="#f8dc81" />
          </View>
        )
      ) : (
        debounceValue && (
          <View style={styles.notFound}>
            <Text h3 h3Style={styles.font}>
              No results found
            </Text>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default SearchAgency;
const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#8dadb3",
    color: "#eff7e1",
    borderColor: "transparent",
  },
  searchbarInput: {
    backgroundColor: "#8dadb3",
    borderColor: "transparent",
  },
  input: {
    color: "#eff7e1",
    fontFamily: "EBGaramond-Regular",
  },
  agency: {
    display: "flex",
    flexDirection: "row",
  },
  basicInfo: {
    paddingTop: 5,
    paddingHorizontal: 10,
    color: "#214151",
  },
  name: {
    fontFamily: "EBGaramond-Regular",
    fontSize: 14,
    fontWeight: "300",
  },
  font: {
    fontFamily: "EBGaramond-Regular",
  },
  notFound: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: "auto",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#c7ffd8",
  },
});
