// import React, { Component } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
// import * as ImageManipulator from 'expo-image-manipulator';
// import { ImageBrowser } from 'expo-image-picker-multiple';

// export default class ImageBrowserScreen extends Component {
//     _getHeaderLoader = () => (
//         <ActivityIndicator size='small' color={'#0580FF'} />
//     );

//     imagesCallback = (callback) => {
//         const { navigation } = this.props;
//         this.props.navigation.setOptions({
//             headerRight: () => this._getHeaderLoader()
//         });

//         callback.then(async (photos) => {
//             const cPhotos = [];
//             for (let photo of photos) {
//                 const pPhoto = await this._processImageAsync(photo.uri);
//                 cPhotos.push({
//                     uri: pPhoto.uri,
//                     name: photo.filename,
//                     type: 'image/jpg'
//                 })
//             }
//             navigation.navigate('Main', { photos: cPhotos });
//         })
//             .catch((e) => console.log(e));
//     };

//     async _processImageAsync(uri) {
//         const file = await ImageManipulator.manipulateAsync(
//             uri,
//             [{ resize: { width: 1000 } }],
//             { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
//         );
//         return file;
//     };

//     _renderDoneButton = (count, onSubmit) => {
//         if (!count) return null;
//         return <TouchableOpacity title={'Done'} onPress={onSubmit}>
//             <Text onPress={onSubmit}>Done</Text>
//         </TouchableOpacity>
//     }

//     updateHandler = (count, onSubmit) => {
//         this.props.navigation.setOptions({
//             title: `Selected ${count} files`,
//             headerRight: () => this._renderDoneButton(count, onSubmit)
//         });
//     };

//     renderSelectedComponent = (number) => (
//         <View style={styles.countBadge}>
//             <Text style={styles.countBadgeText}>{number}</Text>
//         </View>
//     );

//     render() {
//         const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;

//         return (
//             <View style={[styles.flex, styles.container]}>
//                 <ImageBrowser
//                     max={10}
//                     onChange={this.updateHandler}
//                     callback={this.imagesCallback}
//                     renderSelectedComponent={this.renderSelectedComponent}
//                     emptyStayComponent={emptyStayComponent}
//                 />
//             </View>
//         );
//     }
// }




// const styles = StyleSheet.create({
//     flex: {
//         flex: 1
//     },
//     container: {
//         position: 'relative'
//     },
//     emptyStay: {
//         textAlign: 'center',
//     },
//     countBadge: {
//         paddingHorizontal: 8.6,
//         paddingVertical: 5,
//         borderRadius: 50,
//         position: 'absolute',
//         right: 3,
//         bottom: 3,
//         justifyContent: 'center',
//         backgroundColor: '#0580FF'
//     },
//     countBadgeText: {
//         fontWeight: 'bold',
//         alignSelf: 'center',
//         padding: 'auto',
//         color: '#ffffff'
//     }
// });



import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageBrowser } from 'expo-image-picker-multiple';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { connect } from 'react-redux'
import {updateImages} from '../../../Redux/Actions/auth'
import {saveuri} from '../../../Redux/Actions/auth'
import Axios from 'axios'

function BrowserScreen(props) {
    const _getHeaderLoader = () => (
        <ActivityIndicator size='small' color={'#0580FF'} />
    );

    const navigation = useNavigation();
    const route = useRoute();

    const imagesCallback = (callback) => {
        
        navigation.setOptions({
            headerRight: () => _getHeaderLoader()
        });

        callback.then(async (photos) => {
            const cPhotos = [];
            //setUri([]);
            for (let photo of photos) {
                const pPhoto = await _processImageAsync(photo.uri);
                
                cPhotos.push({
                    uri: pPhoto.uri,
                    name: photo.filename,
                    type: 'image/jpg'
                })
            }
            route.params.updateImageArray(cPhotos);
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

            navigation.navigate('RegisterProperty', { photos: cPhotos });
        })
            .catch((e) => console.log(e));
    };

    const _processImageAsync = async (uri) => {
        const file = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1000 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        return file;
    };

    const _renderDoneButton = (count, onSubmit) => {
        if (!count) return null;
        return <TouchableOpacity title={'Done'} onPress={onSubmit}>
            <Text onPress={onSubmit}>Done</Text>
        </TouchableOpacity>
    }

    const updateHandler = (count, onSubmit) => {
        navigation.setOptions({
            title: `Selected ${count} files`,
            headerRight: () => _renderDoneButton(count, onSubmit)
        });
    };

    const renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );


    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;

    return (
        <View style={[styles.flex, styles.container]}>
            <ImageBrowser
                max={4}
                onChange={updateHandler}
                callback={imagesCallback}
                renderSelectedComponent={renderSelectedComponent}
                emptyStayComponent={emptyStayComponent}
            />
        </View>
    );

}

const mapStateToProps = (state) => {
    console.log('State*****-------******',state)
    return {
        state
    }
}

const mapDispatchToProps = dispatch => {
    console.log('Dispatch',dispatch)
    return {
        updateImagesArray: (data) => dispatch(updateImages(data)),
        savedUri: data => dispatch(saveuri(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BrowserScreen);


const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        position: 'relative'
    },
    emptyStay: {
        textAlign: 'center',
    },
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 50,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#0580FF'
    },
    countBadgeText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    }
});
