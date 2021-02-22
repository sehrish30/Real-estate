import React from "react";
import Dialog from "react-native-dialog";
import { View } from "react-native";
import SelectBox from "react-native-multi-selectbox";
import { catgeories } from "../../Shared/Categories";

const Alert = ({ visible, category }) => {
  return (
    <View>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Account delete</Dialog.Title>
        <SelectBox
          label="Select single"
          options={catgeories}
          value={category}
          onChange={() => onChange()}
          hideInputFilter={false}
        />
      </Dialog.Container>
    </View>
  );
};

export default Alert;
