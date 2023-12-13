
import { Dimensions, StyleSheet, View, StatusBar, Text as TextRN, TouchableOpacity, Image, Animated, Easing, ScrollView, Alert, RefreshControl, Linking, Modal, Platform } from 'react-native'
import React, { useEffect, useState, useContext, useRef } from 'react'
import InfoCard from '../../Components/InfoCard'
import { Appbar, Divider, Text, FAB, Portal, Dialog, Paragraph, Button, Snackbar, TextInput, configureFonts, DefaultTheme } from 'react-native-paper';
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

//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});



const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const Stats = (props) => {

  const isFocused = useIsFocused();
  const [data, setData] = useState(null)
  const [showLoader, setShowLoader] = useState(true)
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

  const { Nlanguagee } = useContext(DataContext)
  const [languagee, setLanguagee] = Nlanguagee
  const [notificationCount, setNotificationCount] = useState("")

  ////////////////////////////////////////////



  const spinValue = new Animated.Value(0);


  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  useEffect(() => {
    if (isFocused) {
      getDataForFreeUser()
      getDataForPaidUser()
      getName()
      getNotificationCount()
    }


  }, [isFocused]);

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



  useEffect(() => {
    if (isFocused) {
      getPaidUserStatus()
    }
    getLanguge()
  }, [isFocused])


  useEffect(() => { getFirstTimeLoginStatus() }, [])

  useEffect(() => {
    if (isFocused) {
      // getUserType()  // hide upgarde popup- 01 dec
    }

  }, [isFocused])

  const onPressScroll = () => {
    //scrollRef.current.scrollToEnd({ animated: true })
    scrollRef.current.scrollTo({ y: 430, animated: true });
  }
  //lng
  const getLanguge = async () => {
    setShowLoader(true)
    const lang = await getDataFromLocalStorage("lang")
    if (lang == "en") {
      changeLaguagee('en')
    } else {
      changeLaguagee('hi')
    }
    setShowLoader(false)
  }
  const changeLaguagee = (languageKey) => {
    strings.setLanguage(languageKey)
  }

  const onPressButton = () => {
    getDataForFreeUser()
    // getDataForPaidUser()
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
    getDataForPaidUser()
    getName()

    wait(2000).then(() => setRefreshing(false));
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const {
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
  } = useContext(DataContext)
  const [visible, setVisible] = Nvisible
  const [heading, setHeading] = Nheading
  const [subHeading, setSubHeading] = NsubHeading
  const [visibleSnackOne, setVisibleSnackOne] = NvisibleSnackOne
  const [visibleSnackTwo, setVisibleSnackTwo] = NvisibleSnackTwo
  const [visibleSnackThree, setVisibleSnackThree] = NvisibleSnackThree
  const [isInfoButtonVisible, setIsInfoButtonVisible] = NisInfoButtonVisible
  const [questionNumber, setQuestionNumber] = NquestionNumber
  const [num, setNum] = Nnum
  const [globalBmi, setGlobalBmi] = NglobalBmi
  const [crrnt, setCrrnt] = Ncrrnt
  const [trgt, setTrgt] = Ntrgt
  const [ht, setHt] = Nht
  const [feet, setFeet] = Nfeet
  const [inch, setInch] = Ninch
  const [visibleMood, setVisibleMood] = NvisibleMood
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const onDismissSnackBarOne = () => setVisibleSnackOne(false);
  const onDismissSnackBarTwo = () => setVisibleSnackTwo(false);
  const onDismissSnackBarThree = () => setVisibleSnackThree(false);


  const getFirstTimeLoginStatus = async () => {
    const temp = await getDataFromLocalStorage('firstTimeLogin')
    if (temp == 1) {
      setFirstTimeLogin(true)
    }
  }

  const addGoal = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp))
    formdata.append("text", text)
    const result = await PostApiData('add_user_mood', formdata)
    if (result.status == 200) {
      setShowInputForGratification(false)
      ShortToast(result.message, 'success', '')
      setVisibleMood(false)
      props.navigation.navigate('Gratification')
    }
  }


  const updateWeightValues = async () => {
    if (currentWeight == "" || currentWeight.length == 0 || targetWeight == "" || targetWeight.length == 0) {
      ShortToast('Required Field is missing', 'error', '')
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
        getDataForPaidUser()
        ShortToast('Success', 'success', '')
        setEditWeights(false)
      }
    }
  }

  const updateSugarValues = async () => {
    // if (fastingSugar == "" || fastingSugar.includes(".") || fastingSugar.includes(",") || fastingSugar.includes("-") || fastingSugar.includes(" ") || nonFastingSugar == "" || nonFastingSugar.includes(".") || nonFastingSugar.includes(",") || nonFastingSugar.includes("-") || nonFastingSugar.includes(" ")) {
    //   ShortToast('Invalid Input', 'error', '')
    // }
    // else 
    if (fastingSugar < 55 || nonFastingSugar < 70) {
      ShortToast("Your sugar seems to be critically low! Kindly consult a Doctor", 'error', '')
      const temp = await getDataFromLocalStorage('user_id')
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "Sugar");
      formdata.append("fasting", fastingSugar);
      formdata.append("nonfasting", nonFastingSugar);

      const result = await PostApiData('updateuserhealthplan', formdata)
      if (result.status == 200) {
        getDataForPaidUser()
        setEditSugar(false)
      }
    }
    else {
      // if (route.params.flag[0] == "" && route.params.flag[1] == "") {
      const temp = await getDataFromLocalStorage('user_id')
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "Sugar");
      formdata.append("fasting", fastingSugar);
      formdata.append("nonfasting", nonFastingSugar);

      const result = await PostApiData('updateuserhealthplan', formdata)
      if (result.status == 200) {
        getDataForPaidUser()
        setEditSugar(false)
        ShortToast(JSON.stringify(result?.message), 'success', '')

      }
      //  }
      {/*  else {
          const temp = await getDataFromLocalStorage('user_id')
          var formdata = new FormData();
          formdata.append("user_id", JSON.parse(temp));
          formdata.append("type", "Pain");
          formdata.append("value", (Math.round(fastingSugar * 100) / 100).toFixed(2));

          const result = await PostApiData('updateuserpaidhealthplan', formdata)
          if (result.status == 200) {
              ShortToast('Success','','')
              updateOtherValue()
          }
      }*/}
    }
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
        getDataForPaidUser()
        { flagg2 > 2 ? null : ShortToast('Success', 'success', '') }
        setEditBp(false)
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
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    const result = await PostApiData('freeuser', formdata)
    setData(result)
    storeDataInLocalStorage("stackValue", "3")
    storeDataInLocalStorage("user_type", JSON.stringify(result?.user_type))
    //console.log("tempPaid", temp)
    console.log("response user freeuser =================>  ", JSON.stringify(result?.user_type))
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
      setCurrentWeight(result?.single[0]?.attribute_value[0])
      setTargetWeight(result?.single[0]?.attribute_value[1])
      setFastingSugar(result?.single[1]?.attribute_value[0])
      setNonFastingSugar(result?.single[1]?.attribute_value[1])
      setSystolic(result?.single[2]?.attribute_value[0])
      setDiastolic(result?.single[2]?.attribute_value[1])
      setBpm(result?.single[2]?.attribute_value[2])
    }
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
    setShowLoader(false)
  }



  var myloop = []
  /////////////////////////////////////Power of Seven Cards//////////////////////////////////////////////
  for (let i = 0; i < data?.data?.length; i++) {
    myloop.push(
      <InfoCard
        Location={data?.data[i]?.icon}
        Key={i}
        key={i}
        Text={data?.data[i]?.heading}
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

  const renderItem = ({ item }) => {
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
    const myLoopTwo = []                                                //values of weigth, Sugar, BP/////////////////////////////////////////
    for (let i = 0; i < item?.attribute?.length - 1; i++) {
      myLoopTwo.push(
        <>

          <View style={{ flex: 1, alignSelf: 'center' }}
            key={i}>
            <TouchableOpacity
              onPress={() => {
                handleTextPress(item.attribute[i])
              }}>
              {<Text key={i + 1} style={{
                ...fontFamily.bold,
                fontSize: fontSizes.XXL, marginBottom: HEIGHT * 0.013, textAlign: 'center'
              }}>{(item.attribute_value[i] == "") ? "--" : item.attribute_value[i]}</Text>}
            </TouchableOpacity>
            <Text key={i + 2} style={{ fontSize: fontSizes.MED, textAlign: 'center' }}>{item.attribute[i]}</Text>
          </View>
          <Divider key={i + 3}
            style={{ borderWidth: 0.5, borderColor: "silver", height: HEIGHT * 0.09, width: 0.5 }} />

        </>
      )
    }
    /*///Weigth, Sugar, BP////*////////////////////////////////////////////////////////////////////////////////////////////
    return (
      <View style={styles.cardForMonitoringStats}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

          <Text style={{ ...fontFamily.bold, marginLeft: WIDTH * 0.02 }}>{item.heading}</Text>
          <View style={{
            backgroundColor: getColorForBg(item?.attribute[item?.attribute?.length - 1]),
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
              color: getColorForText(item?.attribute[item?.attribute?.length - 1]),
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
            <View style={{ flexDirection: 'row', width: WIDTH * 0.7 }}>
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

                  item.heading == 'Weight' && props.navigation.navigate("OnDetailsSubmitScreenOne")
                  item.heading == 'Sugar' && props.navigation.navigate("OnDetailsSubmitScreenTwo", { "flag": dataForPaidUser?.single[1]?.attribute_value })
                  item.heading == 'Blood Pressure' && props.navigation.navigate("OnDetailsSubmitScreenThree")


                  //item.heading == 'Health Index' && props.navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.healthindex[0]?.value })

                  // if (data?.user_type == "3" || data?.user_type == "2") {

                  //   item.heading == 'Health Index' && props.navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.healthindex[0]?.value })

                  // } else {

                  //   item.heading == 'Health Index' && props.navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.healthindex[0]?.value })

                  // }
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
  const renderItemTwo = ({ item }) => {
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
      item.heading !== "Calories" ?
        <TouchableOpacity style={styles.renderItemTwoContainer}
          onPress={() => {
            setIsInfoButtonVisible(false)
            item.heading == "Calories" ? ShortToast('Calorie Budget is handled by Coach. Kindly contact your Coach', 'error', '') : null
            item.heading == "Pain" && props.navigation.navigate("PainSubmit", { "flag": dataForPaidUser?.data[0]?.attribute_value })
            item.heading == "Psychology" && props.navigation.navigate("PsychologyQuestions", { "flag": dataForPaidUser?.data[1]?.attribute_value })
            item.heading == "BMI" && props.navigation.navigate("BMIsubmit", { "bmiValue": dataForPaidUser?.data[2]?.attribute_value[0] })
            item.heading == "BMR" && ShortToast("Your BMR Value is calculated based on your provided details. Please contact your Coach if you wish to Change it.", "warning", "")
            item.heading == "WHR" && props.navigation.navigate("WHRSubmitMedium")
            item.heading == "Reports" && props.navigation.navigate("Reports")

          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between', marginHorizontal: WIDTH * 0.04
          }}>
            <View style={{ width: WIDTH * 0.275 }}>
              <Text style={{ ...fontFamily.bold }}>{item.heading}</Text>
              <Text style={{
                color: getColor(item.heading, item.sub_heading),
                fontSize: fontSizes.SM
              }}>{item.sub_heading}</Text>
            </View>
            <View style={{ alignSelf: 'center' }}>
              <TouchableOpacity style={styles.smallNextButton}
                onPress={() => {
                  setIsInfoButtonVisible(false)
                  item.heading == "Calories" ? ShortToast('Calorie Budget is handled by Coach. Kindly contact your Coach', 'error', '') : null
                  item.heading == "Pain" && props.navigation.navigate("PainSubmit", { "flag": dataForPaidUser?.data[0]?.attribute_value })
                  item.heading == "Psychology" && props.navigation.navigate("PsychologyQuestions", { "flag": dataForPaidUser?.data[1]?.attribute_value })
                  item.heading == "BMI" && props.navigation.navigate("BMIsubmit", { "bmiValue": dataForPaidUser?.data[2]?.attribute_value[0] })
                  item.heading == "BMR" && ShortToast("Your BMR Value is calculated based on your provided details. Please contact your Coach if you wish to Change it.", "warning", "")
                  item.heading == "WHR" && props.navigation.navigate("WHRSubmitMedium")
                  item.heading == "Reports" && props.navigation.navigate("Reports")

                }}>
                <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                  style={styles.smallNextButton}>
                  <AntDesign name="right" size={HEIGHT * 0.024} color='white' />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{
            top: item.heading == "Reports" ? -H * 0.02 : 0,
            marginLeft: item.heading == "Reports" ? W * 0.04 : 0,
            marginBottom: item.heading == "Reports" ? H * 0 : 0,
            ...fontFamily.bold,
            fontSize: item.heading == "Reports" ? fontSizes.SM : fontSizes.XXL,
            textAlign: item.heading == "Reports" ? 'left' : 'center',
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
    console.log("Gaurav== =================================", result)
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
                width: W * 0.4,
              }}>

                <TouchableOpacity style={{}}>
                  <Image source={require('../../../../assets/icons/LNF2.png')}
                    style={{ height: 30, width: 80, alignSelf: "center", resizeMode: "contain" }} />
                </TouchableOpacity>

                <Text style={{
                  textAlign: "center", ...fontFamily.bold,
                  width: W * 0.4,
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
                      //props.navigation.navigate("Walkthrough")
                    }}
                    style={{
                      height: 15,
                      width: 20,
                      //left: W * 0.78,
                      //top: H * 0.015,
                      //position: 'absolute',
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


                <TouchableOpacity

                  onPress={() => {
                    openNotification()
                  }}
                  style={{
                    height: 27,
                    width: 27,
                    // left: W * 0.88,
                    // top: H * 0.021,
                    // position: 'absolute'
                    //  marginTop:H*0.004,
                  }}>
                  <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/891/891012.png" }}
                    style={{
                      height: H * 0.035,
                      width: H * 0.035,
                      // position: "absolute",
                      zIndex: 5,
                      alignSelf: "center",
                      tintColor: colors.GREEN
                    }}
                  />
                </TouchableOpacity>

                {notificationCount == "0" ? null : <TouchableOpacity

                  onPress={() => {
                    openNotification()
                  }}

                  style={{
                    height: H * 0.027,
                    width: H * 0.027,
                    borderRadius: H * 0.03 / 2,
                    // backgroundColor: "red",
                    //position: 'absolute',
                    //left: W * 0.92,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //top: H * 0.012,
                  }}>
                  <Text style={{
                    color: 'white',
                    fontSize: fontSizes.SM,
                    ...fontFamily.bold,
                  }}>{notificationCount}</Text>
                </TouchableOpacity>}


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
          {firstTimeLogin ?
            <>

              <LottieView style={{ zIndex: 100, top: -H * 0.44, left: -W * 0.24 }}
                source={require('../../../../assets/animations/pointer.json')}
                autoPlay loop />

            </>
            :
            <></>}

          {/*Edit Weights Modal*/}
          <Modal
            style={{

            }}
            animationType="fade"
            transparent={true}
            visible={editWeights}>

            {/* Input Weights Pop Up */}

            <View style={{
              width: W * 0.8,
              backgroundColor: colors.OFFWHITE,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              top: H * 0.35,
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
                adjustsFontSizeToFit
                style={styles.attributeHeading}> {strings.CurrentWeight} </Text>
                <TextInput
                  value={currentWeight}
                  onChangeText={(t) => {
                    if (t.length == 1 && (t == "-" || t == "." || t == "," || t == "0")) {
                      ShortToast("Invalid Input", "error", "")
                    }
                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                      ShortToast("Invalid Input", "error", "")
                    }
                    else {
                      setCrrnt(t)
                      setCurrentWeight(t)
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
                  maxLength={3}
                  keyboardType="number-pad" />
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
                adjustsFontSizeToFit
                style={styles.attributeHeading}>{strings.Targetweight} </Text>
                <TextInput
                  underlineColor={colors.GREEN}
                  onChangeText={(t) => {
                    if (t.length == 1 && (t == "-" || t == "." || t == "," || t == "0")) {
                      ShortToast("Invalid Input", "error", "")
                    }
                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                      ShortToast("Invalid Input", "error", "")
                    }
                    else if ((t.length == 2 || t.length == 3) && (((t > (data?.height * data?.height * 24.9))) || ((t < (data?.height * data?.height * 18.5))))) {
                      ShortToast(`Please choose a Target Weight between ${(Math.round(((data?.height * data?.height * 18.5)) * 100) / 100).toFixed(0)} to ${(Math.round(((data?.height * data?.height * 24.9)) * 100) / 100).toFixed(0)} According to your BMI.`, "error", "")
                      setTargetWeight("")
                    }
                    else {
                      setTrgt(t)
                      setTargetWeight(t)
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
                  keyboardType="number-pad" />
                <Text style={{
                  color: colors.FONT_BLACK,
                  marginLeft: W * 0.01
                }}></Text>
              </View>
              <View style={{ flexDirection: "row", width: W * 0.5, justifyContent: "space-evenly" }}>
                <TouchableOpacity
                  onPress={() => {
                    updateWeightValues()

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
                    setEditWeights(false)
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
          </Modal>

          {/**Edit Fasting Sugar///////////////////////////////////////////////// */}
          <Modal
            style={{
              backgroundColor: "red"
            }}
            animationType="fade"
            transparent={true}
            visible={editSugar}>
            <View style={{
              padding: 10,
              width: W * 0.7,
              backgroundColor: colors.OFFWHITE,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              top: H * 0.35,
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
                adjustsFontSizeToFit
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
                      ShortToast("Your Fasting Sugar Seems to be Elevated", 'warning', '')
                      setFastingSugar(t)
                    }
                    else if (t > 180 && t <= 250) {
                      ShortToast("Your Fasting Sugar Seems to be High (Stage 1)", 'error', '')
                      setFastingSugar(t)
                    }
                    else if (t > 250 && t <= 350) {
                      ShortToast("Your Fasting Sugar Seems to be High (Stage 2)", 'error', '')
                      setFastingSugar(t)
                    }
                    else if (t > 350) {
                      ShortToast("Your Fasting Sugar Seems to be Critical. Please Consult a Doctor!", 'error', '')
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
                adjustsFontSizeToFit
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
          </Modal>
          {/**Edit Fasting Sugar///////////////////////////////////////////////// */}
          {/**Edit non Fasting Sugar///////////////////////////////////////////////// */}
          <Modal
            style={{
              backgroundColor: "red"
            }}
            animationType="fade"
            transparent={true}
            visible={false}>
            <View style={{
              height: H * 0.28,
              width: W * 0.7,
              backgroundColor: colors.OFFWHITE,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              top: H * 0.35,
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
          </Modal>
          {/**Edit non Fasting Sugar///////////////////////////////////////////////// */}
          {/**Edit Systolic///////////////////////////////////////////////// */}
          <Modal
            style={{

            }}
            animationType="fade"
            transparent={true}
            visible={editBp}>
            <View style={{
              padding: 10,
              backgroundColor: colors.OFFWHITE,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              top: H * 0.35,
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
                adjustsFontSizeToFit
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
                adjustsFontSizeToFit
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
                adjustsFontSizeToFit
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
                        if (flagg2 > 2) {
                          ShortToast("Your Systolic BP Level Seems to be Critcial, Kindly consult a Doctor", 'error', '')
                          updateBpValues()
                        }
                        else {
                          setFlagg2(prev => prev + 1)
                          ShortToast("Your Systolic BP level doesn't seem to be normal. Kindly make sure you have took the correct reading", 'warning', '')
                          setSystolic("")
                        }
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
          </Modal>
          {/**Edit Systolic///////////////////////////////////////////////// */}
          {/**Edit diastolic///////////////////////////////////////////////// */}
          <Modal
            style={{
              backgroundColor: "red"
            }}
            animationType="fade"
            transparent={true}
            visible={false}>
            <View style={{
              height: H * 0.28,
              width: W * 0.7,
              backgroundColor: colors.OFFWHITE,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              top: H * 0.35,
              elevation: 5,
            }}>
              <Image source={require('../../../../assets/icons/hypertension.png')}
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
                }}>{strings.diastolicBP}</Text>
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
              <View style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: W * 0.5
              }}>
                <TouchableOpacity
                  onPress={() => {
                    {

                      if (diastolic < 55 || diastolic > 120) {
                        if (flagg1 > 2) {
                          ShortToast("Your Diastolic BP Level Seems to be Critical, Kindly Consult a Doctor", 'error', '')
                          //updateValueDiastolicBp()
                        }
                        else {
                          setFlagg1(prev => prev + 1)
                          ShortToast("Your Diastolic BP level doesn't seem to be normal. Kindly make sure you have took the correct reading", 'warning', '')
                          setDiastolic("")
                        }
                      }
                      else {
                        //updateValueDiastolicBp()
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
          </Modal>
          {/**Edit diastolic///////////////////////////////////////////////// */}
          {/**Edit bpm///////////////////////////////////////////////// */}
          <Modal
            style={{
              backgroundColor: "red"
            }}
            animationType="fade"
            transparent={true}
            visible={false}>
            <View style={{
              height: H * 0.28,
              width: W * 0.7,
              backgroundColor: colors.OFFWHITE,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              top: H * 0.35,
              elevation: 5,
            }}>
              <Image source={require('../../../../assets/icons/hypertension.png')}
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
                }}>{strings.BPM}</Text>
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
              <View style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: W * 0.5
              }}>
                <TouchableOpacity
                  onPress={() => {
                    {
                      if (bpm == "0" || bpm == " " || ((bpm.length == 2 && bpm < "40") || (bpm.length == 3 && bpm > "250"))) {
                        ShortToast("Invalid Value", "warning", "")
                        setBpm("")
                      }
                      else if (bpm.includes(".") || bpm.includes(",") || bpm.includes(" ") || bpm.includes("-")) {
                        ShortToast("Invalid Value", "warning", "")
                        setBpm("")
                      }
                      else {
                        //updateValueBpmBp()
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
          </Modal>

          <Modal visible={firstTimeLogin}
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
                  color: colors.GREEN
                }}>
                  Congratulations!    <FontAwesome5 name="coins" size={20} color={colors.MEDAL_GOLD} />
                </Text>
                <Text style={{
                  ...fontFamily.bold,
                  paddingHorizontal: W * 0.025,
                  lineHeight: H * 0.03
                }}>
                  You have won 21 points on Successful Signup. You can check your Total Points from above.
                </Text>
                <TouchableOpacity onPress={() => {
                  setFirstTimeLogin(false)
                  storeDataInLocalStorage('firstTimeLogin', '0')
                  props.navigation.navigate("Walkthrough")
                }}>
                  <Text style={{
                    ...fontFamily.bold,
                    color: colors.GREEN,
                    fontSize: fontSizes.XL,
                    paddingTop: H * 0.028,
                  }}>
                    OKAY
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
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.3)"
              }}
            >
              <View style={{
                height: H * 0.4,
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
                <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: H * 0.02, }}>
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
                    value={text}
                    onChangeText={(t) => setText(t)}
                    style={{
                      height: H * 0.07,
                      width: W * 0.65,
                      backgroundColor: "white",
                      marginTop: H * 0.04,
                    }} />
                  <View style={{
                    flexDirection: "row",
                    marginTop: H * 0.02,
                    justifyContent: "space-between",
                    width: W * 0.5
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
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        paddingVertical: H * 0.01,
                        paddingHorizontal: W * 0.02,
                        borderRadius: 8,
                      }}
                      onPress={() => {
                        setVisibleMood(false)
                      }}>
                      <Text>
                        {strings.Skip}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>



              </View>
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
                <FlatList
                  data={dataForPaidUser?.single}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => 'key' + index}
                />
                <FlatList
                  data={dataForPaidUser?.data}
                  renderItem={renderItemTwo}
                  keyExtractor={(item, index) => 'key' + index}
                  numColumns={2} />

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
    justifyContent: "space-between",
    width: W,
    height: H * 0.09
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
// export default copilot({
//   animated: true,
//   androidStatusBarVisible: false,
// })(Stats);

export default Stats
