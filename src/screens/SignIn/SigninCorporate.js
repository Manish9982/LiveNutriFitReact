import { StyleSheet, TouchableOpacity, View, Dimensions, Linking, ToastAndroid, StatusBar, } from 'react-native'
import { TextInput, Text, configureFonts, DefaultTheme, Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
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
import AntDesign from 'react-native-vector-icons/dist/AntDesign'

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});

const fontConfig = {

    android: {
        regular: {
            fontFamily: 'Montserrat-Regular',
            fontWeight: 'normal',
            fontSize: fontSizes.LAR,

        }

    }
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts({ config: fontConfig }),
};


const SigninCorporate = ({ navigation, route }) => {
    const { Nmobile, Notp } = useContext(DataContext)
    const [mobile, setMobile] = Nmobile
    const [otp, setOtp] = Notp
    const [loader, setLoader] = useState(false)
    const [userType, setUserType] = useState(null)

    const [countryType, setCountryType] = useState("India")


    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const isFocused = useIsFocused()


    useEffect(() => { getLanguage() }, [isFocused])


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
        strings.setLanguage(languageKey)
    }




    const openURL = async () => {
        { Linking.openURL(`${Constants.BASE_URL}terms-conditions-2/`) }
    }


    const signInPressed = async () => {
        setLoader(true)
        if (mobile.length === 0) {
            ShortToast('Kindly enter your mobile number', 'error', '')
            setLoader(false)
        }
        else {
            setUserType('1')
            var formdata = new FormData();
            formdata.append("id", route.params.id);
            formdata.append("mobile", mobile);
            formdata.append("country", "india");

            console.log("formdata  STATUS= ", formdata)


            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            try {
                const response = await fetch(`${Constants.BASE_URL}panel/corperate-login`, requestOptions)
                const result = await response.json()

                console.log("RESULT STATUS= ", result)

                if (result.status === 200) {

                    navigate(result)

                }
                else {
                    ShortToast(`${result.message}`, "error", "")
                    setLoader(false)
                }
            } catch (error) {
                ShortToast(`${error}`, "error", "")
                setLoader(false)
            }

        }


    }
    const signInPressedUS = async () => {
        setLoader(true)
        if (email.length === 0) {
            ShortToast('Kindly enter your mobile number', 'error', '')
            setLoader(false)
        } else if (password.length == 0) {
            ShortToast('Kindly enter your password', 'error', '')
            setLoader(false)
        }
        else {
            setUserType('1')
            var formdata = new FormData();
            formdata.append("id", route.params.id);
            formdata.append("email", email);
            formdata.append("password", password);
            formdata.append("country", "other");

            console.log("formdata US STATUS= ", formdata)

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            try {
                const response = await fetch(`${Constants.BASE_URL}panel/corperate-login`, requestOptions)
                const result = await response.json()

                if (result.status === 200) {
                    navigateUS(result)
                }
                else {
                    ShortToast(`${result.message}`, "error", "")
                    setLoader(false)
                }
            } catch (error) {
                ShortToast(`${error}`, "error", "")
                setLoader(false)
            }

        }


    }



    const navigate = (result) => {
        //  ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
        setOtp(result.otp)
        // storeDataInLocalStorage('registerStatus', "2")
        setLoader(false)
        storeDataInLocalStorage('userType', 'corporate')//2
        navigation.navigate("VerifyOTPAfterSignInPhone", { "mob": mobile })
    }


    const navigateUS = (result) => {
        // ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
        setOtp(result.otp)
        // storeDataInLocalStorage('registerStatus', "2")
        setLoader(false)
        storeDataInLocalStorage('userType', 'corporate')//2
        navigation.navigate("VerifyOTPAfterSignInEmail", { "email": email })
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



                            {countryType == "India" ?


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
                                            onPress={() => { setCountryType("Others") }}

                                            style={{
                                                backgroundColor: countryType == "Others" ? colors.GREEN : "white",
                                                borderColor: 'gray',
                                                borderWidth: 1,
                                                borderColor: colors.GREEN,
                                                alignItems: "center",
                                                width: W * 0.40,
                                                justifyContent: 'center',
                                                borderRadius: 8,
                                                marginStart: 10
                                            }}>
                                            <Text style={{ color: countryType == "Others" ? "white" : "black", }}>(+1) U.S</Text>
                                        </TouchableOpacity>

                                    </View>


                                    <TextInput style={styles.textInput}
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        placeholder={strings.Enterphneno}
                                        activeUnderlineColor={colors.GREEN}
                                        value={mobile}
                                        onChangeText={(text) => {
                                            if (text.includes(" ") || text.includes("-") || text.includes(",") || text.includes(".")) {
                                                ShortToast("Invalid Phone Number", "error", "")
                                            }
                                            else setMobile(text)
                                        }}
                                    />

                                    <View style={{ flexDirection: 'row' }}>

                                        <Text style={styles.textUniversal}>{strings.bysignin} </Text>
                                        <TouchableOpacity onPress={() => { openURL() }}>
                                            <Text style={styles.tncText}>{strings.termsandcondition}</Text>
                                        </TouchableOpacity>

                                    </View>

                                    <View style={{ alignItems: 'center' }}>

                                        <TouchableOpacity onPress={() => {
                                            signInPressed()
                                        }}
                                            style={styles.button}>
                                            <Text style={styles.textAgree}>{strings.AgredSignIn}</Text>
                                        </TouchableOpacity>

                                    </View>

                                    <View style={styles.textContainerForAlignment}>

                                        <Text style={styles.textUniversal}>{strings.donthaveanaccount}</Text>
                                        <TouchableOpacity onPress={() => { navigation.navigate('SignupPhone') }}>
                                            <Text style={styles.text2}>{strings.craeteone}</Text>
                                        </TouchableOpacity>

                                    </View>

                                </View>

                                : <View
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
                                            onPress={() => { setCountryType("Others") }}

                                            style={{
                                                backgroundColor: countryType == "Others" ? colors.GREEN : "white",
                                                borderColor: 'gray',
                                                borderWidth: 1,
                                                borderColor: colors.GREEN,
                                                alignItems: "center",
                                                width: W * 0.40,
                                                justifyContent: 'center',
                                                borderRadius: 8,
                                                marginStart: 10
                                            }}>
                                            <Text style={{ color: countryType == "Others" ? "white" : "black", }}>(+1) U.S</Text>
                                        </TouchableOpacity>

                                    </View>

                                    <TextInput style={styles.textInput}
                                        placeholder='Enter E-mail Id'
                                        activeUnderlineColor={colors.GREEN}
                                        value={email}
                                        onChangeText={(text) => { setEmail(text) }}
                                    />


                                    <TextInput style={styles.textInput}
                                        placeholder='Enter Password'
                                        activeUnderlineColor={colors.GREEN}
                                        value={password}
                                        onChangeText={(text) => { setPassword(text) }}
                                    />


                                    <View style={{ flexDirection: 'row' }}>

                                        <Text style={styles.textUniversal}>By signing, I accept the </Text>
                                        <TouchableOpacity onPress={() => { openURL() }}>
                                            <Text style={styles.tncText}>Terms & Conditions</Text>
                                        </TouchableOpacity>

                                    </View>

                                    <View style={{ alignItems: 'center' }}>

                                        <TouchableOpacity onPress={() => {
                                            signInPressedUS()
                                        }}
                                            style={styles.button}>
                                            <Text style={styles.textAgree}>Agree & Sign In</Text>
                                        </TouchableOpacity>

                                    </View>

                                    <View style={styles.textContainerForAlignment}>

                                        <Text style={styles.textUniversal}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => { navigation.navigate('Create Account') }}>
                                            <Text style={styles.text2}>Create Account</Text>
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
        padding: 10,
        paddingLeft: 0,
        color: colors.ORANGE,
        marginVertical: 20
    },
    textUniversal:
    {
        fontSize: fontSizes.LAR,
        padding: 10,
        paddingRight: 0,
        marginVertical: 20
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
        height: 40,
        padding: 1,
        marginTop: H * 0.025
    }
})
export default SigninCorporate;
