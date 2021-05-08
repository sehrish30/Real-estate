import React, { useLayoutEffect, useState, useRef, useEffect } from "react";

import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { Button, AirbnbRating, Text } from "react-native-elements";
import {
  checkUsersRate,
  rateService,
} from "../../Shared/Services/RateServices";

var { width } = Dimensions.get("screen");
const UserRateReview = ({ navigation, route, navigation: { goBack } }) => {
  const { id, userId } = route.params;
  let token = useSelector((state) => state.auth.token);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prevRate, setPrevRate] = useState(0);
  const [prevState, setPrevState] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Rate Us",
    });

    (async () => {
      const rate = checkUsersRate(id, userId, token);
      const [rateRes] = await Promise.all([rate]);

      if (rateRes) {
        setPrevState(true);
        rateRes.map((rating) => {
          rating.rating.map((rate) => {
            if (rate.user._id === userId) {
              setRating(rate.rate);
              setReview(rate.text);
            }
          });
        });
      }

      console.log(rateRes, reviewRes);
    })();
  }, [navigation]);

  const sendRateAndReview = async () => {
    if (review) {
      goBack();
      const res = await rateService(
        { id, userId, rate: rating, content: review },
        token
      );
      console.log("SEND INFO", res);

      setLoading(true);
      Toast.show({
        type: "success",
        text1: `Thank you for your review`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  };

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
          defaultRating={rating}
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
              placeholder={"Review..."}
            />
          </View>

          <Button
            disabled={!review}
            loading={loading}
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
            title={prevState ? "Edit Rating" : "Send Rating"}
            onPress={() => {
              sendRateAndReview();
            }}
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
