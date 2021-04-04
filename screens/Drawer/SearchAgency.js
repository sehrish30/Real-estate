import React, {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { StyleSheet, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { Text } from "react-native-elements";

import { useFocusEffect } from "@react-navigation/native";

import { searchAgencies } from "../../Shared/Services/SearchServices";
import AgencyLocationSearch from "../../Shared/ProfileCard/AgencyLocationSearch";
import AgencySearchCard from "../../Shared/ProfileCard/AgencySearchCard";
import { ScrollView } from "react-native-gesture-handler";

const SearchAgency = ({ navigation }) => {
  const [search, setSearch] = useState(null);
  const [location, setLocation] = useState("");
  const searchField = useRef();
  const [agencies, setAgencies] = useState([]);
  const [debounceValue, setDebounceValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [highRating, setHighRating] = useState("");
  const [lowRating, setLowRating] = useState("");
  const [popular, setPopular] = useState("");

  let timer;

  const useDebounce = (value, delay = 1000) => {
    timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return debounceValue;
  };

  const searchTypedAgency = async (value) => {
    if (value?.length > 0 || location) {
      setLoading(true);
      const res = await searchAgencies(value, location.item);

      setAgencies(res);
      setLoading(false);
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
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Search Agencies",
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      searchField.current.focus();
      return () => {
        setSearch("");
      };
    }, [])
  );

  return (
    <ScrollView>
      <SearchBar
        ref={searchField}
        placeholder="Search Agencies..."
        onChangeText={(search) => setSearch(search)}
        value={search}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.searchbarInput}
        inputStyle={styles.input}
        placeholderTextColor="#839b97"
        leftIconContainerStyle={{ color: "#eff7e1" }}
        rightIconContainerStyle={{
          backgroundColor: "#fff",
        }}
      />
      <AgencyLocationSearch
        setLocation={setLocation}
        onChange={onChange}
        location={location}
      />

      {agencies?.length > 0 ? (
        !loading ? (
          agencies.map((agency, index) => (
            <AgencySearchCard
              navigation={navigation}
              key={agency.id}
              index={index}
              agency={agency}
            />
          ))
        ) : (
          <View style={styles.notFound}>
            <ActivityIndicator size="large" color="#f8dc81" />
          </View>
        )
      ) : debounceValue || location ? (
        <View style={styles.notFound}>
          <Text h3 h3Style={styles.font}>
            No results found
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default SearchAgency;
const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#fff",
    borderWidth: 0,
    borderColor: "transparent",
    paddingVertical: 0,
  },
  searchbarInput: {
    backgroundColor: "#fff",
    borderColor: "transparent",
  },
  input: {
    color: "#214151",
    fontSize: 16,
    // fontFamily: "EBGaramond-Regular",
  },
  font: {
    // fontFamily: "EBGaramond-Regular",
  },
  notFound: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: "auto",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
