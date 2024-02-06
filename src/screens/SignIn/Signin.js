import { StyleSheet, TouchableOpacity, View, Dimensions, Linking, ToastAndroid, StatusBar, } from 'react-native'
import { TextInput, Text, configureFonts, DefaultTheme, Provider as PaperProvider, ActivityIndicator, Checkbox } from 'react-native-paper';
import { fontSizes, colors, H, W, ShortToast, fontFamily, Constants } from '../../colorSchemes/ColorSchemes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React, { useState, useContext, useEffect } from 'react'
import DataContext from '../../context/DataContext';
import { storeDataInLocalStorage } from '../../local storage/LocalStorage';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../assets/components/Loader'
import { useIsFocused } from '@react-navigation/native';
import { getDataFromLocalStorage } from '../../local storage/LocalStorage';
import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import CreateAccount from '../CreateAccount/CreateAccount';
import AntDesign from 'react-native-vector-icons/dist/AntDesign'

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});

const fontConfig = {
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'normal',
    fontSize: fontSizes.LAR,
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts({ config: fontConfig }),
};

const Signin = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    useEffect(() => { getLanguage() }, [isFocused])
    const { Nmobile, Notp, Nlanguage } = useContext(DataContext)
    const [mobile, setMobile] = Nmobile
    const [language, setLanguage] = Nlanguage
    const [otp, setOtp] = Notp
    const [loader, setLoader] = useState(false)
    const [userType, setUserType] = useState(null)
    const [countryType, setCountryType] = useState("India")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isChecked, setChecked] = useState(false);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true)
    //lng
    const getLanguage = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(language)
        setLoader(false)
    }

    const handleCheckBoxToggle = () => {
        setChecked(prev => !prev);
    };

    const openURL = async () => {
        Linking.openURL(`${Constants.BASE_URL}terms-conditions-2/`)
    }

    const signInPressed = async () => {
        storeDataInLocalStorage('country', countryType)
        if (isChecked) {
            setLoader(true)
            if (mobile.length === 0) {
                ShortToast('Kindly fill in your details!', 'error', '')
                setLoader(false)
            }
            else if (mobile.includes('@')) {
                setUserType('2')
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

                        ShortToast(result.message, 'success', '')
                        // ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
                        setOtp(result?.otp)
                        setTimeout(() => {
                            storeDataInLocalStorage('registerStatus', result.register_status)
                            storeDataInLocalStorage('mobile', mobile)
                            // console.log("")
                            setLoader(false)
                            navigation.navigate("VerifyOTPAfterSignInEmail", { "email": mobile })
                        }, 500);
                    }
                    else {
                        setLoader(false)
                        ShortToast(result?.message, 'error', '')
                    }
                } catch (error) {
                    ShortToast("Internal Server Error :"`${error}`, 'error', '')
                }
            }
            else {
                setUserType('1')
                var formdata = new FormData();
                formdata.append("mobile", mobile);
                formdata.append("country", "india");
                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                };
                try {
                    //const response = await fetch("https://lnf.bizhawkztest.com/public/Signup/login", requestOptions)
                    const response = await fetch(`${Constants.BASE_URL}panel/Signup/login`, requestOptions)
                    const result = await response.json()
                    console.log(result)
                    if (result.status === 200) {
                        navigate(result)
                    }
                    else if (mobile.length === 0) {
                        ShortToast('Kindly Fill in your Details!', 'error', '')
                        setLoader(false)
                    }
                    else {
                        ShortToast(result?.message, 'error', '')
                        setLoader(false)
                    }
                } catch (error) {
                    ShortToast(`Internal Server Error :${error}`, 'error', '')
                }
            }
        } else {
            ShortToast("Please accept terms and conditions!", "error")
        }
    }

    const signInPressedUS = async () => {
        storeDataInLocalStorage('country', countryType)
        if (isChecked) {
            setLoader(true)
            if (email.length === 0) {
                ShortToast('Kindly fill in your details!', 'error', '')
                setLoader(false)
            }
            else if (password.length === 0) {
                // setUserType('2')
                ShortToast('Kindly fill in password!', 'error', '')
                setLoader(false)
            }
            else {
                var formdata = new FormData();
                formdata.append("email", email);
                formdata.append("password", password);
                formdata.append("country", "other");
                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                };
                try {
                    const response = await fetch(`${Constants.BASE_URL}panel/Signup/login`, requestOptions)
                    const result = await response.json()
                    console.log(result)
                    if (result.status === 200) {
                        navigateUS(result)
                    } else {
                        setLoader(false)
                        ShortToast(result.message, 'error', '')
                    }
                } catch (error) {
                    ShortToast(`Internal Server Error :${error}`, 'error', '')
                }
            }
        } else {
            ShortToast("Please accept terms and conditions!", "error")
        }
    }

    const navigate = (result) => {
        //  ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
        setOtp(result.otp)
        storeDataInLocalStorage('registerStatus', result.register_status)
        //setLoader(false)
        navigation.replace("VerifyOTPAfterSignInPhone", { "mob": mobile })
    }

    const navigateUS = (result) => {
        // ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
        setOtp(result.otp)
        storeDataInLocalStorage('registerStatus', result.register_status)
        //setLoader(false)
        navigation.replace("VerifyOTPAfterSignInEmail", { "email": email })
    }

    return (

        loader
            ?
            <>
                <Loader />
            </>
            :
            <KeyboardAwareScrollView>
                <PaperProvider theme={theme}>
                    <View style={styles.mainContainer}>
                        <StatusBar backgroundColor={colors.GREEN} />
                        <LinearGradient colors={[colors.GREEN, colors.GREEN3, colors.GREEN3]}
                            style={styles.upperContainer}>
                            <View style={{}}>
                                <Text style={styles.greeting}>{strings.Hey}</Text>
                                <Text style={styles.welcomeText}>{strings.Gladtomeetyou}</Text>
                            </View>
                        </LinearGradient>
                        <View style={styles.lowerContainer}>
                            <Text style={styles.text}>{strings.SignIn}</Text>
                            <Text style={styles.text3}>{strings.Pleaseenteryourcredentialstocontinue}</Text>
                            {
                                countryType == "India" ?
                                    <View
                                        style={{
                                        }}>
                                        <View style={{
                                            flexDirection: "row",
                                            marginHorizontal: H * 0.02,
                                            marginTop: 5,
                                            height: H * 0.05,
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => { setCountryType("India") }}
                                                style={{
                                                    backgroundColor: countryType == "India" ? colors.GREEN : "white",
                                                    borderColor: colors.GREEN,
                                                    alignItems: 'center',
                                                    width: W * 0.41,
                                                    borderRadius: 8,
                                                    justifyContent: 'center',
                                                    borderColor: colors.GREEN,
                                                    borderWidth: 1
                                                }}>
                                                <Text style={{ textAlign: "center", color: countryType == "India" ? "white" : "black", }}>(+91) India <AntDesign name="check" color="white" size={16}/></Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => { setCountryType("other") }}

                                                style={{
                                                    backgroundColor: countryType == "other" ? colors.GREEN : "white",
                                                    borderColor: 'gray',
                                                    borderWidth: 1,
                                                    borderColor: colors.GREEN,
                                                    alignItems: "center",
                                                    width: W * 0.40,
                                                    justifyContent: 'center',
                                                    borderRadius: 8,
                                                    marginStart: 10
                                                }}>
                                                <Text style={{ color: countryType == "other" ? "white" : "black", }}>(+1) U.S</Text>
                                            </TouchableOpacity>

                                        </View>

                                        <TextInput style={styles.textInput}
                                            autoCapitalize='none'
                                            placeholder={strings.EnterEmailIdPhoneNumber}
                                            activeUnderlineColor={colors.GREEN}
                                            value={mobile}
                                            onChangeText={(text) => { setMobile(text) }}
                                        />

                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>


                                            <Checkbox.Android style={{
                                            }}
                                                onPress={handleCheckBoxToggle}
                                                status={isChecked ? 'checked' : 'unchecked'}
                                                color={colors.GREEN} />

                                            <Text style={styles.textBySignin}>{strings.bysignin}</Text>
                                            <TouchableOpacity onPress={() => { openURL() }}>
                                                <Text style={[styles.tncText,]}>{strings.termsandcondition}</Text>
                                            </TouchableOpacity>

                                        </View>

                                        <View style={{ alignItems: 'center', marginTop: 25 }}>

                                            <TouchableOpacity onPress={() => {
                                                signInPressed()
                                            }}
                                                style={styles.button}>
                                                <Text style={styles.textAgree}>{strings.AgredSignIn}</Text>
                                            </TouchableOpacity>

                                        </View>

                                        <View style={styles.textContainerForAlignment}>

                                            <Text style={styles.textUniversal}>{strings.donthaveanaccount} </Text>
                                            <TouchableOpacity onPress={() => { navigation.navigate('SignupPhone') }}>
                                                <Text style={styles.text2}>{strings.craeteone}</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                    :
                                    <View
                                        style={{
                                        }}>
                                        <View style={{
                                            flexDirection: "row",
                                            marginHorizontal: H * 0.02,
                                            marginTop: 5,
                                            height: H * 0.05,
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => { setCountryType("India") }}
                                                style={{
                                                    backgroundColor: countryType == "India" ? colors.GREEN : "white",
                                                    borderColor: colors.GREEN,
                                                    alignItems: 'center',
                                                    width: W * 0.41,
                                                    borderRadius: 8,
                                                    justifyContent: 'center',
                                                    borderColor: colors.GREEN,
                                                    borderWidth: 1
                                                }}>
                                                <Text style={{ textAlign: "center", color: countryType == "India" ? "white" : "black", }}>(+91) India</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { setCountryType("other") }}
                                                style={{
                                                    backgroundColor: countryType == "other" ? colors.GREEN : "white",
                                                    borderColor: 'gray',
                                                    borderWidth: 1,
                                                    borderColor: colors.GREEN,
                                                    alignItems: "center",
                                                    width: W * 0.40,
                                                    justifyContent: 'center',
                                                    borderRadius: 8,
                                                    marginStart: 10
                                                }}>
                                                <Text style={{ color: countryType == "other" ? "white" : "black", }}>(+1) U.S <AntDesign name="check" color="white" size={16}/></Text>
                                            </TouchableOpacity>
                                        </View>
                                        <TextInput style={styles.textInput}
                                            autoCapitalize='none'
                                            placeholder={strings.EnterEmailId}
                                            activeUnderlineColor={colors.GREEN}
                                            //activeUnderlineColor={"red"}
                                            value={email}
                                            onChangeText={(text) => { setEmail(text) }}
                                        />
                                        <TextInput style={styles.textInput}
                                            placeholder={strings.EnterPassword}
                                            activeUnderlineColor={colors.GREEN}
                                            value={password}
                                            onChangeText={(text) => { setPassword(text) }}
                                            secureTextEntry={secureTextEntry1}
                                            right={<TextInput.Icon icon="eye" onPress={() => setSecureTextEntry1(prev => !prev)} color={secureTextEntry1 ? null : colors.GREEN} />}
                                        />
                                        <TouchableOpacity
                                            onPress={() => { navigation.navigate("ForgetPassword", { 'email': email }) }}
                                            style={{
                                                alignItems: 'flex-end',
                                                width: W * 0.9,
                                                borderRadius: 8,
                                                marginTop: H * 0.025,
                                                justifyContent: 'flex-end',
                                                fontFamily: 'Montserrat-Medium',
                                            }}>
                                            <Text style={{
                                                textAlign: 'right',
                                                color: "green"
                                            }}>{strings.ForgotPassword}</Text>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <View style={{
                                            }}><Checkbox.Android
                                                    onPress={handleCheckBoxToggle}
                                                    status={isChecked ? 'checked' : 'unchecked'}
                                                    color={colors.GREEN} />
                                            </View>
                                            <Text style={styles.textBySignin}>{strings.bysignin} </Text>
                                            <TouchableOpacity onPress={() => { openURL() }}>
                                                <Text style={styles.tncText}>{strings.termsandcondition}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{
                                            alignItems: 'center',
                                            marginTop: 25
                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                signInPressedUS()
                                            }}
                                                style={styles.button}>
                                                <Text style={styles.textAgree}>{strings.AgredSignIn}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.textContainerForAlignment}>
                                            <Text style={styles.textUniversal}>{strings.donthaveanaccount} </Text>
                                            <TouchableOpacity onPress={() => { navigation.navigate('SignupPhone') }}>
                                                <Text style={styles.text2}>{strings.craeteone}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                            }
                        </View>
                    </View>
                </PaperProvider>
            </KeyboardAwareScrollView >
    )
}

const styles = StyleSheet.create({

    mainContainer:
    {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
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
        borderRadius: 12,


    },
    tncText:
    {
        fontSize: fontSizes.LAR,
        paddingLeft: 0,
        marginTop: 7,
        color: colors.ORANGE,
    },
    textUniversal:
    {
        fontSize: fontSizes.LAR,
        paddingRight: 0,
        marginTop: 20,
    },
    textBySignin:
    {
        fontSize: fontSizes.LAR,
        paddingLeft: 0,
        marginTop: 7,
    },
    textAgree:
    {
        textAlign: 'center',
        color: 'white',
        fontSize: fontSizes.LAR,

    },
    greeting:
    {
        color: 'white',
        fontSize: fontSizes.greeting,
        padding: 10,
        fontFamily: 'Montserrat-Regular',

    },
    welcomeText:
    {
        color: 'white',
        paddingTop: 0,
        paddingLeft: 10,
        fontSize: fontSizes.XXXL

    },
    text2:
    {
        fontSize: fontSizes.LAR,
        color: colors.GREEN,
        marginTop: 20
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
        height: 40,
        marginTop: H * 0.03,
        padding: 1,
    }
})
export default Signin;
