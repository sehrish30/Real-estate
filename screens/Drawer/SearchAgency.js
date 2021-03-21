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

const SearchAgency = ({ navigation }) => {
  const [search, setSearch] = useState(null);
  const [location, setLocation] = useState("");
  const searchField = useRef();
  const [agencies, setAgencies] = useState([]);
  const [debounceValue, setDebounceValue] = useState("");
  const [loading, setLoading] = useState(false);
  let timer;

  const useDebounce = (value, delay = 1000) => {
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
      <AgencyLocationSearch onChange={onChange} location={location} />

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
  font: {
    fontFamily: "EBGaramond-Regular",
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
