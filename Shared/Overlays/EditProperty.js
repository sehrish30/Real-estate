import React, { useRef, useEffect, useReducer, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { Input, Button, Overlay, Text } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { updateProperty } from "../../Shared/Services/PropertyServices";
var { width, height } = Dimensions.get("window");
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
const initialstate = {
  editerrors: {},
};
const editReducer = (state, newState) => ({ ...state, ...newState });

const EditProperty = ({
  id,
  sentname,
  sentvideo,
  sentimage,
  sentdescription,
  sentprice,
  visible,
  setVisible,
  navigation,
  setList,
  descriptionEditRef,
  nameEditRef,
  priceEditRef,
  videoEditRef,
}) => {
  const [{ editerrors }, dispatchEdit] = useReducer(editReducer, initialstate);
  //   const descriptionEditRef = useRef();
  //   const nameEditRef = useRef();
  //   const priceEditRef = useRef();
  //   const videoEditRef = useRef();
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState(sentname);
  const [videourl, setVideourl] = useState(sentvideo);
  const [Imageurl, setImageurl] = useState(sentimage);
  const [description, setDescription] = useState(sentdescription);
  const [price, setPrice] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    navigation.goBack();
    await updateProperty(
      {
        property_id: id,
        name,
        price,
        description,
        video_url: videourl,
      },
      token
    );
    setLoading(false);
  };
  useEffect(() => {
    if (nameEditRef.current) {
      if (nameEditRef?.current.isFocused() && name?.length < 5) {
        dispatchEdit({
          editerrors: {
            ...editerrors,
            name: "Name is required atleast 5 characters",
          },
        });
      } else if (name.length > 0) {
        delete editerrors.name;
      }
    }
    if (priceEditRef.current) {
      if (priceEditRef.current.isFocused() && price?.length == 0) {
        dispatchEdit({
          editerrors: { ...editerrors, price: "Price is required" },
        });
      } else if (price?.length > 0) {
        delete editerrors.price;
      }
    }
    if (descriptionEditRef.current) {
      if (descriptionEditRef.current.isFocused() && description?.length <= 10) {
        dispatchEdit({
          editerrors: {
            ...editerrors,
            description: "Description should be atleast 40 characters",
          },
        });
      } else if (description.length > 0) {
        delete editerrors.description;
      }
    }
    if (videoEditRef.current) {
      if (
        videoEditRef?.current.isFocused() &&
        !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
          videourl
        ) &&
        videourl.length > 1
      ) {
        dispatchEdit({
          editerrors: {
            ...editerrors,
            video: "url format incorrect",
          },
        });
      } else {
        delete editerrors.video;
      }
    }
    return () => {
      //   setName(sentname);
      //   setVideourl(sentvideo);
      //   setImageurl(sentimage);
      //   setDescription(sentdescription);
    };
  }, [name, price, description, videourl]);

  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={visible}
      onBackdropPress={() => {
        setVisible(!visible);
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            fontSize: 20,
            alignItems: "center",
            textAlign: "center",
            width: width,
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          Edit Property
        </Text>
        <KeyboardAwareScrollView
          viewIsInsideTabBar={true}
          extraHeight={200}
          enableOnAndroid={true}
        >
          <Input
            ref={nameEditRef}
            inputStyle={styles.inputStyle}
            label="Property Title"
            labelStyle={styles.fieldLabels}
            inputContainerStyle={[styles.inputContainer]}
            onChangeText={(value) => setName(value)}
            value={name}
            errorMessage={editerrors.name}
          />
          <Input
            ref={priceEditRef}
            keyboardType={"numeric"}
            inputStyle={styles.inputStyle}
            label="Property Cost"
            labelStyle={styles.fieldLabels}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(value) => {
              setPrice(value);
            }}
            value={price}
            errorMessage={editerrors.price}
          />

          <Input
            ref={descriptionEditRef}
            inputStyle={styles.inputStyle}
            label="Description"
            labelStyle={styles.fieldLabels}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(value) => setDescription(value)}
            value={description}
            multiline={true}
            numberOfLines={10}
            errorMessage={editerrors.description}
          />
          <Input
            ref={videoEditRef}
            inputStyle={styles.inputStyle}
            label="Video URL"
            labelStyle={styles.fieldLabels}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(val) => setVideourl(val)}
            value={videourl}
            errorMessage={editerrors.video}
          />

          <Input
            inputStyle={styles.inputStyle}
            label="360 View URL"
            labelStyle={styles.fieldLabels}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(val) => setImageurl(val)}
            value={Imageurl}
            // errorMessage={editerrors.email}
          />
          <View
            style={{
              flexDirection: "row",
              marginVertical: 20,
              marginBottom: 30,
            }}
          >
            <Button
              type="clear"
              containerStyle={{ width: width / 2.5 }}
              titleStyle={{ fontFamily: "EBGaramond-Bold", color: "#214151" }}
              title="Close"
              onPress={() => {
                setVisible(false);
              }}
            />

            <Button
              loading={loading}
              disabled={!price}
              buttonStyle={styles.register}
              containerStyle={{ width: width / 2.5 }}
              titleStyle={{ fontFamily: "EBGaramond-Bold" }}
              title="Edit Property"
              onPress={() => {
                if (Object.keys(editerrors).length === 0) {
                  onSubmit();
                } else {
                  Toast.show({
                    type: "error",
                    text1: `Fill all fields`,
                    visibilityTime: 2000,
                    topOffset: 30,
                  });
                }
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Overlay>
  );
};

export default EditProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    width: width,
    height: height,
  },
  inputStyle: {
    color: "#214151",
  },
  fieldLabels: {
    color: "#839b97",
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#214151",
    paddingHorizontal: 5,
  },
  register: {
    backgroundColor: "#214151",
  },
});
