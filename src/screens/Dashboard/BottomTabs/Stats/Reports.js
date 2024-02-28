import { FlatList, StyleSheet, TouchableOpacity, View, Modal, Image, Alert, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'
import { Text, TextInput } from 'react-native-paper'
import { colors, fontFamily, fontSizes, GreenButton, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import DocumentPicker from 'react-native-document-picker'
import Loader from '../../../../assets/components/Loader'
import { launchCamera } from 'react-native-image-picker'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import { useLocales } from '../../../../utils/LocalizationUtil'

const Reports = ({ navigation }) => {
    const isFocused = useIsFocused()
    useEffect(() => {
        getAttachments()
    }, [])

    const strings = useLocales()
    useEffect(() => { getLanguage() }, [isFocused])

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

    const [text, setText] = useState("")
    const [data, setData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [loader, setLoader] = useState(true)
    const [description, setDescription] = useState("")
    const [visible2, setVisible2] = useState(false)
    const [visible3, setVisible3] = useState(false)
    const [doc, setDoc] = useState(null)
    const [flag, setFlag] = useState(false)
    const [pic, setPic] = useState(null)
    const [count, setCount] = useState(0)
    const [countDoc, setCountDoc] = useState(0)


    const validation = async () => {
        console.log("countDoc= ", count)
        const userType = await getDataFromLocalStorage('user_type')
        if (JSON.parse(userType) == "1") {
            if (countDoc > 1) {
                setVisible2(false)
                //Alert.alert("Alert", "You can not upload more than 1 files")
                Alert.alert("Alert", strings.Youcannotuploadfiles1)
            } else {
                setVisible2(true)
            }
        } else {
            setVisible2(true)

        }
    }

    const submitLink = async () => {
        setLoader(true)
        setVisible(false)
        const userType = await getDataFromLocalStorage('user_type')
        console.log("count== ", count)
        if (JSON.parse(userType) == "1") {
            if (!!text) {
                if (count < 5) {
                    const temp = await getDataFromLocalStorage('user_id')
                    var formdata = new FormData();
                    formdata.append("user_id", JSON.parse(temp));
                    // formdata.append("reports[]", "hi");
                    formdata.append("links[]", text);
                    formdata.append("description", description)
                    const result = await PostApiData('userreport', formdata)
                    if (result.status == '200') {
                        ShortToast(result.message, 'success', '')
                        getAttachments()
                        setText("")
                        setDescription("")
                        setDoc(null)
                        setPic(null)
                        setVisible(false)
                    }
                    setDoc(null)
                    setPic(null)
                }
                // else ShortToast("You can not upload more than 5 links for now", "error", "")
                else ShortToast(strings.Youcannotupload5, "error", "")
            }
            else {
                ShortToast("Required Field Missing", "error", "")
            }
        } else {
            if (!!text) {
                const temp = await getDataFromLocalStorage('user_id')
                var formdata = new FormData();
                formdata.append("user_id", JSON.parse(temp));
                // formdata.append("reports[]", "hi");
                formdata.append("links[]", text);
                formdata.append("description", description)
                const result = await PostApiData('userreport', formdata)
                if (result.status == '200') {
                    ShortToast(result.message, 'success', '')
                    getAttachments()
                    setText("")
                    setDescription("")
                    setDoc(null)
                    setPic(null)
                    setVisible(false)
                }
                setDoc(null)
                setPic(null)
            }
            else {
                ShortToast("Required Field Missing", "error", "")
            }
        }
        setLoader(false)
    }

    const launchCam = async () => {

        if (Platform.OS == "android") {
            check(PERMISSIONS.ANDROID.CAMERA)
                .then((result) => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            //console.log('This feature is not available (on this device / in this context)');
                            break;
                        case RESULTS.DENIED:
                            //console.log('The permission has not been requested / is denied but requestable');
                            request(PERMISSIONS.ANDROID.CAMERA)
                                .then((result) => {
                                    switch (result) {
                                        case RESULTS.UNAVAILABLE:
                                            //console.log('This feature is not available (on this device / in this context)');
                                            break;
                                        case RESULTS.DENIED:
                                            //console.log('The permission has not been requested / is denied but requestable');
                                            Alert.alert("Error", "Camera Permission Not Granted")

                                            break;
                                        case RESULTS.LIMITED:
                                            //console.log('The permission is limited: some actions are possible');
                                            break;
                                        case RESULTS.GRANTED:
                                            //console.log('The permission is granted');
                                            //setPermission1(true)
                                            launchCamera({
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
                                                        Alert.alert(response?.errorCode)
                                                        console.log(response)
                                                        setPic(response)
                                                        setVisible3(false)
                                                        setVisible2(true)
                                                    }
                                                },
                                            )
                                            break;
                                        case RESULTS.BLOCKED:
                                            //console.log('The permission is denied and not requestable anymore');
                                            break;
                                    }
                                })
                                .catch((error) => {
                                    // …
                                });

                            break;
                        case RESULTS.LIMITED:
                            //console.log('The permission is limited: some actions are possible');
                            break;
                        case RESULTS.GRANTED:
                            //console.log('The permission is granted');
                            //setPermission1(true)
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
                                        Alert.alert('hi')
                                        console.log(response)
                                        setPic(response)
                                        setVisible3(false)
                                        setVisible2(true)
                                    }
                                },
                            )
                            break;
                        case RESULTS.BLOCKED:

                            //console.log('The permission is denied and not requestable anymore');
                            break;
                    }
                })
                .catch((error) => {
                    // …
                });
        }
        else {
            check(PERMISSIONS.IOS.CAMERA)
                .then((result) => {
                    console.log("Camera OPEN=====>", result)
                    console.log("Camera =====>", RESULTS.UNAVAILABLE)
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            Alert.alert('Feature Unavailable', 'This feature is not available on this device')
                            console.log('This feature is not available (on this device / in this context)');
                            break;
                        case RESULTS.DENIED:
                            Alert.alert('Feature Unavailable', 'This feature is not available on this device')
                            //console.log('The permission has not been requested / is denied but requestable');
                            request(PERMISSIONS.IOS.CAMERA)

                                .then((result) => {
                                    switch (result) {
                                        case RESULTS.UNAVAILABLE:
                                            Alert.alert('Feature Unavailable', 'This feature is not available on this device')
                                            //console.log('This feature is not available (on this device / in this context)');
                                            break;
                                        case RESULTS.DENIED:
                                            //console.log('The permission has not been requested / is denied but requestable');
                                            Alert.alert("Error", "Camera Permission Not Granted")

                                            break;
                                        case RESULTS.LIMITED:
                                            Alert.alert('Feature Unavailable', 'This feature is not available on this device')
                                            //console.log('The permission is limited: some actions are possible');
                                            break;
                                        case RESULTS.GRANTED:
                                            //console.log('The permission is granted');
                                            //setPermission1(true)
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
                                                        Alert.alert('Feature Unavailable', response.error)
                                                        console.log('ImagePicker Error: ', response.error);
                                                    } else {
                                                        Alert.alert('Feature Unavailable', 'This feature is not available on this device')
                                                        console.log(response)
                                                        setPic(response)
                                                        setVisible3(false)
                                                        setVisible2(true)
                                                    }
                                                },
                                            )
                                            break;
                                        case RESULTS.BLOCKED:
                                            //console.log('The permission is denied and not requestable anymore');
                                            break;
                                    }
                                })
                                .catch((error) => {
                                    Alert.alert('Feature Unavailable', error)
                                    // …
                                });
                            break;
                        case RESULTS.LIMITED:
                            Alert.alert('Feature Unavailable', 'This feature is not available on this device')
                            //console.log('The permission is limited: some actions are possible');
                            break;
                        case RESULTS.GRANTED:
                            //console.log('The permission is granted');
                            //setPermission1(true)
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
                                        Alert.alert(response?.errorCode)
                                        console.log(response)
                                        setPic(response)
                                        setVisible3(false)
                                        setVisible2(true)
                                    }
                                },
                            )
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert('Feature Unavailable', 'This feature is not available on this device')
                            //console.log('The permission is denied and not requestable anymore');
                            break;
                    }
                })
                .catch((error) => {
                    // …
                    Alert.alert('Error', error)
                });
        }

    }

    const getAttachments = async () => {

        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        const result = await PostApiData('getuserreport', formdata)
        console.log("results == ", result)
        if (result.status == '200') {

            setData(result?.data)
            setFlag(true)
            var a = 0
            var b = 0
            for (let i = 0; i < result.data.length; i++) {
                if (result.data?.[i]?.link == true) {
                    a = a + 1
                    setCount(a)
                    console.log("a", a)

                }
                else {
                    b = b + 1
                    setCountDoc(b)
                    console.log("b", b)
                }
            }
        }
        else {
            setFlag(false)
        }
        setLoader(false)
    }

    const deleteItem = async (id) => {
        setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("attachment_id", id)
        const result = await PostApiData('deleteuserreport', formdata)
        if (result.status == '200') {
            ShortToast(result.message, 'success', '')
            data.length = 0
            getAttachments()
        }
        setLoader(false)
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => { navigation.navigate("ReportsWebView", { "link": item.links, "isLink": item.link }) }}
                style={{
                    paddingVertical: H * 0.01,
                    flexDirection: "row",
                    width: "95%",
                    alignSelf: "center",
                    //height: H * 0.08,
                    // borderWidth: 1,
                    borderRadius: 8,
                    //justifyContent: "center",
                    paddingLeft: W * 0.035,
                    marginVertical: H * 0.01,
                    backgroundColor: colors.OFFWHITE

                }}>

                {
                    item.link
                        ?
                        <Image
                            source={require('../../../../assets/icons/link.png')}
                            style={{
                                height: H * 0.05,
                                width: H * 0.05,
                                alignSelf: "center",
                                marginRight: W * 0.02,
                            }}
                        />
                        :
                        <Image
                            source={require('../../../../assets/icons/attachment.png')}
                            style={{
                                height: H * 0.05,
                                width: H * 0.05,
                                alignSelf: "center",
                                marginRight: W * 0.02,
                            }}
                        />
                }

                <View>
                    <Text style={{
                        ...fontFamily.bold,
                        fontSize: fontSizes.XL,
                        width: W * 0.6
                    }}>
                        {item?.links}
                    </Text>
                    <Text style={{
                        color: "grey",
                        width: W * 0.6
                    }}>
                        {item?.link_description}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => { deleteItem(item?.linkid) }}
                    style={{
                        //marginLeft: W * 0.7,
                        // position: "absolute",
                        alignSelf: "center",
                    }}>
                    <AntDesign
                        name="delete"
                        style={{

                        }}
                        size={18}
                    />
                </TouchableOpacity>
            </TouchableOpacity>

        )
    }

    const pickDocument = async () => {
        console.log("document picker here")
        const res = await DocumentPicker.pickSingle()
        console.log(res)
        setDoc(res)
        setVisible3(false)
        setVisible2(true)
    }

    const uploadDoc = async () => {

        // const userType = await getDataFromLocalStorage('user_type')
        // console.log("countDoc== ", countDoc)
        // if (JSON.parse(userType) == "1") {
        //     if (doc) {
        //         if (countDoc == 0) {
        //             setLoader(true)
        //             const temp = await getDataFromLocalStorage('user_id')
        //             var formdata = new FormData();
        //             formdata.append("user_id", JSON.parse(temp));
        //             formdata.append('reports[]', {
        //                 name: doc?.name,
        //                 type: doc?.type,
        //                 uri: doc?.uri,
        //             })
        //             //formdata.append("links[]", text);
        //             formdata.append("description", description)
        //             const result = await PostApiData('userreport', formdata)
        //             if (result.status == '200') {
        //                 ShortToast(result.message, 'success', '')
        //                 getAttachments()
        //                 setText("")
        //                 setDescription("")
        //                 setVisible(false)
        //             }
        //             setLoader(false)
        //             setVisible2(false)
        //         }
        //         else {
        //             //   ShortToast("You can not upload more than 1 file for now.", "error", "")
        //             ShortToast(strings.Youcannotuploadfiles1, "error", "")
        //         }

        //     }
        //     else if (pic) {
        //         if (countDoc == 0) {
        //             setLoader(true)
        //             const temp = await getDataFromLocalStorage('user_id')
        //             var formdata = new FormData();
        //             formdata.append("user_id", JSON.parse(temp));
        //             formdata.append('reports[]', {
        //                 name: pic.assets?.[0]?.fileName,
        //                 type: pic.assets?.[0]?.type,
        //                 uri: pic.assets?.[0]?.uri,
        //             })
        //             //formdata.append("links[]", text);
        //             formdata.append("description", description)
        //             const result = await PostApiData('userreport', formdata)
        //             if (result.status == '200') {
        //                 ShortToast(result.message, 'success', '')
        //                 getAttachments()
        //                 setText("")
        //                 setDescription("")
        //                 setVisible(false)
        //             }
        //             setLoader(false)
        //             setVisible2(false)
        //         } else {
        //             //ShortToast("You can not upload more than 1 file for now.", "error", "")
        //             ShortToast(strings.Youcannotuploadfiles1, "error", "")
        //         }
        //     }
        //     else {
        //         ShortToast('Kindly choose a document first', 'warning', '')
        //     }
        //     setDoc(null)
        //     setPic(null)
        //     getAttachments()
        // } else {
        if (doc) {
            setLoader(true)
            const temp = await getDataFromLocalStorage('user_id')
            var formdata = new FormData();
            formdata.append("user_id", JSON.parse(temp));
            formdata.append('reports[]', {
                name: doc?.name,
                type: doc?.type,
                uri: doc?.uri,
            })
            //formdata.append("links[]", text);
            formdata.append("description", description)
            const result = await PostApiData('userreport', formdata)
            if (result.status == '200') {
                ShortToast(result.message, 'success', '')
                getAttachments()
                setText("")
                setDescription("")
                setVisible(false)
            }
            setLoader(false)
            setVisible2(false)

        }
        else if (pic) {
            setLoader(true)
            const temp = await getDataFromLocalStorage('user_id')
            var formdata = new FormData();
            formdata.append("user_id", JSON.parse(temp));
            formdata.append('reports[]', {
                name: pic.assets?.[0]?.fileName,
                type: pic.assets?.[0]?.type,
                uri: pic.assets?.[0]?.uri,

            })
            //formdata.append("links[]", text);
            formdata.append("description", description)
            const result = await PostApiData('userreport', formdata)
            if (result.status == '200') {
                ShortToast(result.message, 'success', '')
                getAttachments()
                setText("")
                setDescription("")
                setVisible(false)
            }
            setLoader(false)
            setVisible2(false)
        }
        else {
            ShortToast('Kindly choose a document first', 'warning', '')
        }
        setDoc(null)
        setPic(null)
        getAttachments()
    }
    //}


    return (
        loader ?
            <Loader />
            :
            <View>
                <HeaderForSubmissionScreens Title={strings.UploadReports} />
                <View style={{}}>
                    <Modal
                        visible={visible}
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
                                paddingVertical: H * 0.03,
                                // height: H * 0.32,
                                width: W * 0.9,
                                justifyContent: "center",
                                elevation: 8
                            }}>
                                <Text style={{
                                    ...fontFamily.bold,
                                    // top: -H * 0.06,
                                    //left: W * 0.05,
                                    fontSize: fontSizes.XXL,
                                    textAlign: "center",
                                    paddingVertical: H * 0.02
                                }}>{strings.AddReportLinks}</Text>

                                <View style={{
                                    flexDirection: "row",
                                    backgroundColor: colors.OFFWHITE,
                                    borderRadius: 4,
                                    justifyContent: "center",
                                }}>

                                </View>
                                <TextInput
                                    //textBreakStrategy="balanced"
                                    // textAlign='left'
                                    placeholder={strings.YourLink}

                                    //textAlignVertical="auto"
                                    activeUnderlineColor={colors.GREEN}
                                    value={text}
                                    onChangeText={(t) => { setText(t) }}
                                    maxLength={100}
                                    style={{
                                        marginVertical: H * 0.02,
                                        width: '90%',
                                        backgroundColor: "white",
                                        alignSelf: "center"
                                    }} />
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    //textBreakStrategy="balanced"
                                    // textAlign='left'
                                    placeholder={strings.Description}
                                    //textAlignVertical="auto"
                                    activeUnderlineColor={colors.GREEN}
                                    value={description}
                                    onChangeText={(t) => { setDescription(t) }}
                                    maxLength={100}
                                    style={{
                                        marginVertical: H * 0.02,
                                        //height: H * 0.15,
                                        width: '90%',
                                        backgroundColor: "white",
                                        alignSelf: "center"
                                    }} />
                                <View style={{
                                    flexDirection: "row",
                                    width: '100%',
                                    justifyContent: "space-evenly",
                                    paddingVertical: H * 0.02,
                                    // top: H * 0.05
                                }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            submitLink()}>

                                        <Text style={{
                                            textAlign: "right",
                                            ...fontFamily.bold,
                                            color: colors.GREEN,
                                            // top: H * 0.055,
                                            // left: -W * 0.06
                                        }}>{strings.Submit}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setVisible(false)}>

                                        <Text style={{
                                            textAlign: "right",
                                            ...fontFamily.bold,
                                            color: "red",
                                            // top: H * 0.055,
                                            //left: -W * 0.06
                                        }}>{strings.Cancel}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        visible={visible2}
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
                                paddingVertical: H * 0.03,
                                // height: H * 0.32,
                                width: W * 0.9,
                                justifyContent: "center",
                                elevation: 8
                            }}>
                                <Text style={{
                                    ...fontFamily.bold,
                                    // top: -H * 0.06,
                                    //left: W * 0.05,
                                    fontSize: fontSizes.XXL,
                                    textAlign: "center",
                                    paddingVertical: H * 0.02
                                }}>{strings.UploadAttachments}</Text>
                                <TextInput
                                    left={
                                        <TextInput.Icon
                                            icon="attachment"
                                            style={{
                                                top: -H * 0.02,
                                                backgroundColor: doc || pic ? "yellow" : "white"
                                            }}
                                            color={doc || pic ? colors.GREEN : "grey"}
                                            onPress={() => {
                                                setVisible2(false)
                                                setVisible3(true)
                                            }}
                                        />}

                                    multiline
                                    numberOfLines={4}
                                    //textBreakStrategy="balanced"
                                    // textAlign='left'
                                    placeholder={strings.AttachmentDescriptionHere}

                                    //textAlignVertical="auto"
                                    activeUnderlineColor={colors.GREEN}
                                    value={description}
                                    onChangeText={(t) => { setDescription(t) }}
                                    maxLength={100}
                                    style={{
                                        marginVertical: H * 0.02,
                                        //height: H * 0.15,
                                        width: '90%',
                                        backgroundColor: "white",
                                        alignSelf: "center"
                                    }} />

                                <View style={{
                                    flexDirection: "row",
                                    width: '100%',
                                    justifyContent: "space-evenly",
                                    paddingVertical: H * 0.02,
                                    // top: H * 0.05
                                }}>
                                    <TouchableOpacity onPress={() =>
                                        uploadDoc()}>

                                        <Text style={{
                                            textAlign: "right",
                                            ...fontFamily.bold,
                                            color: colors.GREEN,
                                            // top: H * 0.055,
                                            // left: -W * 0.06
                                        }}>{strings.Submit}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setPic(null)
                                        setDoc(null)
                                        setVisible2(false)
                                    }

                                    }>

                                        <Text style={{
                                            textAlign: "right",
                                            ...fontFamily.bold,
                                            color: "red",
                                            // top: H * 0.055,
                                            //left: -W * 0.06
                                        }}>{strings.Cancel}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        visible={visible3}
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
                                    <TouchableOpacity

                                        onPress={() => { launchCam() }}>


                                        <View style={{
                                            alignItems: "center",
                                            marginHorizontal: W * 0.1,
                                            marginVertical: H * 0.01,
                                        }}>
                                            <AntDesign name="camera" size={50} color={"silver"} />
                                            <Text style={{
                                                ...fontFamily.bold,
                                                fontSize: fontSizes.MED
                                            }}>{strings.OpenCamera}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => { pickDocument() }}>
                                        <View style={{
                                            alignItems: "center",
                                            marginHorizontal: W * 0.1,
                                            marginVertical: H * 0.01,
                                        }}>
                                            <AntDesign name="file1" size={50} color={"silver"} />
                                            <Text style={{
                                                ...fontFamily.bold,
                                                fontSize: fontSizes.MED
                                            }}>{strings.AddFiles}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setVisible3(false)
                                    setVisible2(true)
                                }}>
                                    <Text style={{
                                        textAlign: "right",
                                        ...fontFamily.bold,
                                        color: "red",
                                        top: H * 0.055,
                                        left: -W * 0.06
                                    }}>{strings.Cancel}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View style={{
                        backgroundColor: "white",
                        height: H * 0.54,
                        marginTop: H * 0.02,
                        width: W * 0.9,
                        alignSelf: "center",
                        borderRadius: 8
                    }}>
                        {!flag ? <Text style={{
                            ...fontFamily.bold,
                            alignSelf: "center",
                            marginTop: H * 0.3
                        }}>{strings.YourReportsWillBeVisibleHere}</Text> : null}
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${index}`}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setVisible(true)
                        }}
                        style={{
                            marginTop: H * 0.02
                        }}>
                        <GreenButton Title={strings.AddReportLinks} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setVisible2(true)}
                        style={{
                            marginTop: H * 0.02
                        }}>
                        <GreenButton Title={strings.AddFiles} />
                    </TouchableOpacity>
                </View >
            </View >
    )
}

const styles = StyleSheet.create({})
export default Reports
