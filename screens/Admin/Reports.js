import React, { useReducer } from "react";
import { StyleSheet, Text, View, FlatList, StatusBar } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { formatISO9075 } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { listAllReportedProperties } from "../../Shared/Services/PropertyServices";
import {
  undoReport,
  deleteReportedProperty,
} from "../../Shared/Services/PropertyServices";

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
  dispatchReportedProperties,
}) => {
  // REDUCERS

  return (
    <View>
      {/* ZAHRA */}
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
        <View style={[styles.side]}>
          <Text style={styles.title}>{description}</Text>
          <Text style={{ color: "#214151" }}>{type}</Text>
          <Text style={styles.date}>
            {formatISO9075(Date.parse(createdAt), {
              representation: "date",
            })}
          </Text>
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
const Reports = () => {
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
      dispatchReportedProperties={dispatchReportedProperties}
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
    paddingTop: StatusBar.currentHeight || 0,
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
