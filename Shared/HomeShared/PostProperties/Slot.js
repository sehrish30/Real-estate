import React, { useState } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar
} from 'react-native';
// import * as firebase from 'firebase'
// import Animbutton from '../../components/animbutton'
// import Commonstyle from '../../components/commonstyle'
const jsonData = {
    "slots": {
        "slot1": "9:00am to 9:30am",
        "slot2": "9:30am to 10:00am",
        "slot3": "10:00am to 10:30am",
        "slot4": "10:30am to 11:00am",
        "slot5": "11:00am to 11:30am",
        "slot6": "11:30am to 12:00pm"
    }
}

const Slot = ({ navigation }) => {
    const onPressBack = () => {
        const { goBack } = navigation
        goBack()
    }
    const slots = jsonData.slots
    const slotsarr = Object.keys(slots).map(function (k) {
        return (
            <View key={k} style={{ margin: 5 }}>

                <TouchableOpacity >
                    <Text>{slots[k]}</Text>
                </TouchableOpacity>
            </View>)
    });
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View >
                <TouchableOpacity onPress={() => onPressBack()}><Text >Back</Text></TouchableOpacity>
                <Text ></Text>
                <Text ></Text>
            </View>
            { slotsarr}
        </View>
    );

}
export default Slot;
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});