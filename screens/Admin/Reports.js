import React, { useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { Avatar, Button, Badge } from "react-native-elements";
import { formatISO9075 } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { listAllReportedProperties } from "../../Shared/Services/PropertyServices";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

import {
  undoReport,
  deleteReportedProperty,
} from "../../Shared/Services/PropertyServices";

var { width, height } = Dimensions.get("screen");
const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  data: [],
};

const Item = ({
  description,
  type,
  createdAt,
  images,
  id,
  token,
  data,
  agency,
  numberOfReports,
  dispatchReportedProperties,
  navigation,
}) => {
  // REDUCERS

  return (
    <View>
      {/* Move to whole property view */}
      <View style={[styles.item, { flexDirection: "row" }]}>
        <View>
          <Avatar
            source={{
              uri:
                images[0] ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
            }}
          />
        </View>
        <View style={[styles.side, { width: width / 3 }]}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.title}>{description.substring(0, 80)}...</Text>
            <Badge value={numberOfReports} status="error" />
          </View>
          <Text style={{ color: "#214151", marginTop: 15 }}>
            <FontAwesome5
              name="building"
              size={15}
              color="#214151"
              style={{ marginRight: 5 }}
            />
            Property type: {type}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPressIn={() => {
                navigation.navigate("PropertiesPosts", {
                  id: id,
                });
              }}
              style={{ marginVertical: 10 }}
            >
              <Feather name="external-link" size={25} color="#214151" />
            </Pressable>
            <Text style={styles.date}>
              {formatISO9075(Date.parse(createdAt), {
                representation: "date",
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.btns}>
        <Button
          buttonStyle={{
            borderColor: "#214151",
          }}
          titleStyle={{ fontFamily: "EBGaramond-Bold", color: "#214151" }}
          title="Delete property"
          type="outline"
          onPress={() => {
            (async () => {
              const res = await deleteReportedProperty(
                { id, agencyId: agency, type },
                token
              );
              let newData = data.filter((property) => property.id !== id);
              console.log("NEW DATA", data);
              if (res) {
                dispatchReportedProperties({
                  data: newData,
                });
              }
            })();
          }}
        />
        <Button
          titleStyle={{ fontFamily: "EBGaramond-Bold" }}
          buttonStyle={styles.ignore}
          title="Ignore"
          onPress={() => {
            (async () => {
              const res = await undoReport({ id }, token);

              let newData = data.filter((property) => property.id !== id);
              console.error("NEW DATA", data);
              if (res) {
                dispatchReportedProperties({
                  data: newData,
                });
              }
            })();
          }}
        />
      </View>
    </View>
  );
};
const Reports = ({ navigation }) => {
  let token = useSelector((state) => state.auth.token);

  // REDUCERS
  const [{ data }, dispatchReportedProperties] = useReducer(
    reducer,
    initialState
  );

  const renderItem = ({ item }) => (
    <Item
      description={item.description}
      type={item.type}
      createdAt={item.createdAt}
      images={item.images}
      id={item.id}
      token={token}
      data={data}
      agency={item.agency}
      numberOfReports={item.noOfReports}
      dispatchReportedProperties={dispatchReportedProperties}
      navigation={navigation}
    />
  );

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const res = await listAllReportedProperties(token);
        dispatchReportedProperties({
          data: res,
        });
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
  },
  item: {
    borderRadius: 10,
    backgroundColor: "#e4fbff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    color: "#214151",
    fontFamily: "EBGaramond-Bold",
  },
  side: {
    marginLeft: 15,
    flexGrow: 1,
  },
  date: { color: "#839b97", marginLeft: "auto", fontSize: 12 },
  btns: { flexDirection: "row", justifyContent: "center" },
  ignore: {
    backgroundColor: "#214151",
    marginLeft: 15,
  },
});
