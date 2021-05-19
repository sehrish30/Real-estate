import React, { useLayoutEffect, useState, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ImageBrowser } from "expo-image-picker-multiple";
import * as ImageManipulator from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { Dimensions } from "react-native";
const renderImage = (item, i) => {
  return (
    <Image
      style={{ height: 100, width: 100 }}
      source={{ uri: item.uri }}
      key={i}
    />
  );
};
var { width, height } = Dimensions.get("screen");
// const reducer = (state, newState) => ({ ...state, ...newState });
// const initialState = {
//   selectedPhotos: [],
// };

const Photos = ({
  navigation,
  selectedPhotos,
  dipatchPhotos,
  setUploadPhotos,
}) => {
  const [photos, setPhotos] = useState([]);
  const [total, setTotal] = useState(0);

  const imagesCallback = (callback) => {
    callback
      .then(async (photos) => {
        const cPhotos = [];
        for (let photo of photos) {
          const pPhoto = await processImageAsync(photo.uri);

          cPhotos.push({
            uri: pPhoto.uri,
            name: photo.filename,
            type: "image/jpg",
          });

          setPhotos(cPhotos);
          dipatchPhotos({
            selectedPhotos: [
              ...selectedPhotos,
              {
                uri: pPhoto.uri,
                name: photo.filename,
                type: "image/jpg",
              },
            ],
          });
          //   setPhotos((prev) => [
          //     ...prev,
          //     {
          //       uri: pPhoto.uri,
          //       name: photo.filename,
          //       type: "image/jpg",
          //     },
          //   ]);
        }

        // console.error("PHOTO", cPhotos);
        // route.params.updateImageArray(cPhotos);
        // props.updateImagesArray(cPhotos)

        //-----------------------------------
        //             cPhotos.map(image=>{
        //                 const imageData = new FormData();
        //                 const newFile = {
        //                 uri: image.uri,
        //                 name: image.name,
        //                 type: image.type
        //                 };
        //     imageData.append("file", newFile);
        //     imageData.append("cloud_name", "abikhan");
        //     imageData.append("upload_preset", "insta-clone");

        //    Axios.post(
        //       "https://api.cloudinary.com/v1_1/abikhan/image/upload",
        //       imageData
        //     ).then(res=>props.savedUri(res.data.url))
        //     .catch(err=>console.log('Error---',err))

        // }
        // )

        // navigation.navigate("RegisterProperty", { photos: cPhotos });
      })
      .catch((e) => console.log(e));
  };

  const processImageAsync = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  const renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return (
      <TouchableOpacity title={"Done"} onPress={onSubmit}>
        <Text onPress={onSubmit}>Done</Text>
      </TouchableOpacity>
    );
  };

  const updateHandler = (count, onSubmit) => {
    // navigation.navigate("Photos");
    // navigation.setOptions({
    //   title: `Selected ${count} files`,
    //   headerRight: () => renderDoneButton(count, onSubmit),
    // });
    setTotal(count);

    onSubmit();
  };

  const renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
  return (
    <>
      <View style={[styles.flex, styles.container]}>
        <ImageBrowser
          max={5}
          onChange={updateHandler}
          callback={imagesCallback}
          renderSelectedComponent={renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
        />
        {/* <ScrollView>{photos.map((item, i) => renderImage(item, i))}</ScrollView> */}
        <View style={styles.btn}>
          <Button
            title="Cancel"
            containerStyle={{
              width: width / 2,
            }}
            type="clear"
            titleStyle={{
              fontFamily: "EBGaramond-Bold",
              color: "#214151",
            }}
            onPress={() => {
              setTotal(0);
              dipatchPhotos({
                selectedPhotos: [],
              });
              setUploadPhotos(false);
            }}
          />
          <Button
            containerStyle={{
              width: width / 2,
            }}
            buttonStyle={{
              backgroundColor: "#214151",
            }}
            titleStyle={{
              fontFamily: "EBGaramond-Bold",
            }}
            title="Upload"
            onPress={() => {
              console.error(selectedPhotos);
              setUploadPhotos(false);
            }}
          />
        </View>
      </View>
    </>
  );
};

export default Photos;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    width: width,
  },
  container: {
    position: "relative",
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    justifyContent: "center",
    backgroundColor: "#0580FF",
  },
  countBadgeText: {
    fontWeight: "bold",
    alignSelf: "center",
    padding: "auto",
    color: "#ffffff",
  },
  btn: {
    flexDirection: "row",
    width: width,
    justifyContent: "center",
    margin: 0,
    padding: 0,
  },
});
