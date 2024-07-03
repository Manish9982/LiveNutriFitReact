import { StyleSheet, TouchableOpacity, View, Dimensions, Linking, ToastAndroid, StatusBar, Modal, TouchableWithoutFeedback, Image, } from 'react-native'
import { TextInput, Text, configureFonts, DefaultTheme, Provider as PaperProvider, ActivityIndicator, Checkbox } from 'react-native-paper';
import { fontSizes, colors, H, W, ShortToast, fontFamily, Constants, GetApiData } from '../../colorSchemes/ColorSchemes'
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
import { useLocales } from '../../utils/LocalizationUtil';
import { FlatList } from 'react-native-gesture-handler';

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

    const strings = useLocales()
    useEffect(() => { getLanguage() }, [isFocused])
    useEffect(() => { getCountryList() }, [isFocused])
    const { Nmobile, Notp, Nlanguage } = useContext(DataContext)
    const [mobile, setMobile] = Nmobile
    const [language, setLanguage] = Nlanguage
    const [otp, setOtp] = Notp
    const [loader, setLoader] = useState(false)
    const [userType, setUserType] = useState(null)
    const [country, setCountry] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isChecked, setChecked] = useState(false);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true)
    const [countries, setCountries] = useState(null)
    const [visibleCountryList, setVisibleCountryList] = useState(false)
    //lng
    const getLanguage = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(language)
        setLoader(false)
    }

    const getCountryList = async () => {
        const result = await GetApiData('get_countrycode')
        if (result?.status == '200') {
            setCountries(result)
        }
    }

    const handleCheckBoxToggle = () => {
        setChecked(prev => !prev);
    };

    const openURL = async () => {
        Linking.openURL(`${Constants.BASE_URL}terms-conditions-2/`)
    }

    const signInPressed = async () => {
        if (isChecked) {
            setLoader(true)
            if (mobile.length === 0 || country == '') {
                ShortToast('Kindly fill in your details!', 'error', '')
                setLoader(false)
            }
            else if (mobile.includes('@')) {
                setUserType('2')
                var formdata = new FormData();
                formdata.append("email", mobile);
                formdata.append("country", country?.country?.toLowerCase());
                formdata.append("code", country?.code);
                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                };
                try {
                    console.log('login formdata ==>', formdata)
                    const response = await fetch(`${Constants.BASE_URL}panel/Signup/login`, requestOptions)
                    const result = await response.json()
                    console.log(result)
                    if (result?.status === 200) {

                        ShortToast(result?.message, 'success', '')
                        // ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
                        //setOtp(result?.otp)
                        setTimeout(() => {
                            storeDataInLocalStorage('registerStatus', result?.register_status)
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
                formdata.append("country", country?.country?.toLowerCase());
                formdata.append("code", country?.code);
                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                };
                try {
                    console.log('login formdata ==>', formdata)
                    const response = await fetch(`${Constants.BASE_URL}panel/Signup/login`, requestOptions)
                    const result = await response.json()
                    console.log(result)
                    if (result?.status === 200) {
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

    const navigate = (result) => {
        //  ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
        //setOtp(result?.otp)
        storeDataInLocalStorage('registerStatus', result?.register_status)
        storeDataInLocalStorage('mobile_formatted', result?.mobile)
        //setLoader(false)
        navigation.replace("VerifyOTPAfterSignInPhone", { "mob": mobile })
    }

    const navigateUS = (result) => {
        // ShortToast(`OTP : ${JSON.stringify(result?.otp)}`, 'warning', '')
        //setOtp(result?.otp)
        storeDataInLocalStorage('mobile_formatted', result?.mobile)
        storeDataInLocalStorage('registerStatus', result?.register_status)
        //setLoader(false)
        navigation.replace("VerifyOTPAfterSignInEmail", { "email": email })
    }

    const renderCountries = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setCountry(item)
                    setVisibleCountryList(false)
                }}
                style={styles.countryButton}>
                <View style={styles.secondContainer}>
                    <Image
                        style={styles.flagImage}
                        source={{ uri: item?.icon }} />
                    <Text>{item?.country}</Text>
                </View>
                <Text>{item?.code}</Text>
            </TouchableOpacity>
        )
    }

    const onPressChooseCountry = () => {
        setVisibleCountryList(true)
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
                    <Modal
                        transparent
                        visible={visibleCountryList}>
                        <TouchableWithoutFeedback onPress={() => setVisibleCountryList(false)}>
                            <View style={styles.modalOverlay}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.list}>
                                        <Text style={[styles.text3, { padding: 0 }]}>Choose Country :</Text>
                                        <FlatList
                                            contentContainerStyle={{ padding: 15 }}
                                            data={countries?.countries}
                                            renderItem={renderCountries}
                                            keyExtractor={(item, index) => `${index}`}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
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
                            <View
                                style={{
                                }}>
                                <TouchableOpacity
                                    onPress={onPressChooseCountry}
                                    style={styles.inputContainer}>
                                    {
                                        country == ''
                                            ?
                                            <Text style={styles.textInputTextCustom}>Choose Country</Text>
                                            :
                                            <Text style={{}}>({country?.code}) {country?.country}</Text>
                                    }
                                </TouchableOpacity>
                                <TextInput style={styles.textInput}
                                    mode='outlined'
                                    autoCapitalize='none'
                                    placeholder={strings.EnterEmailIdPhoneNumber}
                                    activeUnderlineColor={colors.GREEN}
                                    value={mobile}
                                    outlineColor='#ccc'
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
                                        <Text style={[styles.tncText,]}> {strings.termsandcondition}</Text>
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
        //height: 40,
        marginTop: H * 0.03,
        //padding: 1,
    },
    inputContainer:
    {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 14,
        width: '100%', // Adjust width as needed,
        height: 56,
        justifyContent: 'center',
    },
    textInputTextCustom:
    {
        color: '#534f58'
    },
    list: {
        backgroundColor: '#fff',
        width: 300,
        alignSelf: 'center',
        padding: 15,
        borderRadius: 8,
        maxHeight: '65%',
    },
    modalOverlay:
    {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center'
    },
    countryButton:
    {
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flagImage:
    {
        height: 20,
        width: 30,
        borderRadius: 4,
        marginRight: 8
    },
    secondContainer:
    {
        flexDirection: 'row',
    }
})
export default Signin;
