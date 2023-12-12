import { StyleSheet, View, Dimensions, Image, TouchableOpacity, ScrollView, RefreshControl, StatusBar, Modal, Alert, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, Appbar, TextInput, ActivityIndicator } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import HeaderForUserProfile from './HeaderForUserProfile'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { useIsFocused } from '@react-navigation/native'


import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'



//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const date = new Date()

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const UserProfile = ({ navigation }) => {

    const [dataFromApi, setDataFromApi] = useState(null)
    const [loader, setLoader] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [lastRefresh, setLastRefresh] = useState(null)
    const [bioModal, setBioModal] = useState(false)
    const [camVisible, setCamVisible] = useState(false)
    const [image, setImage] = useState(null)
    const [text, setText] = useState("")

    const isFocused = useIsFocused()
    useEffect(() => { getLanguge() }, [isFocused])
    useEffect(() => {
        getDataForUserProfile()
        requestCameraPermission()
    }, [isFocused])

    //lng
    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")

        if (lang == "en") {
            changeLaguagee('en')

        } else {
            changeLaguagee('hi')

        }

    }


    const changeLaguagee = (languageKey) => {
        strings.setLanguage(languageKey)
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
                { text: 'OK', onPress: () => { { navigation.navigate("Upgrade") } } },
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
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "LiveNutriFit App Camera Permission",
                    message:
                        "LiveNutriFit App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            ShortToast(err, "error", "");
        }
    };

    const launchCam = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "LiveNutriFit App Camera Permission",
                    message:
                        "LiveNutriFit App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                launchCamera(
                    {
                        includeBase64: false,
                        mediaType: 'photo',
                        quality: 0.5,
                    },
                    async (response) => {
                        if (response.didCancel) {
                            console.log('User cancelled image picker');
                        } else if (response.error) {
                            console.log('ImagePicker Error: ', response.error);
                        } else {
                            await uploadPhoto(response)
                        }
                    },
                )
            } else {
                ShortToast("Camera Permission Denied. Kindly Grant Camera Access From Settings.", "error", "");
            }
        } catch (err) {
            ShortToast(err, "error", "");
        }


    }

    const uploadPhoto = async (pic) => {
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
                    await uploadPhoto(response)
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
        if (result?.status == "200") {
            setDataFromApi(result)
            setLastRefresh(`${(date.getHours()).toString().padStart(2, 0)}:${(date.getMinutes()).toString().padStart(2, 0)}`)
        }
        else {
            ShortToast("error", "msg")
        }
        setLoader(false)
    }

    return (
        <View>
            <StatusBar backgroundColor={colors.GREEN} />
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />
                <Appbar.Content style={{ alignItems: "center", marginRight: W * 0.125 }} title={<Text style={{ color: "white", fontSize: fontSizes.XL, ...fontFamily.bold }}>
                    {strings.MyProfile}</Text>} />

            </Appbar.Header>
            {loader ? <View style={{
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
                    <View style={{ flexDirection: 'row', }}>
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
                            <Text style={styles.text1}>{dataFromApi?.data[0].food_type == true ? "Vegetarian" : "Non-Vegetarian"}</Text>
                        </View>
                    </View>


                    <>
                        {dataFromApi?.data[0].mobile == null || dataFromApi?.data[0].mobile == "" ? null :
                            <>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../assets/icons/phone-call.png')}
                                        style={styles.userIconContainer} />
                                    <Text style={styles.text1}>{dataFromApi?.data[0].mobile}</Text>
                                </View>
                            </>}
                    </>

                    <>
                        {(dataFromApi?.data[0]?.email == "null" || dataFromApi?.data[0].email == null || dataFromApi?.data[0].email == "") ? null :
                            <>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../assets/icons/email.png')}
                                        style={styles.userIconContainer} />
                                    <Text style={styles.text1}>{dataFromApi?.data[0].email}</Text>
                                </View>
                            </>

                        }

                    </>
                    <Text style={{
                        position: "absolute",
                        left: W * 0.42,
                        top: H * 0.2,
                        width: W * 0.57,
                        ...fontFamily.bold,
                        borderWidth: 0.5,
                        paddingHorizontal: W * 0.01,
                    }}>{strings.LastUpdatedat} {lastRefresh}</Text>



                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.containersAdjacent}>
                            <Text style={[styles.text2, { fontSize: fontSizes.XXXL }]}>{dataFromApi?.data[0].total_point}</Text>
                            <Text style={styles.text1}>{strings.TotalPoints}</Text>
                        </View>

                        <View style={styles.containersAdjacent}>
                            <TouchableOpacity onPress={() => navigationTOScreen()}
                                style={styles.button}>
                                <Text style={styles.text3}>{strings.Upgrade}</Text>
                            </TouchableOpacity>
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



                    <TouchableOpacity onPress={() => { setBioModal(true) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/inverted-commas.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>{strings.Bio}</Text>
                                <Text style={styles.text1}>{dataFromApi?.data?.[0]?.bio == "" ? "Write something about youself" : dataFromApi?.data?.[0]?.bio}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/pin.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>{strings.Location}</Text>
                                <Text style={styles.text1}>{dataFromApi?.data?.[0].address == null ? "Your Current Location" : dataFromApi?.data[0].address}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("editProfile") }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/about.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>{strings.BasicInformation}</Text>
                                <Text style={styles.text1}>{strings.HeightWeightAgeGenderActivity}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/report.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>{strings.goals}</Text>
                                <Text style={styles.text1}>{dataFromApi?.data?.[0]?.goal}</Text>
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
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/credit-card.png')}
                                style={styles.userIconContainer} />
                            <View>
                                <Text style={styles.text2}>{strings.PaymentDetails}</Text>
                                <Text style={styles.text1}>{strings.YourPaymentDetails}</Text>
                            </View>
                        </View>
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
        height: HEIGHT,
        width: WIDTH,
        justifyContent: 'space-evenly',
        paddingBottom: HEIGHT * 0.1,

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
        fontFamily: 'Montserrat-SemiBold'
    },
    text1:
    {
        color: 'grey',
        fontSize: fontSizes.MED
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
