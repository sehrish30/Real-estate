import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import PropertiesCards from "../../Shared/HomeShared/PostProperties/PropertiesCards";
import { agentProperties } from "../../Shared/Services/AgencyServices";
import { useSelector } from "react-redux";
import Loading from "../../Shared/Loading";

const AgencyListings = ({ navigation: { goBack }, navigation, route }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let token = useSelector((state) => state.auth.token);
  let agency = useSelector((state) => state.auth.agency);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Agency Listings",
    });
    let agencyId;
    if (agency.id) {
      agencyId = agency.id;
    } else {
      agencyId = route.params?.agencyId;
    }
    (async () => {
      setData(await agentProperties(agencyId, token));
      setLoading(false);
    })();
    return () => {
      setLoading(true);
    };
  }, [navigation]);

  return data?.length > 0 ? (
    <FlatList
      style={{ flex: 1 }}
      data={data}
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
              color: "#214151",
              fontFamily: "EBGaramond-Bold",
              fontSize: 20,
            }}
          >
            No Properties yet
          </Text>
        </View>
      )}
    </>
  );
};

export default AgencyListings;

const styles = StyleSheet.create({});
