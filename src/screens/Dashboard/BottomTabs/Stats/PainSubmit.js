import { View, TouchableOpacity, StyleSheet, ToastAndroid, Modal, ScrollView, Keyboard, Platform } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { TextInput, Text, Divider } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'
import { Slider } from '@miblanchard/react-native-slider'
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'
import { useLocales } from '../../../../utils/LocalizationUtil'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const PainSubmit = ({ navigation, route }) => {

  const isFocused = useIsFocused()
  const strings = useLocales()
  const scrollRef = useRef()

  React.useEffect(() => {
    handleSliderValueChange(isNaN(route.params.flag) ? 0 : route.params.flag)
    getPainReason()
  }, [])

  useEffect(() => { getLanguage() }, [isFocused])

  //lng
  const getLanguage = async () => {
    const lang = await getDataFromLocalStorage("lang")
    if (lang == "en") {

    } else {


    }
  }

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);


  const [keyboardStatus, setKeyboardStatus] = useState(false)
  const [painValue, setPainValue] = useState(isNaN(route.params.flag) ? 0 : route.params.flag)
  const [painColor, setPainColor] = useState("green")
  const [visible, setVisible] = useState(false)
  const [reason, setReason] = useState("")

  const storePainReason = async (t) => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("reason", t);
    const result = await PostApiData('painreason', formdata)
    console.log("PAIN--------------------" + result)
    //navigation.navigate("BootSplash")
    navigation.goBack()
  }


  const getPainReason = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp))
    const result = await PostApiData('getpainreason', formdata)
    console.log("PAIN2-------------------" + result)

    if (result.status == '200') {
      //setReason(result?.pain_reason)
    }
    else {
      setReason("")
    }
  }

  const saveValueForPain = async () => {
    if (route.params.flag.length == 0) {
      const temp = await getDataFromLocalStorage('user_id')
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "Pain");
      formdata.append("value", (Math.round(painValue * 100) / 100).toFixed(0));

      const result = await PostApiData('userpaidhealthplan', formdata)
      console.log("Pain ====================>>>>>>", result)
      if (result.status == 200) {
        ShortToast(result.message, 'success', '')
        // navigation.navigate("BootSplash")
        navigation.goBack()
      }
    }
    else if (painValue > 1) {
      const temp = await getDataFromLocalStorage('user_id')
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "Pain");
      formdata.append("value", (Math.round(painValue * 100) / 100).toFixed(0));

      const result = await PostApiData('updateuserpaidhealthplan', formdata)
      console.log("Pain value====================>>>>>>", result)

      if (result.status == 200) {
        ShortToast(result.message, 'success', '')
        storePainReason(reason)
      }
    }
    else {
      const temp = await getDataFromLocalStorage('user_id')
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "Pain");
      formdata.append("value", (Math.round(painValue * 100) / 100).toFixed(2));

      const result = await PostApiData('updateuserpaidhealthplan', formdata)
      console.log("Pain value====================>>>>>>", result)
      if (result.status == 200) {
        ShortToast(result.message, 'success', '')
        // navigation.navigate("BootSplash")
        navigation.goBack()
      }
    }
  }
  const handleSliderValueChange = (num) => {
    setPainValue(num)
    if (num >= 0 && num < 1) {
      setPainColor("green")
    }
    else if (num >= 1 && num < 4) {
      setPainColor(colors.MEDAL_GOLD)
    }
    else if (num >= 1 && num < 4) {
      setPainColor(colors.MEDAL_GOLD)
    }
    else if (num >= 4 && num < 7) {
      setPainColor(colors.ORANGE2)
    }
    else if (num >= 7 && num < 10) {
      setPainColor("red")
    }
  }
  return (
    <View style={styles.mainContainer}>


      {/*
     <Modal visible={visible}
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

            }}>
              Tell us the reason for your pain:
            </Text>
            <TextInput
              value={reason}
              onChangeText={(t) => { setReason(t) }}
              style={{
                height: H * 0.1,
                width: W * 0.7,
                backgroundColor: "white"
              }} />
            <View style={{ flexDirection: "row", width: W, justifyContent: "space-evenly" }}>
              <TouchableOpacity onPress={() => {
                setVisible(false)
                navigation.navigate("BootSplash")
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
                setVisible(false)
                navigation.navigate("BootSplash")
              }}>
                <Text style={{
                  ...fontFamily.bold,
                  color: "red",
                  fontSize: fontSizes.XL,
                  paddingTop: H * 0.028,
                }}>
                  SKIP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >
     */}

      <HeaderForSubmissionScreens Title={strings.Pain} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS == 'android' ? '20%' : '80%'
        }}
        ref={scrollRef}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{
          textAlign: 'center',
          ...fontFamily.bold,
          color: painColor,
          fontSize: fontSizes.greeting,
          marginVertical: H * 0.04
        }}>{(Math.round(painValue * 100) / 100).toFixed(0)}</Text>
        {/*<TextInput style={styles.textInput}
        onChangeText={(t) => { t > 10 ? (ToastAndroid.show("Max Value of Pain can be 10", ToastAndroid.SHORT)) : setPainValue(t) }}
        value={painValue}
        placeholder={(painValue == 0) || (painValue == 0.00) ? "0-10" : `${(Math.round(painValue * 100) / 100).toFixed(2)}`}
        placeholderTextColor={"silver"}
        underlineColor="transparent"
        activeOutlineColor={colors.GREEN}
        activeUnderlineColor={colors.GREEN}
        keyboardType="number-pad"
        maximumValue={10}
      />*/}
        <Text style={{ textAlign: 'center', ...fontFamily.bold }}>{strings.RatingScale}</Text>
        <View style={{ flexDirection: 'row', justifyContent: "space-evenly", top: H * 0.04 }}>
          <Text style={{ color: "green" }}>{strings.None}</Text>
          <Text style={{ color: colors.MEDAL_GOLD }}>{strings.Mild}</Text>
          <Text style={{ color: colors.ORANGE2 }}>{strings.Moderate}</Text>
          <Text style={{ color: "red" }}>{strings.Severe}</Text>
        </View>

        <View style={{}}>

          <Slider
            containerStyle={styles.slider}
            value={painValue}
            onValueChange={(t) => { handleSliderValueChange(t) }}
            animateTransitions={true}
            minimumValue={0}
            maximumValue={10}
            maximumTrackTintColor={"silver"}
            minimumTrackTintColor={painColor}
            thumbTintColor={painColor}
          />
        </View>
        {
          painValue > 1
            ?
            <>
              <View>
                <Text style={{
                  alignSelf: "center",
                  marginTop: H * 0.05,
                  ...fontFamily.bold
                }}>
                  {strings.Enterreson}
                </Text>
                <TextInput
                  value={reason}
                  onFocus={() => scrollRef.current.scrollToEnd()}
                  onChangeText={(t) => {
                    scrollRef.current.scrollToEnd()
                    setReason(t)
                  }}
                  style={{
                    marginTop: H * 0.05,
                    height: H * 0.075,
                    width: W * 0.85,
                    alignSelf: "center",
                    backgroundColor: colors.OFFWHITE,
                  }}
                />

              </View>
            </>
            :
            <>
            </>
        }

        <View style={styles.buttonDisplay}>
          <TouchableOpacity style={styles.buttonStyle}
            onPress={() => { saveValueForPain() }}>
            <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>{strings.Save}</Text>
          </TouchableOpacity>


        </View>

      </ScrollView>
    </View >
  )
}

const styles = StyleSheet.create({
  mainContainer:
  {
    flex: 1,
    backgroundColor: 'white'
  },
  text2:
  {
    color: 'black',
    backgroundColor: 'white',
    fontFamily: 'Montserrat-SemiBold'
  },
  buttonDisplay:
  {
    flexDirection: 'row',
    width: W,
    alignSelf: 'center',
    justifyContent: 'space-evenly'
  },
  buttonStyle:
  {
    backgroundColor: colors.GREEN,
    height: H * 0.06,
    width: W * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    borderRadius: 8,
    marginTop: H * 0.1
  },
  textInput:
  {
    height: H * 0.06,
    width: W * 0.85,
    alignSelf: 'center',
    marginBottom: H * 0.05,
    elevation: 6,
    backgroundColor: 'white',
    fontSize: fontSizes.MED,
  },
  text:
  {
    marginLeft: W * 0.08,
    marginBottom: H * 0.01,
    marginTop: H * 0.05,
    fontFamily: 'Montserrat-SemiBold'
  },
  slider:
  {
    width: W * 0.8,
    alignSelf: "center",
    marginVertical: H * 0.05,

  }
})

export default PainSubmit


// import React, { useRef, useState, useEffect, Alert } from 'react';
// import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
// import { Button, Text } from 'react-native-paper';
// import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
// import Svg, { Circle, Path, G } from 'react-native-svg';
// import ViewShot from 'react-native-view-shot';
// import Share from 'react-native-share';

// //const initialColor = '#f2d8cb'
// const initialColor = '#dbdad9'
// const strokeColor = '#0e4c9e'

// const mustardColor = '#fc7f03'
// const orangeColor = '#fc5603'
// const redColor = '#fc2403'
// const yellowColor = '#fcc203'

// const PainSubmit = () => {

//   const H = useWindowDimensions().height
//   const W = useWindowDimensions().width

//   const styles = makeStyles(H, W)

//   const [circlesForMen, setCirclesForMen] = useState([]);
//   const [circlesForMenBack, setCirclesForMenBack] = useState([]);
//   const [circlesForWomen, setCirclesForWomen] = useState([])
//   const [circlesForWomenBack, setCirclesForWomenBack] = useState([])
//   const [gender, setGender] = useState("male")
//   const [isFront, setIsFront] = useState(true)
//   const [animationComplete, setAnimationComplete] = useState(false);

//   const rotationValue = useSharedValue(0);

//   const viewShotRef = React.useRef();

//   const captureScreen = async () => {
//     const uri = await viewShotRef.current.capture()
//     await shareScreenshot(uri)
//   };

//   useEffect(() => {
//     if (animationComplete) {
//       Animated.timing(rotationValue, {
//         toValue: 180,
//         duration: 1000,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [animationComplete]);

//   const interval = useRef(0)

//   // const handleTouch = (event) => {
//   //   const { locationX, locationY } = event.nativeEvent;

//   //   setCirclesForMen(prevCircles => [
//   //     ...prevCircles,
//   //     { x: locationX, y: locationY, radius: 20 },
//   //   ]);
//   // };

//   const shareScreenshot = async (uri) => {
//     if (uri) {
//       try {
//         const shareOptions = {
//           url: uri,
//         };
//         await Share.open(shareOptions);
//       } catch (error) {
//         console.log('Error sharing:', error);
//       }
//     } else {
//       // Alert.alert('No screenshot captured', 'Please capture a screen first.');
//       console.log('error')
//     }
//   };

//   const handlePressIn = (event) => {
//     let r = 0;
//     const { locationX, locationY } = event.nativeEvent;
//     if (gender == 'male') {
//       interval.current = setInterval(() => {
//         if (isFront) {
//           setCirclesForMen(prevCircles => {
//             if (r < 8) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: yellowColor }]
//             }
//             else if (r < 14) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: mustardColor }]
//             }
//             else if (r < 20) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: orangeColor }]
//             }
//             else if (r < 28.4) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: redColor }]
//             }
//             else if (r >= 28.4) {
//               return [...prevCircles]
//             }
//           })
//         }
//         else {
//           setCirclesForMenBack(prevCircles => {
//             if (r < 8) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: yellowColor }]
//             }
//             else if (r < 14) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: mustardColor }]
//             }
//             else if (r < 20) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: orangeColor }]
//             }
//             else if (r < 28.4) {
//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r, color: redColor }]
//             }
//             else if (r >= 28.4) {
//               return [...prevCircles]
//             }
//           })
//         }
//         r = r + 0.8;
//       }, 200);
//     }
//     if (gender == 'female') {
//       interval.current = setInterval(() => {
//         if (isFront) {
//           setCirclesForWomen(prevCircles => {
//             if (r < 28.4) {

//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r }]
//             }
//             else return [...prevCircles]
//           })
//         }
//         else {
//           setCirclesForWomenBack(prevCircles => {
//             if (r < 28.4) {

//               return [...prevCircles, { x: locationX, y: locationY, radius: 8 + r }]
//             }
//             else return [...prevCircles]
//           })
//         }

//         r = r + 0.8;
//       }, 200);
//     }


//     // setCirclesForMen(prevCircles => [
//     //   ...prevCircles,
//     //   { x: locationX, y: locationY, radius: 20 },
//     // ]);
//   };

//   const handleAnimation = () => {
//     // rotationValue.value = withTiming(1, {
//     //   duration: 1000,
//     //   easing: Easing.linear,
//     // });
//     // handleRotation()
//     setIsFront(prev => !prev)
//   };

//   const handlePressOut = () => {
//     clearInterval(interval.current)
//   }

//   const onPressGender = () => {
//     setGender(prev => prev == 'female' ? 'male' : 'female')
//   }

//   const onPressUndo = () => {
//     if (gender == 'male') {
//       if (isFront) {
//         setCirclesForMen((prevCircles => prevCircles.slice(0, -1)))
//       }
//       else {
//         setCirclesForMenBack((prevCircles => prevCircles.slice(0, -1)))
//       }
//     }

//     if (gender == 'female') {
//       if (isFront) {
//         setCirclesForWomen((prevCircles => prevCircles.slice(0, -1)))
//       }
//       else {
//         setCirclesForWomenBack((prevCircles => prevCircles.slice(0, -1)))
//       }
//     }
//   }
//   // console.log(circlesForMen)
//   return (
//     <>
//       {
//         (circlesForMen.length !== 0 || circlesForWomen.length !== 0 || circlesForMenBack.length !== 0 || circlesForWomenBack.length !== 0) &&
//         <Text
//           style={styles.undoButton}
//           onPress={onPressUndo}>Undo</Text>
//       }

//       <TouchableOpacity
//         onPress={onPressGender}
//         style={styles.genderButton}>
//         {
//           gender == 'male'
//             ?
//             <Text style={styles.whiteText}>Gender : Male</Text>
//             :
//             <Text style={styles.whiteText}>Gender : Female</Text>
//         }
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={handleAnimation}
//         style={styles.isFrontButton}>
//         <Text style={styles.whiteText}>Rotate</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={captureScreen}>
//         <Text>Capture</Text>
//       </TouchableOpacity>
//       {/* <TouchableOpacity onPress={shareScreenshot}>
//         <Text>Share</Text>
//       </TouchableOpacity> */}

//       <View style={styles.container}>
//         {
//           gender == 'male' ?
//             <>
//               {
//                 isFront ?
//                   // male front
//                   <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
//                     <Svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       xmlSpace="preserve"
//                       id="Layer_1"
//                       x={0}
//                       y={0}
//                       style={{
//                         zIndex: 2
//                       }}
//                       viewBox={`0 0 800 1360`}
//                     >
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         fill={initialColor}
//                         id="frt_1"
//                         d="M415.6 53c-12-28.8-34.4-45.7-53.4-45.7-30.8 0-50.2 31.5-53.2 44.5-1.9 8.3-2.8 23.5-2.5 28.2s1 12.3.7 16.2c2 7.7 6.7 23 6.7 33 .7 5.2 1.2 12.5 3.3 18.8 3 4 22.5 23.3 44.2 23.3s36.5-8.7 45.7-23c2.6-5.6 5-15.2 4.8-18.6-.7-5.1 4.7-28 5.7-32.7.6-7.3-.3-12-2-44z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_4"
//                         d="M299 91.3c-4 4-1.8 17-.8 20.7 3.7 13.9 3.1 12.5 7.2 15.8 1.4 1.1 5.2 4.8 8.5-1.7 0-10-4.6-25.3-6.7-33-1-1.8-4.2-5.8-8.2-1.8z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_5"
//                         d="M411.8 129.7c3.8 6.4 8.9 3.2 10-1.8s7.6-7.9 6.8-23.6-8-11.7-11-7.3c-1.1 4.7-6.5 27.6-5.8 32.7z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_8"
//                         d="M306.9 232.5c15.7-.8 41.2-2.2 45.3 3.7s15.8 6 19.7 0 38-6.2 50.8-4.3c5 .7 9.8.8 14.4.4 11-1.1 20.4-5.1 25.3-10-8.9.1-18.5-5.2-31-10.7-16.1-7.1-24.6-15.9-25.2-18.6s.1-34.5.9-44.5c-9.2 14.3-24 23-45.7 23S320.2 152 317.2 148c2.2 6.3 1.5 29.8.8 45.3-8.5 15.2-38 25.7-46 29.2 2 1.7 8.7 4.9 18.9 7.8 5.1 1.5 10.7 2.5 16 2.2z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_12"
//                         d="M336.4 657.4c7.6 9.5 13.9 18.7 17.8 26.9 1-2.2 2.8-2.8 6.8-3.2s5.8.8 6.9 1.6c3.8-7.7 10.2-16.5 18.1-25.7-13.6-4.7-41.3-3.4-49.6.4z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_26"
//                         d="M386 657c-7.9 9.2-14.3 18-18.1 25.7 1.2.8 3.1 5.1 4.3 8.1s1 20.8-.2 31.5 1.5 59.8 3.8 71 8.4 55.3 10.1 67c1.7 11.7 5.2 31.5 7.2 39.8 36.2 25.8 52.4-20 89.2-33.2 3.3-11.9 5.9-48.2 5.6-61.5.9-10.9-.7-70.6-1.6-80.9-.7-16.5-8.6-84-9.4-93.4-1.1-12.5-4.3-40-5.3-53.7C460.9 586 414.1 624 386 657z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_27"
//                         d="M240.3 867.3c1.2 2.6 2.4 4.9 3.4 7.1 3.5 25.8 4.8 42.1 6.5 61 .1 3.7.3 7.7.3 11.9 10.6 44.4 50.9 21.2 68.8 3.9.3-1.3.9-2.7 1.4-3.5.9-1.6 2.1-10.6 3.4-16.6 1.3-6 2-18.5 4-26.8.2-.7.4-1.6.6-2.7-34.7 22.4-52.8-21.1-88.4-34.3z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_28"
//                         d="M393 900.2c2 8.3 4.3 14.2 4.3 24s4 22.2 5.2 25c17.4 18.2 63.2 42.9 71.4-12.7 0-11.5 3.1-34.2 3.5-45.2.4-11-.9-14.3 4.8-24.3-36.8 13.1-53 59-89.2 33.2z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_29"
//                         d="M250.6 947.3c.1 4.2.1 8.6-.2 13.1-1.4 20.2-4.8 41.9-4.1 53 1 16 4.5 62 7.5 83s6.9 83 7.1 87.5c.1 1.1 0 2.3-.1 3.5 7-11.5 36.4-9.9 44.7-6.1-1.1-3.9-2.3-10.5-2.4-15-.2-5.3 7.5-47.2 8.3-58.3s3.7-29.5 4.3-33.3 7.2-47.1 7.6-53.8c.3-7.3.6-45.1-.1-50.7s-2.2-13.1-3.5-15.1c-.6-1-.6-2.3-.2-3.6-18 17-58.4 40.2-68.9-4.2z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_31"
//                         d="M260.7 1187.3c-.4 3.8-1.4 8.1-1.8 11.1-.5 4 2.1 8.6 1.4 15.9 0 .3-.1.7-.1 1 12.7-4.4 40.1 8.7 48.9 21.1 1.2-7.8 1.1-15.2-.5-19.1-1.7-4.2-2.2-7.2-.8-12.5 1.4-5.3-.7-18.7-1.8-21.8-.2-.5-.4-1.1-.6-1.8-8.3-3.8-37.8-5.4-44.7 6.1z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_32"
//                         d="M417.2 1181.8c-2.2 6.2-3.2 21-2.7 22.7s.8 9.3-1 13.5c-1.8 4.2-1.7 13.3-.7 21.5 6-13.6 36.9-29.9 49.9-23.7-2-5.5-2.2-5.8-1-9.2s2.2-12 1.5-16.2c-3.3-15.6-39.3-13.1-46-8.6z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_33"
//                         d="M260.2 1215.3c-1.1 7-6.7 15.4-10.9 23.7-4.4 8.8-13 19.4-21 28.2-2.3 2.5-4.1 5.8-5.5 9.2-3.6 8.5-4.8 18.1-4.6 20.3.2 3.1 3.1 5.9 6.1 5.5 0 1.1 1 2.9 4.2 2.5.2 2 0 6.2 8.2 5 4 4.9 7.9 4.6 10.8 1.8 5.3 6.3 10.4 6.5 15.8 5.8 4.4-.6 11.1-7.8 12.2-10.6s2.2-3.9 5.9-6.8c2-1.6 3.8-4.1 5.2-8.8.7-2.4 1.2-5.5 1.7-8.2.3-1.8.5-3.5.6-4.5.7-5.8.7-10.8 4.5-21.3 8.7-3.7 14-10.3 15.5-18.8.1-.6.2-1.3.3-1.9-8.9-12.4-36.4-25.5-49-21.1z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_34"
//                         d="M501 1276.5c-1.2-4.2-9.7-14.8-16.3-21.8-6.6-7-7.8-11.3-12.5-18.7s-7.3-14.7-9.3-20.2c-13-6.2-43.9 10.1-49.9 23.7 1 8.2 12 15 15 16.5s3 4.2 3.8 7c.8 2.8 2.8 10.7 3.8 21s6.2 15.7 8.7 17.7c2.5 2 2.8 3 3.7 4.7.9 1.7 3.4 6.1 11.2 9.8s15-1.2 16.7-4.8c4.5 4.5 11.1.4 12.2-2.1 4.9 1.4 7.8-3.2 7.9-5.2 1.6.3 3.6-1.1 4.2-2.6.8.3 2.5.7 5-3.3s-3.1-17.5-4.2-21.7z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_9_2_"
//                         d="M363 445.4c0 3.1-1.4-.3 0 0 17.7 3 6.2 2.9 29.1 9 27.5 7.4 54.9-13.2 62.3-20.9 3.1-6.7 7.1-27.6 9.3-33.3 2.2-5.7 5.1-22.4 5.5-22.3-.2-13.6 6.9-51.1 6-86.7-.1-2.5-.4-4.9-.7-7.4-5.5-31.9-37.6-52.6-44.8-56.1-6 .1-14.5-.8-19.2-1.1-14.1-.8-34.2-1.2-37.9 4.6s-9.6-2.7-9.4 4.4c.2 8.9-23 142.6-23.2 156.9.5 19.5 23 51.2 23 52.9z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_9_1_"
//                         d="M362.8 370c-.2-14.3-.2-125.4 0-134.3.2-7.1-5.7 1.4-9.4-4.4-3.7-5.8-29.6-6.7-43.6-5.9-4.8.3-6-1.2-10.7-2.7-7.2 3.5-42.2 29-47.6 60.9-.4 2.4-.6 4.9-.7 7.4-.9 35.7 6.3 72.4 6.1 86 .4-.1 5.6 25.6 7.8 31.3 2.2 5.7 4.3 18.3 7.5 25.1 7.4 7.8 33.1 23.6 61.9 18.1 23.2-4.5 9.4-2.2 27.1-5.2 1.3-.2 1.6 2.3 1.6-.9-.1-1.6-.7-55.9 0-75.4z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_10_1_"
//                         d="M367.9 450.8c0-1.5-5.2-6.8-5.2-5.9l-.1-14.3c-2.8 1-16.4 9.3-47.1 11.6-31.4-.5-36.7-2.8-44.1-10.5 3.2 6.8 3.1 21.5 4.7 27.3s-1.9 15.4-4 36c-2.3 20.5-4.8 30.6-3.7 35.1.7 3-4.4 6.3-5.3 10.1 10.5 11.5 36.2 34.5 99.3 34.5.7 0 5.4-.9 5.4-15.8 0-11.6-1.5-31.8-1.6-51.4-.5-32.9 1.7-52.9 1.7-56.7z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_10_2_"
//                         d="M362 508.4c-.2 19.6.2 40 .2 51.6 0 14.9-1.5 14.4 0 14.9 60.3 21.7 87.8-22 98.4-33.5-.8-3.8-4.7-8.4-4-11.4 1.1-4.5.1-16.1-2.1-36.7-2.3-20.5-6.4-28.3-4.8-34.1 1.6-5.8 2.5-24.8 5.7-31.6-7.5 7.7-23 12.5-50.7 11.4-16.5-2.7-41.9-8.5-41.9-8.6 0-.9-.3 15-.3 16.5-.1 3.8 0 28.5-.5 61.5z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_11_2_"
//                         d="M360.5 575c-.1 32.5.2 25.3.3 40.1.1 13.6.7 21.3.3 39.4 7.1.8 16-.5 24.3 3.2 27.1-33.1 78.3-70.6 86.3-80.2-1.7-11.8-4.3-21.9-7-26.1-2-3-2.5-8.2-3-10-11.5 11.6-33.4 33.4-103.3 33.9l2.1-.3z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_11_1_"
//                         d="M361.7 574.7c-69-1-86.9-23.5-98.5-35-.4 1.9-1.5 4.1-3.4 7.2-2.7 4.2-5 15.5-6.7 27.3 8.1 9.5 56.6 49.7 84 82.6 8.3-3.8 17.2-2.5 24.2-3.4-.5-18.1 0-25.8 0-39.4 0-14.8.3-6.7 0-39.2l.4-.1z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_29_1_"
//                         d="M470.8 944.6c-9.8 44.6-50.1 21.3-68.4 4.6.4 1.3-1.1 8.7-1.7 9.7-1.3 2-1.4 13-2 18.6s1.3 37.7 1.7 44.9c.4 6.7 4.2 49.4 4.9 53.2s3.9 22.1 4.8 33.2c1 11.1 9.3 52.9 9.2 58.2 0 4.5-1.1 11.1-2.2 15 8.2-3.9 37.6-6 44.8 5.4-.1-1.2-.2-2.4-.2-3.5.1-4.5 3-66.6 5.7-87.6s5.4-67.1 6.2-83.1c.5-11.1-.2-35.9-1.9-56.1-.3-4.4-1-8.3-.9-12.5z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_26_1_"
//                         d="M336.4 656.7c-28.4-32.9-72.7-73.2-83.4-81.9-.9 13.7-7.2 45.4-8.2 57.9-.8 9.4-8.3 77-9 93.5-.8 10.4-2.2 70.1-1.2 80.9-.2 13.3 2.6 49.6 5.9 61.5 36.8 13 53.2 58.7 89.4 32.8 2-8.3 5.4-28.1 7-39.8 1.6-11.7 7.5-55.8 9.8-67 2.2-11.2 4.7-60.3 3.5-71-1.3-10.7-1.5-28.5-.4-31.5 1.2-3 3.1-7.3 4.3-8.1-3.8-7.7-7.7-15.3-15.6-24.5l-2.1-2.8z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_14"
//                         d="M467.7 278.3c13.5 30 46 30.2 58.6 48.4-.8-3.4-4.1-24.8-3.4-31.3-2-22.3-9.7-37-22.7-53.4s-45.2-25-55.7-24.9c-5 4.9-14.4 9-25.3 10 10.8 3 46.5 30.5 48.5 51.2z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_20"
//                         d="M614 564.4c-2.9-7.6-5.9-16.1-8.1-21.6-34-115.8-44.7-136.6-51.5-149-24.3-16.4-63.2 18.8-61.7 31.8 7 18 20.5 69.5 47.2 107.6 4.2 6 27.1 44.1 30.1 49.3 6.6 10.1 45.9-8.5 44-18.1z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_16"
//                         d="M530.8 429c14.3-6 25.9-14.6 23.2-33.9-1.6-11.2-14.7-38.9-18.8-44.9-2.3-3.3-7.7-18.3-8.9-23.4-12.6-18.2-45.1-18.4-58.6-48.4 1.2 12 2.2 85.6 1.5 99 .1.1 20.8 42.7 23.5 48.2 8.5 13 24.5 9.1 38.1 3.4z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_22"
//                         d="M630 594.6c-8.5-4-5.8-8.2-9.5-15-1.7-3.1-8.4-20.5-10.8-26.9 1.8 9.6-38 32.2-44.5 22 1.5 2.7 10.1 18.2 13.4 25.4 3.2 6.8 6 13.1 6.5 14 14.9-11.9 36.4-20.1 44.9-19.5z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_24"
//                         d="M683.5 624.6c-2.8-3.8-17.5-11.5-21.8-14.5-2.1-1.5-7.9-4.4-14.3-7.4s-13.2-6.1-17.5-8.1c-8.4-.6-30 7.6-44.9 19.5 1 1.8-.9 7.1.1 16.2s4.1 23.2 6.4 32.1 7 18.4 8.5 22.9 9.4 29.4 12.6 32c2.8 2.2 7.5.8 8.2-2.8s-1.6-10.9-2.5-14.1-5.6-19.2-6.5-21.8-2-5.1-.2-5.1 2.1 2.8 3.2 5.6 5.9 19.5 6.9 24.1 4.5 17 6.2 21.8 5 10 9 9.8 4.9-4.8 5.1-8.4-5.9-23.5-6.4-27.6-5.4-19.2-6.1-21.2-1.4-5 .6-5.1 2.9 5.6 3.8 8.6 9.8 31.9 10.2 35.5 2.6 14.5 6 17.8c2.7 2.6 5.6 3.9 8.6.9s2.2-10 .9-15.2-4.6-21.1-5.5-25-6.4-20.9-7.2-24-2.1-5.4-1.1-5.8 2.2 1.1 3.5 5.2 6.6 20.5 8.4 25.5 1.5 11.6 4.1 17.4 7 7.6 10.6 7.1 4.3-7.4 4.4-10.1-4.8-20.5-6.2-27.4-5.2-16.6-6.5-23-7.4-23.4-8.6-26-.6-4.8 2.5-3.9 9.2 2.6 13 7.6 10.9 6.8 13.4 7 8.5.4 9.2-6.4-7.4-10-10.1-13.7z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_13"
//                         d="M257.7 283.7c6.1-31.9 44.1-54.8 52.1-58.3-10.2-2.9-18.8-7.9-20.9-9.5-8 3.5-15.5 2-26.8 4.2s-33.3 16-45.3 40.5-17.7 54.2-17.4 63c0 1.2 0 2.3-.1 3.2 13-15.4 43.8-19.1 58.4-43.1z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_19"
//                         d="M135.6 487.7c-3.8 12.3-10.2 40.3-18.1 63.6-1.7 5.1-3.6 11.8-5.3 16.3 1.7 9 32.5 21.7 42.6 16.8 1.5-2.7 2.8-5 3.7-6.6 4.7-7.5 12.4-19.5 23.7-36.7 10.7-16.2 24.1-37.6 30.6-53.6.3-.6 14.4-44 17-57-7-15-18.1-53-56-35.6.1.1-22.1 39.4-38.2 92.8z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_15"
//                         d="M256.9 291c.1-2.5.4-4.9.8-7.4-14.6 24-45.4 27.8-58.3 43.2-.4 6-6.2 19.3-8.8 25.4-11.3 25.5-12.5 29-14.7 35.5-.5 1.7-3.1 10.3-3.4 11.7-1.4 17.7 10.2 23.9 23.9 29.6 11.4 4.8 24.5 8.3 33.4 1.5.7-1.5 1.6-3.4 2.9-5.7 3.5-6.8 23.4-48 24-48.1.2-13.6-.8-50 .2-85.7z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_21"
//                         d="M116.2 555.1c-4 12.7-9.2 25.1-9.9 26.6-.9 1.9-6.1 11.6-7.6 12.9 9.1.4 29 8.7 43 19.4-.5-9.4 13.4-29.5 18-38.2-10 4.9-41.8-11.7-43.5-20.7z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_23"
//                         d="M141 617.5c.1-1 .3-2.2.7-3.5-14-10.8-34-19-43-19.4-1.9 1.6-5.3 3-12.8 5.1-1.9.5-3.8 1.3-5.9 2.2-12.7 5.8-27.9 18.4-31.9 21-4.6 3-7.8 8.4-11.9 10.5s-4.1 8.6 0 10.5 9.6.1 13-1.5 9-8.5 15.5-10.5c3.8-1.2 7.6-1.5 7.6.1s-8.5 22.4-9.1 25.5-3.9 13.9-5.9 21.1S52 700 50.7 708s.9 11.8 5.1 12.6 7.9-7.6 8.6-10.6c.7-3 2.9-12.8 4-15.5s6.6-18.8 8-22 2.4-8.6 4.4-7.8-.4 5.9-1.8 9.8c-1.4 3.9-7.1 24.7-7.9 28.6s-5 19.8-5.2 22.5c-.2 2.7-1.9 8.8 2.8 10.5s7.8-1.9 9.5-5.6c1.7-3.7 5.4-17.6 7.4-26.1s5.8-19.5 7.1-24 2.1-8 3.9-7.9 1.5 2.5.8 4.8-6.1 20.6-7.1 25.6-4.3 16.1-5.5 20.3-1.8 9.2 2.5 10.8 6.9-1.5 8.8-4.8 7.9-21.5 9.4-27.1 4.8-18.5 6.1-22.4 2.5-5.6 3.6-5.5.2 2.6-1.1 7-5.4 18.5-7.1 25-2.2 9.6 0 12 7.1-.5 8.2-2.5 3-11 5.7-16.3c1.7-3.4 3.7-11.2 6.5-19.4 1.7-4.8 4.3-9.7 5.6-13.8.4-1.1.7-2.2 1-3.2 2.7-9.4 3.6-16.6 6-25.3 2.7-9.7.2-11.7 1-20.2z"
//                         className="st0"
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         id="frt_1_1_"
//                         d="M363.4 7.3c-28.8-.9-59.9 14.4-56.8 75.9 19.6 0 110.9-.5 110.9-1.1 3.9-54.4-20.5-73.7-54.1-74.8z"
//                         style={{
//                           stroke: "#0e4c9e",
//                         }}
//                       />
//                       <Path
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         fill={initialColor}
//                         style={{
//                           stroke: "#0e4c9e"
//                         }}
//                         id="frt_9_3_"
//                         d="M363.5 316.9c-.2-14.3 0-72 .1-80.9.2-7.1-5.6.3-9.4-4.4-4.4-5.3-19.9-7.2-33.9-6.4-4.8.3-5.3-.4-10.5.3-7.2 3.5-47.8 24.2-53.3 56.1-.4 2.4-1.9 8-1.9 10.5.6 10.5 2.1 10.4 1.9 24 .4-.1 51.2 1.4 60 1.4 10.5 0 37.1.4 47-.6z"
//                         className="st0"
//                       />
//                       <Path
//                         fill={initialColor}
//                         onPressIn={handlePressIn}
//                         onPressOut={handlePressOut}
//                         style={{
//                           stroke: "#0e4c9e"
//                           // stroke: "red"
//                         }}
//                         id="frt_9_4_"
//                         d="M409.8 317.6c8.9 0 58.8-1.5 59.2-1.4-.2-13.6 2.2-13.5 2.8-24-.1-2.5-1.5-8.1-1.9-10.5-5.5-31.9-46.1-52.6-53.3-56.1-5.2-.6-5.8 0-10.5-.3-14-.8-29.5 1.1-33.9 6.4-3.8 4.7-9.6-2.7-9.4 4.4.2 8.9.3 66.6.1 80.9 9.9 1 36.5.7 46.9.6z"
//                         className="st0"
//                       />


//                     </Svg>
//                     <Svg
//                     pointerEvents='none'
//                     style={[StyleSheet.absoluteFill, { zIndex: 2, elevation: 10 }]}>
//                     {
//                       circlesForMen.map((circle, index) => (
//                         <Circle
//                           onPress={() => console.log('do nothing')}
//                           // stroke={'blue'}
//                           strokeLinecap='square'
//                           key={index}
//                           cx={circle.x}
//                           cy={circle.y}
//                           r={circle.radius}
//                           fill={circle.color}
//                         />
//                       ))}
//                   </Svg>
//                   </ViewShot>
//                   :
//                   // male back
//                   <Svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlSpace="preserve"
//                     id="Layer_1"
//                     x={0}
//                     y={0}
//                     style={{
//                       enableBackground: "new 0 0 800 1360",
//                     }}
//                     viewBox="0 0 800 1360"
//                   >
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_1"
//                       d="M413.2 144.3c1.4-8.3 2.3-14.4 4.2-28.6.4-2.8 4.7-1.7 6.7-4.4.9-1.3 7.3-14.1 8-17 .9-3.3 2.1-16.1 1.6-16.9-5.2-7.9-12.2 6.1-11.9 3.4.9-8 1.6-14.9 1.9-19.7 1.3-21.6-29-55-61.3-55-27.3 0-76.4 23.8-57.3 74.3.4.9-5.9-5.9-8.4-4.8-3.5 1.5-3.5 4.6-3.4 7.3.2 3.1 1.2 10.5 3 14 1.9 3.5 3.8 13.1 5.8 16 2.5 3.6 7.3 3.9 7.4 4.8.2 2.4 1.4 8.7 4.6 26.3 10.3 20.8 88.9 20.6 99.1.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_2"
//                       d="M460.2 215.9c-28-9.4-49-27.2-50-29.3s.2-30.5 1.5-34.3c.2-.7.8-3.6 1.5-7.9-10.2 20.3-88.8 20.5-99-.4 1.2 6.9 2.3 12 3 12.8 1.6 1.9 2.9 28.2.5 31.3-7.8 10-31.5 20.7-49.2 27.4 21.7-6.1 173.8-3.4 191.7.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_8"
//                       d="M260.7 319.7c-1.8-10.4-1-25.2 0-31-5.9 6.6 29.9-80.1 22.7-78-68.5 19.9-75.1 38.4-79.8 44.7-6.1 8.4-12.6 15-15.6 76.2-6.8 10.6-9.9 25.7-11.7 35.9s-12.8 27.8-15.5 35.5c-4 34.3 10.7 40.5 26.1 46.2 16.5 6 26.1 3.4 35.2-12.3 1.1-2.2 3.4-7 4.4-8.9 3.5-7 18.3-39.3 19.2-42.1s2.1 0 3.2 0c3.5-36.6 13.5-44.3 11.8-54.7v-11.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_10"
//                       d="M186.8 449.3c-15.4-5.7-30.1-11.8-26.1-46.2-2.8 7.7-1.8 15.2-6.5 23.4s-.8 6.5-9.8 19.9c-4.2 6.3-9 20-13.2 35.3-1.3 4.6-2.5 9.3-3.6 14 3.4-5.9 6.6-22.5 50.4-10.9 10.7 2.8 31.9 11.1 26.9 27.4 2.7-7.8 4.7-15.1 6.3-21.5 2.5-10.4 3.7-17.9 4-19.8.5-4.3.8-7.3 1.5-9.3s2.2-9.8 2.3-13.1c.1-2.4 1.9-9.2 4.8-15-9 15.6-20.5 21.8-37 15.8z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_11"
//                       d="M550.2 484.7c39.1-10.3 46.7 1.8 50.3 8.7-.2-1.4-.4-2.6-.6-3.8-2.8-17.7-17.8-46.8-19.5-49.5s-8.2-16.4-10.2-26.6c-.3-1.5-.6-2.9-1-4.2 1.5 28.9-13.2 34.7-27.7 40-15.3 5.6-27.9 1.4-37-11.6.8 1.7 1.4 2.9 1.7 3.5 2.2 4.2 2.2 4.7 2.2 7.7s2.8 14.2 4.1 19.4c1.2 4.9.1 15.8 7.6 38.7 2.4-12.2 21.1-19.9 30.1-22.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_16"
//                       d="M97.4 611.3c-3.2 1.1-16.4 13.9-20 15.4s-5.8 6.5-10.2 9c-4.4 2.5-8.3 6-9 8.8s-5.5 4.3-5.5 7.3 2 5.3 6.9 6 12.6-8 14.1-9.4 2.5.5 1.8 2.3-5.7 14.9-6.8 19.7c-1.2 4.8-3.8 16.9-4.5 20.9-.7 4-3 20.9-3.3 23.9s-3.3 14.9 1.2 18.2 7.8-2.3 9.8-7.6 1.5-11.8 2.7-14.4c1.2-2.6 4.3-18.9 6.3-22.4s2.8 1.2 1.7 4.1-3.8 16.1-3.8 18.2-1.8 13.9-2.5 17.9-1.3 13.9 0 18.1c1.3 4.2 7.2 1.7 9-.5s3.7-11.1 4.5-16.4 1-14.1 2.5-19.9 3.6-16.2 5.5-19.1 3.8.3 3.3 2.5-2.3 9.4-4 16.2-1.5 14.4-3 21.2-3.2 12.3 0 15.7 6.5.8 8.5-1.7 4.3-13.3 5.7-21.7 4.7-21.1 5.8-25c1.2-4 3.5-7.8 5.3-7.5s-.2 6-1 9.1-5 20.6-5.2 26.2 2.5 7.8 5.7 6.5 4.3-6 5-8.8 2.7-8.6 3.2-11.9 4.2-16.1 6.2-20.2c2-4.1 2.8-9.3 6.7-27.2 3.8-17.9 4.3-32.4 3.3-36.4-.7-2.1-42.2-17.8-45.9-17.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_12"
//                       d="M178.1 484.7c-43.8-11.5-47 5-50.4 10.9-3.1 13-5.6 25.8-6.7 35-9.2 50.5-20.2 67.3-23.6 80.7-.9 6 9.5 13.9 20.9 18.7 11 4.6 23.4 1.2 26-2.6 10.1-17 18.2-45.1 48.7-87.6 4.9-9 8.9-18.6 12.1-27.8 4.8-16.2-16.3-24.5-27-27.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_17"
//                       d="M667.4 642.6c-1.4-3.8-8-7.6-10.3-8.6s-7.9-8-12.7-10c-4.1-1.7-11.9-10.4-15.6-11.5-9.3 2.8-38.9 10.8-47.1 15.4-.2 1.6 1.4 5 2.2 10.8-1.7 4 .9 19.5 1.9 22.8s4.2 22.2 5.8 25.9 3 8.1 3.7 10.4 7.7 31.8 10.2 34.2 5.7 1.8 7-.5.5-7.5 0-10.8-1.7-9.8-2-12.4-2.3-10.4-3.3-14.1c-1-3.6 1.3-3.6 3-1.5 1.7 2.2 3.3 8.6 4.2 11.8s3.5 16.1 4.3 20.6 2.8 17.6 5.8 20.7 5.7 3.3 8.2 1 1.2-7.3.8-10.1-2.5-19.1-2.8-22.9-3.8-14.3-4.7-20.4 2.7-1.8 3-.5 4.2 14.8 4.7 18.2 3 15.6 3.5 22.5 3.7 12.9 4.8 14.4 6 2.2 7.5 0 1.2-5.6 1-9.3-1.5-22-1.5-25.5-4.5-19.7-5-23.4 1.3-1.8 2-.2c.7 1.7 5 19.1 5.8 22.7s1.2 7.3 1.8 11.9 3.8 9 6.3 10.3 5.5-1.2 6.5-3.8-1.5-15.1-1.8-23.2-1.5-11.3-2.2-13.9c-.7-2.7-3-18.1-3.8-22.4-.8-4.3-6.7-18.9-7.7-21.7s4.2.5 5.7 2.8 7.5 5.5 10.5 5.3 5.7-1.7 6-5.3-3.7-4.4-5.7-9.7z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_8_1_"
//                       d="M484.2 320c-1.7 10.4-8.1 29.4-4.5 66 1.1 0 3.8-4.3 4.7-1.5.9 2.8 8 32.4 15.9 43.3 1 1.9 3 7.7 4.1 9.8 9.2 15.7 21 17.4 37.5 11.3 15.4-5.8 31.5-5.9 27.4-40.2-7.7-19.9-15.3-31.3-17.1-41.5s-5-25.3-11.8-35.9c-3.3-61.1-9.7-67.8-15.9-76.1-4.7-6.3-11.4-24.8-79.9-44.5-7.2-2.1 35.5 82.7 29.5 76 1.1 6 11.9 22.9 10.1 33.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_19"
//                       d="M370.6 708.7c.8 5.8 5.1 20.9 3.8 39.3s3.2 72.9 6.5 86.3 7 37.8 8.8 56c1.1 11.3 3.4 23 5.6 32.2 8.4 9.2 24.1 12.2 39.7 11.3 15.3-.9 32.9-5 46.8-24.8.9-5.9 1.7-9.6 2-10.8.8-3 4.1-27 4.1-38 0-13.4 3.2-46.8 4.2-61.7s2.9-42.6 2.6-56.4c-.2-7.7-1.8-33.6-3.2-39.7s-4.3-21.6-4.8-25.5c-.2-1.7-1.3-7.5-2.5-13.9 0 23.4-13.1 13.9-21.6 27.5-13.9 2-35.2 13.2-81.6 18.6l-10.4-.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_19_1_"
//                       d="M357.8 709.8c-29 8.8-56.1-3.7-87-15-8.5-13.6-27.1-8.9-27-32.3-1.2 6.4-2.3 12.2-2.5 13.9-.5 3.9-3.4 19.4-4.8 25.5s-3 32-3.2 39.7c-.4 13.8 1.5 41.5 2.5 56.4s4.1 48.3 4.1 61.7c0 11 3.3 35 4.1 38 .3 1.2 1.1 4.9 2 10.8 13.9 19.8 31.5 24 46.8 24.9 15.6.9 32.9-2.3 41.4-13.9 2.2-9.2 2.8-18.3 3.9-29.6 1.8-18.2 5.6-42.6 8.9-56s7.9-67.9 6.6-86.3c.4-18.6 1.4-20.7 2.3-26.5l1.9-11.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_20"
//                       d="M293.4 933.8c-16.2-1-34-5.5-48.3-28.6 2.5 12.9 3.2 32.1 4.2 53.2.7 13.8-.1 29.5-1.2 42.2 2.6-20.8 19.1-19 35.6-17.4 16.6 1.6 33.3 3.3 35.7 9.8-1.2-5.5.7-11.1 3-15.9s3.2-17.7 4-28.7 5.8-24.2 7.5-30c-7 12.4-22.8 16.4-40.5 15.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_21"
//                       d="M434.9 933.8c-15.6.9-31.2-2.1-39.7-11.3 1.3 5.6 2.6 10.3 3.7 13.5 2.8 8.7 2.2 34.1 5.5 40.3 2.6 4.9 3.7 9.2 3.5 15.1 6-4.7 22.4-6.7 36.5-8.2 13.7-1.4 29.4 1.3 35.9 14-1-13.8-1.8-29.7-1.6-46.5.1-18.7 1.7-32.8 3-41.7-13.9 19.8-31.5 23.8-46.8 24.8z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_22"
//                       d="M283.9 983.2c-16.5-1.6-33.1-3.4-35.6 17.4-.6 6.7-1.2 12.6-1.8 17-1.8 12.7-5 45.8-2.5 59.7s8.8 70.1 9 91.3c2.4 11.5 18.5 15.4 31.6 15.9 13.2.5 23.3-2.3 25.6-16.1 1.5-12.1 2.9-25 3.1-31.4.3-11.3 3.5-35.2 8-48.4s5.3-35.1 3.6-53.9-4.2-36.1-5.3-41.6c-2.4-6.6-19.1-8.2-35.7-9.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_23"
//                       d="M444.4 983.2c-14.2 1.4-30.5 3.5-36.5 8.2-.1 1.6-.2 3.2-.5 5.1-1.2 8.7-5.4 47.9-5.1 67.3.2 12.3 1.8 19.9 4.6 33 1 4.9 7.3 39.2 7.5 45.4.1 3.2 1.8 16.6 3.8 30.8 5.6 7.7 15.9 11.8 25.6 11.5 11.8-.5 25.9-3.6 30.5-12.6.1-3.3.3-6.3.4-9 .8-12.9 4.8-46.5 7.5-73.6s3-44.5 1-61.9c-.9-8-2-18.3-2.9-30.1-6.5-12.8-22.2-15.4-35.9-14.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_24"
//                       d="M284.5 1184.4c-13.1-.5-29.2-4.3-31.6-15.9.2 21.1 4.1 51.2 4.2 57.8s-1.2 26.6-1 28.5c.2 1.9.2 3.7-.9 3.7 6.1 14.3 4.3 25.1 3.6 34.2-.4 5.1.2 9.5 1.3 14.1 10.5-13.4 48-20 48.2-7.5-.2-6.1-1.2-13.4-2.1-20.4-1.5-12.8 1.8-27.2 2.2-31s-4.5-18.4-5.8-25.4 2.2-19.1 4.2-31.2c.9-5.2 2.1-14 3.2-23.2-2.1 14-12.3 16.8-25.5 16.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_25"
//                       d="M443.8 1184.4c-9.7.4-19.9-3.8-25.6-11.5 1.9 13.7 4.2 28 5.7 34.1 3 12.4 1 17.7-1.8 26.5s-2.3 14.3-1.3 21.9.7 17.4.5 24.4c-.1 4.1-2.1 11.3-2.6 17.9 5.4-8.6 37.8-2.7 48.5 9 .5-.5 1-.9 1.5-1.3.8-4 1.1-8.4.8-12.7-1-13.1-2-21 3-33.6-.1-.1-.2-.1-.3-.2-2.2-1.5-1.7-12.6-1.7-21.6s1.2-24.1 2.2-31.8c.8-6.1 1.1-21.3 1.6-33.7-4.6 9-18.8 12.2-30.5 12.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_26"
//                       d="M260.2 1306.9c2.3 2.2 12.7 9.1 23.2 11.6s19.2-1.5 23-7.1c1.7-2.6 2.2-6.8 2.1-11.9-.3-12.6-37.8-6-48.3 7.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_27"
//                       d="M418.6 1297.8c-.4 4.8 0 9.3 2.5 12.2 6.6 7.8 13.3 10.3 26.7 7.1 9.4-2.2 15.7-7.1 19.4-10.4-10.8-11.6-43.2-17.5-48.6-8.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_3_1_"
//                       d="M382.6 206c-16.8 0-76.4-2.6-98.2 3.4-39.5 21.4-44.5 68.4-45.5 74.1s.5 26.1 2.2 36.6 8.2 29.4 4.6 66c1.1 0 1.5 3.5 1.9 6.1s4.2 16.7 9.2 22.9S266 440 270 447.4c4.5 5.5 41.4 10.6 83.7 11.4 9.7.2 19.6-1.7 29.5-1.8-.8-5.3-.8-158.8-.8-175 .2-35.1.2-35.1.2-76z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_3_2_"
//                       d="M346.2 282.1c.2 16.2 2.1 169.7 1.4 175 9.9-.1 19.9 1.7 29.5 1.4 42.4-1.4 76.7-5.9 81.1-11.4 3.9-7.5 10.5-27.3 15.4-33.5 4.9-6.3 8.6-20.4 9-23 .3-2.6.7-6.1 1.8-6.1-4.1-36.6 2.2-55.6 3.8-66.1 1.6-10.5 2.9-30.9 1.8-36.6s-5.9-51-45.6-71.9c-21.8-5.7-82.2-4-99-3.8.3 40.9.3 40.9.8 76z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_4_2_"
//                       d="M363.2 511.8c-.2 20.1-.2 20.1-.3 29-.1 16.9-1.3 19.3-.2 19.2 18.4-2.3 17.9-9.9 47.4-9.6 26 .2 50.2 8 56.4 17.1-3.9-6.7-1.7-11.8-.2-15.7 1.4-4.1-.7-25.1-1.6-30.9s-5-12.3-2.8-31-3.4-45.3.7-52.8c-4.6 5.5-30 12.7-72.4 13.1-9.6.1-16.5 1.6-26.4 1.5.3 9.8-.8 44.5-.6 60.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_4_1_"
//                       d="M364.5 457.1c-9.9 0-15.1-6.4-24.7-6.6-42.4-.8-69.4-5.8-73.9-11.3 4 7.5-4.9 27.4-2.9 46.1s.9 28.8-.1 34.6-3.3 26.8-1.9 30.9c1.4 3.9 3.6 9-.4 15.7 6.3-9.1 30.6-16.6 56.6-16.6 29.5 0 28.9 7.6 47.3 10.1 1.1.1-.1-2.3 0-19.2v-29c.5-15.6-.3-44.9 0-54.7z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_5_2_"
//                       d="M366.2 705.5c2.4 0 4.1.3 4.4 3.2.3 3.1 29.4 6.6 38.1 5.3 47.8-5.4 77.4-32 77.4-50.9-1.5-8.5-4.5-20.1-4-32.3s-5.5-54.7-11.5-63.7l-.6-.9c-6.3-9.1-30.6-16.6-56.6-16.6-29.5 0-46.9 10-49.6 10.4-2.3.3-1.5 127.2-.4 145.1-.1-.1.4.4 2.8.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_5_1_"
//                       d="M366.3 704.9c1.1-17.9-.4-144.7-2.6-145-2.8-.4-17.9-10.4-47.4-10.4-26.1 0-50.4 7.4-56.6 16.6l-.6.9c-6 9-12 51.5-11.5 63.7s-2.5 23.9-4 32.3c0 18.9 15.6 28.4 22.3 33.5 22.2 11.5 44.3 22.2 80 17.8 3.6-.9 12.2-3 13.2-5.8s2-3.2 4.4-3.2 2.8-.4 2.8-.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_4_3_"
//                       d="M325.2 550.1c17.4.5 27.8 8.6 38.5 9.8 5.3.6 35.1-6.9 38.6-9.9 1.5-4.1-9.4-339.8-17.5-344.3-4.6 0-35 0-44.9-.1-.6 5.7-15.8 344.5-14.7 344.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_4_4_"
//                       d="M325.2 550.1c17.4.5 27.8 8.6 38.5 9.8 5.3.6 35.1-6.9 38.6-9.9 1.5-4.1-1.5-88.1-2.4-100-15.5 0-11.3.6-36.1 1.7-8.5.5-25-1.6-34.9-1.7-.6 5.7-4.8 100.1-3.7 100.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       style={{
//                         stroke: "#0e4c9e"
//                       }}
//                       fill={initialColor}
//                       id="bck_12_1_"
//                       d="M550.1 484.8c-10.7 2.6-33.6 9.7-29.1 26 3.1 9.2 8.6 19.8 13.4 28.9 29.9 42.9 37.5 71.1 47.4 88.3 2.5 3.8 14.9 7.4 25.9 3 11.5-4.6 22-12.4 21.2-18.4-3.2-13.5-13.9-30.4-22.4-81-1-9.2-2.3-25.2-5.2-38.2-3.4-6.1-7.3-19.5-51.2-8.6z"
//                       className="st0"
//                     />
//                   </Svg>
//               }
//             </>
//             :

//             <>
//               {
//                 isFront ?
//                   // female front
//                   <Svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlSpace="preserve"
//                     id="Layer_1"
//                     x={0}
//                     y={0}
//                     style={{
//                       zIndex: 2
//                     }}
//                     viewBox="0 0 726 1320"
//                   >
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_1"
//                       d="M342.2 18.8c-25.9 0-43.8 13.7-50.4 35.5-3.2 10.6-3.6 24.1-3.6 40.5 0 2.2.1 4.4.2 6.5.5 11.2 2.3 22.2 4.6 31.6 3.2 13.1 7.4 23.3 10.5 26.9 3.5 5.3 9.4 9.8 13.8 13.2 7.5 5.9 14.7 9 26 9 11.7 0 20.1-3.8 27.3-10.2 3.9-3.5 8.8-8.4 10.5-12.2 3.4-6.6 6.2-17.3 8.3-28 2.5-12.6 4.1-25.3 4.7-31.5.1-1.5.2-2.7.2-3.3-.1-15.1 7.9-78-52.1-78z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_4"
//                       d="M281.2 97.1c-2.9.6-4.1 8.2-3.1 13.6s3.9 14.2 6.5 18.8c2.3 4.1 4.8 9.6 8.3 3.4-2.3-9.4-4.1-20.4-4.6-31.6-2.3-2.2-5.2-4.6-7.1-4.2z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_5"
//                       d="M396 132.6c1.5-2.4 4.4-8.9 5.8-12.6s2.9-14.2 2.4-18.9-4.8-4.9-6.5-2.2c-.8 1.2-2.2 1.5-3.6 1.3-.5 6.2-2.1 18.9-4.7 31.5 2.4 5.3 5.4 2.8 6.6.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_9_4_"
//                       d="M341.2 321.9c9.2-1.1 19.4-4.8 24.5-8.4 5.6-.4 23.1 7.5 32.9 5.5 2.6-.5 6.9 1.8 8.1 1.6 1.7-.5 21.6-1.6 31.7-2.2 4.6-2.2 22.8-19.8 2.4-60.2-6-11.7 4.7-39.2-14.9-39.7-6-.1-70.7-.2-77.4-.8-4.6-3.2-29.8 104.2-7.3 104.2z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_9_3_"
//                       d="M234.9 234.8c1.2 8 5.1 16.8 8.9 21.2.5 4.9-7.4 20.2-5.3 28.7.5 2.3-1.8 6-1.5 7 .5 1.5 1.9 18.8 2.6 27.5 2.3 4 20.6 19.7 62 1.6 12-5.3 40.4 3.8 40.7-13.3.1-5.2-.6-61.5 0-67.3 3.2-4-107.6-25-107.4-5.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_8"
//                       d="M315.2 235.2c7.7-1.3 14 3.7 18.3 7.7s11.7 4 15.3 0 12-9.3 24.3-7.3 16.3-1 26.3-6c13.2-6.6 19.5-9.1 36.7-14.5-4.2-.3-8.4-.4-12.5-.6-17.5-1-39-4.6-42.5-13.3-4.1-10-3.2-27.4-.2-41.3-1.7 3.8-6.6 8.8-10.5 12.2-7.2 6.4-15.6 10.2-27.3 10.2-11.4 0-18.5-3.1-26-9-4.5-3.5-10.4-7.9-13.8-13.2.3 2.2 2.8 18.8 1.8 32.2-.9 13.4-10.8 16.6-31.6 20.6-8.1 1.5-21.4 3-29.4 3.7 20.7 3.5 43.3 10.5 47.3 13.5s16.2 6.4 23.8 5.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_9_2_"
//                       d="M339.9 364.6c.6 5.8-.2 62.1-.1 67.3.3 17.1 29.5 8.1 41.8 13.4 42.5 18.2 47.8-10.1 50.2-14.1.7-8.7 1.5-15.3 2-16.8.3-1 .8-2.7 1.3-5 2.2-8.5 5.4-23.9 5.9-28.8 3.9-4.4 7.9-13.2 9.2-21.2.3-19.5-113.7 1.2-110.3 5.2z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_9_1_"
//                       d="M234.6 358.8c1.2 8 5.1 16.8 8.9 21.2.5 4.9 3.6 20.3 5.7 28.8.5 2.3 1 4 1.3 5 .5 1.5 1.2 8.1 1.9 16.8 2.3 4 7.4 32.3 48.8 14.2 12-5.3 40.4 3.8 40.7-13.3.1-5.2-.6-61.5 0-67.3 3.3-4-107.5-25-107.3-5.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       d="M337.7 566.7v.3c80.1 1.1 102.9-31.1 106.8-38.7-5.5-13.7-13.8-34.2-14.8-42.3-.9-7.3 1-37.4 3-57-2.5 4-8.2 32.7-51.1 13.7-12.4-5.6-22.6-13.2-42.8-11.8l-1.1 135.8z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_10_2_"
//                       d="M341.9 430.5c0 .2.5 136.2-.8 136.2-76.8 0-98.3-32.1-101.9-39.6 5.5-13.4 13.7-33.5 14.8-41.5 1-7.2-.5-36.9-2.1-56.2 2.3 4 7.4 32.3 48.8 14.2 12-5.3 24.1-13.1 41.2-13.1V565.6c0 .7-1 .4-.8 1.1 0-.3.1-.3 0 0"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_10_3_"
//                       d="M338.9 307.2c8.8-.1-6 .1 0 0 36.6-.1 88.5-32.4 105.2 15.9 3.6 12.1 9.3 15.3 7.4 34.2-1.3 7.9-5.3 16.6-9.2 21.1-23.9 29.3-55 11.6-69.9-.7-8.3-6.9-18.6-13.1-29.7-14.4-1.9-.2-3 .2-3.3-1.6-.1-.4 0-.9 0-1.3v-4c0-9.8-.1-19.8-.1-29.6 0-12.9-.4-16.5-.4-19.6"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_10_1_"
//                       d="M342 307c0 3.1-.3 6.7-.3 19.8v33.8c0 .4.1.9 0 1.3-.3 1.8-1.4 1.4-3.2 1.6-10.6 1.3-20.5 7.6-28.4 14.6-14.2 12.5-44 30.4-67 1-3.8-4.5-7.6-13.2-8.9-21.2-1.9-19.1 3.6-22.3 7-34.5C257 274.7 306.9 307 342 307c5.8 0-8.5 0 0 0"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_12_2_"
//                       d="M339.8 639.6c9.1-.2 17.7 2.6 32.9 5.4 19.2-25.3 64.5-73.6 85.2-79.3-4.5-15.9-8.6-26.3-9.3-28.1-.9-2.3-2.4-6-4.2-10.3-3.6 7.5-28.4 39.5-104.6 40 0 0 .7 1.6 0 0 0 6.9.6 71.6-.1 72.9.1-.6 0 0 0 0"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_12_1_"
//                       d="M341.7 640s-.1-.5 0 0c-.7-1.3-.2-66-.2-72.9-.6 1.6 0 0 0 0-74.5-.4-98.8-32.4-102.3-39.9-1.7 4.3-3.2 8-4.1 10.3-.7 1.8-4.7 12.2-9 28.1 20.2 5.7 64.5 53.9 83.3 79.2 14.9-2.9 23.2-5.7 32.1-5.4"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_13"
//                       d="M312 644.9c5.7 7.5 9.6 13 10.4 14.8 15.3 17.2 28.7 12.5 40.8-.8.8-1.7 4.1-7.2 9.1-14.6-18.4-6.7-45.1-6.4-60.3.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_14"
//                       d="M243.5 279.1c.4-24.9 15.2-46.1 48.1-49.3-4-3-26.7-10-47.3-13.5-8 .7-36.8-.8-45.5 44.5-1.3 6.9-6.6 29.2-8.4 49.6 8.4-13 44.9-15.2 53.1-31.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_15"
//                       d="M442.2 275.9c5.1 21 49.6 18.9 52.1 37 0-5.5-5-59.8-19-79.2-10.7-15-25-17.7-39-18.6-17.2 5.4-23.5 7.9-36.7 14.5 34.4 5.2 41.9 26.1 42.6 46.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_20"
//                       d="M184.9 426.2c-10.1-4.5-11.5-4.8-21.3-15.8-6.3 14.9-25 65.4-26.9 84.9-4.4 44.5-15 74.2-20 87.5 1.8 4.4 7.2 6.7 12.4 8.9 5.5 2.4 14.8 4.1 20 3.2 2-4.5 4.3-9.3 6.5-13.4 8.5-15.2 22.1-48.8 29.1-64.5 6.1-13.6 26.1-84.1 28.8-95.3-12.7 5.7-18.1 9.1-28.6 4.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_16"
//                       d="M241.4 323.3c2.7-9.6 4.7-20.2 2.8-33.1-.6-3.7-.8-7.4-.7-11-8.2 16.1-44.7 18.3-53.2 31.4-.3 3-.5 6-.6 8.9-.7 20.9-21.5 74.7-26.5 91.7 2 21.5 40 20.8 49.9 11.9.8-2.1 4-13.3 4.6-14.6 2.3-5.2 15.7-39.7 16.6-50.6-.1-19.7 3.6-22.4 7.1-34.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_21"
//                       d="M555.9 591.8c5.1-2.2 10.5-4.5 12.3-8.8-.2-.5-.4-.9-.5-1.4-6.5-17-11.5-47.2-15-73.2-2.5-18.3-27.1-87.4-33.3-102.4-6.6-14.9-16.7 2.8-28.4 7.9-12.8 5.7-27.6-24.1-22.9-3.3 2.7 7 12.8 69 38.2 124.3 7.5 14.1 23.8 47.3 29.8 60 5.2 1 14.4-.7 19.8-3.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_17"
//                       d="m517.4 401.4-.6-2.4c-2.2-8.3-5.5-19.7-10.5-34.4-3.7-11.1-6.3-20.3-8.2-27.7-1.2-4.8-2-8.8-2.6-12.2-1-5.8-1.3-9.6-1.3-11.8-2.5-18.1-47-16-52.1-37 .4 10.7-1.2 21.2-1.6 29-.4 6.4 1 11.2 2.8 16 3.5 9.2 8.5 18.4 6 38.4.3 1.9 1.8 4.1 2.7 6.9s7.3 22.7 10.3 30.8c1.4 3.7 3.6 8.7 5.8 13.7 5 12.5 56.5 22.2 49.3-9.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_22"
//                       d="M135.3 583.6c-5.2-2.2-13.2-6.9-15-11.2-.7 1.8-5.2 14.1-5.9 15.8-2.7 7.8-5.6 12.2-8.2 14.7 6.8-.8 13.8 1.3 19.6 4.9 6.2 3.9 11.6 4.6 13.3 9.8 1-3.5 3.6-9.5 7-16.8.8-1.8 6.6-13.9 7.5-15.9-5 .9-12.7 1.1-18.3-1.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_23"
//                       d="M558.8 607.8c7.8-4.9 17.8-7 26.6-3-9.1-4.7-15.1-17.9-21.1-33.6-1.8 4.3-5.6 9.3-10.7 11.5-5.5 2.4-17.5 2.3-22.7 1.4 1.2 2.6 7.3 15.1 7.5 15.6 1.2 3.2 5.6 12.8 5.8 15.5.1 1.2.5 4.7 1.1 9-1.6-11.7 5.3-11.2 13.5-16.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_24"
//                       d="M126.1 607.8c-5.8-3.6-12.8-5.7-19.6-4.9-2.2 2.2-4.1 3-5.5 3.4-2.9 1-20.6 11.6-26.4 15.2S66 631 60.4 633.7s-8.5 6.9-10 8.6-6.6 7.5-6.6 9.9 4.4 3.8 8 2.9 11.8-8.6 15.8-12.4 9.5-4.9 12.2-4.9 2.6 3.1 1.9 4.5-2.9 8.2-4 13.6-1 11.9-1.9 14-5 19.4-5.6 23.6-2.6 15.5 0 19 6 1.2 7.1-1.4 3.6-14.1 4.1-16.9 6.8-21.1 7.4-22.8 3.1 2.6 2.2 5.8-2.4 11.8-4.8 18.5-2.6 14.1-3.4 17.5-1.8 8.1-1.5 11.5 3.1 5.9 5.5 4.6 4.9-9.5 5.5-12.5 4-14.4 5.6-18.4 3-20.5 4-23 1.9 1.1 1.2 2.8-3.4 18-3.8 21.6-3.5 14.9-2.6 19.1 5.1 3.5 6.8 1.8 2.5-7.1 3-9.8 4.1-13.4 5.4-17.5 3.4-16.2 4.1-20.2 2-1.6 1.1 1.8-.9 11.9-1.8 14.2-1 8.1-1.8 9.6-2.8 5.9-1 9 5 1.5 5.9.1 3.8-10.6 5-13.4 2.6-11 3.8-15.9c1.1-4.9 3.2-11 4.4-17.5s1.3-14 2.5-18.3 4.5-18.7 4.7-23c0-.6.2-1.4.5-2.4-1.6-5-7-5.6-13.2-9.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_25"
//                       d="M629.6 635c-3.3-5.2-13.7-10-17-13.5s-17.8-11.8-27.2-16.7c-8.8-4-18.8-1.9-26.6 3-8.3 5.2-15.1 4.7-13.7 16.5.8 5.3 2 11.9 3.3 17.2 2.4 9.8 2.1 16.2 3.5 22.4s4.9 14.5 5.8 21.2 3.4 7.2 5.5 15.2 6.9 8.4 8.1 6.1.4-7.5-.4-8.5-1.5-3.1-1.9-5.2-1.6-8.4-2.1-11.5-3.1-13.1-2.2-14.5 3.5 4 3.8 5.9 3 14.9 5 21.2 4 18.5 7.1 22.9 7.1 1.1 7.1-2.9-3-17.1-3.2-20-3.9-20-4.4-21.6 2.5-1.1 2.8.2 1.8 10.6 3 14.4 5 18.1 5.5 20.8 2 14.1 6.1 16.2 5.9-2.1 6.2-5.9-5.5-30-6.4-34.5-4.4-16.9-3-18.1 4.9 11.8 5.5 15.8 4.4 22.9 5.9 26.6 5.8 4.8 7.5 1.5-1.5-24.4-1.9-31.4-4.4-14.2-4.5-21.2-5.2-20.5-4.8-22.7c.5-2.6 9.2.3 12.2 2.7 3 2.3 8.5 8.5 11.5 10s8.8 3.8 10.2 0c1.2-3.7-3-6.4-6.3-11.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_26"
//                       d="M226 565.7c-8.9 31.5-19.8 84.9-10.4 137.2 1.9 10.7 29.7 157 32.4 171.8.4 2.4 1.2 5.8 2 10 54.8-4.2 72.9 49.1 80.7 10.1-.3-28.3-1.7-73.1-2.7-91.6-.5-9-1.7-28.9 3.6-60.6 2.4-14.4 13.4-54.9-9.2-82.8-.8-1.8-4.7-7.3-10.4-14.8-19.4-25.4-65.1-73.6-86-79.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_27"
//                       d="M372.3 644.2c-5 7.5-8.2 12.9-9.1 14.6-22 24.2-15.5 60.2-10.5 83.8s4 49.2 3.8 59.5c-.2 7.9-2.7 56.3-3 88.5 7.5 47.2 22.3-11.8 80.6-5.8.6-3.9 1.3-7.7 1.9-11.3 1.7-9.7 18-92.7 21-108.7s14.6-62.2 14.6-105.2c0-32.7-7.1-68.6-13.6-94-29.5 6.5-69.1 53.8-85.7 78.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_28"
//                       d="M250 884.6c3.1 15.3 8 40.6 8.2 61.1 9.9 48.1 49 36.4 64.3 13.9.2-1.7.6-3.2 1-4.5 3.2-9.2 7-21.2 7.2-44 0-4.3 0-9.9-.1-16.4-7.7 39.1-25.8-14.2-80.6-10.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_29"
//                       d="M353.5 890.6c-.1 9.7 0 18 .4 23.2 1.8 22.5 4.2 31.7 7.7 44.5 15.2 24 59.7 38.5 64.9-16 0-11.8 2.1-30.8 4.1-39.2 1.3-5.2 2.4-11.8 3.5-18.4-58.4-5.8-73.1 53.2-80.6 5.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_30"
//                       d="M258.2 945.7c.1 8.4-.7 15.9-2.7 21.7-9.5 27-3.2 94.8 0 112s21.2 99.8 24.1 121.5c.3 2.2.4 4.6.5 7 7-6.9 20.7-9.9 28.9-8.1 5 1.1 8.3 3.6 11.1 7.5-2.4-9.7-1.7-19.7-1-34.9.8-16.5 6.8-83.5 9.8-105.2s.8-46.2-2.5-62c-2.8-13.7-5.3-34.2-3.7-45.5-15.5 22.4-54.6 34-64.5-14z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_31"
//                       d="M361.6 958.4c3.5 12.8-5.2 55.3-7 75.2-1.8 19.8 5 54.5 5.2 66.3s3.2 42.5 4.8 56.8c1.7 14.3 2.3 41.2-.7 53.5 3.3-5.5 5.9-9.1 12.1-10.4 8.8-1.9 21.8.7 28.3 8.6.5-9.5 5.2-38.2 14.8-79.2s12.8-69.8 14.5-100.5-.5-49.8-2.2-55-4.8-19.5-4.8-31.2c-5.4 54.4-49.9 39.9-65 15.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_32"
//                       d="M308.9 1199.8c-8.2-1.8-21.8 1.2-28.9 8.1.2 11-1.6 22.9.2 29 1.6 5.6 2.3 5.9 1.3 9.8 7.5-4.4 35.3-5.7 42.3 2.9-.6-3.5-1.6-7-2.3-9.5-1.2-4.5.2-8.8 1.8-11.2s.8-8.5-2.5-19c-.3-.9-.5-1.8-.7-2.6-2.9-3.9-6.2-6.4-11.2-7.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_33"
//                       d="M376 1199.8c-6.2 1.3-8.8 4.9-12.1 10.4-3 12.3-3.2 15.2-1.2 22.3 2 7.2 0 8.5-1.8 18 4.7-11.7 38.2-9.3 42-3.5-1.7-4.3.5-5.5 1.8-12.5s-1-16.7-.5-26.2c-6.4-7.9-19.4-10.5-28.2-8.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_34"
//                       d="M281.6 1246.7c-.3 1.3-.9 3.1-1.6 5.7-3 10-9.3 16.8-12.5 22s-.5 7.8 2.8 9.7c3.3 1.8 3.3-.5 4.8.7s12.3.5 13.5.2 1.5-.7 5.2.8 8.8-2.3 10.7-.7 10 1.7 12.7 1.4 5.3-5.2 5.8-6.7.3-3 1-5 1.2-6.2-.2-9c-1.3-2.8-1.5-3.3 0-8.3.7-2.2.5-5 .1-7.7-7.1-8.8-34.8-7.5-42.3-3.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_35"
//                       d="M360.9 1250.5c-1.8 9.5 2.7 9.8.3 14.2-2.3 4.3-1.3 10.5-.2 11.5s-1.3 2.5 3 7.2 13.8 2.7 15.3 2.2 3-1 4 .2 6.5.6 7.7 0 3.3-1.2 4-.3 5.2-.4 7.5 0 5.8-1.2 8.2-.8c2.3.3 7.2-2 7-6.5s-2.8-6.2-4.8-9.2-8.3-17.5-10-21.8c-3.8-5.9-37.3-8.3-42 3.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="frt_1_1_"
//                       d="M342.7 18.1c-27.6-.9-57.4 13.8-54.4 72.7 18.8 0 106.2-.5 106.2-1.1 3.8-52.1-19.6-70.6-51.8-71.6z"
//                       className="st0"
//                     />
//                   </Svg>
//                   :
//                   // female back
//                   <Svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlSpace="preserve"
//                     id="Layer_1"
//                     x={0}
//                     y={0}
//                     style={{
//                       enableBackground: "new 0 0 726 1320",
//                     }}
//                     viewBox="0 0 726 1320"
//                   >
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_2"
//                       d="M418.3 214.6c-24.7-4.1-43.9-6.1-38.5-44.1.1-.5 2.8-7.6 5-12.9-16.7 13.9-71.9 14.2-86.8-.6 2.5 7.6 4.8 12.7 5.5 14.6 1 2.8 1.1 23.8-.8 27.3-4.8 8.8-20.5 14.1-36.1 17 27.2 4.2 131.5 3.4 151.7-1.3z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_9"
//                       d="M510.4 444.1c8.4-3.3 16.8-6.8 19.5-19.4-3-9.6-5.8-22.8-10.4-36.5-2.6-7.8-10-27.1-16.3-50.1-1-3.6-1.7-6.9-2.3-10.2-1.5-4.6-2.3-27.7-6.3-49-5-36.3-14.9-45.5-18.4-49.1-1.9-1.9-7.5-5.8-19.2-9.6-12.9-4.1-27.7-1.7-29.6-3.5-4.2-3.7 29.3 73.1 25.5 69.1-2.3 9.3-5.8 17.8-6.8 24.4-1.4 8.7-1.5 16.8-1.2 24.6 3.6 7.4 20.9 53.1 21.9 55.5 1.1 2.7 13.7 35.9 15.8 40 .6 1.3 1.4 3.7 2.2 6.6 6.5 8.8 15.2 11.3 25.6 7.2z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_3_2_"
//                       d="M340.2 450.9c1.2 10.2 14.3 1.4 22.8 3.4 26.3 6.3 52.8-4.7 65.3-8.2 1.3-9.1 2.7-17.1 3.6-21.7 2.3-12 10-47.2 11.1-74.3.2-5.5.3-11.6.7-14.2.3-1.8.5-1.8 1.2-1.1-.6-17.8 3-25 4-31 .7-4.2 3.1-10.1 4.8-17.7 1.1-4.7 1.9-10.1 1.9-16.2 0-11.8-7.4-38.3-28.2-53.2-2.9-.4-5.8-.9-8.8-1.4-21.8 2.2-44.9 2.8-74.9 2.6-2.9.1-4.5 224.7-3.5 233z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_9_1_"
//                       d="M198.5 438c.8-2.9 1.7-5.3 2.3-6.6 2.2-4.1 15.2-37.1 16.3-39.8 1-2.4 18.9-47.9 22.6-55.2.4-7.8.4-15.9-.9-24.6-.9-6.6-4.3-15.2-6.5-24.5-3.9 4 31-73.6 26.8-70-1.9 1.8-17.1.4-30 4.3-11.7 3.6-17.3 7.5-19.3 9.3-3.5 3.6-13.6 12.7-19 48.9-4.3 21.2-5.4 44.3-6.9 48.9-.6 3.3-1.4 6.6-2.4 10.2-6.6 22.9-14.2 42.1-16.9 49.9-4.8 13.6-7.7 26.8-10.9 36.4 2.5 12.6 10.9 16.2 19.2 19.7 10.2 4.2 18.9 1.8 25.6-6.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_3_1_"
//                       d="M341.8 218.6c-30 0-54 0-75.8-2.4-3 .5-5.9 1-8.8 1.4-20.9 14.7-28.5 41.2-28.6 53-.1 6.1.7 11.5 1.7 16.2 1.6 7.6 4 13.5 4.6 17.7.9 6 5.7 14.3 4.9 32.1.7-.8-.2-1.9 0 0 .3 2.6.4 8.6.6 14.2.8 27.2 8.2 62.4 10.5 74.4.9 4.6 2.1 12.6 3.4 21.7 12.5 3.6 37 6.5 64.1 7.1 8.4.2 22.8 8.6 24-1.6 1-8.4 2.1-233.8-.6-233.8z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_4_1_"
//                       d="M342.4 452.3c-8.6 0-15.3 1.3-23.6 1.1-27.1-.6-51.5-3.5-64.1-7.1 2.1 14.6 4.1 32 4.6 42.8.8 17.5-3 26-8.8 39.2-2.3 5.4-6.5 15.5-11.1 27.5 12.6-6.7 39.6-11.6 58.9-11.6 26.5 0 45.8 33.2 44.6 1.6-1.7-47.8.6-28.5-.5-93.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       d="M445.5 560.2c-12.5-6.8-40.3-16.7-59.4-13.7-19 3-46.2 30.7-44.7-.9 2.1-47.8-.3-28.6 1.2-93.6 8.6.1 15.3 1.4 23.6 1.3 27.1-.4 49.7-4.4 62.2-7.9-2.1 14.6-2.5 33.2-3 44-.9 17.5 2.8 26 8.5 39.3 2.3 5.4 7.1 19.5 11.6 31.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_5_1_"
//                       d="M341.5 554c-18.4.1-17.7-9.8-44.2-9.7-19.3.1-46.4 5.2-58.9 12-6.7 17.7-14.1 39.3-17.9 55.5-5.6 24-6.1 32.9-6.2 50.1 26.8 26.9 61.7 36.3 106 28.4 10-2.4 8.3-1.7 13.4-3.8 4.4-1.8 7.2-2.9 9-3.5.3.4-1.3-128.9-1.2-129z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_5_2_"
//                       d="M340.5 683c1.9.6 4.7 1.8 9 3.5 5.2 2.1 3.4 1.4 13.4 3.8 44.3 7.9 79.2-1.6 106-28.4-.1-17.2-.6-26.1-6.2-50.1-3.8-16.2-11.2-37.8-17.9-55.5-12.5-6.8-39.6-11.9-58.9-12-26.5-.1-25.8 9.8-44.2 9.7.2.1-1.4 129.4-1.2 129z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_10"
//                       d="M173.7 444.1c-8.7-3.5-17.6-7.2-19.8-21.2-3.9 12.7-8.9 23.3-12.7 31.5-2.1 4.7-5.7 12.9-9 21.8 4.4-4.2 13-7 32.2-1.2 6.3 1.9 18.9 7.9 21.5 17.4 2.3-8.3 4.7-21.4 6.1-25.9 1.7-5.2 4.7-20.3 6-27 .1-.3.1-.7.2-1-6.4 7.5-14.7 9.5-24.5 5.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_11"
//                       d="M519.7 475.1c17.7-5.4 26.4-3.4 31.1.2-3.5-10.3-7.1-17.9-8-19.6-1.6-2.7-5.5-13.5-10-23.2-1-2.2-1.9-4.8-2.8-7.7-2.7 12.5-11.1 16.1-19.5 19.4-10.4 4.1-19.2 1.5-25.7-7.1 1.8 6.4 3.8 15 4.3 16.9 1.4 5 3.1 13.2 4.2 18.2.7 3.4 1.6 9.4 4.9 20.6 2.3-9.6 15.2-15.8 21.5-17.7z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_12"
//                       d="M164.4 475.1c-19.2-5.9-27.8-3-32.2 1.2-2.8 7.6-5.5 15.8-6.9 22.5-3 14.7-3.8 31.2-6.2 46.5-1.3 8.7-11.8 38.8-15.2 49.2-3.7 4.5 9.1 3 16.9 6.5 4.6 2.1 9.4 4.5 15.2 5.2 3.6-12.4 20.2-42.2 26.4-55.3 7.8-16.5 20-47.8 22.5-55.5.3-.9.6-1.8.9-2.9-2.6-9.5-15.2-15.5-21.4-17.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_13"
//                       d="M576.3 591.9c-6.9-23.1-16.5-79.3-19.5-94.6-1.5-7.8-3.8-15.4-6-21.9-4.7-3.6-13.4-5.6-31.1-.2-6.3 1.9-19.2 8.1-21.6 17.8 1.7 5.6 3.9 12.6 7.1 21.2 9.2 24.7 23 50.2 35.9 77.1.1.2 4.9 14.1 5.1 14.8 5.9-.6 13.8-6.1 18.6-8.3 6.1-2.9 9.8-3.1 11.5-5.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_16"
//                       d="M83.8 602.2c-5.9 1.7-7.1 4.2-11.8 6.4s-9.8 6.2-10.4 7.2-2.8 2.9-5.2 5.7-.8 5.6 1.8 6.4 7.8-.5 11.2-3.3 6.8-4.7 9.2-5.8 3.4.4 3.7 2.1-2.6 9.6-4 14-1.4 6.8-1.9 10.5-2.6 12.9-3.2 17.7-1.4 14.4-1.5 19.2.8 8.8 3.3 9.1 4.6-2 5.3-5.7 2.5-10.1 2.9-13.8 2.6-12.7 3.1-14.3 2.1-1.1 1.8.4-1 5.5-1.5 8.1-2.4 13.5-3.1 17.2-1.5 14-1.3 18.2 2.8 6 5.2 4.8 4.6-6.5 5.3-10.8 2.2-10 3-15.2 2.9-15.1 4-18.6 2.4-.9 2.3.9-.8 4.3-1 8.9-1 15.6-1.5 19.8-1.4 11 1.6 12.2 5.2-2.5 6.4-6.2 2.4-12.1 3.4-16.8 2.1-15.3 2.8-18.8 2.1-6.2 2.9-5.7.8 3.9 0 7.6-1.7 9.8-2.7 13.5-3.2 10.1 0 11.4 5.6-3.9 7-7.6 2.9-6.4 4.1-11 1.7-3.4 3.4-12.1 1.4-11.3 3.1-21.1 2.7-17.2 3-21.2c.1-1.5 1.4-7.9 1.5-9.3-9-6-22.1-11.3-32.9-12.4-4.4 2.1-15.6 7.3-19.3 8.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_17"
//                       d="M623 619.2c-2.2-1.8-3.2-5.8-5.2-6.6-4.3-1.9-5.8-3.5-10.2-5.7-2.8-1.4-7.7-4.1-16-6.8-2.3-.8-12-7-14.4-8.2-11.7 1.6-23 8.2-31 14.2.3 2.2 1.4 11.2 1.4 12.9.1 4.8 2.8 18 3.2 22.4s.5 11.8 3 17.6 1.5 11.1 3.3 14.1 2.2 6.2 5.2 11.3 5.2 5.6 6.4 2.2 0-8.2-.8-9.9-1.9-7.6-2.3-10.4-1.6-7.6-.8-9.8 3.2 2.4 3.3 4.5 1.4 12.3 2.1 16.3 2.2 14.1 3.4 19.1 4.5 8.6 6.8 7.1 2.8-6.8 2.6-9.1-1.4-12.5-1.6-15.6-1.7-15.8-1.9-17.5 2.2-1.6 2.8.6 2.1 9.6 2.8 13 2.9 15.4 3.7 21.7 4.9 10.2 7.5 10.4 3.1-6.7 3.2-9.2-1-12.5-1.5-15.3-4.2-24.8-3.2-24.8 3.6 14.8 4.8 21.2 2.8 13 6.7 13.1 3.2-4.8 3.4-12.8-.8-13.9-2.3-25.2-3.3-17.9-4.4-22-3.2-10.8-2.1-12.6 7.5 1.7 11.3 5.2 10.8 4.5 13.2 2.5-.2-6-2.4-7.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_18"
//                       d="M214.3 661.9v19.3c0 17.5 1.8 35.2 3.8 48s13.2 79.2 16 96.2c2.2 13.4 7.4 52 11.4 76.6 12.8 17.4 28.6 21.1 42.4 21.9 13.6.9 27.4-1.6 35.6-9.2.6-15.5.9-32.5.6-40.3-.5-14.8-2.2-56-2.1-67.9s2.6-35 4.2-43.8 5.9-31.3 8.1-41.2c2.2-9.7 6.1-37.3 6.2-37.9-46.1 19.8-100.2 5.4-126.2-21.7z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_20"
//                       d="M287.8 924c-13.8-.9-29.6-4.5-42.4-21.9 1.1 6.6 2 12.1 2.8 15.9 3.7 18 2.7 23.8 4.2 33s.8 17.5-1.7 33.5c-.2 1.2-.4 2.6-.5 4.2 6.1-11.6 19.8-14 31.8-12.7 12.4 1.3 28.6 6 35.1 11.2-.2-4-.3-7.9-.4-11.4-.2-11.5 3.5-22.5 4.8-30.3.6-3.7 1.3-16.6 1.9-30.7-8.2 7.6-21.9 10.1-35.6 9.2z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_18_1_"
//                       d="M341.3 683.3c.1.6 4.1 28.3 6.3 38 2.3 9.8 6.6 32.3 8.3 41.1s4.3 31.9 4.4 43.8-1.3 53.1-1.7 67.9c-.3 7.8.5 26.2 1.2 41.7 8.2 7.6 22 10.6 35.6 9.6 13.8-.9 29.4-4.5 42.1-22 3.9-24.6 8.7-65.4 10.8-78.9 2.7-17 13.5-83.5 15.5-96.3s4.5-31.8 4.4-49.3c0-2 .8-15.7.8-18-25.8 27.4-81.5 42-127.7 22.4z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_21"
//                       d="M396.3 924c-14.2.9-28.4-1.8-36.5-10.1.3 9.5.7 18.3 1 22.9.8 11.5 5.8 24.2 5.8 40.7 0 3.6-.1 7-.3 10.2 6-5.4 22.9-10.4 35.7-11.7 11.4-1.2 24.3.9 30.8 11-.7-4.9-1.5-9.5-2.1-13.5-1.5-10.3-.3-21.2 1.2-34.3.9-7.9 3.5-22.7 5.6-35.7-12.5 16.2-27.8 19.7-41.2 20.5z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_22"
//                       d="M250.2 988.7c-1.6 18.6.5 58.3.5 68.5 0 11 3.2 52.8 8 69.7 2.1 7.2 4.5 18.6 6.9 30.3 5.1 7 16.4 9.5 26 9.9 9.1.4 18.7-4 23.6-12.1 1-9.1 1.9-17.9 2.4-23.8 1.3-15.8 6.3-57.7 7-66.8s-.2-34.5-3.5-48c-2.3-9.4-3.4-19.8-3.9-29.1-6.5-5.2-22.7-9.9-35.1-11.2-12.1-1.4-25.8 1-31.9 12.6z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_23"
//                       d="M402.1 976c-12.8 1.4-29.7 6.3-35.7 11.7-.6 11.6-2.3 21.9-5.4 37.1-4 19.5-2.2 39.5-.2 53.8s3 38.5 6.2 63.5c.5 4.1 1 8.1 1.4 11.9 4.7 8.7 14.7 13.4 24.1 13 8.9-.4 19.3-2.6 24.8-8.5 3.6-15.6 7.6-32.3 9.8-44.5 4-22.7 5.5-50.7 5.5-59.2s2.2-28.3 2.3-42.3c.1-8.7-.9-17.6-2.1-25.5-6.4-10.1-19.3-12.2-30.7-11z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_24"
//                       d="M291.5 1167c-9.6-.4-20.9-2.9-26-9.9 3.1 15.7 6 32 7.5 39.6 2.5 13.4 2.7 35.9 2.1 40-.1 1-.4 1.7-.7 2.1 3.3 10.5 2.5 18 1.7 29.6-.2 3.5-.1 13.3.4 20.2.5.6 1 1.1 1.6 1.6 4.9-14.6 28.5-15 35.1-7.9 1.6-5.9 1-11.1 2.1-18.4 1.1-8-.1-13.1-.5-16.6s1.9-5.1 3.4-12.1-1.1-12.9-3-19.6-2.5-13.6-3-23c-.3-5.9 1.3-22.3 2.9-37.7-4.9 8.1-14.5 12.5-23.6 12.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_25"
//                       d="M368.4 1154c2.2 19.2 3.3 34.3 2.6 47.6-.4 7.8-3.2 15-5.4 22.2s-.2 12.7 1.2 16.7 1.6 7 .6 11.5 1.2 14.1 1.4 19.1c.1 3 0 7.6 1.3 12.3 5-8.1 30-8.4 35.7 6.1.7-.8 1.4-1.6 1.9-2.4.4-6.8.6-15.5.3-18.8-.8-11.4-1.6-18.8 1.5-29.1l-.4-.4c-1.5-1.7-1-7.3-1.3-10.7s.5-18.8 2.7-36c1-7.9 3.8-20.4 6.9-33.8-5.5 5.9-15.9 8.1-24.8 8.5-9.5.6-19.4-4.1-24.2-12.8z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_26"
//                       d="M278.1 1290.3c4 3.7 9.4 6.4 16 6.8 10.6.8 16.1-6.1 18.5-12.9l.6-1.8c-6.6-7.1-30.2-6.7-35.1 7.9z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_27"
//                       d="M370.1 1283.5c.9 3.1 2.3 6.2 4.8 8.9 6.2 6.9 20.1 3.8 25.8 1.1 2-.9 3.6-2.3 5.1-3.9-5.7-14.6-30.7-14.2-35.7-6.1z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       d="M374.9 545.1c-12.6 6.8-43.1 16.5-61.9-.8-1.6 0-2.1 3.6-.5-28 2.3-47.8 10.5-232.7 12.3-297.7 8.6.1 10.5-.6 18.8-.7 27.1-.3 11.9 0 19.3 0-2.1 14.6 7.6 315.2 12 327.2z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       d="M375.5 545.1c-12.6 6.8-43.1 16.5-61.9-.8-1.6 0-2.6 3.6-1-28 1.9-47.4 0 2.9 2.9-63 8.6.1 17.2.3 25.5.3 27.1-.3 20.9-.4 28.3-.3 1.9 17.1 2.3 81.2 6.2 91.8z"
//                       className="st0"
//                     />
//                     <Path
//                       onPressIn={handlePressIn}
//                       onPressOut={handlePressOut}
//                       stroke={"#0e4c9e"}
//                       fill={initialColor}
//                       id="bck_1_1_"
//                       d="M384 159.9c1.6-5.6 6.5-16.3 9.9-30.4.4-2.8 4.5-1.7 6.4-4.4.9-1.3 7-14.1 7.7-17 .9-3.3 2.8-15.5 1-16.6-5-7.9-11.2 5.8-10.9 3.1.9-8 0-13.1-1.4-22.2-10.2-36.3-27.9-52.7-58.9-52.7-29.3 0-61.1 24.2-52 74.6.4.9-5.7-5.9-8.1-4.8-3.4 1.5-3.4 4.6-3.3 7.3.2 3.1 1.2 10.5 2.9 14 1.8 3.5 3.7 13.1 5.6 16 2.4 3.6 7 3.9 7.1 4.8.2 2.4 5 9.2 8.1 26.8 10 20.7 76.1 21.8 85.9 1.5z"
//                       style={{
//                         fill: "#ccc",
//                         stroke: "#0e4e9c",
//                         strokeWidth: 0.5,
//                       }}
//                     />
//                   </Svg>
//               }
//             </>

//         }

//         {
//           gender == 'male' ?
//             <>
//               {
//                 isFront ?
//                   //male front overlay
//                   <Svg
//                     pointerEvents='none'
//                     style={[StyleSheet.absoluteFill, { zIndex: 2, elevation: 10 }]}>
//                     {
//                       circlesForMen.map((circle, index) => (
//                         <Circle
//                           onPress={() => console.log('do nothing')}
//                           // stroke={'blue'}
//                           strokeLinecap='square'
//                           key={index}
//                           cx={circle.x}
//                           cy={circle.y}
//                           r={circle.radius}
//                           fill={circle.color}
//                         />
//                       ))}
//                   </Svg>
//                   :
//                   //male back overlay
//                   <Svg
//                     pointerEvents='none'
//                     style={[StyleSheet.absoluteFill, { zIndex: 2, elevation: 10 }]}>
//                     {
//                       circlesForMenBack.map((circle, index) => (
//                         <Circle
//                           onPress={() => console.log('do nothing')}
//                           // stroke={'blue'}
//                           strokeLinecap='square'
//                           key={index}
//                           cx={circle.x}
//                           cy={circle.y}
//                           r={circle.radius}
//                           fill={circle.color}
//                         />
//                       ))}
//                   </Svg>

//               }
//             </>
//             :

//             <>
//               {
//                 isFront ?
//                   //female front overlay
//                   <Svg
//                     pointerEvents='none'
//                     style={[StyleSheet.absoluteFill, { zIndex: 2, elevation: 5 }]}>
//                     {
//                       circlesForWomen.map((circle, index) => (
//                         <Circle
//                           stroke={'blue'}
//                           strokeLinecap='square'
//                           key={index}
//                           cx={circle.x}
//                           cy={circle.y}
//                           r={circle.radius}
//                           fill="rgba(252, 32, 3, 0.6)"
//                         />
//                       ))}
//                   </Svg>
//                   :
//                   //female back overlay
//                   <Svg
//                     pointerEvents='none'
//                     style={[StyleSheet.absoluteFill, { zIndex: 2, elevation: 5 }]}>
//                     {
//                       circlesForWomenBack.map((circle, index) => (
//                         <Circle
//                           stroke={'blue'}
//                           strokeLinecap='square'
//                           key={index}
//                           cx={circle.x}
//                           cy={circle.y}
//                           r={circle.radius}
//                           fill="rgba(252, 32, 3, 0.6)"
//                         />
//                       ))}
//                   </Svg>
//               }
//             </>

//         }
//         {/* <TouchableOpacity
//           style={styles.touchArea}
//           activeOpacity={1}
//                     onPress={handleTouch}
//         /> */}
//       </View>
//     </>
//   );
// };

// const makeStyles = (H, W) => StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   touchArea: {
//     height: H,
//     width: W,
//     position: 'absolute',
//     zIndex: 1
//   },
//   undoButton:
//   {
//     position: 'absolute',
//     zIndex: 2,
//     backgroundColor: initialColor,
//     padding: 10,
//     margin: 5,
//     borderRadius: 8
//   },
//   genderButton:
//   {
//     //position:'absolute',
//     //margin:Spaces.sm,
//     padding: 10,
//     backgroundColor: strokeColor,
//     borderRadius: 8,
//     alignSelf: 'flex-end'
//   },
//   whiteText:
//   {
//     color: 'white'
//   },
//   isFrontButton:
//   {
//     padding: 10,
//     backgroundColor: strokeColor,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignSelf: 'flex-end'
//   }
// });

// export default PainSubmit;