
import { Dimensions, StyleSheet, View, StatusBar, AppState, Text as TextRN, TouchableOpacity, Image, Animated, Easing, ScrollView, Alert, RefreshControl, Linking, Modal, Platform } from 'react-native'
import React, { useEffect, useState, useContext, useRef } from 'react'
import InfoCard from '../../Components/InfoCard'
import { Appbar, Divider, Text, FAB, Portal, Dialog, Paragraph, Button, Snackbar, TextInput, configureFonts, DefaultTheme, ActivityIndicator } from 'react-native-paper';
import HeaderForStats from './HeaderForStats';
import { FlatList } from 'react-native-gesture-handler';
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W, ShadowsiOS } from '../../../../colorSchemes/ColorSchemes';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage';
import LinearGradient from 'react-native-linear-gradient';
import DataContext from '../../../../context/DataContext';
import WebView from 'react-native-webview';
import DoubleTapBackButtonToCloseApp from '../../../../assets/components/DoubleTapBackButtonToCloseApp';
import LottieView from 'lottie-react-native';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5'
import { useIsFocused } from "@react-navigation/native"
import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import Sound from 'react-native-sound';
import { useLocales } from '../../../../utils/LocalizationUtil';
import Toast from 'react-native-simple-toast'
import moment from 'moment-timezone';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const Stats = (props) => {
  const [data, setData] = useState(null)
  const [showLoader, setShowLoader] = useState(false)
  const [dataForPaidUser, setDataForPaidUser] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [name, setName] = useState("")
  ///////////////////////////////////////////////
  const [editWeights, setEditWeights] = useState(false)
  const [editSugar, setEditSugar] = useState(false)
  const [editBp, setEditBp] = useState(false)
  /////////////////////////////////////////////////
  const [currentWeight, setCurrentWeight] = useState("")
  const [targetWeight, setTargetWeight] = useState("")
  const [weightOkButttonDisabled, setWeightOkButttonDisabled] = useState(false)
  const [fastingSugar, setFastingSugar] = useState("")
  const [nonFastingSugar, setNonFastingSugar] = useState("")
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [bpm, setBpm] = useState("")
  const [flagg1, setFlagg1] = useState(1)
  const [flagg2, setFlagg2] = useState(1)
  const [firstTimeLogin, setFirstTimeLogin] = useState(null)
  const [mealPlanTutorial, setMealPlanTutorial] = useState(false)
  const [showInputForGratification, setShowInputForGratification] = useState(false)
  const [text, setText] = useState("")
  const [paiduserstatusModal, setPaiduserstatusModal] = useState("")
  const [notificationCount, setNotificationCount] = useState("")
  const [sound, setSound] = useState(null);

  const {
    Nlanguage,
    Nvisible,
    Nheading,
    NsubHeading,
    NvisibleSnackOne,
    NvisibleSnackTwo,
    NvisibleSnackThree,
    NisInfoButtonVisible,
    NquestionNumber,
    Nnum,
    NglobalBmi,
    Ncrrnt,
    Ntrgt,
    Nht,
    Nfeet,
    Ninch,
    NvisibleMood,
    NvisibleMoodGood,
    NvisibleMood2,
    NsecondaryLoader,
  } = useContext(DataContext)
  const [visible, setVisible] = Nvisible
  const [heading, setHeading] = Nheading
  const [subHeading, setSubHeading] = NsubHeading
  const [isInfoButtonVisible, setIsInfoButtonVisible] = NisInfoButtonVisible
  const [crrnt, setCrrnt] = Ncrrnt
  const [trgt, setTrgt] = Ntrgt
  const [visibleMood, setVisibleMood] = NvisibleMood
  const [visibleMoodGood, setVisibleMoodGood] = NvisibleMoodGood
  const [visibleMood2, setVisibleMood2] = NvisibleMood2
  const [language, setLanguage] = Nlanguage
  const [secondaryLoader, setSecondaryLoader] = NsecondaryLoader

  const isFocused = useIsFocused();
  const currentTimezone = moment.tz.guess();
  ////////////////////////////////////////////
  const spinValue = new Animated.Value(0);
  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })


  const strings = useLocales()

  useEffect(() => {
    if (isFocused) {
      getDataForFreeUser()
      getName()
      getNotificationCount()
    }
  }, [isFocused]);

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' || nextAppState === 'inactive' || nextAppState === 'background') {
        //Alert.alert("Gaurav")
        getDataForFreeUser()
        getNotificationCount()
        scrollRef.current.scrollTo({
          y: 0,
          animated: true,
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);


  useEffect(() => {
    // Load the sound when the component mounts
    const soundObject = new Sound('coin_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
      } else {
        setSound(soundObject);
      }
    });

    // Unload the sound when the component unmounts
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  useEffect(() => {
    assignMealPlanAndExercisePlan()
  }, [])

  useEffect(() => {
    if (isFocused) {
      getPaidUserStatus()
    }
    getLanguage()
  }, [isFocused])

  useEffect(() => {
    if (isFocused) {
      // getUserType()  // hide upgarde popup- 01 dec
    }

  }, [isFocused])


  const scrollRef = useRef(null)

  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear, // Easing is an additional import from react-native
        useNativeDriver: true  // To make use of native driver for performance
      }
    )
  ).start();

  function validateWeight(input) {
    const regex = /^\d{1,3}(\.\d)?$/;
    // if (regex.test(input)) {
    //   setCurrentWeight(input)
    //   setCrrnt(input)
    //   setWeightOkButttonDisabled(false)
    // }
    // else {
    //   ShortToast('We can only accept numbers with up to one decimal place.')
    //   setCurrentWeight('')
    //   setCrrnt('')
    // }
    return regex.test(input)
  }


  const onPressScroll = () => {
    //scrollRef.current.scrollToEnd({ animated: true })
    scrollRef.current.scrollTo({ y: 430, animated: true });
  }
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
  const playSound = () => {
    if (sound) {
      sound.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.error('Failed to play the sound');
        }
      });
    }
  };

  const assignMealPlanAndExercisePlan = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp));
    const result = await PostApiData('assign_meal', formdata)
    console.log("assign_meal =====>", result)
  }

  const onPressButton = () => {
    getDataForFreeUser()
  }

  const getPaidUserStatus = async () => {
    const paidUserStatus = await getDataFromLocalStorage("paiduserStatus")

    if (paidUserStatus == "PaymentDone") {
      //  props.navigation.navigate("")
      setPaiduserstatusModal(true)
    } else if (paidUserStatus == "PaymentDoneWithQuestions") {
      setPaiduserstatusModal(false)
    } else {
      setPaiduserstatusModal(false)
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    getDataForFreeUser()
    getName()
    wait(2000).then(() => setRefreshing(false));
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const getFirstTimeLoginStatus = async () => {
    const temp = await getDataFromLocalStorage('firstTimeLogin')
    if (temp == 1) {
      setFirstTimeLogin(true)
      playSound()
    }
  }

  const addGoal = async () => {
    setVisibleMoodGood(false)
    setVisibleMood2(false)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp))
    formdata.append("text", text)
    const result = await PostApiData('add_user_mood', formdata)
    console.log("MOOD RESULT == >> ", result)
    setVisibleMood(false)
    if (result.status == 200) {
      setShowInputForGratification(false)
      Toast.show(result.message)
      //ShortToast(result.message, 'success', '')
      setText("")
      setVisibleMood(false)
      // props.navigation.navigate('Gratification')
    }
    // if (text == "") {
    //   ShortToast("Required field", 'Alert', '')
    // } else {
    //   const temp = await getDataFromLocalStorage('user_id')
    //   var formdata = new FormData();
    //   formdata.append("user_id", JSON.parse(temp))
    //   formdata.append("text", text)
    //   const result = await PostApiData('add_user_mood', formdata)
    //   if (result.status == 200) {
    //     setShowInputForGratification(false)
    //     ShortToast(result.message, 'success', '')
    //     setVisibleMood(false)
    //     props.navigation.navigate('Gratification')
    //   }
    // }
  }

  const updateWeightValues = async () => {
    if (currentWeight == "" || currentWeight.length == 0 || targetWeight == "" || targetWeight.length == 0) {
      ShortToast(strings.requiredField, 'error', '')
    }
    else {
      var formdata = new FormData();
      const temp = await getDataFromLocalStorage("user_id")
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "Weight");
      formdata.append("current_weight", currentWeight)
      formdata.append("target_weight", targetWeight)
      const result = await PostApiData('updateuserhealthplan', formdata)
      if (result?.status == "200") {
        getDataForFreeUser()
        ShortToast('Success', 'success', '')
        setEditWeights(false)
        setCurrentWeight('')
        //setTargetWeight('')
      } else {
        ShortToast(JSON.stringify(result?.message), 'error', '')
      }
    }
  }

  const updateSugarValues = async () => {
    // if (fastingSugar == "" || fastingSugar.includes(".") || fastingSugar.includes(",") || fastingSugar.includes("-") || fastingSugar.includes(" ") || nonFastingSugar == "" || nonFastingSugar.includes(".") || nonFastingSugar.includes(",") || nonFastingSugar.includes("-") || nonFastingSugar.includes(" ")) {
    //   ShortToast('Invalid Input', 'error', '')
    // }
    // else 

    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("type", "Sugar");
    formdata.append("fasting", fastingSugar);
    formdata.append("nonfasting", nonFastingSugar);
    const result = await PostApiData('updateuserhealthplan', formdata)
    if (result.status == 200) {
      getDataForFreeUser()
      setEditSugar(false)
      setFastingSugar('')
      setNonFastingSugar('')
    } else {
      ShortToast(JSON.stringify(result?.message), 'error', '')

    }

    // if (fastingSugar < 55 || nonFastingSugar < 70) {
    //   ShortToast("Your sugar seems to be critically low! Kindly consult a Doctor", 'error', '')
    //   const temp = await getDataFromLocalStorage('user_id')
    //   var formdata = new FormData();
    //   formdata.append("user_id", JSON.parse(temp));
    //   formdata.append("type", "Sugar");
    //   formdata.append("fasting", fastingSugar);
    //   formdata.append("nonfasting", nonFastingSugar);
    //   const result = await PostApiData('updateuserhealthplan', formdata)
    //   if (result.status == 200) {
    //     getDataForFreeUser()
    //     setEditSugar(false)
    //     setFastingSugar('')
    //     setNonFastingSugar('')
    //   }
    // }
    // else {
    //   // if (route.params.flag[0] == "" && route.params.flag[1] == "") {
    //   const temp = await getDataFromLocalStorage('user_id')
    //   var formdata = new FormData();
    //   formdata.append("user_id", JSON.parse(temp));
    //   formdata.append("type", "Sugar");
    //   formdata.append("fasting", fastingSugar);
    //   formdata.append("nonfasting", nonFastingSugar);
    //   const result = await PostApiData('updateuserhealthplan', formdata)
    //   if (result.status == 200) {
    //     getDataForFreeUser()
    //     setEditSugar(false)
    //     setFastingSugar('')
    //     setNonFastingSugar('')
    //     ShortToast(JSON.stringify(result?.message), 'success', '')
    //   }
    //  }
  }

  const updateBpValues = async () => {
    if (systolic == "" || diastolic == "") {
      ShortToast('Required field is missing', 'error', '')
    }
    else {
      // if (route.params.flag[0] == "" && route.params.flag[1] == "") {
      const temp = await getDataFromLocalStorage('user_id')
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "Blood Pressure");
      formdata.append("systolic", systolic);
      formdata.append("diastolic", diastolic);
      formdata.append("bpm", bpm);
      const result = await PostApiData('updateuserhealthplan', formdata)
      if (result.status == 200) {
        ShortToast(result.message, 'success', '')
        getDataForFreeUser()
        //{ flagg2 > 2 ? null : ShortToast('Success', 'success', '') }
        setEditBp(false)
        setSystolic('')
        setDiastolic('')
        setBpm('')
      } else {
        ShortToast(JSON.stringify(result?.message), 'error', '')
      }
    }
  }

  const handleTextPress = (t) => {
    if (t == "Current Weight") {
      setEditWeights(true)
    }
    else if (t == "Target Weight") {
      // setEditTargetWeight(true)
      setEditWeights(true)
    }
    else if (t == "Fasting") {
      setEditSugar(true)
    }
    else if (t == "Non-Fasting") {
      setEditSugar(true)
    }
    else if (t == "Systolic") {
      setEditBp(true)
    }
    else if (t == "Diastolic") {
      setEditBp(true)
    }
    else if (t == "BPM") {
      setEditBp(true)
    }
  }

  const getDataForFreeUser = async () => {
    setSecondaryLoader(true)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    formdata.append("timezone", currentTimezone)
    const result = await PostApiData('freeuser', formdata)
    if (result?.status == '200') {
      await setData(result)
      await getDataForPaidUser()
      await storeDataInLocalStorage("stackValue", "3")
      await storeDataInLocalStorage("user_type", JSON.stringify(result?.user_type))
    }

    //console.log("tempPaid", temp)
    console.log("response user freeuser =================>  ", result)
    //console.log("response user freeuser =================>  ", result)

  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };


  const getDataForPaidUser = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    const result = await PostApiData('paiduser', formdata)
    console.log("PAID +++++++++++++ ", result)
    if (result?.status == "200") {
      setDataForPaidUser(result)
      // setCurrentWeight(result?.single[0]?.attribute_value[0])
      setTargetWeight(result?.single[0]?.attribute_value[1])
      // setFastingSugar(result?.single[1]?.attribute_value[0])
      // setNonFastingSugar(result?.single[1]?.attribute_value[1])
      // setSystolic(result?.single[2]?.attribute_value[0])
      // setDiastolic(result?.single[2]?.attribute_value[1])
      // setBpm(result?.single[2]?.attribute_value[2])
    }
    setSecondaryLoader(false)
    getFirstTimeLoginStatus()
  }
  const getName = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("id", JSON.parse(temp))
    const result = await PostApiData('userprofile', formdata)
    if (result?.status == 200) {
      setName(result?.data[0]?.name)
    }
    else {
      ShortToast(result?.message, 'error', '')
    }
  }

  var myloop = []
  /////////////////////////////////////Power of Seven Cards//////////////////////////////////////////////
  for (let i = 0; i < data?.data?.length; i++) {
    myloop.push(
      <InfoCard
        numberOfCoins={data?.data[i]?.number_of_coins}
        Location={data?.data[i]?.icon}
        Key={i}
        key={i}
        Text={data?.data[i]?.heading}
        Text2={data?.data[i]?.heading2}
        Attributes={data?.data[i]?.attribute}
        FollowNeeded={i === 0 ? true : false}
        Information={data?.data[i]?.information}
        SelectedOption={data?.data[i]?.selected_number}
        onPressScroll={onPressScroll}
        onPressButton={onPressButton}
        onPressWeight={setEditWeights}
        onPressSugar={setEditSugar}
        onPressBP={setEditBp}
      />
    );
  }

  const renderItem = (item, index) => {
    const getColorForText = (t) => {
      if (t == "Underweight") {
        return "#b58502"
      }
      else if (t == "Normal") {
        return "white"
      }
      else if (t == "Overweight") {
        return "#945701"
      }
      else if (t == "Obese") {
        return "white"
      }
      else {
        return "white"
      }
    }
    const getColorForBg = (t) => {
      if (t == "Underweight") {
        return "#f7eed5"
      }
      else if (t == "Normal") {
        return "#8cd47e"
      }
      else if (t == "Overweight") {
        return "#ffb44c"
      }
      else if (t == "Obese") {
        return "#ff6761"
      }
      else {
        return "#ff6761"
      }
    }
    const myLoopTwo = []     //values of weigth, Sugar, BP/////////////////////////////////////////
    for (let i = 0; i < item?.attribute?.length - 1; i++) {
      myLoopTwo.push(
        <View
          style={{
            flexDirection: 'row',
          }}
          key={i}>
          <View
            style={{
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleTextPress(item.attribute2[i])
              }}>
              {<Text style={{
                ...fontFamily.bold,
                fontSize: fontSizes.XXL,
                margin: 5,
                textAlign: 'center'
              }}>{(item.attribute_value[i] == "") ? "--" : item.attribute_value[i]}</Text>}
            </TouchableOpacity>
            <Text style={{
              fontSize: fontSizes.MED,
            }}>{item.attribute[i]}</Text>
          </View>
          <Divider
            style={{
              borderWidth: 0.5,
              borderColor: "silver",
              height: HEIGHT * 0.09,
              width: 0.5,
              marginHorizontal: 3,
            }} />
        </View>
      )
    }
    /*///Weigth, Sugar, BP////*////////////////////////////////////////////////////////////////////////////////////////////
    return (
      <View
        key={index}
        style={styles.cardForMonitoringStats}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ ...fontFamily.bold, marginLeft: WIDTH * 0.02 }}>{item.heading}</Text>
          <View style={{
            backgroundColor: getColorForBg(item?.attribute2[item?.attribute2?.length - 1]),
            borderRadius: 12,
            // marginRight: WIDTH * 0.006,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            alignContent: "center",
            width: W * 0.22,
          }}>
            <Text style={{
              fontSize: fontSizes.SM,
              color: getColorForText(item?.attribute2[item?.attribute2?.length - 1]),
              textAlign: 'center',
              margin: WIDTH * 0.01,
              //marginHorizontal: WIDTH * 0.018,
              alignItems: "center",
              alignSelf: "center",
              ...fontFamily.bold,
            }}>{item?.attribute[item?.attribute?.length - 1]}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: WIDTH * 0.88,
            flexWrap: 'wrap',
          }}>
            <View style={{ flexDirection: 'row', width: WIDTH * 0.7, justifyContent: 'space-evenly' }}>
              {myLoopTwo}
            </View>
            <View style={{
              justifyContent: 'center',
              width: WIDTH * 0.13,
              alignSelf: 'flex-end',
              alignItems: 'center',
              marginRight: WIDTH * 0.01
            }}>
              <TouchableOpacity
                onPress={() => {
                  setIsInfoButtonVisible(false)
                  item.heading2 == 'Weight' && props.navigation.navigate("OnDetailsSubmitScreenOne")
                  item.heading2 == 'Sugar' && props.navigation.navigate("OnDetailsSubmitScreenTwo", { "flag": dataForPaidUser?.single[1]?.attribute_value })
                  item.heading2 == 'Blood Pressure' && props.navigation.navigate("OnDetailsSubmitScreenThree")
                  item.heading2 == 'Health Index' && props.navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.healthindex[0]?.value })
                }}
                style={styles.nextButton}>
                <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                  style={styles.nextButton}>
                  <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

        </View >

      </View>)
  }
  //////////////////////////////////////Pain, BMI, BMR/////////////////////////////
  const renderItemTwo = (item, index) => {
    const getColor = (heading, subHeading) => {
      if (heading == "BMI") {
        if (subHeading == "Underweight") {
          return "#b58502"
        }
        else if (subHeading == "Normal") {
          return "#8cd47e"
        }
        else if (subHeading == "Overweight") {
          return "#ffb44c"
        }
        else if (subHeading == "Obese") {
          return "#ff6761"
        }
        else {
          return "#ff6761"
        }
      }
      else {
        if (subHeading == "Underweight") {
          return "#b58502"
        }
        else if (subHeading == "Normal") {
          return "#8cd47e"
        }
        else if (subHeading == "Overweight") {
          return "orange"
        }
        else if (subHeading == "Obese") {
          return "#ff6761"
        }
        else {
          return "red"
        }
      }
    }
    return (
      item.heading2 !== "Calories" ?
        <TouchableOpacity
          key={index}
          style={styles.renderItemTwoContainer}
          onPress={() => {
            setIsInfoButtonVisible(false)
            item.heading2 == "Calories" ? ShortToast(strings.calorieBudgetIsHandledByCoach, 'error', '') : null
            item.heading2 == "Pain" && props.navigation.navigate("PainSubmit", { "flag": dataForPaidUser?.data[0]?.attribute_value })
            item.heading2 == "Psychology" && props.navigation.navigate("PsychologyQuestions", { "flag": dataForPaidUser?.data[1]?.attribute_value })
            item.heading2 == "BMI" && props.navigation.navigate("BMIsubmit", { "bmiValue": dataForPaidUser?.data[2]?.attribute_value[0] })
            item.heading2 == "BMR" && ShortToast(strings.yourBMRIsCalculatedBased, "warning", "")
            item.heading2 == "WHR" && props.navigation.navigate("WHRSubmitMedium")
            item.heading2 == "Reports" && props.navigation.navigate("Reports")
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between', marginHorizontal: WIDTH * 0.04
          }}>
            <View style={{ width: WIDTH * 0.275 }}>
              <Text style={{ ...fontFamily.bold }}>{item.heading}</Text>
              <Text style={{
                color: getColor(item.heading2, item.sub_heading2),
                fontSize: fontSizes.SM
              }}>{item.sub_heading}</Text>
            </View>
            <View style={{ alignSelf: 'center' }}>
              <TouchableOpacity style={styles.smallNextButton}
                onPress={() => {
                  setIsInfoButtonVisible(false)
                  item.heading2 == "Calories" ? ShortToast(strings?.calorieBudgetIsHandledByCoach, 'error', '') : null
                  item.heading2 == "Pain" && props.navigation.navigate("PainSubmit", { "flag": dataForPaidUser?.data[0]?.attribute_value })
                  item.heading2 == "Psychology" && props.navigation.navigate("PsychologyQuestions", { "flag": dataForPaidUser?.data[1]?.attribute_value })
                  item.heading2 == "BMI" && props.navigation.navigate("BMIsubmit", { "bmiValue": dataForPaidUser?.data[2]?.attribute_value[0] })
                  item.heading2 == "BMR" && ShortToast(strings?.yourBMRIsCalculatedBased, "warning", "")
                  item.heading2 == "WHR" && props.navigation.navigate("WHRSubmitMedium")
                  item.heading2 == "Reports" && props.navigation.navigate("Reports")
                }}>
                <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                  style={styles.smallNextButton}>
                  <AntDesign name="right" size={HEIGHT * 0.024} color='white' />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{
            top: item.heading2 == "Reports" ? -H * 0.02 : 0,
            marginLeft: item.heading2 == "Reports" ? W * 0.04 : 0,
            marginBottom: item.heading2 == "Reports" ? H * 0 : 0,
            ...fontFamily.bold,
            fontSize: item.heading2 == "Reports" ? fontSizes.SM : fontSizes.XXL,
            textAlign: item.heading2 == "Reports" ? 'left' : 'center',
          }}>{((item.attribute_value.length == 0) || (item.attribute_value[0] == "")) ? "--" : item.attribute_value[0]}</Text>

        </TouchableOpacity >
        :
        null

    )
  }

  const getNotificationCount = async () => {
    // setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    //  const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp))
    const result = await PostApiData('group_message_count', formdata)
    console.log("notification gaurav1 ==========>>>>> ", result)
    if (result.status == 200) {
      setNotificationCount(result.count)
    } else {
      ShortToast(result?.message, 'error', '')
    }
    // setLoader(false)
  }

  const openNotification = async () => {
    readNotificationCount()
    const userID = await getDataFromLocalStorage('user_id')
    props.navigation.navigate("NotificationWebView", { "UserID": `${userID}` })
    console.log("userID== ", userID)
  }

  const readNotificationCount = async () => {
    // setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp))
    const result = await PostApiData('group_read_message', formdata)
    if (result.status == 200) {
      console.log("GauravNotificationCount  == ", result)
      //Alert.alert("Gaurav")
    } else {
      ShortToast(result?.message, 'error', '')
    }
    // setLoader(false)
  }

  return (
    showLoader ?
      <>
        <View style={styles.loadingContainer}>
          <LottieView
            style={{
              height: H * 0.7,
              width: W * 0.7,
            }}
            source={require('../../../../assets/animations/lf30_editor_xibt7sue.json')}
            autoPlay loop />
        </View>
      </>
      :
      <>
        <View style={{
          flex: 1,
        }}>
          <View style={{
            zIndex: 100
          }}>
            < StatusBar backgroundColor={colors.GREEN} />
            <Appbar.Header style={styles.appBar}>
              {/*More Bar Icon*/}
              <TouchableOpacity
                onPress={() => { props.navigation.navigate("MoreNavigation") }}  //modified
                style={{
                  //position: "absolute",
                  // backgroundColor: colors.MEDAL_GOLD,
                  height: 30,
                  width: 30,
                  borderRadius: 30 / 2,
                  //top: H * 0.019,
                  //left: W * 0.032,
                  justifyContent: "center"
                }}>
                <Image
                  onPress={() => { props.navigation.navigate("MoreNavigation") }}  //modified
                  source={require('../../../../assets/icons/menu.png')}
                  style={{
                    height: 27,
                    width: 27,
                    position: "absolute",
                    zIndex: 5,
                    alignSelf: "center"
                  }}
                  tintColor={"green"} />
              </TouchableOpacity>
              {/*LNF Logo and Name*/}
              <View style={{
                //backgroundColor: 'red',
                //position: "absolute",
                alignSelf: "center",
                //top: H * 0.015,
                left: W * 0.1,
                width: W * 0.45,
                alignItems: 'center'
              }}>
                <TouchableOpacity style={{}}>
                  <Image source={require('../../../../assets/icons/LNF2.png')}
                    style={{ height: 30, width: 80, alignSelf: "center", resizeMode: "contain" }} />
                </TouchableOpacity>
                <Text
                  numberOfLines={2}
                  style={{
                    textAlign: "center",
                    ...fontFamily.bold,
                    width: W * 0.4,
                    fontSize: fontSizes.MED,
                    marginBottom: 3
                    //backgroundColor: "red"
                  }}>{strings.hello}, {name}</Text>
                {/* <Text style={{
                  textAlign: "center", ...fontFamily.bold,
                  width: W * 0.4,
                  backgroundColor: "red"
                }}>Hello, Manish</Text> */}
              </View>
              {/*Total Points and Notifications*/}
              <View style={{
                flexDirection: 'row'
              }}>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate("Total Points")
                    }}
                    style={{
                      height: 20,
                      width: 20,
                      alignSelf: 'center',
                    }}>
                    <Animated.Image source={require('../../../../assets/icons/star.png')}
                      style={{
                        height: H * 0.03,
                        width: H * 0.03,
                        zIndex: 5,
                        alignSelf: "center",
                        alignContent: "center",
                        justifyContent: "center",
                        // transform:[{rotate:spin}]
                        transform: [{ rotateY: spin }, { rotateZ: spin }],
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate("Total Points")
                    }}
                    style={{
                      height: H * 0.027,
                      width: W * 0.2,
                      //position: 'absolute',
                      //left: W * 0.705,
                      justifyContent: 'center',
                      alignItems: 'center',
                      //top: H * 0.04,
                    }}>
                    <Text style={{
                      color: 'black',
                      fontSize: fontSizes.MED,
                      fontFamily: "Montserrat-Bold"
                    }}>{data?.totalpoint}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      openNotification()
                    }}
                    style={{
                      height: 27,
                      width: 27,
                      marginRight: 5 // Adjust this value as needed for spacing
                    }}>
                    <Image
                      source={{ uri: "https://cdn-icons-png.flaticon.com/512/891/891012.png" }}
                      style={{
                        height: H * 0.035,
                        width: H * 0.035,
                        tintColor: colors.GREEN
                      }}
                    />
                  </TouchableOpacity>

                  {/* Notification count text */}
                  {notificationCount !== "0" && (
                    <View style={{
                      position: 'absolute',
                      top: -5, // Adjust this value as needed for vertical positioning
                      right: -1, // Adjust this value as needed for horizontal positioning
                      backgroundColor: 'white',
                      borderRadius: 10,
                      minWidth: 20,
                      padding: 2,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      {/* <Text style={{
                        color: 'white',
                        fontStyle: fontFamily.bold,
                        fontSize: fontSizes.LAR, // Adjust this value as needed for font size
                      }}>{notificationCount}</Text> */}
                    </View>
                  )}
                </View>


              </View>


            </Appbar.Header>
            <Divider style={{
              color: 'silver',
              height: 0.5,
              width: '100%'
            }} />
          </View>
          <DoubleTapBackButtonToCloseApp />
          {/**Edit Current Weight///////////////////////////////////////////////// */}
          {
            firstTimeLogin
            &&
            <LottieView style={{ zIndex: 100, height: 90, width: 90, position: 'absolute', top: H * 0.1, right: -W * 0.04 }}
              source={require('../../../../assets/animations/pointer.json')}
              autoPlay loop />
          }
          {/*Edit Weights Modal*/}
          <Modal
            style={{

            }}
            animationType="slide"
            //presentationStyle='fullScreen'
            transparent={true}
            visible={editWeights}
          //visible={true}
          >
            {/* Input Weights Pop Up */}
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              flex: 1
            }}>
              <View style={{
                width: W * 0.8,
                backgroundColor: colors.OFFWHITE,
                borderRadius: 10,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                top: H * 0.07,
                elevation: 5,
                padding: 10,
              }}>
                <Image source={require('../../../../assets/icons/weight-loss.png')}
                  style={{
                    height: H * 0.05,
                    width: H * 0.05,
                    marginBottom: H * 0.02,
                  }} />
                {/* Current Weight Input Container */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                  <Text numberOfLines={1}

                    style={styles.attributeHeading}> {strings.CurrentWeight} </Text>
                  <TextInput
                    value={currentWeight}
                    onChangeText={(t) => {
                      setCrrnt(t)
                      setCurrentWeight(t)
                      if (validateWeight(t)) {
                        setWeightOkButttonDisabled(false)
                      }
                      else {
                        setWeightOkButttonDisabled(true)
                      }
                    }}
                    underlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    maxLength={5}
                    keyboardType="numeric"
                  />
                  <Text style={{
                    color: colors.FONT_BLACK,
                    marginLeft: W * 0.01
                  }}></Text>
                </View>
                {/* Target Weight Input Container */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10
                }}>
                  <Text numberOfLines={1}

                    style={styles.attributeHeading}>{strings.Targetweight} </Text>
                  <TextInput
                    underlineColor={colors.GREEN}
                    onChangeText={(t) => {
                      setTrgt(t)
                      setTargetWeight(t)
                      if (validateWeight(t)) {
                        setWeightOkButttonDisabled(false)
                      }
                      else {
                        setWeightOkButttonDisabled(true)
                      }
                    }}
                    value={targetWeight}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />

                </View>
                <View style={{ flexDirection: "row", width: W * 0.5, justifyContent: "space-evenly" }}>
                  <TouchableOpacity
                    disabled={weightOkButttonDisabled}
                    onPress={() => {
                      updateWeightValues()

                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: weightOkButttonDisabled ? 'gray' : colors.GREEN,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,

                    }}>
                    <Text style={{
                      color: "white"
                    }}>{strings.Ok}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditWeights(false)
                      setCurrentWeight('')
                      //setTargetWeight('')
                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: "white",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,
                    }}>
                    <Text style={{
                      color: colors.FONT_BLACK
                    }}>{strings.Cancel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/**Edit Fasting Sugar///////////////////////////////////////////////// */}
          <Modal
            style={{
              backgroundColor: "red"
            }}
            animationType="slide"
            transparent={true}
            visible={editSugar}>
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              flex: 1
            }}>
              <View style={{
                padding: 10,
                width: W * 0.7,
                backgroundColor: colors.OFFWHITE,
                borderRadius: 10,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                top: H * 0.07,
                elevation: 5,
                width: W * 0.8,
              }}>
                <Image source={require('../../../../assets/icons/glucose-meter.png')}
                  style={{
                    height: H * 0.05,
                    width: H * 0.05,
                    marginBottom: H * 0.02,
                  }} />
                {/* Fasting Input View */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                  <Text numberOfLines={1}

                    style={styles.attributeHeading}>{strings.fasting} </Text>
                  <TextInput
                    onChangeText={(t) => {
                      if (t == '0') {
                        ShortToast('Invalid Input', 'error', '')
                      }
                      else if (t <= 80) {
                        setFastingSugar(t)
                      }
                      else if (t >= 80 && t <= 110) {
                        setFastingSugar(t)
                      }
                      else if (t > 110 && t <= 180) {
                        //ShortToast("Your Fasting Sugar Seems to be Elevated", 'warning', '')
                        setFastingSugar(t)
                      }
                      else if (t > 180 && t <= 250) {
                        //ShortToast("Your Fasting Sugar Seems to be High (Stage 1)", 'error', '')
                        setFastingSugar(t)
                      }
                      else if (t > 250 && t <= 350) {
                        //ShortToast("Your Fasting Sugar Seems to be High (Stage 2)", 'error', '')
                        setFastingSugar(t)
                      }
                      else if (t > 350) {
                        //ShortToast("Your Fasting Sugar Seems to be Critical. Please Consult a Doctor!", 'error', '')
                        setFastingSugar(t)
                      }
                    }}
                    value={fastingSugar}
                    underlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    keyboardType="number-pad"
                    maxLength={3} />
                  <Text style={{
                    color: colors.FONT_BLACK,
                    marginLeft: W * 0.01
                  }}></Text>
                </View>
                {/* Non Fasting Input View */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}>
                  <Text numberOfLines={1}

                    style={styles.attributeHeading}>{strings.nonfating} </Text>
                  <TextInput
                    onChangeText={(t) => {
                      if (t == '0') {
                        ShortToast('Invalid Input', 'error', '')
                      }
                      else if (t <= 90) {
                        setNonFastingSugar(t)
                      }
                      else if (t >= 90 && t <= 140) {
                        setNonFastingSugar(t)
                      }
                      else if (t > 140 && t <= 210) {
                        //ShortToast("Your Non Fasting Sugar Seems to be Elevated", 'warning', '')
                        setNonFastingSugar(t)
                      }
                      else if (t > 210 && t <= 300) {
                        //ShortToast("Your Non Fasting Sugar Seems to be High (Stage 1)", 'error', '')
                        setNonFastingSugar(t)
                      }
                      else if (t > 300 && t <= 380) {
                        //ShortToast("Your Non Fasting Sugar Seems to be High (Stage 2)", 'error', '')
                        setNonFastingSugar(t)
                      }
                      else if (t > 380) {
                        //ShortToast("Your Non Fasting Sugar Seems To Be Critical. Please Consult A Doctor!", 'error', '')
                        setNonFastingSugar(t)
                      }
                    }}
                    value={nonFastingSugar}
                    underlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Text style={{
                    color: colors.FONT_BLACK,
                    marginLeft: W * 0.01
                  }}></Text>
                </View>
                {/* Touch and Cancel Button Container View*/}
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: W * 0.5
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      updateSugarValues()
                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: colors.GREEN,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,
                    }}>
                    <Text style={{
                      color: "white"
                    }}>{strings.Ok}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditSugar(false)
                      setFastingSugar('')
                      setNonFastingSugar('')
                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: "white",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,
                    }}>
                    <Text style={{
                      color: colors.FONT_BLACK
                    }}>{strings.Cancel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/**Edit Fasting Sugar///////////////////////////////////////////////// */}
          {/**Edit non Fasting Sugar///////////////////////////////////////////////// */}
          <Modal
            style={{
              backgroundColor: "red"
            }}
            animationType="slide"
            transparent={true}
            visible={false}>
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              flex: 1
            }}>
              <View style={{
                height: H * 0.28,
                width: W * 0.7,
                backgroundColor: colors.OFFWHITE,
                borderRadius: 10,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                top: H * 0.07,
                elevation: 5,
              }}>
                <Image source={require('../../../../assets/icons/glucose-meter.png')}
                  style={{
                    height: H * 0.05,
                    width: H * 0.05,
                    marginBottom: H * 0.02,
                  }} />
                <View style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                  <Text style={{
                    ...fontFamily.bold
                  }}>{strings.nonfating}</Text>
                  <TextInput
                    onChangeText={(t) => {
                      if (t == '0') {
                        ShortToast('Invalid Input', 'error', '')
                      }
                      else if (t <= 90) {
                        setNonFastingSugar(t)
                      }
                      else if (t >= 90 && t <= 140) {
                        setNonFastingSugar(t)
                      }
                      else if (t > 140 && t <= 210) {
                        ShortToast("Your Non Fasting Sugar Seems to be Elevated", 'warning', '')
                        setNonFastingSugar(t)
                      }
                      else if (t > 210 && t <= 300) {
                        ShortToast("Your Non Fasting Sugar Seems to be High (Stage 1)", 'error', '')
                        setNonFastingSugar(t)
                      }
                      else if (t > 300 && t <= 380) {
                        ShortToast("Your Non Fasting Sugar Seems to be High (Stage 2)", 'error', '')
                        setNonFastingSugar(t)
                      }
                      else if (t > 380) {
                        ShortToast("Your Non Fasting Sugar Seems To Be Critical. Please Consult A Doctor!", 'error', '')
                      }
                    }}
                    value={nonFastingSugar}
                    underlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Text style={{
                    color: colors.FONT_BLACK,
                    marginLeft: W * 0.01
                  }}></Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: W * 0.5
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      // updateValueNonFastingSugar()
                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: colors.GREEN,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,
                    }}>
                    <Text style={{
                      color: "white"
                    }}>{strings.Ok}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditSugar(false)
                      setFastingSugar('')
                      setNonFastingSugar('')
                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: "white",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,
                    }}>
                    <Text style={{
                      color: colors.FONT_BLACK
                    }}>{strings.Cancel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/**Edit non Fasting Sugar///////////////////////////////////////////////// */}
          {/**Edit Systolic///////////////////////////////////////////////// */}
          <Modal
            style={{
            }}
            animationType="slide"
            transparent={true}
            visible={editBp}>
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              flex: 1
            }}>
              <View style={{
                padding: 10,
                backgroundColor: colors.OFFWHITE,
                borderRadius: 10,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                top: H * 0.07,
                elevation: 5,
                width: W * 0.8,
              }}>
                <Image source={require('../../../../assets/icons/hypertension.png')}
                  style={{
                    height: H * 0.05,
                    width: H * 0.05,
                    marginBottom: H * 0.02,
                  }} />
                {/* Systolic BP Input Container */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                  <Text numberOfLines={1}

                    style={styles.attributeHeading}>{strings.systolicBP}</Text>
                  <TextInput
                    onChangeText={(t) => {
                      if (t == '0') {
                        ShortToast('Invalid Input', 'error', '')
                      }
                      else setSystolic(t)
                    }}
                    value={systolic}
                    underlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    keyboardType="number-pad" />
                  <Text style={{
                    color: colors.FONT_BLACK,
                    marginLeft: W * 0.01
                  }}></Text>
                </View>
                {/* Diastolic BP Input Container */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}>
                  <Text numberOfLines={1}

                    style={styles.attributeHeading}>{strings.diastolicBP}</Text>
                  <TextInput
                    value={diastolic}
                    onChangeText={(t) => {
                      if (t == '0') {
                        ShortToast('Invalid Input', 'error', '')
                      }
                      else
                        setDiastolic(t)
                    }}
                    underlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    keyboardType="number-pad" />
                  <Text style={{
                    color: colors.FONT_BLACK,
                    marginLeft: W * 0.01
                  }}></Text>
                </View>
                {/* BPM BP Input Container */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}>
                  <Text numberOfLines={1}

                    style={styles.attributeHeading}>{strings.BPM}</Text>
                  <TextInput
                    onChangeText={(t) => {
                      if (t == '0') {
                        ShortToast('Invalid Input', 'error', '')
                      }
                      else
                        setBpm(t)
                    }}
                    value={bpm}
                    underlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    style={{
                      width: W * 0.2,
                      height: H * 0.07,
                      alignSelf: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                    keyboardType="number-pad" />
                  <Text style={{
                    color: colors.FONT_BLACK,
                    marginLeft: W * 0.01
                  }}></Text>
                </View>
                {/* BP Input and Cancel Button Container */}
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: W * 0.5
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      {
                        if (systolic < 85 || systolic > 180) {
                          updateBpValues()
                          // if (flagg2 > 2) {
                          //   //ShortToast("Your Systolic BP Level Seems to be Critcial, Kindly consult a Doctor", 'error', '')
                          //   updateBpValues()
                          // }
                          // else {
                          //   //setFlagg2(prev => prev + 1)
                          //   //ShortToast("Your Systolic BP level doesn't seem to be normal. Kindly make sure you have took the correct reading", 'warning', '')
                          //   //setSystolic("")
                          // }
                        }
                        else {
                          updateBpValues()
                        }
                      }
                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: colors.GREEN,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,
                    }}>
                    <Text style={{
                      color: "white"
                    }}>{strings.Ok}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditBp(false)
                      setSystolic('')
                      setDiastolic('')
                      setBpm('')
                    }}
                    style={{
                      width: W * 0.18,
                      height: H * 0.04,
                      backgroundColor: "white",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: H * 0.03,
                    }}>
                    <Text style={{
                      color: colors.FONT_BLACK
                    }}>{strings.Cancel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/**Edit Systolic///////////////////////////////////////////////// */}
          <Modal
            visible={firstTimeLogin}
            //visible={true}
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
                height: H * 0.3,
                backgroundColor: colors.OFFWHITE,
                // backgroundColor: "red",
                width: W * 0.85,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                elevation: 8,
              }}
              >
                <LottieView
                  style={{
                    height: H * 0.7,
                    width: W * 0.7,
                    position: 'absolute',
                    //zIndex: 1
                  }}
                  //onAnimationLoaded={playSound}
                  source={require('../../../../assets/animations/congratulations.json')}
                  autoPlay
                  loop
                />
                {/* <TouchableOpacity 
                style={{zIndex:200, backgroundColor:'red'}}
                onPress={playSound}>
                  <Text>Play Sound</Text>
                </TouchableOpacity> */}
                <Text style={{
                  ...fontFamily.bold,
                  fontSize: fontSizes.XXL,
                  paddingBottom: H * 0.02,
                  color: colors.GREEN
                }}>
                  {strings.Congratulations}!    <FontAwesome5 name="coins" size={20} color={colors.MEDAL_GOLD} />
                </Text>
                <Text style={{
                  ...fontFamily.bold,
                  paddingHorizontal: W * 0.025,
                  lineHeight: H * 0.03
                }}>
                  {strings.YouHaveWon}
                </Text>
                <TouchableOpacity onPress={() => {
                  setFirstTimeLogin(false)
                  storeDataInLocalStorage('firstTimeLogin', '0')
                }}>
                  <Text style={{
                    ...fontFamily.bold,
                    color: colors.GREEN,
                    fontSize: fontSizes.XL,
                    paddingTop: H * 0.028,
                  }}>
                    {strings.Ok}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* modal for paid user status */}
          <Modal
            visible={paiduserstatusModal}
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
                height: H * 0.3,
                backgroundColor: colors.OFFWHITE,
                // backgroundColor: "red",
                width: W * 0.85,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                elevation: 8,
              }}
              >
                <Text style={{
                  ...fontFamily.bold,
                  fontSize: fontSizes.XXL,
                  paddingBottom: H * 0.02,
                  color: 'green'
                }}>
                  Alert

                  {/* <FontAwesome5 name="coins" size={20} color={colors.MEDAL_GOLD} /> */}

                </Text>
                <Text style={{
                  ...fontFamily.bold,
                  paddingHorizontal: W * 0.025,
                  lineHeight: H * 0.03, textAlign: 'center'
                }}>
                  Your Payment has been done , please answer some questions to become paid user!
                </Text>
                <TouchableOpacity onPress={() => {
                  setPaiduserstatusModal(false)

                  props.navigation.navigate("PaidCustomQuestions")

                }}>
                  <Text style={{
                    ...fontFamily.bold,
                    color: 'green',
                    fontSize: fontSizes.XL,
                    paddingTop: H * 0.028,
                  }}>
                    OKAY
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal visible={visibleMood}
            transparent={true}>
            <View
              style={{
                height: H,
                width: W,
                //justifyContent: "center",
                //alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.3)"
              }}
            >
              <View style={{
                padding: 10,
                top: H * 0.07,
                backgroundColor: colors.OFFWHITE,
                // backgroundColor: "red",
                width: W * 0.85,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                elevation: 8,
              }}
              >
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: H * 0.02,
                }}>
                  <Text style={{
                    ...fontFamily.bold,
                    fontSize: fontSizes.XXL,
                    color: colors.GREEN,
                    paddingRight: W * 0.02
                  }}>
                    {strings.HavingabadDay}
                  </Text>
                  <LottieView style={{ height: H * 0.03, width: H * 0.03 }}
                    source={require('../../../../assets/animations/10110-sad.json')}
                    autoPlay loop />
                </View>
                <Text style={{
                  ...fontFamily.bold,
                  paddingHorizontal: W * 0.025,
                  lineHeight: H * 0.03
                }}>
                  {strings.Pleaseentergratitude}
                </Text>



                <>
                  <TextInput
                    maxLength={160}
                    returnKeyType='done'
                    blurOnSubmit={true}
                    multiline
                    value={text}
                    onChangeText={(t) => setText(t)}
                    style={{
                      //height: H * 0.07,
                      width: W * 0.65,
                      backgroundColor: "white",
                      marginTop: H * 0.04,
                    }} />
                  <View style={{
                    flexDirection: "row",
                    marginTop: H * 0.02,
                    justifyContent: "space-between",
                    // width: W * 0.5
                  }}>
                    <TouchableOpacity
                      onPress={() => addGoal()}
                      style={{
                        backgroundColor: colors.GREEN,
                        borderRadius: 8,
                        paddingVertical: H * 0.01,
                        paddingHorizontal: W * 0.02,
                      }}
                    >
                      <Text style={{
                        color: "white"
                      }}>
                        {strings.Submit}
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        paddingVertical: H * 0.01,
                        paddingHorizontal: W * 0.02,
                        borderRadius: 8,
                      }}
                      onPress={() => {
                        setText("")
                        setVisibleMood(false)
                      }}>
                      <Text>
                        {strings.Skip}
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </>



              </View>
            </View>
          </Modal>

          <Modal visible={visibleMoodGood}
            transparent={true}>
            <View
              style={{
                height: H,
                width: W,
                //justifyContent: "center",
                //alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.3)"
              }}
            >
              <View style={{
                padding: 10,
                top: H * 0.07,
                backgroundColor: colors.OFFWHITE,
                // backgroundColor: "red",
                width: W * 0.85,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                elevation: 8,
              }}
              >
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: H * 0.02,
                }}>
                  <Text style={{
                    ...fontFamily.bold,
                    fontSize: fontSizes.XXL,
                    color: colors.GREEN,
                    paddingRight: W * 0.02
                  }}>
                    {strings.HavingabadDay}
                  </Text>
                  <LottieView style={{ height: H * 0.03, width: H * 0.03 }}
                    source={require('../../../../assets/animations/happy.json')}
                    autoPlay loop />
                </View>
                <Text style={{
                  ...fontFamily.bold,
                  paddingHorizontal: W * 0.025,
                  lineHeight: H * 0.03
                }}>
                  {strings.Pleaseentergratitude}
                </Text>



                <>
                  <TextInput
                    maxLength={160}
                    returnKeyType='done'
                    blurOnSubmit={true}
                    multiline
                    value={text}
                    onChangeText={(t) => setText(t)}
                    style={{
                      //height: H * 0.07,
                      width: W * 0.65,
                      backgroundColor: "white",
                      marginTop: H * 0.04,
                    }} />
                  <View style={{
                    flexDirection: "row",
                    marginTop: H * 0.02,
                    justifyContent: "space-between",
                    // width: W * 0.5
                  }}>
                    <TouchableOpacity
                      onPress={() => addGoal()}
                      style={{
                        backgroundColor: colors.GREEN,
                        borderRadius: 8,
                        paddingVertical: H * 0.01,
                        paddingHorizontal: W * 0.02,
                      }}
                    >
                      <Text style={{
                        color: "white"
                      }}>
                        {strings.Submit}
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        paddingVertical: H * 0.01,
                        paddingHorizontal: W * 0.02,
                        borderRadius: 8,
                      }}
                      onPress={() => {
                        setText("")
                        setVisibleMood(false)
                      }}>
                      <Text>
                        {strings.Skip}
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </>



              </View>
            </View>
          </Modal>

          <Modal
            visible={secondaryLoader}
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
          {/**Edit bpm///////////////////////////////////////////////// */}
          <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
              <Dialog.Title style={{ textAlign: 'center' }}>{heading}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{subHeading}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisible(false)}>Got it!</Button>
              </Dialog.Actions>
            </Dialog>
            {/* <Snackbar
              style={{
                backgroundColor: colors.BAD_COLOR
              }}
              visible={visibleSnackOne}
              onDismiss={onDismissSnackBarOne}
              action={{
                label: <Text>OK</Text>,
                onPress: () => {
                  onDismissSnackBarOne()
                  onDismissSnackBarTwo()
                  onDismissSnackBarThree()
                },
              }}>
              <Text style={{
                color: colors.FONT_BLACK,
                textAlign: "center"
              }}> It's Okay, Tomorrow Will be Better!</Text>
            </Snackbar>
            <Snackbar
              style={{
                backgroundColor: colors.GOOD_COLOR
              }}
              visible={visibleSnackTwo}
              onDismiss={onDismissSnackBarTwo}
              action={{
                label: <Text>OK</Text>,
                onPress: () => {
                  onDismissSnackBarOne()
                  onDismissSnackBarTwo()
                  onDismissSnackBarThree()
                },
              }}>
              <Text>
                Good. But there is still scope for Improvemnet</Text>
            </Snackbar>
            <Snackbar
              visible={visibleSnackThree}
              onDismiss={onDismissSnackBarThree}
              style={{
                backgroundColor: colors.BEST_COLOR
              }}
              action={{
                label: <Text>OK</Text>,
                onPress: () => {
                  onDismissSnackBarOne()
                  onDismissSnackBarTwo()
                  onDismissSnackBarThree()
                },
              }}>
              <Text>Well Done. Keep it Up!</Text>
            </Snackbar>*/}
            {/* change to comment */}
            {/* <FAB.Group
              style={{}}
              fabStyle={{ backgroundColor: colors.ORANGE, marginBottom: H * 0.11 }}
              visible={isInfoButtonVisible}
              open={open}
              icon={open ? 'menu-open' : 'menu'}
              actions={[
                {
                  icon: require('../../../../assets/icons/electrocardiography.png'),
                  label: 'Health Index',
                  onPress: () => {
                    setIsInfoButtonVisible(false)
                    props.navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.healthindex[0]?.value })
                  },
                },
                {
                  icon: require('../../../../assets/icons/blog.png'),
                  label: 'Blog',
                  onPress: () => openURL(),
                },
                {
                  icon: require('../../../../assets/icons/user.png'),
                  label: 'My Profile',
                  onPress: () => {
                    setIsInfoButtonVisible(false)
                    props.navigation.navigate("UserProfile")
                  }
                },
                {
                  icon: require('../../../../assets/icons/ribbon.png'),
                  color: "white",
                  style: { backgroundColor: colors.MEDAL_GOLD, },
                  label: 'My Points',
                  onPress: () => {
                    setIsInfoButtonVisible(false)
                    props.navigation.navigate("Total Points")
                  }
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            /> */}
          </Portal>
          {/*<FAB
            visible={isInfoButtonVisible}
            icon={require('../../../../assets/icons/electrocardiography.png')}
            color="white"
            //label="Health Index"
            style={styles.fab}
            onPress={() => {props.navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.infomation[0]?.totalpoint })
                            setIsInfoButtonVisible(false)}}
            animated={true}
            />*/}
          <View style={{ height: HEIGHT }}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.mainContainer}
              // onScrollEndDrag={() => { setIsInfoButtonVisible(!isInfoButtonVisible) }}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  setIsInfoButtonVisible(false)
                }
                else setIsInfoButtonVisible(true)
              }}
              scrollEventThrottle={400}
              // onMomentumScrollEnd={() => setIsInfoButtonVisible(true)}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />}
            >
              {myloop}
              {/*********************PAID USER*******************/}
              <View style={{ marginTop: HEIGHT * 0.02, alignItems: 'center' }}>
                {/* <FlatList
                  data={dataForPaidUser?.single}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `${index}`}
                /> */}
                {/* <FlatList
                  data={dataForPaidUser?.data}
                  renderItem={renderItemTwo}
                  keyExtractor={(item, index) => `${index}`}
                  numColumns={2} /> */}
                {
                  dataForPaidUser?.single?.map((item, index) => {
                    return (
                      renderItem(item, index)
                    )
                  })
                }
                <View style={styles.renderItemTwoViewContainer}>
                  {
                    dataForPaidUser?.data?.map((item, index) => {
                      return (
                        renderItemTwo(item, index)
                      )
                    })
                  }
                </View>

                {/*  <Image source={require('../../../../assets/icons/blog.png')}
                    style={{
                      height: H * 0.12,
                      width: H * 0.12,
                    }}
                  />*/}
              </View>
            </ScrollView>
          </View>
        </View>
      </>
  )
}
const styles = StyleSheet.create({
  container:
  {
    height: H,
    width: W,
    alignItems: "center",
    backgroundColor: "transparent",
    paddingTop: H * 0.05,
    position: "absolute"
  },
  profilePhoto:
  {
    height: H / 1.2,
    width: H / 2.29,
    position: "absolute",
    zIndex: 0,
    borderRadius: 10,
    marginTop: H * 0.02,

  },
  title:
  {
    alignSelf: "center",
    backgroundColor: "transparent",
    height: H / 1.25,
    width: H / 2.29,
    marginTop: H * 0.025,

  },
  title2:
  {
    backgroundColor: "transparent",
    height: H * 0.075,
    width: H * 0.36,
    position: "absolute",
    top: -H * 0.65,
    right: - H * 0.15,
    borderRadius: 10
  },
  title3:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.06,
    width: H * 0.06,
    top: -H * 0.645,
    left: H * 0.151,
  },
  title4:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.1,
    width: H * 0.44,
    top: -H * 0.8,
    left: - H * 0.22,
  },
  title5:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.1,
    width: H * 0.44,
    top: -H * 0.68,
    left: - H * 0.22,
  },
  title6:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.11,
    width: H * 0.44,
    top: -H * 0.57,
    left: - H * 0.22,
  },
  title7:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.11,
    width: H * 0.44,
    top: -H * 0.45,
    left: - H * 0.22,
  },
  title8:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.11,
    width: H * 0.44,
    top: -H * 0.335,
    left: - H * 0.22,
  },
  title9:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.11,
    width: H * 0.44,
    top: - H * 0.22,
    left: - H * 0.22,
  },
  title10:
  {
    backgroundColor: "transparent",
    position: "absolute",
    height: H * 0.11,
    width: H * 0.44,
    top: -H * 0.1,
    left: - H * 0.22,
  },
  fab: {
    position: 'absolute',
    //backgroundColor: colors.ORANGE,
    // right: W * 0.05,
    // bottom: H * 0.18,
    //zIndex: 10,
    //elevation: 3,
    // height: H * 0.08,
    // width: H * 0.08,
    //justifyContent: "center",
    //alignItems: "center",
    // paddingLeft: H * 0.015,
    //opacity: 0.7,

  },
  mainContainer:
  {
    paddingBottom: HEIGHT * 0.3
  },
  headerView:
  {
    width: '100%',
    height: 60,
    elevation: 10,
    backgroundColor: 'white',
    shadowColor: 'black'
  },
  centered:
  {
    alignItems: 'center',
  },
  loadingContainer:
  {
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: 'white',
  },
  cardForMonitoringStats:
  {
    backgroundColor: 'white',
    marginVertical: HEIGHT * 0.01,
    alignSelf: 'center',
    width: WIDTH * 0.9,
    paddingVertical: HEIGHT * 0.012,
    borderRadius: 10,
    elevation: 1,
    ...ShadowsiOS,

  },
  renderItemTwoContainer:
  {
    backgroundColor: 'white',
    height: HEIGHT * 0.12,
    width: WIDTH * 0.42,
    borderRadius: 5,
    marginHorizontal: WIDTH * 0.02,
    marginVertical: HEIGHT * 0.01,
    paddingVertical: HEIGHT * 0.01,
    elevation: 1,
    ...ShadowsiOS,

  },
  renderItemTwoViewContainer:
  {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //backgroundColor: 'red',
    justifyContent: 'center'
  },
  nextButton:
  {
    borderRadius: 10,
    height: HEIGHT * 0.066,
    width: HEIGHT * 0.066,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: HEIGHT * 0.01
  },
  smallNextButton:

  {
    borderRadius: 8,
    height: HEIGHT * 0.042,
    width: HEIGHT * 0.042,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT * 0.02,
  },
  appBar:
  {
    backgroundColor: colors.OFFWHITE,
    //backgroundColor: 'red',
    justifyContent: "space-between",
    width: W,
  },
  headerContainer:
  {
    //justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 8,
    height: HEIGHT * 0.08,
    width: WIDTH,
    paddingHorizontal: WIDTH * 0.02
  },
  attributeHeading:
  {
    ...fontFamily.bold,
    width: W * 0.4
  }
})

export default Stats
