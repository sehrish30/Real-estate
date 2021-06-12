import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { View, StyleSheet, SafeAreaView, Text, Platform } from "react-native";
import { Tile } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

var { width, height } = Dimensions.get("screen");
const HomeMenu = ({ setCategory }) => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Tile
        imageSrc={require("../../assets/images/homeMenu.jpg")}
        title="Which property are you looking for?"
        contentContainerStyle={{
          height: "100%",
          backgroundColor: "#214151",
          alignSelf: "stretch",
          flex: 0.5,
        }}
        titleStyle={styles.title}
        containerStyle={{ height: height / 4 }}
      ></Tile>
      <View
        style={{
          marginTop: 40,
        }}
      >
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => {
              console.error("COMMER");
              setCategory("Residential");
            }}
          >
            <View style={styles.categoryIcon}>
              <Image
                source={require("../../assets/icons/house.png")}
                style={styles.categoryImg}
              ></Image>
            </View>
            <Text style={styles.categoryTitle}>Residential</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() =>
              // navigation.navigate("Home", { title: "Commercial" })
              {
                console.error("COMMER");
                setCategory("Commercial");
              }
            }
          >
            <View style={styles.categoryIcon}>
              <Image
                source={require("../../assets/icons/store.png")}
                style={styles.categoryImg}
              ></Image>
            </View>
            <Text style={styles.categoryTitle}>Commercial</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => {
              // navigation.navigate("Home", { title: "" })
              console.error("All");
              setCategory("");
            }}
          >
            <View style={styles.categoryIcon}>
              <Image
                source={require("../../assets/icons/real-estate.png")}
                style={styles.categoryImg}
              ></Image>
            </View>
            <Text style={styles.categoryTitle}>All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() =>
              // navigation.navigate("Home", { title: "Industrial" })
              {
                console.error("Industry");
                setCategory("Industrial");
              }
            }
          >
            <View style={styles.categoryIcon}>
              <Image
                source={require("../../assets/icons/industry.png")}
                style={styles.categoryImg}
              ></Image>
            </View>
            <Text style={styles.categoryTitle}>Industrial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => {
              console.error("Lands");
              setCategory("Lands");
            }}
          >
            <View style={styles.categoryIcon}>
              <Image
                source={require("../../assets/icons/region.png")}
                style={styles.categoryImg}
              ></Image>
            </View>
            <Text style={styles.categoryTitle}>Lands</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SearchAgency");
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                alignItems: "center",
                textDecorationLine: "underline",
              }}
            >
              Looking for a property seller?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default HomeMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#214151",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "50%",
    height: "100%",
    resizeMode: "center",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 30,
    alignItems: "center",
    color: "#e4fbff",
    height: 90,
    fontFamily: "EBGaramond-Bold",
  },
  categoryContainer: {
    // marginBottom: 5,
    alignSelf: "center",
    flexDirection: Platform.OS === "android" ? "row-reverse" : "row",
    height: 110,
  },

  categoryBtn: {
    flex: 1,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 4,
    backgroundColor: "#F0C948",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  categoryIcon: {
    width: 45,
    height: 45,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  categoryImg: {
    width: 30,
    height: 30,
  },
  categoryTitle: {
    // marginTop: 10,
    color: "#21534A",
    textAlign: "center",
    fontWeight: "bold",
  },
});
