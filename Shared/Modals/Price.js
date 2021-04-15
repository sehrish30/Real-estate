import React, { useState, useCallback } from "react";
import {
  Modal,
  StyleSheet,
  Alert,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import { Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { acceptConsultationRequest } from "../../Shared/Services/NotificationServices";
import * as notifyActions from "../../Redux/Actions/consultation";
import { useFocusEffect } from "@react-navigation/native";

var { width, height } = Dimensions.get("screen");
const Price = ({
  priceVisible,
  setPriceVisible,
  toggleOverlay,
  consultationId,
  customer,
  agencyId,
  agencyName,
}) => {
  let token = useSelector((state) => state.auth.token);
  let socket = useSelector((state) => state.chat.socket);
  let consultations = useSelector((state) => state.consultation.consultations);
  let dispatch = useDispatch();

  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  useFocusEffect(
    useCallback(() => {
      if (price.length > 0) {
        setLoading(false);
      }
    }, [price])
  );

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={priceVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setPriceVisible(!priceVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              autoFocus={true}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Cost of consultation in BD"
              onChangeText={(text) => setPrice(text)}
              value={formatNumber(price)}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: width / 2,
              }}
            >
              <Button
                type="clear"
                titleStyle={[styles.font, { color: "#839b97" }]}
                onPress={() => {
                  setPriceVisible(!priceVisible);
                  toggleOverlay();
                }}
                buttonStyle={styles.outline}
                title="Close"
              />
              <Button
                disabled={loading}
                titleStyle={styles.font}
                onPress={async () => {
                  setPriceVisible(!priceVisible);
                  toggleOverlay();

                  const res = await acceptConsultationRequest(
                    {
                      id: consultationId,
                      payment: price,
                      customer,
                      agencyId,
                      agencyName,
                    },
                    token
                  );

                  if (res) {
                    socket.emit("notification", {
                      ...res.notification,
                      customer,
                    });

                    dispatch(
                      notifyActions.updateConsultations({
                        id: consultationId,
                        status: "accepted",
                      })
                    );

                    console.error("CONSULTATIONS", consultationId);
                  }
                }}
                buttonStyle={styles.solid}
                title="Accept"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Price;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#e4fbff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    width: width / 1.5,
    borderColor: "#214151",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  font: { fontFamily: "EBGaramond-Bold" },
  outline: {
    borderColor: "#839b97",
    marginRight: 10,
  },
  solid: {
    backgroundColor: "#214151",
  },
});
