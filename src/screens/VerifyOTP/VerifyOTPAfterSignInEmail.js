import { View, Alert, ToastAndroid, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Text } from 'react-native-paper'
import { getDataFromLocalStorage, storeDataInLocalStorage, } from '../../local storage/LocalStorage'
import RNRestart from 'react-native-restart'
import DataContext from '../../context/DataContext'
import { colors, Constants, fontSizes, ShortToast } from '../../colorSchemes/ColorSchemes'
import OTPinputComponent from '../VerifyOTP/OTPinputComponent'
import Loader from '../../assets/components/Loader'

import { useIsFocused } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useLocales } from '../../utils/LocalizationUtil'


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const VerifyOTPAfterSignInEmail = ({ navigation, route }) => {

  const { Nmobile, Notp } = useContext(DataContext)
  const [mobile] = Nmobile
  const [loader, setLoader] = useState(false)
  const [otp, setOtp] = Notp

  const isFocused = useIsFocused()
  const strings = useLocales()

  useEffect(() => { getLanguage() }, [isFocused])


  //lng
  const getLanguage = async () => {
    setLoader(true)
    const lang = await getDataFromLocalStorage("lang")

    if (lang == "en") {
      changeLanguage('en')

    } else {
      changeLanguage('hi')

    }
    setLoader(false)

  }


  const changeLanguage = (languageKey) => {
    
  }


  const otpRequestedAgain = async () => {
    setLoader(true)
    var formdata = new FormData();
    formdata.append("email", mobile);
    formdata.append("country", "india");

    var requestOptions = {
      method: 'POST',
      body: formdata,
    };
    try {
      const response = await fetch(`${Constants.BASE_URL}panel/Signup/login`, requestOptions)
      const result = await response.json()
      console.log(result)
      if (result.status === 200) {
        setOtp(result.otp)
        ShortToast(result.message, 'success', '')
        //   ShortToast(`${result.otp}`, 'warning', '')
      }
      else ShortToast(result.message, 'error', '')

    } catch (error) {
      ShortToast(`${error}`, "error", '')

    }
    setLoader(false)
  }

  const verifyOTP = async () => {
    setLoader(true)
    console.log('otp', JSON.stringify(otp))
    var formdata = new FormData();
    formdata.append("otp", otp);
    formdata.append("email", route.params.email)
    formdata.append("login_time", Date.now())
    formdata.append("code", strings?.code)
    
    var requestOptions = {
      method: 'POST',
      body: formdata,
    };

    try {
      const response = await fetch(`${Constants.BASE_URL}panel/verifyOTP`, requestOptions)
      const result = await response.json()
      console.log("email response = ", result)
      if (result.status === 200) {
        storeDataInLocalStorage('Token', result.token)                       //Store Token               //change stack value for navigating to bottom tabs
        storeDataInLocalStorage('mobile', mobile)
        storeDataInLocalStorage('user_id', JSON.stringify(result.user_id))                          //save userId in local storage
        storeDataInLocalStorage('user_type', (result.user_type))                          //save usertype in local storage
        storeDataInLocalStorage('registerStatus', result.register_status)
        storeDataInLocalStorage('wrid', result.wrd_id)
        console.log('wrid', result.wrd_id)

        navigate()


      }
      else ShortToast("Incorrect OTP!", 'error', '')


    } catch (error) {

      ShortToast('Error!', 'error', '')
    }
    setLoader(false)
  }

  const navigate = async () => {
    setLoader(true)
    const temp = await getDataFromLocalStorage("registerStatus")
    if (temp == '1') {
      { storeDataInLocalStorage('stackValue', '3') && RNRestart.Restart() }
    }
    else {
      { storeDataInLocalStorage('stackValue', '4') && RNRestart.Restart() }
    }
    setLoader(false)
  }
  console.log('DataContext-->', route.params.email)
  return (
    loader
      ?
      <Loader />
      :
      <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
        <Text style={{ fontSize: fontSizes.LAR }}>{strings.OTPVerification}</Text>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#adadaa' }}>{strings.Wehavesentthecodeto} </Text>
          <Text style={{ fontSize: fontSizes.LAR }}>{route.params.email}</Text>
        </View>
        <View style={styles.inputContainer}>
          <OTPinputComponent />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#adadaa' }}>{strings.didnotreceivecode}</Text><TouchableOpacity onPress={() => otpRequestedAgain()}>
            <Text style={styles.text}>{strings.requestagain}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => verifyOTP()}>
          <Text style={{ color: 'white' }}>{strings.VerifySignIn}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer:
  {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    //flexWrap:'wrap',
    backgroundColor: 'white',
    paddingVertical: HEIGHT * 0.15
  },
  inputContainer:
  {

  },
  button:
  {
    height: HEIGHT * 0.08,
    width: WIDTH * 0.7,
    backgroundColor: colors.GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  text:
  {
    color: colors.GREEN
  },

})

export default VerifyOTPAfterSignInEmail