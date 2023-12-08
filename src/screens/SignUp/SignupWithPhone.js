import { StyleSheet, TouchableOpacity, View, Dimensions, Linking, ActivityIndicator, StatusBar } from 'react-native'
import { TextInput, Text, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { fontSizes, colors, ShortToast, H, fontFamily } from '../../colorSchemes/ColorSchemes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React, { useState,useEffect } from 'react'
import { storeDataInLocalStorage } from '../../local storage/LocalStorage';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../assets/components/Loader';

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


const fontConfig = {
            fontFamily:  "Montserrat-Regular",
            fontWeight: 'normal',
            fontSize: fontSizes.LAR,
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts({ config: fontConfig }),
};
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const SignupWithPhone = ({ navigation }) => {

    const [mobile, setMobile] = useState('')
    const [confirmmobile, setConfirmMobile] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [confirmemail, setConfirmEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    //const [userType, setUserType] = useState(second)
    const [dataFromApi, setDataFromApi] = useState({})
    const [loader, setLoaderNeeded] = useState(false)
    const  [langText, setTangText] = useState("")
    const [countryType, setCountryType] = useState("India")

    const isFocused = useIsFocused()

    useEffect(() => { getLanguge() }, [isFocused])


  //lng
  const getLanguge = async () => {
    setLoaderNeeded(true)
    const lang = await getDataFromLocalStorage("lang")

    if (lang == "en") {
      changeLaguagee('en')
      setTangText("1")

    } else {
        setTangText("2")
      changeLaguagee('hi')
    }

    setLoaderNeeded(false)

  }

  const changeLaguagee = (languageKey) => {
    strings.setLanguage(languageKey)
  }





    const testEmail = (text) => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regex.test(text)
    }
    const testName = (text) => {
        const regex = /^[a-zA-Z ]+$/
        return regex.test(text)
    }
    const testNumber = (num) => {
        const regex2 = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        return regex2.test(num)
    }

 
    const openURL = async () => {
        { Linking.openURL('https://livenutrifit.com/terms-conditions-2/') }
    }
    const openURL2 = async () => {
        { Linking.openURL('https://livenutrifit.com/hippa-notice/') }
    }

    const signUpPressed = async () => {

        storeDataInLocalStorage('country',countryType)


        setLoaderNeeded(true)

        if (!testName(userName)) {
            ShortToast(strings.NameError, 'error', '')


        } else if (!testNumber(mobile)) {
            ShortToast(strings.MobileError, 'error', '')


        } else if (mobile !== confirmmobile) {
            ShortToast(strings.ConfirmMobileError, 'error', '')


        } else if (!testEmail(email)) {
            ShortToast(strings.EmailError, 'error', '')


        } else if (email !== confirmemail) {
            ShortToast(strings.ConfirmEmailError, 'error', '')
        }

        else if (password.length == 0) {
            ShortToast(strings.PasswordError, 'error', '')

        }
        else if (confirmpassword.length == 0) {
            ShortToast(strings.RePasswordError, 'error', '')

        }

        else if (password !== confirmpassword) {
            ShortToast(strings.ConfirmError, 'error', '')

        }

        else {
            var formdata = new FormData();
            formdata.append("user_name", userName);
            formdata.append("mobile", mobile);
            formdata.append("user_type", "1");
            formdata.append("email", email);
            formdata.append("password", password);
            formdata.append("confirm_password", confirmpassword);

            formdata.append("language", langText);


            var requestOptions = {
                method: 'POST',
                body: formdata,
            };
            try {
                const response = await fetch("https://livenutrifit.com/panel/Signup", requestOptions)
                const result = await response.json()
                console.log(result)
                setDataFromApi(result)
                {
                    if (result.status === 200) {
                        navigate(result)
                    }
                    else if (result.message == "Already registered!") {
                        ShortToast("Already Regisetred ! Please Sign In", 'warning', '')
                        navigation.navigate("Sign In")
                    }
                    else ShortToast(result.message, 'error')

                }
            } catch (error) {
                ShortToast(error, 'error')
            }
            //Navigation

        }



        setLoaderNeeded(false)



    }

    console.log('name and number---->', testName(userName), testNumber(mobile))
    const navigate = (result) => {
       // ShortToast(JSON.stringify(result.otp), 'warning', '')                                               // Navigation Function
        storeDataInLocalStorage('user_id', JSON.stringify(result.user_id))
        navigation.navigate("VerifyOTPAfterRegistrationEmail", { "email": email, "username": userName, })
        /////////////////////////////////////////////////////////////////////////////////////////////
        console.log('result for signUp--->', result)
        //////////////////////////////////////////////////////////////////////////////////////////////
    }
    return (

        loader
            ?
            <>
                <Loader />
                
            </>
            :

            <KeyboardAwareScrollView>

                <ScrollView contentContainerStyle={{
                    paddingBottom: H * 0.8
                }}>
                    <PaperProvider theme={theme}>


                        <View style={styles.mainContainer}>
                            <StatusBar

                                backgroundColor={colors.GREEN}
                            />

                            <View style={styles.upperContainer}>

                                <Text style={styles.greeting}>{strings.Hey}</Text>
                                <Text style={styles.welcomeText}>{strings.Gladtomeetyou}</Text>

                            </View>

                            <View style={styles.lowerContainer}>

                                <Text style={styles.text}>{strings.Createyouraccount}</Text>
                                <View style={{
                                        flexDirection: "row",
                                        marginHorizontal: HEIGHT * 0.02,
                                        marginTop: 5,
                                        height: HEIGHT * 0.05,
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => { setCountryType("India") }}
                                            style={{
                                                backgroundColor: countryType == "India" ? colors.GREEN : "white",
                                                borderColor: colors.GREEN,
                                                alignItems: 'center',
                                                width: WIDTH * 0.41,
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
                                                width: WIDTH * 0.40,
                                                justifyContent: 'center',
                                                borderRadius: 8,
                                                marginStart: 10
                                            }}>
                                            <Text style={{ color: countryType == "other" ? "white" : "black", }}>(+1) U.S</Text>
                                        </TouchableOpacity>

                                    </View>


                                <Text style={styles.text3}>{strings.Pleaseenteryourdetailstouseourapp}</Text>


                                <TextInput style={styles.textInput}
                                    placeholder={strings.Pleaseenteryourname}
                                    activeUnderlineColor={colors.GREEN}
                                    value={userName}
                                    onChangeText={(text) => { setUserName(text) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    activeOutlineColor={colors.GREEN}
                                />

                                <TextInput style={styles.textInput}
                                    placeholder={strings.EnterMobileNumber}
                                    value={mobile}
                                    onChangeText={(number) => { setMobile(number) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    activeOutlineColor={colors.GREEN}
                                    keyboardType='numeric'
                                    maxLength={10}
                                />
                                <TextInput style={styles.textInput}
                                    placeholder={strings.ConfirmMobileNumber}
                                    value={confirmmobile}
                                    onChangeText={(confirmnumber) => { setConfirmMobile(confirmnumber) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    activeOutlineColor={colors.GREEN}
                                    keyboardType='numeric'
                                    maxLength={10}
                                />
                                <TextInput style={styles.textInput}
                                    placeholder={strings.EnterEmailAddress}

                                    activeUnderlineColor={colors.GREEN}
                                    value={email}
                                    onChangeText={(text) => { setEmail(text) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    activeOutlineColor={colors.GREEN}
                                />
                                <TextInput style={styles.textInput}
                                    placeholder={strings.ConfirmEnterEmailAddress}

                                    activeUnderlineColor={colors.GREEN}
                                    value={confirmemail}
                                    onChangeText={(confirmtext) => { setConfirmEmail(confirmtext) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    activeOutlineColor={colors.GREEN}
                                />
                                <TextInput style={styles.textInput}
                                    placeholder={strings.EnterPassword}
                                    activeUnderlineColor={colors.GREEN}
                                    value={password}
                                    onChangeText={(text) => { setPassword(text) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    secureTextEntry={true}
                                    activeOutlineColor={colors.GREEN}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={strings.ConfirmPassword}
                                    activeUnderlineColor={colors.GREEN}
                                    value={confirmpassword}
                                    onChangeText={(text) => { setConfirmPassword(text) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    secureTextEntry={true}

                                    activeOutlineColor={colors.GREEN}
                                />

                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap', marginLeft: WIDTH * 0.035, marginVertical: HEIGHT * 0.04
                                }}>

                                    <Text style={styles.textUniversal}>{strings.bysignin}</Text>
                                    <TouchableOpacity onPress={() => { openURL() }}>
                                        <Text style={styles.tncText}>{strings.termsandcondition} </Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: fontSizes.LAR, fontFamily: 'Montserrat-Regular' }}>{strings.and} </Text>
                                    <TouchableOpacity onPress={() => { openURL2() }}>
                                        <Text style={styles.tncText2}>{strings.privacypolicy} </Text></TouchableOpacity>
                                    {/* <Text style={[styles.tncText2, { color: 'black' }]}>, including </Text>
                                    <Text style={[styles.tncText2, { color: 'black' }]}>usage</Text>
                                    <Text style={[styles.tncText2, { color: 'black' }]}> of</Text> */}
                                    <Text style={[styles.tncText2, { color: 'black', marginTop: 0 }]}> {strings.includingusage}</Text>
                                </View>

                                <View style={{ alignItems: 'center' }}>

                                    <TouchableOpacity onPress={() => { signUpPressed() }}
                                        style={styles.button}>
                                        <Text style={styles.textAgree}>{strings.AgreeSignUp}</Text>
                                    </TouchableOpacity>


                                </View>

                            </View>
                        </View>


                    </PaperProvider>
                </ScrollView>

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
        fontSize: fontSizes.LAR,
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
        //marginBottom: HEIGHT * 0.02,
        fontSize: fontSizes.LAR,
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
        fontFamily: fontFamily.bold
    },
    greeting:
    {
        color: 'white',
        fontSize: fontSizes.greeting,
        padding: HEIGHT * 0.01,
        fontFamily: 'Montserrat-Regular',
        marginTop: HEIGHT * 0.02,
        fontFamily: fontFamily.bold,

    },
    welcomeText:
    {
        color: 'white',
        paddingTop: 0,
        paddingLeft: 10,
        fontSize: fontSizes.LAR

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
        fontSize: fontSizes.LAR,
        fontFamily: fontFamily.bold,

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
export default SignupWithPhone;
