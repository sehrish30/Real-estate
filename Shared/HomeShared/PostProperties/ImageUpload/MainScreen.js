// import React, { Component } from 'react';
// import { View, Platform, Button, Image, ScrollView, Alert, } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
// import * as Permissions from 'expo-permissions';

// export default class MainScreen extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             photos: []
//         }
//     }

//     componentDidUpdate() {
//         const { params } = this.props.route;
//         if (params) {
//             const { photos } = params;
//             if (photos) this.setState({ photos });
//             delete params.photos;
//         }
//     }

//     renderImage(item, i) {
//         return (
//             <Image
//                 style={{ height: 100, width: 100 }}
//                 source={{ uri: item.uri }}
//                 key={i}
//             />
//         )
//     }

//     render() {
//         const { navigate } = this.props.navigation;

//         return (
//             <View style={{ flex: 1 }}>
//                 <Button
//                     title="Open image browser"
//                     onPress={async () => {
//                         await Permissions.askAsync(Permissions.CAMERA);
//                         const res = await MediaLibrary.requestPermissionsAsync();
//                         console.log('res', res);
//                         if (Platform.OS !== 'web') {
//                             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//                             if (status !== 'granted') {
//                                 Alert.alert(
//                                     'Sorry, we need media library permissions to make this work!',
//                                 );
//                                 return;
//                             }
//                         }

//                         navigate('ImageBrowser');
//                     }}
//                 />
//                 <ScrollView>
//                     {this.state.photos.map((item, i) => this.renderImage(item, i))}
//                 </ScrollView>
//             </View>
//         );
//     }
// }


import React, { useState, useEffect } from 'react';
import { View, Platform, Button, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

function MainScreen(props) {

    const [photos, setPhotos] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const { params } = route;
        if (params) {
            const { photos } = params;
            if (photos) setPhotos({ photos });
            delete params.photos;
        }
    }, []);

    const renderImage = (item, i) => {
        return (
            <Image
                style={{ height: 100, width: 100 }}
                source={{ uri: item.uri }}
                key={i}
            />
        )
    }


    const updateImageArray = (newImageArray) => {
        setPhotos(newImageArray);
    }

    return (
        <View style={{ flex: 1 }}>
            <Button
                title="Open image browser"
                onPress={async () => {

                    if (Platform.OS !== 'web') {
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                        if (status !== 'granted') {
                            Alert.alert(
                                'Sorry, we need media library permissions to make this work!',
                            );
                            return;
                        }
                    }

                    navigation.navigate('BrowserScreen',{updateImageArray: updateImageArray});
                }}
            />
            <ScrollView>
                {photos.map((item, i) => renderImage(item, i))}
            </ScrollView>
        </View>
    );

}

export default MainScreen;