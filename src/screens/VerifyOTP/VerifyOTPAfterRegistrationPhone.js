import { View, Alert, ToastAndroid, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { Text } from 'react-native-paper'
import { storeDataInLocalStorage, } from '../../local storage/LocalStorage'
import RNRestart from 'react-native-restart'
import DataContext from '../../context/DataContext'
import { colors, Constants, fontSizes, ShortToast } from '../../colorSchemes/ColorSchemes'
import OTPinputComponent from '../VerifyOTP/OTPinputComponent'
///////////////////////////////////////for email only////////////////////////////////////////////////
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const VerifyOTPAfterRegistrationPhone = ({ navigation, route }) => {

    const { Nmobile, Notp } = useContext(DataContext)
    const [mobile] = Nmobile
    const [otp, setOtp] = Notp


    const otpRequestedAgain = async () => {
        var formdata = new FormData();
        formdata.append("mobile", route.params.mob);
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
    }

    const verifyOTP = async () => {
        var formdata = new FormData();
        formdata.append("otp", otp)
        formdata.append("mobile", route.params.mob)
        formdata.append("login_time", Date.now())
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
        };

        const response = await fetch(`${Constants.BASE_URL}panel/verifyOTP`, requestOptions)
        const result = await response.json()
        console.log(result)
        if (result.status === 200) {
            storeDataInLocalStorage('Token', result.token)                       //Store Token
            storeDataInLocalStorage('stackValue', '4')                          //change stack value for navigating to bottom tabs
            storeDataInLocalStorage('mobile', mobile)
            storeDataInLocalStorage('user_id', JSON.stringify(result.user_id))  
            storeDataInLocalStorage('user_type', (result.user_type))                          //save usertype in local storage
            storeDataInLocalStorage('wrid', result.wrd_id)

            //save userId in local storage
            { storeDataInLocalStorage('stackValue', '4') && navigation.replace("WelcomeScreenAfterRegistration") }

        }
        else ShortToast("Incorrect OTP!", 'error', '')

    }

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <Text style={{ fontSize: fontSizes.LAR }}>OTP Verification</Text>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#adadaa' }}>We have sent the code to </Text>
                <Text style={{ fontSize: fontSizes.LAR }}>{route.params.mob}</Text>
            </View>
            <View style={styles.inputContainer}>
                <OTPinputComponent />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#adadaa' }}>Didn't receive the code?</Text><TouchableOpacity onPress={() => otpRequestedAgain()}>
                    <Text style={styles.text}> Request again</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => verifyOTP()}>
                <Text style={{ color: 'white' }}>Verify and Login</Text>
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

export default VerifyOTPAfterRegistrationPhone