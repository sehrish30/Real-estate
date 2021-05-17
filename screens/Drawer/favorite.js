import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  AsyncStorage,
} from "react-native";
import Axios from "axios";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
// import { useNavigation } from "react-navigation-hooks";
// import { SharedElement } from "react-navigation-shared-element";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width } = Dimensions.get("window");

export default class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      list2: [{ id: 1 }, { id: 1 }, { id: 1 }],
    };
  }

  getData = async () => {
    console.log("HELLO");
    // axios.post("https://node.creativecodes.net/allProperties")
    // .then((response) => {
    //      console.log(response)
    // })
    fetch(`https://node.creativecodes.net/wishlist/6028e1a705ec7b1424dbf2ea`)
      .then((response) => response.json())
      .then((responsejson) => {
        console.log(responsejson.wishlist);
        this.setState({
          list: responsejson.wishlist,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getData();
  }

  nav = async (ID) => {
    console.log(ID);
    await AsyncStorage.setItem("property", ID);
    this.props.navigation.navigate("PropertiesPosts");
  };

  renderDayRow = ({ item }) => {
    // console.log('ID: '+ item.property.id)
    return (
      <TouchableWithoutFeedback
        style={{ marginTop: 25 }}
        onPress={() => this.nav(item.property.id)}
      >
        <Image
          style={styles.image}
          source={{
            uri: "https://th.bing.com/th/id/Re2a4a7e212cacbf317c408356179ae84?rik=rBl5XPQzQ1xusA&riu=http%3a%2f%2fwww.e-architect.co.uk%2fimages%2fjpgs%2fsouth_africa%2fhouse-mosi-n120413-15.jpg",
          }}
        />
        <View style={styles.card}>
          <View style={styles.details}>
            <View style={styles.superhost}>
              <Text style={styles.superhostLabel}>{item.property.type}</Text>
            </View>
            <View style={styles.rating}>
              <Icon name="star" color="rgb(255, 56, 92)" />
              <Text style={styles.ratingLabel}>4.6 (rating)</Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{}}>
              <Text style={[styles.title, { fontWeight: "bold" }]}>
                {item.property.title}
              </Text>
              <Text style={[styles.title, { fontSize: 15 }]}>
                {item.property.description}
              </Text>
              <Text style={[styles.title, { fontSize: 15 }]}>
                Rooms: {item.property.rooms}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ color: "#F0C948", fontWeight: "bold", fontSize: 20 }}
                >
                  {item.property.cost}
                </Text>
                <Text style={{ color: "#F0C948", fontSize: 20 }}> BHD</Text>
              </View>

              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{ color: "white" }}>for </Text>
                <Text style={{ color: "white" }}>{item.property.category}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <FlatList
            pagingEnabled
            data={this.state.list}
            renderItem={this.renderDayRow}
            keyExtractor={(item) => item.id}
          />

          {/* 
                    <TouchableWithoutFeedback
                        style={{ marginTop: 25 }}
                        onPress={() => this.props.navigation.navigate('PropertiesPosts')}
                    >
                        <Image
                            style={styles.image}
                            source={{ uri: 'https://th.bing.com/th/id/Re86b4a25d378003cd5decb63fc1d9f6d?rik=bwtHH3SpDhVxIw&riu=http%3a%2f%2f1.bp.blogspot.com%2f-ipy06jJr7lM%2fUcBy_kDc62I%2fAAAAAAAAT5U%2fcWBJGKpSq-Q%2fs1600%2fBeautiful_Modern_House_In_Desert_on_world_of_architecture_10.jpg' }}
                        />
                        <View style={styles.card}>
                            <View style={styles.details}>
                                <View style={styles.superhost}>
                                    <Text style={styles.superhostLabel}>House</Text>
                                </View>
                                <View style={styles.rating}>
                                    <Icon name="star" color="rgb(255, 56, 92)" />
                                    <Text style={styles.ratingLabel}>
                                        4.6 (rating)
                  </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{}}>
                                    <Text style={[styles.title, { fontWeight: 'bold' }]}>Demo</Text>
                                    <Text style={[styles.title, { fontSize: 15 }]}>Location</Text>
                                    <Text style={[styles.title, { fontSize: 15 }]}>Agent Name</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#F0C948', fontWeight: 'bold', fontSize: 20 }}>1000</Text>
                                        <Text style={{ color: '#F0C948', fontSize: 20 }}> BHD</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Text style={{ color: 'white' }}>for</Text>
                                        <Text style={{ color: 'white' }}>House</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback

                        style={{ marginTop: 25 }}
                        onPress={() => this.props.navigation.navigate('PropertiesPosts')}
                    >
                        <Image
                            style={styles.image}
                            source={{ uri: 'https://www.soprovich.com/i-a86d0f95/real-estate/2075_57339.luxury-lg.default.jpg' }}
                        />
                        <View style={styles.card}>
                            <View style={styles.details}>
                                <View style={styles.superhost}>
                                    <Text style={styles.superhostLabel}>House</Text>
                                </View>
                                <View style={styles.rating}>
                                    <Icon name="star" color="rgb(255, 56, 92)" />
                                    <Text style={styles.ratingLabel}>
                                        4.6 (rating)
                  </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{}}>
                                    <Text style={[styles.title, { fontWeight: 'bold' }]}>Demo</Text>
                                    <Text style={[styles.title, { fontSize: 15 }]}>Location</Text>
                                    <Text style={[styles.title, { fontSize: 15 }]}>Agent Name</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#F0C948', fontWeight: 'bold', fontSize: 20 }}>1000</Text>
                                        <Text style={{ color: '#F0C948', fontSize: 20 }}> BHD</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Text style={{ color: 'white' }}>for</Text>
                                        <Text style={{ color: 'white' }}>House</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  image: {
    height: 150,
    width: width - 20,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontFamily: "EBGaramond-Regular",
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
    fontFamily: "EBGaramond-Regular",
  },
  card: {
    backgroundColor: "#21534A",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
