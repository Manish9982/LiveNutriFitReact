import { StyleSheet, TouchableOpacity, View, Dimensions, Linking, ActivityIndicator, StatusBar } from 'react-native'
import { TextInput, Text, configureFonts, DefaultTheme, Provider as PaperProvider, Checkbox } from 'react-native-paper';
import { fontSizes, colors, ShortToast, H, fontFamily, Constants } from '../../colorSchemes/ColorSchemes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React, { useState, useEffect } from 'react'
import { storeDataInLocalStorage } from '../../local storage/LocalStorage';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../assets/components/Loader';
import { useIsFocused } from '@react-navigation/native';
import { getDataFromLocalStorage } from '../../local storage/LocalStorage';
import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { useLocales } from '../../utils/LocalizationUtil';
import moment from 'moment-timezone';

const fontConfig = {
    fontFamily: "Montserrat-Regular",
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
    const [langText, setTangText] = useState("")
    const [countryType, setCountryType] = useState("India")
    const [isChecked, setChecked] = useState(false);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true)
    const [secureTextEntry2, setSecureTextEntry2] = useState(true)

    const isFocused = useIsFocused()
    const strings = useLocales()
    const currentTimezone = moment.tz.guess();

    useEffect(() => { getLanguage() }, [isFocused])

    const handleCheckBoxToggle = () => {
        setChecked(prev => !prev);
    };
    //lng
    const getLanguage = async () => {
        setLoaderNeeded(true)
        const lang = await getDataFromLocalStorage("lang")

        if (lang == "en") {
            changeLanguage('en')
            setTangText("1")

        } else {
            setTangText("2")
            changeLanguage('hi')
        }
        setLoaderNeeded(false)
    }

    const changeLanguage = (languageKey) => {

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
        { Linking.openURL(`${Constants.BASE_URL}terms-conditions-2/`) }
    }
    const openURL2 = async () => {
        { Linking.openURL(`${Constants.BASE_URL}hippa-notice/`) }
    }

    const signUpPressed = async () => {

        storeDataInLocalStorage('country', countryType)

        if (isChecked) {
            setLoaderNeeded(true)

            if (!testName(userName)) {
                ShortToast(strings.NameError, 'error', '')


            } else if (!testNumber(mobile)) {
                ShortToast(strings.MobileError, 'error', '')

            } else if (!testEmail(email)) {
                ShortToast(strings.EmailError, 'error', '')

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
                formdata.append("timezone", currentTimezone)

                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                };
                try {
                    const response = await fetch(`${Constants.BASE_URL}panel/Signup`, requestOptions)
                    const result = await response.json()
                    console.log("Signup Result====>>>>>   ", result)
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

        } else {
            ShortToast("Please accept terms and condtions !", "error")
        }
        setLoaderNeeded(false)
    }

    console.log('name and number---->', testName(userName), testNumber(mobile))
    const navigate = (result) => {
        // ShortToast(JSON.stringify(result.otp), 'warning', '')                                               // Navigation Function
        storeDataInLocalStorage('user_id', JSON.stringify(result.user_id))
        navigation.navigate("VerifyOTPAfterRegistrationEmail", { "email": email, "username": userName, "mobile": mobile })
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
                    paddingBottom: H * 0.2
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
                                        <Text style={{ textAlign: "center", color: countryType == "India" ? "white" : "black", }}>(+91) {strings.India} <AntDesign name="check" color="white" size={16} /></Text>
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
                                        <Text style={{ color: countryType == "other" ? "white" : "black", }}>(+1) {strings.US}<AntDesign name="check" color="white" size={16} /></Text>
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
                                    autoCapitalize='none'
                                    placeholder={strings.EnterEmailAddress}
                                    activeUnderlineColor={colors.GREEN}
                                    value={email}
                                    onChangeText={(text) => { setEmail(text) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    activeOutlineColor={colors.GREEN}
                                />

                                <TextInput style={styles.textInput}
                                    placeholder={strings.EnterPassword}
                                    activeUnderlineColor={colors.GREEN}
                                    //activeUnderlineColor={"red"}
                                    value={password}
                                    onChangeText={(text) => { setPassword(text) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    activeOutlineColor={colors.GREEN}
                                    secureTextEntry={secureTextEntry1}
                                    right={<TextInput.Icon icon="eye" onPress={() => setSecureTextEntry1(prev => !prev)} color={secureTextEntry1 ? null : colors.GREEN} />}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={strings.ConfirmPassword}
                                    activeUnderlineColor={colors.GREEN}
                                    value={confirmpassword}
                                    onChangeText={(text) => { setConfirmPassword(text) }}
                                    mode='outlined'
                                    outlineColor='#ebebeb'
                                    secureTextEntry={secureTextEntry2}
                                    right={<TextInput.Icon icon="eye" onPress={() => setSecureTextEntry2(prev => !prev)} color={secureTextEntry2 ? null : colors.GREEN} />}
                                    activeOutlineColor={colors.GREEN}
                                />

                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    marginVertical: HEIGHT * 0.04,
                                    alignItems: 'center'
                                }}>
                                    <Checkbox.Android style={{
                                    }}
                                        onPress={handleCheckBoxToggle}
                                        status={isChecked ? 'checked' : 'unchecked'}
                                        color={colors.GREEN} />
                                    <Text style={{}}>{strings.bysignin}</Text>
                                    <TouchableOpacity onPress={() => { openURL() }}>
                                        <Text style={{ color: colors.BUTTON_ORANGE }}> {strings.termsandcondition} </Text>
                                    </TouchableOpacity>
                                    <Text style={{}}>{strings.and} </Text>
                                    <TouchableOpacity onPress={() => { openURL2() }}>
                                        <Text style={{ color: colors.BUTTON_ORANGE }}>{strings.privacypolicy}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{}}> {strings.includingusage}</Text>
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
        marginTop: 10,

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
        fontFamily: 'Montserrat-Regular',
    },
    textUniversal:
    {
        fontSize: fontSizes.LAR,
        //padding: 10,
        marginTop: 10,
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
        padding: HEIGHT * 0.01,
        fontFamily: 'Montserrat-Regular',
        marginTop: HEIGHT * 0.02,
        ...fontFamily.bold,

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
        ...fontFamily.bold,

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
