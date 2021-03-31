import React, { useLayoutEffect, useState, useRef, useEffect } from "react";

import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";

import { Button, AirbnbRating, Text } from "react-native-elements";

var { width } = Dimensions.get("screen");
const UserRateReview = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Rate Us",
    });
  }, [navigation]);

  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (rating) {
      Animated.spring(scrollY, {
        toValue: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [rating]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {!rating ? (
            <Text
              h4
              h4Style={{
                fontFamily: "EBGaramond-Bold",
                color: "#214151",
                fontSize: 18,
              }}
            >
              How much would you rate us?
            </Text>
          ) : null}
          {!rating ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "EBGaramond-Italic",
                  color: "#214151",
                  fontSize: 16,
                  letterSpacing: 1,
                }}
              >
                Tap on a star to rate us
              </Text>
            </View>
          ) : null}
        </View>
        <AirbnbRating
          count={5}
          reviews={[
            "Bad",
            "Hmm",
            "Good",
            "Very Good",
            "Amazing",
            "Hmm...",
            "Very Good",
            "Wow",
            "Amazing",
            "Unbelievable",
            "Jesus",
          ]}
          selectedColor="#fdb827"
          reviewSize={18}
          reviewColor="#fdb827"
          unSelectedColor="#839b97"
          defaultRating={0}
          size={30}
          showRating={true}
          onFinishRating={(text) => setRating(text)}
          starContainerStyle={{
            marginVertical: 10,
          }}
        />
      </>

      {rating ? (
        <Animated.View
          style={{
            transform: [
              {
                translateX: 0,
              },
              {
                translateY: scrollY,
              },
            ],
          }}
        >
          <View
            style={{
              marginTop: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              h4
              h4Style={{
                fontFamily: "EBGaramond-Bold",
                color: "#214151",
                fontSize: 16,
              }}
            >
              What would you like to share with us?
            </Text>
            <TextInput
              multiline
              numberOfLines={6}
              style={styles.input}
              onChangeText={(text) => setReview(text)}
              value={review}
            />
          </View>
          <Button
            containerStyle={{
              marginHorizontal: 15,
              marginTop: 20,
            }}
            buttonStyle={{
              backgroundColor: "#214151",
            }}
            titleStyle={{
              fontFamily: "EBGaramond-Bold",
            }}
            title="Send"
          />
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
};

export default UserRateReview;

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    width: width / 1.2,
    borderColor: "#214151",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#214151",
  },
});
