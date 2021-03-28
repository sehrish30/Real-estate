import React, { memo } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Button, Overlay } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
var { width, height } = Dimensions.get("window");
import { blockChat, unblockChat } from "../Services/ChatServices";
import Toast from "react-native-toast-message";

const MenuOverlay = ({
  visible,
  setVisible,
  toggleOverlay,
  chatData,
  chatBlocked,
  personWhoBlocked,
  setPersonWhoBlocked,
}) => {
  let socket = useSelector((state) => state.chat.socket);
  let blockstatus = useSelector((state) => state.chat.currentChatBlocked);
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);

  let userId;
  if (agency.id) {
    userId = agency.id;
  } else {
    userId = user.decoded.userId;
  }

  return (
    <View>
      <Overlay
        overlayStyle={{ width: width / 1.5 }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        {/* <Button
          buttonStyle={{
            borderColor: "#a2d0c1",
            height: 50,
          }}
          containerStyle={{}}
          titleStyle={{
            color: "#214151",
            fontFamily: "EBGaramond-Bold",
          }}
          type="outline"
          icon={
            <FontAwesome
              style={{ paddingRight: 10 }}
              name="trash-o"
              size={15}
              color="#214151"
            />
          }
          title="Clear chat"
          onPress={() => {
            setVisible(false);
            constDeleteAllMessages();
          }}
        /> */}
        {console.log(blockstatus)}
        {!chatBlocked && !blockstatus && (
          <Button
            buttonStyle={{
              borderColor: "#a2d0c1",
              height: 50,
            }}
            titleStyle={{
              color: "#214151",
              fontFamily: "EBGaramond-Bold",
            }}
            type="outline"
            icon={
              <FontAwesome
                name="ban"
                size={15}
                color="#214151"
                style={{ paddingRight: 10 }}
              />
            }
            title="Block user"
            onPress={async () => {
              toggleOverlay();
              const res = await blockChat(chatData.chatId, userId, token);
              if (res) {
                socket.emit("chatBlocked", chatData);
                console.log("DATA I AM GETTING AFTER LOCKING", res);
                setPersonWhoBlocked(res.personWhoBlocked);
                Toast.show({
                  type: "success",
                  text1: `User blocked`,
                  text2: `They will be notified that they have been blocked`,
                  visibilityTime: 4000,
                  topOffset: 30,
                });
              }
            }}
          />
        )}
        {(blockstatus || chatBlocked) && userId === personWhoBlocked && (
          <Button
            buttonStyle={{
              borderColor: "#a2d0c1",
              height: 50,
            }}
            titleStyle={{
              color: "#214151",
              fontFamily: "EBGaramond-Bold",
            }}
            type="outline"
            icon={
              <FontAwesome
                name="ban"
                size={15}
                color="#214151"
                style={{ paddingRight: 10 }}
              />
            }
            title="Unblock user"
            onPress={() => {
              toggleOverlay();
              const res = unblockChat({ chatId: chatData.chatId }, token);
              if (res) {
                socket.emit("chatunblock", chatData);
                console.log("DATA I AM GETTING AFTER UNBLOCKING", res);
                Toast.show({
                  type: "success",
                  text1: `User Unblocked`,
                  visibilityTime: 2000,
                  topOffset: 30,
                });
              }
            }}
          />
        )}

        <Button
          buttonStyle={{
            height: 50,
          }}
          type="clear"
          titleStyle={{ color: "#839b97", fontFamily: "EBGaramond-Bold" }}
          title="Close"
          onPress={toggleOverlay}
        />
      </Overlay>
    </View>
  );
};

export default memo(MenuOverlay);

const styles = StyleSheet.create({});
