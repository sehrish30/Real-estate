// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   StatusBar
// } from 'react-native';

// import { Calendar } from 'react-native-calendars';

// export default class Calc extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//     this.onDayPress = this.onDayPress.bind(this);
//   }
//   onDayPress(day) {
//     this.setState({
//       selected: day.dateString
//     });
//     this.props.navigation.navigate('Slot', { bookingDate: day })
//   }
//   _onPressBack() {
//     const { goBack } = this.props.navigation
//     goBack()
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <View >
//           <TouchableOpacity onPress={() => this._onPressBack()}><Text >Back</Text></TouchableOpacity>
//           <Text ></Text>
//           <Text ></Text>
//         </View>
//         <Calendar
//           onDayPress={this.onDayPress}
//           style={styles.calendar}
//           hideExtraDays
//           markedDates={{ [this.state.selected]: { selected: true } }}
//           theme={{
//             selectedDayBackgroundColor: 'green',
//             todayTextColor: 'green',
//             arrowColor: 'green',
//           }}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   calendar: {
//     borderTopWidth: 1,
//     paddingTop: 5,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     height: 350
//   }
// });


// //////////////////////////////////////////////////////////////////////



// // import React, { Component } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   StatusBar
// // } from 'react-native';
// // import Commonstyle from '../../components/commonstyle'
// // import { Calendar } from 'react-native-calendars';

// // export default class Calc extends Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {};
// //     this.onDayPress = this.onDayPress.bind(this);
// //   }
// //   onDayPress(day) {
// //     this.setState({
// //       selected: day.dateString
// //     });
// //     this.props.navigation.navigate('Slot', { bookingDate: day })
// //   }
// //   _onPressBack() {
// //     const { goBack } = this.props.navigation
// //     goBack()
// //   }
// //   render() {
// //     return (
// //       <View style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <View style={Commonstyle.toolbar}>
// //           <TouchableOpacity onPress={() => this._onPressBack()}><Text style={Commonstyle.toolbarButton}>Back</Text></TouchableOpacity>
// //           <Text style={Commonstyle.toolbarTitle}></Text>
// //           <Text style={Commonstyle.toolbarButton}></Text>
// //         </View>
// //         <Calendar
// //           onDayPress={this.onDayPress}
// //           style={styles.calendar}
// //           hideExtraDays
// //           markedDates={{ [this.state.selected]: { selected: true } }}
// //           theme={{
// //             selectedDayBackgroundColor: 'green',
// //             todayTextColor: 'green',
// //             arrowColor: 'green',
// //           }}
// //         />
// //       </View>
// //     );
// //   }
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1
// //   },
// //   calendar: {
// //     borderTopWidth: 1,
// //     paddingTop: 5,
// //     borderBottomWidth: 1,
// //     borderColor: '#eee',
// //     height: 350
// //   }
// // });


//////////////////////////////////////////////////////////////////////////

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
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{ margin: 100, }}>
      <Button title="Show modal" onPress={toggleModal} />

      <Modal isVisible={isModalVisible} avoidKeyboard={true} scrollHorizontal={true} propagateSwipe={true}>
        <ScrollView>
          <View style={{ margin: 50, backgroundColor: 'gray', borderRadius: 20, padding: 20, margin: 20 }}>

            <Text style={styles.heading}>Request to Buy/Rent</Text>

            <View style={{ paddingBottom: 10 }}></View>

            <View >
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
            <Button
              buttonStyle={styles.cancelbtn}
              title="Cancel"
              onPress={toggleModal}
            />

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

