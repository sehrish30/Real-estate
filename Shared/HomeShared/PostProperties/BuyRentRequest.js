import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from "react-native";
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native-gesture-handler";
import { Input, Button, Image, Header, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar } from 'react-native-calendars';

// import { decay } from "react-native-reanimated";



var { width, height } = Dimensions.get("window");

const RequestMeeting = ({ navigation }) => {
    // const navigation = useNavigation();
    // const showMenu = () => {
    //     navigation.toggleDrawer();
    // };

    // FORM STATES
    const [name, setName] = useState("");
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // const [day, setDays] = useState();
    // const [selected, setSelected] = useState({});
    // const onDayPress = (day) => {
    //     setDay({
    //         selected: day
    //     });

    //     navigation.navigate('Slot', { bookingDate: day })
    // }



    return (
        <View style={{ margin: 100, }}>
            <Button title="Show modal" onPress={toggleModal} />

            <Modal isVisible={isModalVisible} avoidKeyboard={true} scrollHorizontal={true} propagateSwipe={true}>
                <ScrollView>
                    <View style={{ margin: 50, backgroundColor: 'gray', borderRadius: 20, padding: 20, margin: 20 }}>
                        {/* <Text>Hello!</Text>

                    <Button title="Hide modal" onPress={toggleModal} /> */}
                        <Text style={styles.heading}>Request to Buy/Rent</Text>

                        <View style={{ paddingBottom: 10 }}></View>


                        <Input
                            label="Message"
                            leftIcon={<MaterialIcon name="email" size={24} color="#f8dc81" />}
                            onChangeText={(value) => setDescription(value)}
                            value={description}
                            multiline={true}
                            numberOfLines={5}
                        />

                        <View style={{ paddingBottom: 10 }}></View>
                        <Input
                            label="Email"
                            leftIcon={<Icon name="people" size={24} color="#f8dc81" />}
                            onChangeText={(value) => setName(value)}
                            value={name}
                        />

                        <View style={{ paddingBottom: 10 }}></View>

                        <Input
                            label="Phone Number"
                            keyboardType={"numeric"}
                            leftIcon={<MaterialIcon name="phone" size={24} color="#f8dc81" />}
                            onChangeText={(value) => setPrice(value)}
                            value={price}
                        />
                        <View>
                            <Calendar
                                onDayPress={(day) => navigation.navigate("Slot", { bookingDate: day })}
                                style={styles.calendar}
                                hideExtraDays
                                theme={{
                                    selectedDayBackgroundColor: 'green',
                                    todayTextColor: 'green',
                                    arrowColor: 'green',
                                }}
                            />
                        </View>


                        <Button
                            buttonStyle={styles.register}
                            title="Send Buy/Rent request"

                        />
                        <Button buttonStyle={styles.cancelbtn} title="Cancel" onPress={toggleModal} />

                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};


export default RequestMeeting;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    menu: {
        paddingTop: 20,
        paddingLeft: 15,

        paddingRight: 10,
    },
    rightNav: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    heading: {
        textAlign: "center",
        fontSize: 20,
        color: "#214151",
        marginBottom: 12,
        marginTop: 15,
    },
    form: {
        marginTop: 30,
        marginBottom: 400,
        flex: 1,
        justifyContent: "center",

        marginHorizontal: 20,
    },
    attachments: {
        marginTop: 15,
        position: "relative",
    },
    addAttachment: {
        borderColor: "#f8dc81",
        // width: "max-content",
    },
    buttonStyle: {
        color: "#214151",
        fontFamily: "EBGaramond-Regular",
    },
    image: {
        marginTop: 5,
    },

    imageSlide: {
        flexDirection: "row",
    },
    iconImage: {
        justifyContent: "flex-end",
        marginLeft: "auto",
        marginTop: 10,
    },
    dialog: {
        backgroundColor: "#f8dc81",
    },
    dialogbackground: {
        backgroundColor: "#f8dc81",
        borderColor: "#fff",
    },
    register: {
        backgroundColor: "#214151",
        marginTop: 30,
    },
    cancelbtn: {
        backgroundColor: "#a2d0c1",
        marginTop: 5,
    },
    maps: {
        height: "100%",
    },
    datepick: {
        width: 200
    },
    divider: {
        height: 1,
        backgroundColor: "#DCDDDE",
        marginVertical: 16,
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    }
});

