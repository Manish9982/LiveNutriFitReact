import { StyleSheet, TouchableOpacity, View, Dimensions, Linking, Alert, ActivityIndicator, ToastAndroid } from 'react-native'
import { TextInput, Text, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { fontSizes, colors, H, ShortToast, fontFamily, W } from '../../colorSchemes/ColorSchemes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React, { useState, useContext } from 'react'
import DataContext from '../../context/DataContext';
import { storeDataInLocalStorage } from '../../local storage/LocalStorage';


const fontConfig = {

    android: {
        regular: {
            fontFamily:  "Montserrat-SemiBold",
            fontWeight: 'normal',
            fontSize: fontSizes.LAR,

        }

    }
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts({config:fontConfig}),
};
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const SignupWithEmail = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    //const [userType, setUserType] = useState(second)
    const [dataFromApi, setDataFromApi] = useState({})
    const { NsignupType } = useContext(DataContext)
    const [signup_type] = NsignupType
    const [loader, setLoader] = useState(false)



    const navigate = (result) => {
        setLoader(true)
        storeDataInLocalStorage('user_id', JSON.stringify(result.user_id))
        storeDataInLocalStorage('user_type', JSON.stringify(result.user_type))
        console.log('result for signUp--->', result)
        setLoader(false)
        ShortToast(JSON.stringify(result.otp), 'warning', '')
        navigation.navigate("VerifyOTPAfterRegistrationEmail", { "email": email })

        /////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////
    }
    const testEmail = (text) => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regex.test(text)
    }
    const testName = (text) => {
        const regex = /^[a-zA-Z ]+$/
        return regex.test(text)
    }

    const handleChangeEmail = (text) => {
        setEmail(text)
    }
    const handleChangeName = (text) => {
        setUserName(text)
    }


    const openURL = async () => {
        { Linking.openURL('https://livenutrifit.com/terms-conditions-2/') }
    }
    const openURL2 = async () => {
        { Linking.openURL('https://livenutrifit.com/hippa-notice/') }
    }

    const signUpPressed = async () => {
        setLoader(true)

        if (testName(userName) && testEmail(email)) {
            var formdata = new FormData();
            formdata.append("user_name", userName);
            formdata.append("email", email);
            formdata.append("user_type", "1");
            formdata.append("signup_type", "2");

            var requestOptions = {
                method: 'POST',
                body: formdata,
            };
            try {
                const response = await fetch("https://livenutrifit.com/Signup", requestOptions)
                const result = await response.json()
                console.log(result)
                setDataFromApi(result)
                if (result.status === 200) {
                    navigate(result)
                    ShortToast("OTP Sent To Your Email.", 'success', '')
                }
                else if (result.message !== 200) {
                    ShortToast(result.message, 'error', '')
                    navigation.navigate("Sign In")
                }

            } catch (error) {
                ShortToast(error, 'error', '')
                navigation.goBack()

            }

        }
        else if (email.length === 0) {
            ShortToast('Email Address Can NOT be Empty!', 'error', '')
        }
        else if (!testEmail(email)) {
            ShortToast('Invalid Email Address!', 'error', '')
        }
        else if (userName.length === 0) {
            ShortToast('Name can not be empty!', 'error', '')
        }
        else if (!testName(userName)) {
            ShortToast('Name can not contain special characters and numbers', 'error', '')
        }
        setLoader(false)
    }

    console.log('name and email---->', testName(userName), testEmail(email))
    return (

        <KeyboardAwareScrollView>
            <PaperProvider theme={theme}>
                {loader ? <View style={{ justifyContent: 'center', alignItems: 'center', height: H, width: W }}>
                    <ActivityIndicator size="large"
                        color={colors.GREEN} />
                </View> :

                    <View style={styles.mainContainer}>

                        <View style={styles.upperContainer}>

                            <Text style={styles.greeting}>Hey!</Text>
                            <Text style={styles.welcomeText}>Glad to meet you</Text>

                        </View>

                        <View style={styles.lowerContainer}>

                            <Text style={styles.text}>Create your account</Text>
                            <Text style={styles.text3}>Please enter your details to use our app</Text>
                            <TextInput style={styles.textInput}
                                placeholder='Enter Email Address'
                                onChangeText={(text) => { handleChangeEmail(text) }}
                                mode='outlined'
                                outlineColor='#ebebeb'
                                activeOutlineColor={colors.GREEN}
                            />
                            <TextInput style={styles.textInput}
                                placeholder='Enter Your Name'
                                activeUnderlineColor={colors.GREEN}
                                onChangeText={(text) => { handleChangeName(text) }}
                                mode='outlined'
                                outlineColor='#ebebeb'
                                activeOutlineColor={colors.GREEN}
                            />

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: WIDTH * 0.035, marginVertical: HEIGHT * 0.04 }}>

                                <Text style={styles.textUniversal}>By signing, I accept the </Text>
                                <TouchableOpacity onPress={() => { openURL() }}>
                                    <Text style={styles.tncText}>Terms & Conditions </Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: fontSizes.LAR, fontFamily: 'Montserrat-Regular' }}>and </Text>
                                <TouchableOpacity onPress={() => { openURL2() }}>
                                    <Text style={styles.tncText2}>Privacy Policy </Text></TouchableOpacity>
                                <Text style={[styles.tncText2, { color: 'black' }]}>, including </Text>
                                <Text style={[styles.tncText2, { color: 'black' }]}>usage</Text>
                                <Text style={[styles.tncText2, { color: 'black' }]}> of</Text>
                                <Text style={[styles.tncText2, { color: 'black', marginTop: 0 }]}> Cookies</Text>
                            </View>

                            <View style={{ alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => { signUpPressed() }}
                                    style={styles.button}>
                                    <Text style={styles.textAgree}>Agree & Sign Up</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>}


            </PaperProvider>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({

    mainContainer:
    {
        height: HEIGHT,
        width: WIDTH,
    },
    upperContainer:
    {
        backgroundColor: colors.GREEN,
        height: '30%',
    },
    lowerContainer:
    {
        position: 'absolute',
        top: 120,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        height: '100%'
    },

    button:
    {
        backgroundColor: colors.GREEN,
        height: 52,
        width: "100%",
        justifyContent: 'center',
        borderRadius: 8,


    },
    tncText:
    {
        //fontSize: fontSizes.LAR,
        //paddingTop: 10,
        color: colors.ORANGE,
        //marginLeft:WIDTH*-0.015,
        fontSize: fontSizes.LAR,
        fontFamily: 'Montserrat-Regular'
    },
    tncText2:
    {
        fontSize: fontSizes.LAR,
        color: colors.ORANGE,
        // marginBottom: HEIGHT * 0.02,
        // fontSize: fontSizes.LAR,
        fontFamily: 'Montserrat-Regular'
    },
    textUniversal:
    {
        fontSize: fontSizes.LAR,
        //padding: 10,
        paddingLeft: 0,
        fontSize: fontSizes.LAR,
        fontFamily: 'Montserrat-Regular'

    },
    textAgree:
    {
        textAlign: 'center',
        color: 'white',
        fontSize: fontSizes.LAR,
        ...fontFamily.bold
    },
    greeting:
    {
        color: 'white',
        fontSize: fontSizes.greeting,
        padding: 10,
        ...fontFamily.bold,
        marginTop: HEIGHT * 0.02,
        elevation: 8,
    },
    welcomeText:
    {
        color: 'white',
        paddingTop: 0,
        paddingLeft: 10,
        fontSize: fontSizes.LAR,
        ...fontFamily.bold,
        elevation: 8,

    },
    text2:
    {
        fontSize: fontSizes.LAR,
        padding: 10,
        paddingLeft: 0,
        color: colors.GREEN,
        marginVertical: 20
    },
    text3:
    {
        color: colors.FONT_BLACK,
        padding: 10,
        ...fontFamily.bold

    },

    text:
    {
        padding: 10,
        fontSize: fontSizes.XXXL,
    },
    textContainerForAlignment:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: "4%"
    },
    textInput:
    {
        backgroundColor: 'white',
        fontSize: fontSizes.LAR,
        marginVertical: HEIGHT * 0.01,
    }
})
export default SignupWithEmail;
