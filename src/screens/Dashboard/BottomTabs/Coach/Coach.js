import {
  FlatList, View, Image, Keyboard, Modal, TouchableOpacity, StyleSheet, PermissionsAndroid, Linking,
  Alert, StatusBar, useWindowDimensions, KeyboardAvoidingView, Platform, PanResponder
} from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Appbar, Divider, Portal, ProgressBar, Text, TextInput } from 'react-native-paper'
import { getDataFromLocalStorage, removeDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'
import { colors, convertTimestampToYYYYMMDD, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { color, spring } from 'react-native-reanimated'
import DataContext from '../../../../context/DataContext'
import { useIsFocused } from '@react-navigation/native'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import ImagePicker from 'react-native-image-crop-picker';
import { Rating, AirbnbRating } from 'react-native-ratings'
import DocumentPicker from 'react-native-document-picker'
import { PERMISSIONS, RESULTS, requestMultiple } from 'react-native-permissions'
import { useLocales } from '../../../../utils/LocalizationUtil'
import Icon from 'react-native-vector-icons/FontAwesome'
import LottieView from 'lottie-react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"


import { Swipeable } from 'react-native-gesture-handler';

const Coach = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [selectedMessageID, setSelectedMessageID] = useState('');

  const interval = useRef();
  const { NisInfoButtonVisible, Nmessages, Ncount } = useContext(DataContext)
  const [messages, setMessages] = Nmessages
  const [count, setCount] = Ncount
  const [data, setData] = useState(null)
  const [text, setText] = useState("")
  const [replytext, setreplyText] = useState("")
  const [page, setPage] = useState(2)
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
  const [loader2, setLoader2] = useState(true)
  const [userType, setUserType] = useState("")
  const [popupvisible, setPopupvisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState([])
  const [selecteOptionWhole, setSelecteOptionWhole] = useState(null)
  const [isImageVisible, setIsImageVisible] = useState(true);
  const emojis = ['👍', '👎', '😊', '😂', '😍', '😢', '🙏'];
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [emoji, setEmoji] = useState({});
  const H = useWindowDimensions().height
  const W = useWindowDimensions().width
  const flatListRef = useRef(null);
  const strings = useLocales()

  const styles = makeStyles(H, W)

  const openAppSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    //showCallAlertMessage()
    getMessages()
  }, [])


  useEffect(() => {
    if (isFocused) {
      getLanguage(),
        setIsInfoButtonVisible(false)
      markMessageAsRead()
    }
  }, [isFocused])



  useEffect(() => {
    removeValue()
  }, [])

  useEffect(() => {
    // Load stored emoji reactions when component mounts
    const loadStoredEmojiReactions = async () => {
      try {
        const storedEmoji = await getDataFromLocalStorage('emojiReactions');
        console.log("emoji first time ", storedEmoji)
        if (storedEmoji !== null) {
          setEmoji(JSON.parse(storedEmoji));
          handleSelectEmoji(JSON.parse(storedEmoji))

        }
      } catch (error) {
        console.error('Error loading emoji reactions:', error);
      }
    };

    loadStoredEmojiReactions();
  }, []); // Empty dependency array ensures this effect runs only once
  // Empty dependency array ensures this effect runs only once



  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      keyboardDidShowListener && keyboardDidShowListener.remove();
    };
  }, []); // Empty dependency array to run the effect only once (on mount)
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      keyboardDidHideListener && keyboardDidHideListener.remove();
    };
  }, []); // Empty dependency array to run the effect only once (on mount)

  const handleKeyboardDidShow = (event) => {
    const height = event.endCoordinates.height;
    setKeyboardHeight(height);
  };
  const handleKeyboardDidHide = (event) => {
    setKeyboardHeight(0);
  };

  //lng
  const getLanguage = async () => {
    const lang = await getDataFromLocalStorage("lang")
  }

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('upgradepopup')
    } catch (e) {
      // remove error
    }
  }

  const markMessageAsRead = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("id", JSON.parse(temp));
    const result = await PostApiData('read_message', formdata)
    if (result.status == '200') {
      setCount(null)
    }
  }
  const markRatingAsRead = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("id", JSON.parse(temp));
    const result = await PostApiData('read_rating', formdata)
    if (result.status == '200') {
      //  setCount(null)
    }
  }

  const callRequestToCoach = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp));
    const result = await PostApiData('call_alert', formdata)
    if (result.status == 200) {
      //  setCount(null)
      navigation.navigate("Stats")
    }
  }



  const yourRef = useRef(null)

  const getMessages = async () => {
    setPage(2)
    setLoader2(true)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("pagination", 1);
    formdata.append("reciever_id", "")
    const result = await PostApiData('getusermessage', formdata)

    console.log("chat Resultt", result)

    if (result.status == '200') {
      setData(result)
      // newArr = result?.data?.reverse()
      // setMessages(prev => [...prev, ...newArr])
      setMessages(result?.data?.reverse())
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
    setLoader2(false)
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
    const result = await PostApiData('sendermessage', formdata)
    if (result.status == '200') {
      setPage(2)
      setCamVisible(false)
      setLoading(false)
      getMessages()
    }
    else ShortToast(result.message, 'error', '')
    setLoading(false)
  }
  const uploadCamPic = async (pic) => {
    setLoading(true)
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
      setPage(2)
      setCamVisible(false)
      setLoading(false)
      getMessages()
    }
    else ShortToast(result.message, 'error', '')
    setLoading(false)

  }
  const uploadPdf = async (pdf) => {
    setLoading(true)
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
    const result = await PostApiData('sendermessage', formdata)
    if (result.status == '200') {
      setPage(2)
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
      requestCameraPermission()
    };
  }

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
    if (Platform.OS === "android") {
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
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          try {
            const pic = await ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
            });
            uploadCamPic(pic);
            setCamVisible(false);
          } catch (err) {
            ShortToast(`${err}`, 'error', '');
          }
        } else {
          Alert.alert("Camera permission denied");
        }
      } catch (err) {
        ShortToast(err, "error", "");
      }
    } else if (Platform.OS === "ios") {
      try {
        const statuses = await requestMultiple([
          PERMISSIONS.IOS.CAMERA,
          PERMISSIONS.IOS.PHOTO_LIBRARY,
        ]);
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
            uploadCamPic(pic);
            setCamVisible(false);
          } catch (err) {
            ShortToast(`${err}`, 'error', '');
          }
        } else {
          if (statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED) {
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
      } catch (err) {
        ShortToast(`${err}`, 'error', '');
      }
    }
  };

  const getTimeFromStamp = (timestamp) => {
    if (timestamp !== 0) {
      const date = new Date(Number.parseInt(timestamp, 10) * 1000)
      var hour = date.getHours().toString().padStart(2, 0)
      var minutes = date.getMinutes().toString().padStart(2, 0)
      var date2 = date.getDate().toString().padStart(2, 0)
      var month = (date.getMonth() + 1).toString().padStart(2, 0)
      var year = date.getFullYear().toString()
      return `${date2}/${month}/${year}  ${hour}:${minutes}`
    }
    else {
      return ``
    }

  }

  const sendResponseForHealthIndex = async (arr, message) => {

    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("userid", JSON.parse(temp));
    formdata.append("customerId", message?.health_data?.customerId);
    formdata.append("questionId", arr?.questionId);
    formdata.append("period", message?.health_data?.period);
    formdata.append("value", arr?.name);
    formdata.append("type", "string");
    formdata.append("message_id", message?.message_id);
    formdata.append("updatedBy", arr?.updatedBy);
    const result = await PostApiData('getquestionresponse', formdata)
    {
      if (result?.status == '200') {
        getMessages()
      }
    }
  }

  const onPressOption = (id, edit, multi, fullArr, message) => {
    sendResponseForHealthIndex(fullArr, message)
    if (edit) {
      if (multi !== 'selection') {
        setSelectedOption((prev) => prev?.includes(id) ? prev?.filter(item => item !== id) : [...prev, id])
      }
      else if (multi == 'selection') {
        setSelectedOption([id])
      }
    }
  }


  const renderOptions = (item, index, edit, multi, message) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => onPressOption(item?.id, edit, multi, item, message)}
        style={[styles.options, { backgroundColor: selectedOption?.includes(item?.id) ? colors.GREEN : '#fff' }]}>
        <Text style={{ marginRight: 8, color: selectedOption?.includes(item?.id) ? '#fff' : '#000' }}>
          {item?.localName}
        </Text>
        {
          selectedOption?.includes(item?.id)
          &&
          <Icon
            color={'#fff'}
            name={"check-square-o"}
            size={20}
          />
        }
      </TouchableOpacity>
    )
  }

  const handleIconClick = (msg, msgID) => {
    console.log("msg ", msg)
    console.log("msgID ", msgID)


    setSelectedMessage(msg);
    setSelectedMessageID(msgID);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setreplyText("")
  };


  const renderLeftActions = (item) => {

    return (

      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={() => console.log()}>

          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: W * 0.04
            }}
            source={require('../../../../assets/icons/reply.png')}
          />

        </TouchableOpacity>
      </View>
    );

  };

  const handleSubmit = () => {
    console.log('Submitted text:', replytext);
    console.log('Submitted selectedMessageID:', selectedMessageID);
    onSend()
    setModalVisible(false);
    setreplyText("")

    // Add your custom logic here
  };


  const saveEmojiReactions = async (emoji) => {
    try {
      // Check if emoji state is defined and not empty
      if (Object.keys(emoji).length > 0) {
        // Prepare emoji with icons (replace 'emoji_icon' with actual icon)
        const emojiWithIcons = emoji;
        Object.keys(emoji).forEach(key => {
          emojiWithIcons[key] = `${emoji[key]} emoji_icon`;
        });

        // Save emoji reactions to AsyncStorage
        await storeDataInLocalStorage('emojiReactions', JSON.stringify(emoji));
        console.log('Saved Emoji Reactions:', emojiWithIcons);
      } else {
        console.warn('No emoji reactions to save.');
      }
    } catch (error) {
      console.error('Error saving emoji reactions:', error);
    }
  };

  const handleLongPress = async (id) => {
    setSelectedItemId(id);
    await storeDataInLocalStorage('setSelectedItemId', id);

  };

  const handleSelectEmoji = async (selectedEmoji) => {
    const storedEmojiID = await getDataFromLocalStorage('setSelectedItemId');

    console.log("emoji=====", selectedEmoji)
    console.log("emoji ID=====", selectedItemId)
    console.log("setSelectedItemId=====", storedEmojiID)


    setEmoji((prevState) => ({
      ...prevState,
      [storedEmojiID]: selectedEmoji,
    }));
    saveEmojiReactions(selectedEmoji); // Save emoji reactions after selecting emoji
    setSelectedItemId(null); // Reset selectedItemId after selecting emoji
  };

  const handleClearEmoji = (id) => {
    console.log("emoji---", id)
    setEmoji((prevState) => {
      const updatedReactions = { ...prevState };
      delete updatedReactions[id];
      return updatedReactions;
    });
    saveEmojiReactions(); // Save emoji reactions after clearing emoji
  };
  const scrollToMessage = (messageId) => {
    console.log("ID", messageId)
    console.log("index", index)
    const index
     = messages.findIndex(message => message.id === messageId);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ animated: true, index });
    }
  };
  
  const renderItem = ({ item, index }) => {
    if (
      item.reciever_message == "" &&
      item.receiver_icon.length == 0 &&
      item.icon.length == 0 &&
      item?.message_type == 'text'
    ) {
      // console.log("Chat Item", "Gaurav 1");
      return (
        <Swipeable
          renderLeftActions={() => renderLeftActions(item)}
          onSwipeableLeftOpen={() => handleIconClick(item?.user_message, item?.message_id)}
        >

        
            <View style={styles.messageContainerWrapper}>
              <TouchableOpacity
                onLongPress={() => handleLongPress(item?.message_id)}
                style={styles.messageContainer}
              >
                <Text style={{ color: 'black', 
                fontSize: fontSizes.LAR }}>
                  {item.user_message}
                </Text>
                <Text
                  style={{
                    marginTop: H * 0.01,
                    fontSize: fontSizes.EXTRASM,
                    color: 'black',
                  }}>
                  {getTimeFromStamp(item.created)}
                </Text>
              </TouchableOpacity>

            {emoji[item.message_id] && (
              <Text style={styles.messageEmoji}>
                {emoji[item.message_id]}</Text>
            )}
            {selectedItemId === item.message_id && (
              <View style={styles.emojiPickerOverlay}>
                <View style={styles.emojiPicker}>
                  {emojis.map((emoji, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelectEmoji(emoji)}>
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>


        </Swipeable>
      );
    } else if (
      item.reciever_message == "" &&
      item.icon.length == 0 &&
      item.receiver_icon.length == 0 &&
      item?.message_type == 'reply'
    ) {
      // console.log("Chat Item", "Gaurav 6");
      return (
        <Swipeable
          renderLeftActions={() => renderLeftActions(item)}
          onSwipeableLeftOpen={() => handleIconClick(item?.user_message, item?.message_id)}
        >
          <TouchableOpacity
          onLongPress={() => handleLongPress(item?.message_id)}
          onPress={()=>
            scrollToMessage("21759")}
          
            style={{
              marginRight: W * 0.02,
              marginTop: H * 0.02,
              maxWidth: W * 0.7,
              alignSelf: "flex-end",
              borderWidth: 1,
              backgroundColor: "#DCF8C6",
              borderColor: "#CCCCCC", // Border color
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
          
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F0F0F0',
              borderBottomLeftRadius: 5,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,

            }}>
              <View style={{
                width: 4, // Width of the red line
                height: '100%', // Ensure it spans the full height of the container
                backgroundColor: '#FF5B61',
                // Space between the line and the text
                borderRadius: 20,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0

                // Border radius to round the ends of the line
              }} />
              <Text
                style={{
                  color: "black",
                  fontSize: 13,
                  padding: 10,
                  width: W * 0.6,
                }} >
                {item.replied_message}
              </Text>
            </View>

            {/* Highlighted view (user message with timestamp) */}
            <View
              style={{
                paddingHorizontal: W * 0.05,
                paddingVertical: H * 0.01,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              <Text style={{ 
                color: "black",
               fontSize: fontSizes.LAR }}>
                {item.user_message}</Text>
              <Text
                style={{
                  marginTop: H * 0.01,
                  fontSize: fontSizes.MED,
                  color: "black",
                }}
              >
                {getTimeFromStamp(item.created)}
              </Text>
            </View>

            
          </TouchableOpacity>

          {emoji[item.message_id] && (
              <Text style={styles.messageEmoji}>
                {emoji[item.message_id]}</Text>
            )}
            {selectedItemId === item.message_id && (
              <View style={styles.emojiPickerOverlay}>
                <View style={styles.emojiPicker}>
                  {emojis.map((emoji, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelectEmoji(emoji)}>
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
        </Swipeable>
      );
    } else if (
      item.user_message == "" &&
      item.icon.length == 0 &&
      item.receiver_icon.length == 0 &&
      item?.message_type == 'text'
    ) {
      // console.log("Chat Item", "Gaurav 2");
      return (
        <Swipeable
          renderLeftActions={renderLeftActions}
          onSwipeableLeftOpen={() => handleIconClick(item?.reciever_message, item?.message_id)}
        >
          <>
            {/* Your existing content here */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: W * 0.05,
                  paddingVertical: H * 0.02,
                  justifyContent: "center",
                  alignSelf: "flex-start",
                  maxWidth: W * 0.7,
                  borderBottomRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  marginLeft: W * 0.03,
                  marginTop: H * 0.02,
                }}
              >
                <Text>{item.reciever_message}</Text>
                <Text
                  style={{
                    marginTop: H * 0.01,
                    fontSize: fontSizes.EXTRASM,
                  }}
                >
                  {getTimeFromStamp(item.created)}
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: fontSizes.SM,
                    marginTop: 5,
                    color: "black",
                  }}
                >
                  By - {item?.coachname}
                </Text>
              </View>
            </View>
          </>
        </Swipeable>
      );
    } else if (item?.message_type == "pdf") {
      // console.log("Chat Item", "Gaurav 3");

      if (item?.sender_pdf == "") {
        return (
          <Swipeable
            renderLeftActions={renderLeftActions}
            onSwipeableLeftOpen={() => handleIconClick(item?.reciever_message, item?.message_id)}
          >
            <TouchableOpacity
              style={{
                marginTop: 15,
                marginStart: 10,
              }}
              onPress={() => {
                navigation.navigate("ChatPdfViewer", {
                  url: `${item?.base_url}${item?.receiver_pdf}`,
                });
              }}
            >
              <Image
                style={{
                  width: W * 0.25,
                  height: W * 0.3,
                }}
                source={require("../../../../assets/icons/pdf.png")}
              />

              <Text
                style={{
                  fontSize: fontSizes.EXTRASM,
                  color: "black",
                  marginTop: 4,
                  marginStart: 10,
                }}
              >
                {getTimeFromStamp(item.created)}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        );
      } else {
        // console.log("Chat Item", "Gaurav 4");

        return (
          <Swipeable
            renderLeftActions={renderLeftActions}
            onSwipeableLeftOpen={() => handleIconClick(item?.reciever_message, item?.message_id)}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                marginTop: 15,
                marginEnd: 10,
              }}
              onPress={() => {
                navigation.navigate("ChatPdfViewer", {
                  url: `${item?.base_url}${item?.sender_pdf}`,
                });
              }}
            >
              <Image
                style={{
                  width: W * 0.25,
                  height: W * 0.3,
                }}
                source={require("../../../../assets/icons/pdf.png")}
              />

              <Text
                style={{
                  fontSize: fontSizes.EXTRASM,
                  color: "black",
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                {getTimeFromStamp(item.created)}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        );
      }
    } else if (item.icon.length !== 0) {
      return (
        <Swipeable
          renderLeftActions={renderLeftActions}
          onSwipeableLeftOpen={() => handleIconClick(item?.reciever_message, item?.message_id)}
        >
          <View
            style={{
              width: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ChatImageDisplay", {
                  icon: item.icon,
                  base: `${item.base_url}`,
                })
              }
            ></TouchableOpacity>
          </View>

          <>
            {/* Your existing content here */}
            <View
              style={{
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
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChatImageDisplay", {
                    icon: item.icon,
                    base: `${item.base_url}`,
                  })
                }
              >
                <Image
                  source={{ uri: `${item.base_url}${item.icon[0]}` }}
                  style={{ height: W * 0.34, width: W * 0.34 }}
                />
                <Text
                  style={{
                    marginTop: H * 0.01,
                    fontSize: fontSizes.EXTRASM,
                    color: "white",
                  }}
                >
                  {getTimeFromStamp(item.created)}
                </Text>
              </TouchableOpacity>
              {item.icon.length > 1 ? (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ChatImageDisplay", {
                        icon: item.icon,
                        base: `${item.base_url}`,
                      })
                    }
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(5,5,5,0.8)",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          position: "absolute",
                          alignSelf: "center",
                          zIndex: 100,
                          fontSize: 35,
                          shadowOpacity: 1,
                          ...fontFamily.bold,
                        }}
                      >
                        {item.icon.length - 2 == 0 ? "" : `+${item.icon.length - 2}`}
                      </Text>
                      <Image
                        source={{ uri: `${item.base_url}${item.icon[1]}` }}
                        style={{ height: W * 0.34, width: W * 0.34, zIndex: -2 }}
                      />
                      <Text
                        style={{
                          marginTop: H * 0.01,
                          fontSize: fontSizes.EXTRASM,
                        }}
                      >
                        {getTimeFromStamp(item.created)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                </>
              )}
            </View>
          </>
        </Swipeable>
      );
    } else if (item.receiver_icon.length !== 0) {
      return (
        <Swipeable
          renderLeftActions={renderLeftActions}
          onSwipeableLeftOpen={() => handleIconClick(item?.reciever_message, item?.message_id)}
        >
          <View
            style={{
              width: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ChatImageDisplay", {
                  icon: item.receiver_icon,
                  base: `${item.base_url}`,
                })
              }
            ></TouchableOpacity>
          </View>

          <>
            {/* Your existing content here */}
            <View
              style={{
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
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChatImageDisplay", {
                    icon: item.receiver_icon,
                    base: `${item.base_url}`,
                  })
                }
              >
                <Image
                  source={{ uri: `${item.base_url}${item.receiver_icon[0]}` }}
                  style={{ height: W * 0.34, width: W * 0.34 }}
                />
                <Text
                  style={{
                    marginTop: H * 0.01,
                    fontSize: fontSizes.EXTRASM,
                  }}
                >
                  {getTimeFromStamp(item.created)}
                </Text>
              </TouchableOpacity>
              {item.receiver_icon.length > 1 ? (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ChatImageDisplay", {
                        icon: item.receiver_icon,
                        base: `${item.base_url}`,
                      })
                    }
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(5,5,5,0.4)",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          position: "absolute",
                          alignSelf: "center",
                          zIndex: 100,
                          fontSize: 35,
                          shadowOpacity: 1,
                          ...fontFamily.bold,
                        }}
                      >
                        {item.receiver_icon.length - 2 == 0
                          ? ""
                          : `+${item.receiver_icon.length - 2}`}
                      </Text>
                      <Image
                        source={{ uri: `${item.base_url}${item.receiver_icon[1]}` }}
                        style={{ height: W * 0.34, width: W * 0.34, zIndex: -2 }}
                      />
                      <Text
                        style={{
                          marginTop: H * 0.01,
                          fontSize: fontSizes.EXTRASM,
                          color: "white",
                        }}
                      >
                        {getTimeFromStamp(item.created)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                </>
              )}
            </View>
          </>
        </Swipeable>
      );
    } else if (item?.message_type == "quiz") {
      

      return (
        <View>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              justifyContent: "center",
              borderBottomRightRadius: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              alignSelf: "flex-start",
              marginLeft: W * 0.02,
              marginTop: H * 0.02,
              maxWidth: W * 0.7,
            }}
          >
            <Text>{item?.reciever_message}</Text>
            <Text
              style={{
                textAlign: "right",
                marginTop: H * 0.01,
                fontSize: fontSizes.EXTRASM,
              }}
            >
              {getTimeFromStamp(item.created)}
            </Text>
          </View>
          <View style={styles.optionButtonView}>
            {/* <FlatList
              data={item?.options}
              renderItem={renderOptions},
              keyExtractor={(item, index) => `${index}`}
            /> */}
            {item?.health_data?.responses?.map((i, index) =>
              renderOptions(
                i,
                index,
                item?.health_data?.isActive,
                item?.health_data?.responseType,
                item
              )
            )}
          </View>
        </View>
      );
    } else {
      // Handle other message types or conditions here
      return null;
    }
  };



  const onSend = async () => {
    console.log("Send", text == "" ? replytext : text)
    if (text !== "" || replytext !== "") {
      var formdata = new FormData();
      const temp = await getDataFromLocalStorage('user_id')
      const temp2 = await getDataFromLocalStorage('coach_id')
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("user_message", text == "" ? replytext : text);
      formdata.append("reciever_id", JSON.parse(temp2));
      formdata.append("message_id", selectedMessageID);
      const result = await PostApiData('sendermessage', formdata)
      if (result?.status == '200') {
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

  const handleLoadMore = async () => {
    setLoader2(true)
    var newArr = []
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("pagination", page);
    formdata.append("reciever_id", "")
    const result = await PostApiData('getusermessage', formdata)

    if (result.status == '200' && result?.total_pages >= page) {
      setData(result)
      newArr = result?.data?.reverse()
      //setMessages(result?.data?.reverse())
      setMessages(prev => [...prev, ...newArr])
      setPage(prev => prev + 1)
      markRatingAsRead()
    }
    else if (result?.status == '200') {
      null
    }
    else {
      Alert.alert(`${result?.status}`, result?.message)
    }
    setLoader2(false)
  }

  return (
    <View
      //behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1, paddingBottom: Platform.OS == "ios" ? keyboardHeight : null }}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Reply for :</Text>
              <Text style={styles.msgText}>{selectedMessage}</Text>

              <View style={styles.inputContainer}>
                {/* <TouchableOpacity style={styles.iconButton} onPress={() => setCamVisible(true)}>
                  <Image
                    source={require('../../../../assets/icons/camera.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.iconButton} onPress={() => {
                  Alert.alert('Alert', "You are allowed to upload PDF file only !", [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'OKAY', onPress: () => pickPDF() },
                  ]);
                }}>
                  <Image
                    source={require('../../../../assets/icons/attachfile.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity> */}
                <TextInput
                  underlineColor="transparent"
                  multiline={true}
                  scrollEnabled
                  placeholder='Type here..'
                  placeholderTextColor="gray"
                  style={styles.input}
                  value={replytext}
                  onChangeText={setreplyText}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={handleCancel}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSubmit]}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
        <Modal
          visible={loader2}
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
            <LottieView
              style={{
                height: 200,
                width: 200,
              }}
              source={require('../../../../assets/animations/lf30_editor_xibt7sue.json')}
              autoPlay loop />
          </View>
        </Modal>




        <View style={styles.messageList}>
          <FlatList
            inverted={true}
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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

    </View>
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
  },
  optionButtonView:
  {
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    //maxWidth: W * 0.8,
    //flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    margin: W * 0.02,
    marginTop: H * 0.01,
    padding: 8,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
  },
  options:
  {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.GREEN,
    margin: 8,
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //backgroundColor:'#e8e9eb'
  },
  modalView: {
    margin: 20,
    backgroundColor: '#e8e9eb',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  msgText: {
    marginBottom: 14,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 2,
    color: "grey",
  },

  // input: {
  //   height: 40,
  //   borderColor: 'white',
  //   borderWidth: 1,
  //   borderRadius: 10,
  //   marginTop: 10,
  //   paddingHorizontal: 10,
  //   width: '100%',
  //   marginBottom: 20,
  // },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#ff6347',
  },
  buttonSubmit: {
    backgroundColor: colors.GREEN,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  iconButton: {
    padding: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  replycameraButton:
  {
    alignSelf: 'center',
  },
  replypdfButton:
  {
    marginLeft: W * 0.05,
    marginRight: W * 0.02,
    alignSelf: 'center',
  },

  replytext:
  {
    backgroundColor: 'white',
    //marginTop: 5,
    width: W * 0.6,
    alignSelf: "center",
  },
  input: {
    flex: 1,
    backgroundColor: '#e8e9eb',

    height: 40,
    padding: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageContainerWrapper: {
    marginHorizontal: W * 0.025,
  },
  messageContainer: {

    paddingHorizontal: W * 0.05,
    paddingVertical: H * 0.02,
    marginTop: H * 0.02,
    maxWidth: W * 0.7,
    alignSelf: "flex-end",
    borderWidth: 1,
    backgroundColor: "#DCF8C6",
    borderColor: "#CCCCCC", // Border color
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxWidth: W * 0.85,
  },
  emojiPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  emojiPicker: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'silver',
    padding: 10,
    elevation: 20,
    borderRadius: 30,

  },
  emoji: {
    marginHorizontal: 10, // Add horizontal margin to create space between emojis
    fontSize: 30, // Adjust the size of the emoji if needed
  },
  messageEmoji: {
    position: 'absolute',
    bottom: 0,
    left: W * 0.89,
    marginTop:20,

    alignSelf: "flex-end",

    fontSize: fontSizes.XXXL, // Adjust font size as needed
  },
});



export default Coach
