import { View, Alert, ToastAndroid, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState , useEffect} from 'react'
import { Text } from 'react-native-paper'
import { storeDataInLocalStorage, } from '../../local storage/LocalStorage'
import RNRestart from 'react-native-restart'
import DataContext from '../../context/DataContext'
import { colors, Constants, fontSizes, ShortToast } from '../../colorSchemes/ColorSchemes'
import OTPinputComponent from '../VerifyOTP/OTPinputComponent'
import Loader from '../../assets/components/Loader'
import { useIsFocused } from '@react-navigation/native';
import { getDataFromLocalStorage } from '../../local storage/LocalStorage';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'


//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});

///////////////////////////////////////for email only////////////////////////////////////////////////
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const VerifyOTPAfterRegistration = ({ navigation, route }) => {

    const { Nmobile, Notp } = useContext(DataContext)
    const [mobile] = Nmobile
    const [otp, setOtp] = Notp
    const [loader, setLoader] = useState(false)

    const isFocused = useIsFocused()


    useEffect(() => { getLanguge() }, [isFocused])


  //lng
  const getLanguge = async () => {
    setLoader(true)
    const lang = await getDataFromLocalStorage("lang")
    if (lang == "en") {
      changeLaguagee('en')
    } else {
      changeLaguagee('hi')
    }
    setLoader(false)

  }


  const changeLaguagee = (languageKey) => {
    strings.setLanguage(languageKey)
  }

    const otpRequestedAgain = async () => {
        setLoader(true)
        var formdata = new FormData();
        formdata.append("email", route.params.email);
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
                //ShortToast(JSON.stringify(result.otp), 'warning', '')
            }

        } catch (error) {
            console.log(error)
        }
        setLoader(false)
    }

    const verifyOTP = async () => {
        setLoader(true)
        var formdata = new FormData();
        formdata.append("otp", otp)
        formdata.append("email", route.params.email)

        var requestOptions = {
            method: 'POST',
            body: formdata,
        };

        const response = await fetch(`${Constants.BASE_URL}panel/Signup/verifyOTP`, requestOptions)
        const result = await response.json()
        console.log(result)
        if (result.status === 200) {
            storeDataInLocalStorage('Token', result.token)
            storeDataInLocalStorage('stackValue', '4')                        //Store Token
            storeDataInLocalStorage('mobile', mobile)
            storeDataInLocalStorage('user_id', JSON.stringify(result.user_id))     
            storeDataInLocalStorage('user_type', (result.user_type))    
                   storeDataInLocalStorage('wrid', result.wrd_id)
                      //save usertype in local storage
            //save userId in local storage
            { storeDataInLocalStorage('stackValue', '4') && navigation.replace("WelcomeScreenAfterRegistration") }                        //change stack value for navigating to bottom tabs

        }
        else
            ShortToast('Incorrect OTP! ', 'error', '')
        setLoader(false)
    }

    console.log('route.param.email', route.params.email)
    console.log('DataContext-->', mobile)
    return (
        loader
            ?
            <Loader />
            :
            <ScrollView contentContainerStyle={styles.mainContainer}>
                <Text style={{ fontSize: fontSizes.LAR }}>{strings.OTPVerification}</Text>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#adadaa' }}>{strings.Wehavesentthecodeto} </Text>
                    <Text style={{ fontSize: fontSizes.LAR }}>{route.params.email}</Text>
                    {/* <Text style={{ fontSize: fontSizes.MED }}>and </Text>
                    <Text style={{ fontSize: fontSizes.LAR }}>{route.params.mobile}</Text> */}
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
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: HEIGHT,
        width: WIDTH,
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

export default VerifyOTPAfterRegistration