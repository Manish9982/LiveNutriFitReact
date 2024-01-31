import { FlatList, View, Image, Keyboard, Modal, TouchableOpacity, StyleSheet, PermissionsAndroid, Linking, Alert, StatusBar, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Appbar, Divider, Portal, ProgressBar, Text, TextInput } from 'react-native-paper'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { color, spring } from 'react-native-reanimated'
import DataContext from '../../../../context/DataContext'
import { useIsFocused } from '@react-navigation/native'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import ImagePicker from 'react-native-image-crop-picker';
import { Rating, AirbnbRating } from 'react-native-ratings'
import SweetAlert from 'react-native-sweet-alert'
import Loader from '../../../../assets/components/Loader'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DocumentPicker from 'react-native-document-picker'
import { requestCameraAndGalleryPermissions } from '../../../../colorSchemes/RequestPermissions'



//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});



const Coach = ({ navigation }) => {
  const isFocused = useIsFocused()
  const interval = useRef();
  const { NisInfoButtonVisible, Nmessages, Ncount } = useContext(DataContext)
  const [messages, setMessages] = Nmessages
  const [count, setCount] = Ncount
  const [data, setData] = useState(null)
  const [text, setText] = useState("")
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [isInfoButtonVisible, setIsInfoButtonVisible] = NisInfoButtonVisible
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [camVisible, setCamVisible] = useState(false)
  const [buttonBgColor, setButtonBgColor] = useState(colors.ORANGE)
  const [buttonBgColor2, setButtonBgColor2] = useState(colors.OFFWHITE)
  const [textColor, setTextColor] = useState('white')
  const [textColor2, setTextColor2] = useState('black')
  const [visible, setVisible] = useState(false)
  const [description, setDescription] = useState("")
  const [rating, setRating] = useState("")
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const [userType, setUserType] = useState("")
  const [popupvisible, setPopupvisible] = useState(false)

  const H = useWindowDimensions().height
  const W = useWindowDimensions().width

  const styles = makeStyles(H, W)

  useEffect(() => {
    if (isFocused) {
      //showCallAlertMessage()

      //getMessages()
    }
  },
    [isFocused])


  useEffect(() => {
    if (isFocused) {
      getMessages(),
        getLanguage(),
        setIsInfoButtonVisible(false)
      requestCameraPermission()
      markMessageAsRead()
    }
  }, [isFocused])



  useEffect(() => {
    removeValue()
  }, [])

  //lng
  const getLanguage = async () => {
    const lang = await getDataFromLocalStorage("lang")
    strings.setLanguage(lang)
  }


  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('upgradepopup')
    } catch (e) {
      // remove error
    }

    console.log('Done.')
  }


  const markMessageAsRead = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("id", JSON.parse(temp));
    const result = await PostApiData('read_message', formdata)
    if (result.status == '200') {
      console.log(result)
      setCount(null)
    }
  }
  const markRatingAsRead = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("id", JSON.parse(temp));
    const result = await PostApiData('read_rating', formdata)
    if (result.status == '200') {
      console.log(result)
      //  setCount(null)
    }
  }


  const callRequestToCoach = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp));
    const result = await PostApiData('call_alert', formdata)
    if (result.status == 200) {
      console.log(result)
      //  setCount(null)
      navigation.navigate("Stats")
    }
  }


  const toastMobileEmail = async () => {
    const userTypee = await getDataFromLocalStorage('user_type')
    if (JSON.parse(userTypee) == "1") {
      Alert.alert("Alert", strings.ThisfeatureforPaidCorporateUser)
    } else {
      scheduleWhatsappCall()

    }
  }

  const yourRef = useRef(null)

  const getMessages = async () => {

    setLoader(true)

    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    const temp2 = await getDataFromLocalStorage('coach_id')
    const userTypee = await getDataFromLocalStorage('user_type')
    formdata.append("user_id", JSON.parse(temp));
    //formdata.append("reciever_id", JSON.parse(temp2))
    formdata.append("reciever_id", "")
    const result = await PostApiData('getusermessage', formdata)

    console.log("type ===== ", result)

    if (result.status == '200') {
      setData(result)
      setMessages(result.data.reverse())

      markRatingAsRead()

      // if (JSON.parse(userTypee) == "1") {

      // } else {
      //   markRatingAsRead()
      //   // if (result.hideunhiderating == "true") {
      //   //   setVisible(true)
      //   // } else {
      //   //   setVisible(false)
      //   // }
      // }


    }
    setLoader(false)
  }

  const submitRating = async () => {
    var formdata = new FormData();

    const temp = await getDataFromLocalStorage('user_id')
    const temp2 = await getDataFromLocalStorage('coach_id')
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("coach_id", JSON.parse(temp2));
    formdata.append("rating", rating);
    formdata.append("description", description)
    const result = await PostApiData('coachrating', formdata)
    if (result.status == '200') {
      ShortToast(result.message, 'success', '')
    }
    else {
      ShortToast(result.message, 'error', '')
    }
  }

  const uploadPhoto = async (pic) => {
    setLoading(true)
    console.log("gallery pic", pic)
    console.log("gallery pic", pic?.[0]?.mime,)
    console.log("gallery pic", pic?.[0]?.path,)
    console.log(pic.length)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    const temp2 = await getDataFromLocalStorage('coach_id')
    formdata.append("user_id", JSON.parse(temp));
    if (pic.length > 1) {

      for (var i = 0; i < pic.length; i++) {
        formdata.append('icon[]', {
          name: pic?.[i]?.path,
          type: pic?.[i]?.mime,
          uri: pic?.[i]?.path,
        });
      }
    }
    else {
      formdata.append('icon[]', {
        name: pic?.[0]?.path,
        type: pic?.[0]?.mime,
        uri: pic?.[0]?.path
      })
    }
    formdata.append("reciever_id", JSON.parse(temp2));
    console.log("FORMDATA====================================================", formdata)
    const result = await PostApiData('sendermessage', formdata)
    if (result.status == '200') {
      setCamVisible(false)
      setLoading(false)
      getMessages()
    }
    else ShortToast(result.message, 'error', '')
    setLoading(false)
  }
  const uploadCamPic = async (pic) => {
    setLoading(true)
    console.log("cam pic", pic)
    console.log("pic.mime", pic.mime)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    const temp2 = await getDataFromLocalStorage('coach_id')
    formdata.append("user_id", JSON.parse(temp));
    formdata.append('icon[]', {
      name: pic?.path,
      type: pic?.mime,
      uri: pic?.path
    })
    formdata.append("reciever_id", JSON.parse(temp2));
    const result = await PostApiData('sendermessage', formdata)
    if (result.status == '200') {
      setCamVisible(false)
      setLoading(false)
      getMessages()
    }
    else ShortToast(result.message, 'error', '')
    setLoading(false)

  }
  const uploadPdf = async (pdf) => {
    setLoading(true)
    console.log(pdf)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    const temp2 = await getDataFromLocalStorage('coach_id')
    formdata.append("user_id", JSON.parse(temp));
    formdata.append('pdf', {
      name: pdf?.[0]?.name,
      type: pdf?.[0]?.type,
      uri: pdf?.[0]?.uri
    })

    formdata.append("reciever_id", JSON.parse(temp2));

    console.log("REQUEST++++++++++++   ", formdata)
    const result = await PostApiData('sendermessage', formdata)
    if (result.status == '200') {
      //setCamVisible(false)
      setLoading(false)
      getMessages()
    }
    else ShortToast(result.message, 'error', '')
    setLoading(false)

  }

  const launchCam = async () => {
    if (Platform.OS == "android") {
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
          try {
            const pic = await ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
            });
            console.log("CAmPic======>", pic)
            uploadCamPic(pic)
            setCamVisible(false)
          } catch (err) {
            ShortToast(`${err}`, 'error', '');
          }
        } else {
          ShortToast("Camera permission denied", 'error', '');
        }
      } catch (err) {
        ShortToast(err, "error", "");
      }
    }
    else {
      try {
        const pic = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });
        console.log("CAmPic======>", pic)
        uploadCamPic(pic)
        setCamVisible(false)
      } catch (err) {
        ShortToast(`${err}`, 'error', '');
      }
    }
  };

  const launchGallery = async () => {
    ImagePicker.openPicker({
      multiple: true,
      //maxFiles: 5,
      mediaType: 'photo'
    }).then(images => {

      uploadPhoto(images)
      //ShortToast('Hi', 'progress', '')

    });

  }

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.pick({
        // type: [DocumentPicker.types.pdf, DocumentPicker.types.docx], // Filter for PDF files only
        type: [DocumentPicker.types.pdf], // Filter for PDF files only
      });

      // Handle the selected PDF file here
      console.log(
        result
      );

      uploadPdf(result)

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User canceled the document picker
      } else {
        // Handle other errors
        console.error('Error picking a PDF file:', err);
      }
    }
  };

  const scheduleWhatsappCall = async () => {
    Linking.openURL('whatsapp://send?text=Hello, I would like to Schedule a Call with my Coach&phone=+919990025252')
  }

  const requestCameraPermission = async () => {
    if (Platform.OS == "android") {
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
    }
    else {
      requestCameraAndGalleryPermissions()
    }

  }

  const getTimeFromStamp = (timestamp) => {

    const date = new Date(Number.parseInt(timestamp, 10) * 1000)
    var hour = date.getHours().toString().padStart(2, 0)
    var minutes = date.getMinutes().toString().padStart(2, 0)
    var date2 = date.getDate().toString().padStart(2, 0)
    var month = (date.getMonth() + 1).toString().padStart(2, 0)
    var year = date.getFullYear().toString()
    return `${date2}/${month}/${year}  ${hour}:${minutes}`
  }




  // const getTimeFromStamp = (timestamp) => {
  //   const date = new Date(Number.parseInt(timestamp, 10) * 1000);

  //   var hour = date.getHours();
  //   var period = hour >= 12 ? 'PM' : 'AM';

  //   // Convert to 12-hour format
  //   hour = (hour % 12) || 12;

  //   var minutes = date.getMinutes().toString().padStart(2, '0');
  //   var date2 = date.getDate().toString().padStart(2, '0');
  //   var month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   var year = date.getFullYear().toString();

  //   return `${date2}/${month}/${year}  ${hour}:${minutes} ${period}`;
  // }


  const renderItem = ({ item, index }) => {
    if (item.reciever_message == ""
      && item.receiver_icon.length == 0
      && item.icon.length == 0 && item?.message_type == 'text') {
      return (
        <>
          < View style={{
            backgroundColor: colors.GREEN,
            paddingHorizontal: W * 0.05,
            paddingVertical: H * 0.02,
            justifyContent: "center",
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            alignSelf: "flex-end",
            marginRight: W * 0.02,
            marginTop: H * 0.02,
            maxWidth: W * 0.85,
          }
          }>
            <Text style={{
              color: "white",
              ...fontFamily.bold
            }}>{item.user_message}</Text>
            <Text style={{
              marginTop: H * 0.01,
              fontSize: fontSizes.EXTRASM,
              color: "white"
            }}>{getTimeFromStamp(item.created)}</Text>


            {/* <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize:fontSizes.SM,
            color:colors.OFFWHITE }}>{item?.coachname}</Text> */}

          </View >
        </>
      )
    }

    else if (item.user_message == ""
      && item.icon.length == 0 &&
      item.receiver_icon.length == 0 && item?.message_type == 'text') {
      return (
        <>
          <View style={{
            backgroundColor: "white",
            paddingHorizontal: W * 0.05,
            paddingVertical: H * 0.02,
            justifyContent: "center",
            alignSelf: "flex-start",
            maxWidth: W * 0.7,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginLeft: W * 0.02,
            marginTop: H * 0.02,
          }}>
            <Text style={{


            }
            }>{item.reciever_message}</Text>
            <Text style={{
              marginTop: H * 0.01,
              fontSize: fontSizes.EXTRASM,
            }}>{getTimeFromStamp(item.created)}</Text>

            <Text style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: fontSizes.SM,
              marginTop: 5,
              color: "black"
            }}>By - {item?.coachname}</Text>
          </View>
        </>
      )
    }
    else if (item?.message_type == "pdf") {


      if (item?.sender_pdf == "") {
        return (

          <TouchableOpacity
            style={{
              marginTop: 15,
              marginStart: 10,

            }}
            onPress={() => {
              navigation.navigate("ChatPdfViewer", { url: `${item?.base_url}${item?.receiver_pdf}` })
            }}
          >
            <Image

              style={{
                width: W * 0.25,
                height: W * 0.3,

              }}
              source={require('../../../../assets/icons/pdf.png')} />

            <Text style={{
              fontSize: fontSizes.EXTRASM,
              color: "black",
              marginTop: 4,
              marginStart: 10
            }}>{getTimeFromStamp(item.created)}</Text>
          </TouchableOpacity>

        )
      } else {
        return (
          <TouchableOpacity
            style={{

              alignSelf: 'flex-end',
              marginTop: 15,
              marginEnd: 10,

            }}

            onPress={() => {
              navigation.navigate("ChatPdfViewer", { url: `${item?.base_url}${item?.sender_pdf}` })
            }}
          >
            <Image

              style={{
                width: W * 0.25,
                height: W * 0.3,
              }}
              source={require('../../../../assets/icons/pdf.png')} />

            <Text style={{
              fontSize: fontSizes.EXTRASM,
              color: "black",
              textAlign: 'center',
              marginTop: 5,
            }}>{getTimeFromStamp(item.created)}</Text>
          </TouchableOpacity>

        )
      }



    }
    else if (item.icon.length !== 0) {
      return (
        <>
          < View style={{
            backgroundColor: colors.GREEN,
            paddingHorizontal: W * 0.05,
            paddingVertical: H * 0.005,
            justifyContent: "center",
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            alignSelf: "flex-end",
            marginRight: W * 0.02,
            marginTop: H * 0.02,
            maxWidth: W * 0.7,
            flexDirection: "row"
          }}>
            <TouchableOpacity onPress={() =>
              navigation.navigate("ChatImageDisplay",
                { "icon": item.icon, "base": `${item.base_url}` })}>

              <Image source={{ uri: `${item.base_url}${item.icon[0]}` }}
                style={{ height: W * 0.34, width: W * 0.34, }} />
              <Text style={{
                marginTop: H * 0.01,
                fontSize: fontSizes.EXTRASM,
                color: "white"
              }}>{getTimeFromStamp(item.created)}</Text>
            </TouchableOpacity>
            {item.icon.length > 1
              ?
              <>
                <TouchableOpacity onPress={() =>
                  navigation.navigate("ChatImageDisplay",
                    { "icon": item.icon, "base": `${item.base_url}` })}>
                  <View style={{
                    backgroundColor: 'rgba(5,5,5,0.8)',
                    justifyContent: "center"
                  }}>
                    <Text style={{
                      color: "white",
                      position: "absolute",
                      alignSelf: "center",
                      zIndex: 100,
                      fontSize: 35,
                      shadowOpacity: 1,
                      ...fontFamily.bold,
                    }}>{item.icon.length - 2 == 0 ? "" : `+${item.icon.length - 2}`}</Text>
                    <Image source={{ uri: `${item.base_url}${item.icon[1]}` }}
                      style={{ height: W * 0.34, width: W * 0.34, zIndex: -2 }} />
                    <Text style={{
                      marginTop: H * 0.01,
                      fontSize: fontSizes.EXTRASM,

                    }}>{getTimeFromStamp(item.created)}</Text>
                  </View>
                </TouchableOpacity>
              </>
              :
              <>
              </>
            }

          </View >
        </>
      )
    }
    else if (item.receiver_icon.length !== 0) {
      return (
        <>
          < View style={{
            backgroundColor: "white",
            paddingHorizontal: W * 0.05,
            paddingVertical: H * 0.005,
            justifyContent: "center",
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            alignSelf: "flex-start",
            marginLeft: W * 0.02,
            marginTop: H * 0.02,
            maxWidth: W * 0.7,
            flexDirection: "row"
          }}>
            <TouchableOpacity onPress={() => navigation.navigate("ChatImageDisplay", { "icon": item.receiver_icon, "base": `${item.base_url}` })}>

              <Image source={{ uri: `${item.base_url}${item.receiver_icon[0]}` }}
                style={{ height: W * 0.34, width: W * 0.34 }} />
              <Text style={{
                marginTop: H * 0.01,
                fontSize: fontSizes.EXTRASM,

              }}>{getTimeFromStamp(item.created)}</Text>
            </TouchableOpacity>
            {item.receiver_icon.length > 1
              ?
              <>
                <TouchableOpacity onPress={() => navigation.navigate("ChatImageDisplay", { "icon": item.receiver_icon, "base": `${item.base_url}` })}>
                  <View style={{
                    backgroundColor: 'rgba(5,5,5,0.4)',
                    justifyContent: "center"
                  }}>
                    <Text style={{
                      color: "white",
                      position: "absolute",
                      alignSelf: "center",
                      zIndex: 100,
                      fontSize: 35,
                      shadowOpacity: 1,
                      ...fontFamily.bold,
                    }}>{item.receiver_icon.length - 2 == 0 ? "" : `+${item.receiver_icon.length - 2}`}</Text>
                    <Image source={{ uri: `${item.base_url}${item.receiver_icon[1]}` }}
                      style={{ height: W * 0.34, width: W * 0.34, zIndex: -2 }} />
                    <Text style={{
                      marginTop: H * 0.01,
                      fontSize: fontSizes.EXTRASM,
                      color: "white",
                    }}>{getTimeFromStamp(item.created)}</Text>
                  </View>
                </TouchableOpacity>
              </>
              :
              <>
              </>
            }

          </View >
        </>
      )
    }

  }

  const onSend = async () => {
    if (text !== "") {
      var formdata = new FormData();
      const temp = await getDataFromLocalStorage('user_id')
      const temp2 = await getDataFromLocalStorage('coach_id')
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("user_message", text);
      formdata.append("reciever_id", JSON.parse(temp2));
      const result = await PostApiData('sendermessage', formdata)
      console.log(result)
      setMessages([{
        "user_message": `${text}`,
        "reciever_message": "",
        "receiver_icon": [],
        "icon": [],
        "created": Date.now() / 1000
      }, ...messages])
      getMessages()
      setText("")
    }

  }

  const handleOnPress1 = () => {
    setButtonBgColor(colors.ORANGE)
    setButtonBgColor2(colors.OFFWHITE)
    setTextColor('white')
    setTextColor2('black')
    // setMealMenuIsVisible(true)
  }
  const handleOnPress2 = () => {
    setButtonBgColor(colors.OFFWHITE)
    setButtonBgColor2(colors.ORANGE)
    setTextColor('black')
    setTextColor2('white')
    ShortToast(strings.FeatureComingSoon, 'warning', '')
    handleOnPress1()
    // setMealMenuIsVisible(false)
  }

  return (
    loader ?
      <>
        <Loader />
      </>
      :
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
      >

        <View>
          <StatusBar backgroundColor={colors.GREEN} />
          <Appbar.Header style={{
            backgroundColor: colors.GREEN,
            width: W
          }}>
            {/* <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} /> */}
            <Appbar.Content style={{
              alignItems: "center",
            }}
              title={<Text style={{
                color: "white",
                fontSize: fontSizes.XL,
                fontFamily: "Montserrat-SemiBold"
              }}>LiveNutriFit {strings.Coach}</Text>} />
          </Appbar.Header>
        </View>

        <>
        </>
        <View style={styles.ButtonDisplayContainer}>
          {/* <TouchableOpacity onPress={() => { handleOnPress1() }} style={[styles.mealButton, { backgroundColor: buttonBgColor }]}>
            <Text style={[styles.textStyle, { color: textColor }]}>{strings.Coach}</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => { handleOnPress2() }} style={[styles.ExerciseButton, { backgroundColor: buttonBgColor2 }]}>
            <Text style={[styles.textStyle, { color: textColor2 }]}>{strings.Doctor}</Text>
          </TouchableOpacity> */}

        </View>


        <View style={{
          flexDirection: 'row',
          //paddingVertical: H * 0.02,
          paddingHorizontal: W * 0.03,
          backgroundColor: '#e8e9eb',
        }}>
          <View>
            <Image source={{ uri: data?.coachimage }}
              style={{
                height: H * 0.1,
                width: H * 0.1,
                borderRadius: H * 0.05,
                borderColor: '#8eb4ed',
                borderWidth: 1,
                resizeMode: 'contain'
              }} />
          </View>
          <View style={{
            justifyContent: 'center',
            // width: W * 0.38,
            width: W * 0.9,
            marginLeft: W * 0.025
          }}>
            <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>{data?.coachname}</Text>
            <Text style={{ fontSize: fontSizes.SM, marginVertical: H * 0.005 }}>{strings.YourPersonalHealthAssistant}</Text>

            <TouchableOpacity onPress={() => {
              // data.hideunhiderating == "true" ? setVisible(true) : setVisible(true)
              setVisible(true)
            }}>

              <Text style={{
                fontSize: fontSizes.MED,
                color: "green"
              }}>{strings.AddRatings}</Text>
            </TouchableOpacity>
          </View>
          {/* <Divider style={{
            width: 1,
            height: H * 0.1
          }} /> */}
          {/* <TouchableOpacity
            onPress={() => { scheduleWhatsappCall() }} modified
            // onPress={() => { toastMobileEmail() }}
            style={{
              alignSelf: 'center',
              marginLeft: W * 0.032
            }}>
            <Image source={require('../../../../assets/icons/phone-call1.png')}
              style={{
                height: H * 0.05,
                width: H * 0.05,
                borderRadius: H * 0.025,
                tintColor: colors.ORANGE
              }}
            />
          </TouchableOpacity> */}
          {/* <View style={{
            justifyContent: 'center',
            width: W * 0.2,
            marginLeft: W * 0.015
          }}>
            <Text style={{ color: colors.ORANGE }}>{strings.Scheduleacall}</Text>
          </View> */}
        </View>




        <View style={{
          flex: 1,
        }}>
          {/******************************************************** User Ratings***************************************************************** */}
          <Modal
            transparent={true}
            visible={loading}>
            <View style={{
              height: H,
              width: W,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <View style={{
                height: H * 0.2,
                width: W * 0.9,
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Portal>
                  <ProgressBar visible={true} indeterminate={true} color={colors.GREEN} />
                </Portal>
              </View>
            </View>
          </Modal >

          <Modal visible={popupvisible}
            transparent={true}
          >
            <View style={{
              height: H,
              width: W,
              justifyContent: "center",
              alignItems: "center",
              //  backgroundColor: "rgba(0,0,0,0.93)",
              backgroundColor: "grey",

            }}>
              <View style={{
                //paddingVertical: H * 0.05,
                height: H * 0.35,
                width: W * 0.9,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                elevation: 10
              }}>

                <Text style={{
                  ...fontFamily.bold,
                  fontSize: fontSizes.XXXL,
                  textAlign: 'center',
                }}>
                  Alert!
                </Text>

                <Text style={{
                  textAlign: 'center',
                  padding: 10,
                  fontSizes: fontSizes.MED,
                }}>
                  {strings.freecoachmsg}
                </Text>


                <View style={{
                  flexDirection: "row",
                  width: W,
                  marginTop: H * 0.02,
                  justifyContent: "space-evenly"
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      //submitRating()
                      setPopupvisible(false)
                      navigation.navigate("Upgrade")
                    }}
                    style={{
                      backgroundColor: colors.GREEN,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: W * 0.04,
                      borderRadius: 8,
                    }}>
                    <Text style={{
                      width: W * 0.14, textAlign: 'center',
                      color: "white",
                      ...fontFamily.bold
                    }}>{strings.Ok}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {

                      Alert.alert('Alert!', strings.coachalertmsg, [
                        {
                          text: 'OKAY', onPress: () => {

                            callRequestToCoach()

                          }
                        },]);

                    }}
                    style={{
                      backgroundColor: colors.BAD_COLOR,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: W * 0.04,
                      paddingVertical: H * 0.01,
                      borderRadius: 8,
                    }}>
                    <Text style={{ ...fontFamily.bold }}>{strings.Cancel}</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>

          <Modal visible={visible}
            transparent={true}
          ><View style={{
            height: H,
            width: W,
            justifyContent: "center",
            alignItems: "center"
          }}>
              <View style={{
                padding: 10,
                alignSelf: 'center',
                // height: H * 0.5,
                width: W * 0.9,
                backgroundColor: "white",
                borderRadius: 10,
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Rating
                  showRating
                  ratingTextColor='black'
                  startingValue={0}
                  onFinishRating={(t) => { setRating(t) }}
                  style={{}}
                />
                <Text style={{
                  ...fontFamily.bold,
                  marginTop: 10,
                }}>
                  {strings.comments} :
                </Text>
                <TextInput
                  value={description}
                  onChangeText={(t) => { setDescription(t) }}
                  style={{
                    width: W * 0.8,
                    alignSelf: "center",
                    backgroundColor: colors.OFFWHITE,
                    marginTop: 10,
                  }}
                />

                <View style={{
                  flexDirection: "row",
                  width: W,
                  marginTop: 10,
                  justifyContent: "space-evenly"
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      submitRating()
                      setVisible(false)
                    }}
                    style={{
                      backgroundColor: colors.GREEN,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: W * 0.04,
                      paddingVertical: H * 0.01,
                      borderRadius: 8,
                    }}>
                    <Text style={{
                      color: "white",
                      ...fontFamily.bold
                    }}>{strings.Submit}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setVisible(false)
                    }}
                    style={{
                      backgroundColor: colors.BAD_COLOR,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: W * 0.04,
                      paddingVertical: H * 0.01,
                      borderRadius: 8,
                    }}>
                    <Text style={{ ...fontFamily.bold }}>{strings.Cancel}</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>


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
                    <View style={styles.galleryModal}>
                      <AntDesign name="picture" size={50} color={"silver"} />
                      <Text style={styles.fonts}>Gallery</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setCamVisible(false)}
                >
                  <Text style={styles.cancelButton}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>


          <View style={styles.messageList}>
            <FlatList
              // initialScrollIndex={117}
              inverted
              ref={yourRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${index}`}

            />
          </View>



        </View >

        <View style={styles.modalCam}>
          <TouchableOpacity style={styles.cameraButton}
            onPress={() => { setCamVisible(true) }} >

            <Image
              source={require('../../../../assets/icons/camera.png')}
              style={styles.cameraIcon}
            />

          </TouchableOpacity>


          <TouchableOpacity style={styles.pdfButton}

            // onPress={() => { pickPDF() }}
            onPress={() => {
              Alert.alert('Alert', "You are allowed to upload PDF file only !", [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'OKAY', onPress: () => { pickPDF() } },

              ]);
            }} >

            <Image
              source={require('../../../../assets/icons/attachfile.png')}
              style={styles.cameraIcon}
            />

          </TouchableOpacity>


          <TextInput
            underlineColor={"transparent"}
            multiline={true}
            scrollEnabled
            //numberOfLines={4}
            activeUnderlineColor={colors.GREEN}
            placeholder={strings.Message}
            placeholderTextColor={"gray"}
            outlineColor={colors.MEDAL_GOLD}
            activeOutlineColor={colors.GREEN}
            style={styles.inputStyle}
            value={text}
            onChangeText={(t) => { setText(t) }} />


          <TouchableOpacity style={styles.sendButton}
            onPress={() => { onSend() }}

          >
            <Image
              source={require('../../../../assets/icons/send.png')}
              style={styles.sendIcon}
            />

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>



  )
}

const makeStyles = (H, W) => StyleSheet.create({
  ButtonDisplayContainer:
  {
    flexDirection: 'row',
    justifyContent: 'center',
    //height: H * 0.05,
    //  marginVertical: H * 0.008,
    width: W,
    alignItems: "center",
    //borderColor: colors.ORANGE,
    borderColor: "white",
    borderWidth: 1,
  },
  mealButton:
  {
    height: H * 0.06,
    width: W * 0.5,
    //elevation: 10,
    // borderTopLeftRadius: 8,
    // borderBottomLeftRadius: 8,
  },
  ExerciseButton:
  {
    height: H * 0.06,
    width: W * 0.5,
    //elevation: 10,
    // borderTopRightRadius: 8,
    // borderBottomRightRadius: 8,
  },
  textStyle:
  {
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: fontSizes.MED,
    height: '100%'
  },
  sendIcon:
  {
    height: H * 0.035,
    width: H * 0.035,
    borderRadius: H * 0.025,
    tintColor: colors.GREEN,
  },
  sendButton:
  {
    marginLeft: W * 0.01,
    marginRight: W * 0.05,
    alignSelf: 'center',
  },
  inputStyle:
  {
    backgroundColor: 'white',
    //marginTop: 5,
    width: W * 0.72,
    alignSelf: "center",
  },
  cameraIcon:
  {
    height: H * 0.025,
    width: H * 0.025,
    //borderRadius: H * 0.025,
    tintColor: 'gray'
  },
  cancelButton:
  {
    textAlign: "right",
    ...fontFamily.bold,
    color: "red",
    top: H * 0.055,
    left: -W * 0.06
  },
  fonts:
  {
    ...fontFamily.bold,
    fontSize: fontSizes.MED
  },
  cameraButton:
  {
    marginLeft: W * 0.035,
    marginRight: W * 0.02,
    alignSelf: 'center',
  },
  pdfButton:
  {
    marginLeft: W * 0.025,
    marginRight: W * 0.023,
    alignSelf: 'center',
  },
  modalCam:
  {
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    marginEnd: W * 0.02,
    marginLeft: W * 0.02,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: "white",
  },
  messageList:
  {
    paddingBottom: 10,
    // backgroundColor: 'yellow',
    // height: H * 0.52,
    // 
  },
  galleryModal: {
    alignItems: "center",
    marginHorizontal: W * 0.1,
    marginVertical: H * 0.01,
  }
})

export default Coach