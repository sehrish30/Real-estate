import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const RecommendedProperties = ({
  item,
  images,
  type,
  agency,
  title,
  cost,
  category,
  city,
  id,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          console.error("ABHE RUK");
          navigation.push("PropertiesPosts", { id: id });
          //   navigation.navigate("Home");
          // navigation.navigate("Home", {
          //   screen: "PropertiesPosts",
          //   params: { item: item },
          // });
        }}
      >
        {images && images.length > 0 ? (
          <Image style={styles.image} source={{ uri: images[0] }} />
        ) : null}
        <View style={styles.card}>
          <View style={styles.details}>
            <View style={styles.superhost}>
              <Text style={styles.superhostLabel}>{type}</Text>
            </View>
            <View style={styles.rating}>
              <Icon name="star" color="#fdca40" />
              <Text style={styles.ratingLabel}>{agency.totalRating}</Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{}}>
              <Text style={[styles.title, { fontFamily: "EBGaramond-Bold" }]}>
                {title}
              </Text>
              <Text style={[styles.title, { fontSize: 15 }]}>
                {city || null}
              </Text>
              <Text style={[styles.title, { fontSize: 15, color: "#839b97" }]}>
                By {agency.name}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "#F0C948",
                    fontFamily: "EBGaramond-Bold",
                    fontSize: 20,
                  }}
                >
                  {cost}
                </Text>
                <Text
                  style={{
                    color: "#F0C948",
                    fontSize: 20,
                  }}
                >
                  {" "}
                  BD
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{ color: "white" }}>for</Text>
                <Text style={{ color: "white" }}> {category}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default RecommendedProperties;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    // alignItems: "center",
  },
  image: {
    height: 150,
    width: width - 32,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    // fontFamily: "EBGaramond-Regular",
    fontSize: 20,
    color: "white",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingLabel: {
    fontFamily: "EBGaramond-Bold",
    marginLeft: 4,
    color: "white",
  },
  superhost: {
    borderColor: "#F0C948",
    borderRadius: 30,
    borderWidth: 1,
    padding: 4,
    backgroundColor: "#F0C948",
  },
  superhostLabel: {
    fontSize: 10,
  },
  card: {
    backgroundColor: "#21534A",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
