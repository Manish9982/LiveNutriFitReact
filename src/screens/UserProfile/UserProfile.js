import { StyleSheet, View, Dimensions, Image, TouchableOpacity, ScrollView, RefreshControl, StatusBar, Modal, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, Appbar, TextInput, ActivityIndicator } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import HeaderForUserProfile from './HeaderForUserProfile'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { useIsFocused } from '@react-navigation/native'
import { Linking } from 'react-native';


import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { PERMISSIONS, RESULTS, check, request, requestMultiple } from 'react-native-permissions'
import ImagePicker from 'react-native-image-crop-picker'
import { useLocales } from '../../utils/LocalizationUtil'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const date = new Date()

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const UserProfile = ({ navigation }) => {
    const [dataFromApi, setDataFromApi] = useState(null)
    const [loader, setLoader] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [lastRefresh, setLastRefresh] = useState(null)
    const [bioModal, setBioModal] = useState(false)
    const [camVisible, setCamVisible] = useState(false)
    const [image, setImage] = useState(null)
    const [text, setText] = useState("")

    const isFocused = useIsFocused()
    const strings = useLocales()

    const openAppSettings = () => {
        Linking.openSettings();
    };


    useEffect(() => {
        getLanguage()
        getDataForUserProfile()
        //requestCameraPermission()
    }, [isFocused])


    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")

        if (lang == "en") {
            changeLanguage('en')

        } else {
            changeLanguage('hi')

        }

    }

    const changeLanguage = (languageKey) => {

    }

    const navigationTOScreen = async () => {
        const userType = await getDataFromLocalStorage('user_type')

        if (JSON.parse(userType) == "1") {


            Alert.alert('Alert', 'Currently you are a free user, you want to upgrade plan?', [

                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => { { navigation.navigate("Upgrade") } }
                },
            ]);
        } else {

        }

    }

    const date = new Date()
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getDataForUserProfile()
        setLastRefresh(`${(date.getHours()).toString().padStart(2, 0)}:${(date.getMinutes()).toString().padStart(2, 0)}`)
        wait(2000).then(() => setRefreshing(false))
    }, []);


    const redirectToSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openSettings();
        } else {
            openSettings();
        }
    };

    const requestCameraPermission = async () => {
        try {
            const permissionStatus = await check(
                Platform.select({
                    android: 'android.permission.CAMERA',
                    ios: 'camera',
                })
            );
            if (permissionStatus === 'granted') {
                // Permission already granted
                // Proceed with using the camera
            } else {
                // Permission hasn't been granted yet
                await request(
                    Platform.select({
                        android: 'android.permission.CAMERA',
                        ios: 'camera',
                    })
                );
            }
        } catch (error) {
            console.error('Error checking camera permission: ', error);
        }
    };

    const launchCam = async () => {
        try {
            // if (Platform.OS == "ios") {
            //     const statuses = await requestMultiple([
            //         PERMISSIONS.IOS.CAMERA,
            //         PERMISSIONS.IOS.PHOTO_LIBRARY,
            //     ]);
            //     console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
            //     console.log('FaceID', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);

            //     if (
            //         statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED &&
            //         statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.GRANTED
            //     ) {
            //         try {
            //             const pic = await ImagePicker.openCamera({
            //                 width: 300,
            //                 height: 400,
            //                 cropping: true,
            //             });
            //             console.log("CAmPic======>", pic);
            //             uploadPhotoCamera(pic)
            //         }
            //         catch (err) {
            //             ShortToast(`${err}`, 'error', '');
            //         }
            //     } else {
            //         if (statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED) {
            //             Alert.alert("Camera is not accessible");
            //             return false;
            //         } else if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] !== RESULTS.GRANTED) {
            //             Alert.alert("Photo Library is not accessible");
            //             return false;
            //         }
            //     }

            // }
            if (Platform.OS === "ios") {
                const statuses = await requestMultiple([
                    PERMISSIONS.IOS.CAMERA,
                    PERMISSIONS.IOS.PHOTO_LIBRARY,
                ]);
                console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                console.log('FaceID', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);

                if (
                    statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED &&
                    statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.GRANTED
                ) {
                    try {
                        const pic = await ImagePicker.openCamera({
                            width: 300,
                            height: 400,
                            cropping: true,
                        });
                        console.log("CAmPic======>", pic);
                        uploadPhotoCamera(pic);
                    }
                    catch (err) {
                        ShortToast(`${err}`, 'error', '');
                    }
                } else {
                    if (statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED) {
                        Alert.alert(
                            "Camera is not accessible",
                            "Please enable camera access in settings",
                            [
                                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                { text: 'OK', onPress: openAppSettings },
                            ],
                            { cancelable: false }
                        );
                        return false;
                    } else if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] !== RESULTS.GRANTED) {
                        Alert.alert(
                            "Photo Library is not accessible",
                            "Please enable photo library access in settings",
                            [
                                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                { text: 'OK', onPress: openAppSettings },
                            ],
                            { cancelable: false }
                        );
                        return false;
                    }
                }
            }

            else {
                const statuses = await requestMultiple([
                    PERMISSIONS.ANDROID.CAMERA,
                    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                ]);
                console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
                console.log('FaceID', statuses[PERMISSIONS.ANDROID.PHOTO_LIBRARY]);

                if (
                    statuses[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED
                ) {
                    try {
                        const pic = await ImagePicker.openCamera({
                            width: 300,
                            height: 400,
                            cropping: true,
                            compressImageQuality: 0.4
                        });
                        console.log("CAmPic======>", pic);
                        uploadPhotoCamera(pic)
                    }
                    catch (err) {
                        ShortToast(`${err}`, 'error', '');
                    }
                } else {
                    if (statuses[PERMISSIONS.ANDROID.CAMERA] !== RESULTS.GRANTED) {
                        Alert.alert("Camera is not accessible");
                        return false;
                    } else if (statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] !== RESULTS.GRANTED) {
                        Alert.alert("Photo Library is not accessible");
                        return false;
                    }
                }

            }
        } catch (err) {
            ShortToast(`${err}`, 'error', '');
        }
    }




    const uploadPhotoGallery = async (pic) => {
        console.log('PIC=====>', pic)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("profile", {
            uri: pic?.assets?.[0]?.uri,
            type: pic?.assets?.[0]?.type,
            name: pic?.assets?.[0]?.fileName,
        });
        const result = await PostApiData('update_profile_image', formdata)
        console.log("result======>", result)
        ShortToast(result.message, "success", "")
        getDataForUserProfile()
        setCamVisible(false)
    }
    const uploadPhotoCamera = async (pic) => {
        console.log('PIC=====>', pic)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("profile", {
            // uri: pic?.path,
            // type: pic?.mime,
            // name: pic?.modificationDate,
            name: pic?.path,
            type: pic?.mime,
            uri: pic?.path
        });
        const result = await PostApiData('update_profile_image', formdata)
        console.log("result======>", result)
        ShortToast(result.message, "success", "")
        getDataForUserProfile()
        setCamVisible(false)
    }

    const launchGallery = async () => {
        launchImageLibrary(
            {
                includeBase64: false,
                mediaType: 'photo',
                quality: 0.8,
            },
            async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    await uploadPhotoGallery(response)
                }
            },
        )
    }

    const uploadBio = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("bio", text)
        const result = await PostApiData('update_user_bio', formdata)
        if (result.status == '200') {
            getDataForUserProfile()
            ShortToast(result.message, 'success', '')
        }
        setBioModal(false)
    }


    const getDataForUserProfile = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("id", JSON.parse(temp));
        const result = await PostApiData('userprofile', formdata)
        console.log(result)
        setDataFromApi(result)
        setLoader(false)
        setLastRefresh(`${(date.getHours()).toString().padStart(2, 0)}:${(date.getMinutes()).toString().padStart(2, 0)}`)
    }


    return (
        <View>
            <StatusBar backgroundColor={colors.GREEN} />
            <HeaderForSubmissionScreens Title={strings.My_Profile} />
            {
                loader
                    ?
                    <View style={{
                        height: H,
                        width: W,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <ActivityIndicator size="large"
                            color={colors.GREEN} />
                    </View>
                    :
                    <ScrollView contentContainerStyle={styles.mainContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        <View style={{ flexDirection: 'row', marginTop: H * 0.05 }}>
                            <TouchableOpacity onPress={() => { setCamVisible(true) }}>
                                <Image source={{ uri: dataFromApi?.data[0].profile_pic }}
                                    style={styles.userImageContainer}
                                />
                            </TouchableOpacity>
                            <Modal
                                visible={camVisible}
                                transparent={true}
                            >
                                <View style={{
                                    height: H,
                                    width: W,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'

                                }}>
                                    <View style={{
                                        backgroundColor: colors.OFFWHITE,
                                        borderRadius: 4,
                                        height: H * 0.32,
                                        width: W * 0.85,
                                        justifyContent: "center",
                                        elevation: 8
                                    }}>
                                        <Text style={{
                                            ...fontFamily.bold,
                                            top: -H * 0.06,
                                            left: W * 0.05,
                                            fontSize: fontSizes.XXL
                                        }}>Choose</Text>
                                        <View style={{
                                            flexDirection: "row",
                                            backgroundColor: colors.OFFWHITE,
                                            borderRadius: 4,
                                            justifyContent: "center",

                                        }}>
                                            <TouchableOpacity onPress={() => { launchCam() }}>
                                                <View style={{
                                                    alignItems: "center",
                                                    marginHorizontal: W * 0.1,
                                                    marginVertical: H * 0.01,
                                                }}>
                                                    <AntDesign name="camera" size={50} color={"silver"} />
                                                    <Text style={{
                                                        ...fontFamily.bold,
                                                        fontSize: fontSizes.MED
                                                    }}>Camera</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { launchGallery() }}>
                                                <View style={{
                                                    alignItems: "center",
                                                    marginHorizontal: W * 0.1,
                                                    marginVertical: H * 0.01,
                                                }}>
                                                    <AntDesign name="picture" size={50} color={"silver"} />
                                                    <Text style={{
                                                        ...fontFamily.bold,
                                                        fontSize: fontSizes.MED
                                                    }}>Gallery</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity onPress={() => setCamVisible(false)}
                                        >
                                            <Text style={{
                                                textAlign: "right",
                                                ...fontFamily.bold,
                                                color: "red",
                                                top: H * 0.055,
                                                left: -W * 0.06
                                            }}>CANCEL</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>

                            <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.text2}>{dataFromApi?.data[0].name}</Text>
                                <Text style={styles.text1}>{dataFromApi?.data?.[0]?.food_profile}</Text>
                            </View>
                        </View>


                        <>
                            {dataFromApi?.data[0].mobile == null || dataFromApi?.data[0].mobile == "" ? null :
                                <>
                                    <View style={{ flexDirection: 'row', marginTop: H * 0.05 }}>
                                        <Image source={require('../../assets/icons/phone-call.png')}
                                            style={styles.userIconContainer} />
                                        <Text style={styles.text1}>{dataFromApi?.data[0].mobile}</Text>
                                    </View>
                                </>}
                        </>

                        <>
                            {(dataFromApi?.data[0]?.email == "null" ||
                                dataFromApi?.data[0].email == null ||
                                dataFromApi?.data[0].email == "") ? null :
                                <>
                                    <View style={{ flexDirection: 'row', marginTop: H * 0.04 }}>
                                        <Image source={require('../../assets/icons/email.png')}
                                            style={styles.userIconContainer} />
                                        <Text style={styles.text1}>{dataFromApi?.data[0].email}</Text>
                                    </View>
                                </>

                            }

                        </>

                        <View style={{ flexDirection: 'row', marginTop: H * 0.05 }}>
                            <View style={styles.containersAdjacent}>
                                <Text style={[styles.text2, { fontSize: fontSizes.XXXL }]}>
                                    {dataFromApi?.data[0].total_point}</Text>
                                <Text style={styles.text1}>{strings.TotalPoints}</Text>
                            </View>

                            <View style={styles.containersAdjacent}>
                                {/* <TouchableOpacity onPress={() => navigationTOScreen()}
                                style={styles.button}>
                                <Text style={styles.text3}>{strings.Upgrade}</Text>
                            </TouchableOpacity> */}

                                <Text style={{

                                    width: '90%',
                                    ...fontFamily.bold,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    paddingHorizontal: W * 0.01,
                                }}>{strings.LastUpdatedat} {lastRefresh}</Text>
                            </View>
                        </View>
                        <Modal visible={bioModal}
                            transparent={true}>
                            <View
                                style={{
                                    height: H,
                                    width: W,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0,0,0,0.3)"
                                }}
                            >
                                <View style={{
                                    //height: H * 0.3,
                                    backgroundColor: colors.OFFWHITE,
                                    // backgroundColor: "red",
                                    width: W * 0.85,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    //alignItems: "center",
                                    borderRadius: 8,
                                    elevation: 8,
                                    paddingVertical: H * 0.05,
                                }}
                                >
                                    <Text style={{
                                        ...fontFamily.bold,
                                        fontSize: fontSizes.XL,
                                        paddingBottom: H * 0.01,
                                        marginLeft: W * 0.08
                                    }}>
                                        Your Bio:
                                    </Text>
                                    <TextInput
                                        //textBreakStrategy="balanced"
                                        // textAlign='left'
                                        multiline={true}
                                        numberOfLines={4}
                                        //textAlignVertical="auto"
                                        activeUnderlineColor={colors.GREEN}
                                        value={text}
                                        onChangeText={(t) => { setText(t) }}
                                        maxLength={100}
                                        style={{
                                            //height: H * 0.15,
                                            width: W * 0.7,
                                            backgroundColor: "white",
                                            alignSelf: "center"
                                        }} />
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: W * 0.6,
                                        alignSelf: "center"
                                    }}>
                                        <TouchableOpacity onPress={() => {
                                            //  handleCustomAnswer()
                                            uploadBio()
                                        }}>
                                            <Text style={{
                                                ...fontFamily.bold,
                                                color: colors.GREEN,
                                                fontSize: fontSizes.XL,
                                                paddingTop: H * 0.028,
                                            }}>
                                                SUBMIT
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {

                                            setBioModal(false)
                                            //setSelectedOption("")
                                        }}
                                        >
                                            <Text style={{
                                                ...fontFamily.bold,
                                                color: "red",
                                                fontSize: fontSizes.XL,
                                                paddingTop: H * 0.028,
                                            }}>
                                                CANCEL
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        {/* <TouchableOpacity onPress={() => { setBioModal(true) }}>
                        <View style={{ flexDirection: 'row' }}>
                         <Image source={require('../../assets/icons/inverted-commas.png')}
                                style={styles.userIconContainer} /> 
                            <View>
                                <Text style={styles.text2}>{strings.Bio}</Text>
                                <Text style={styles.text1}>{dataFromApi?.data?.[0]?.bio == "" ? "Write something about youself" : dataFromApi?.data?.[0]?.bio}</Text> 
                            </View>
                        </View>
                    </TouchableOpacity> */}
                        {/* <TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/pin.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>{strings.Location}</Text>
                                <Text style={styles.text1}>{dataFromApi?.data?.[0].address == null ? "Your Current Location" : dataFromApi?.data[0].address}</Text>
                            </View>
                        </View>
                    </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => { navigation.navigate("editProfile") }}>
                            <View style={{ flexDirection: 'row', marginTop: H * 0.05 }}>
                                <Image source={require('../../assets/icons/about.png')}
                                    style={styles.userIconContainer} />
                                <View>
                                    <Text style={styles.text2}>{strings.BasicInformation}</Text>
                                    <Text style={styles.text1}>{strings.HeightWeightAgeGenderActivity}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("editProfile", { flag: '1' }) }}
                        >
                            <View style={{ flexDirection: 'row', marginTop: H * 0.05 }}>
                                <Image source={require('../../assets/icons/report.png')}
                                    style={styles.userIconContainer} />
                                <View style={{ width: W }}>
                                    <Text style={styles.text2}>{strings.goals}</Text>
                                    <View style={{ flexDirection: 'row', width: '80%', flexWrap: 'wrap' }}>
                                        {
                                            dataFromApi?.data?.[0]?.goal?.answer?.map((item, index) => {
                                                if (index == dataFromApi?.data?.[0]?.goal?.answer?.length - 1) {
                                                    return (
                                                        <Text
                                                            key={index}
                                                            style={[styles.text1, {}]}>{item?.text} </Text>)
                                                }
                                                else {
                                                    return (
                                                        <Text
                                                            key={index}
                                                            style={[styles.text1, {}]}>{item?.text}, </Text>)
                                                }

                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {/*  <TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/cutlery.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>Food Preferences</Text>
                                <Text style={styles.text1}>Diet Preference, Allergies, Cuisine</Text>
                            </View>
                        </View>
                    </TouchableOpacity>*/}
                        <TouchableOpacity>
                            {/* <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/credit-card.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>{strings.PaymentDetails}</Text>
                                <Text style={styles.text1}>{strings.YourPaymentDetails}</Text>
                            </View>
                        </View> */}
                        </TouchableOpacity>

                    </ScrollView >
            }

        </View >
    )
}

const styles = StyleSheet.create({
    appBar:
    {
        backgroundColor: colors.GREEN,
        width: W,
    },
    mainContainer:
    {
        paddingBottom: H * 0.2
    },
    userImageContainer:
    {
        height: HEIGHT * 0.12,
        width: HEIGHT * 0.12,
        borderRadius: (HEIGHT * 0.12) / 2,
        marginRight: WIDTH * 0.05,
        marginHorizontal: WIDTH * 0.06
    },
    userIconContainer:
    {
        height: HEIGHT * 0.027,
        width: HEIGHT * 0.027,
        marginRight: WIDTH * 0.05,
        marginHorizontal: WIDTH * 0.06
    },
    text2:
    {
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: '600',
        color: 'black',
        fontSize: fontSizes.XXL,
    },
    text1:
    {
        fontFamily: 'Montserrat-SemiBold',
        color: 'black',
        fontSize: fontSizes.MED,
        fontWeight: '600',
    },
    button:
    {
        height: HEIGHT * 0.07,
        width: WIDTH * 0.35,
        backgroundColor: colors.GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    text3:
    {
        color: 'white'
    },
    containersAdjacent:
    {
        borderColor: 'silver',
        borderWidth: 0.5,
        width: WIDTH * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        height: HEIGHT * 0.1,
        alignSelf: 'center',

    },

})
export default UserProfile
