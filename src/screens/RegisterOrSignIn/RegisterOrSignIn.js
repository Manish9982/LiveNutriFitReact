import { View, Image, Dimensions, StyleSheet, TouchableOpacity, StatusBar, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, Constants, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import { Text, configureFonts, DefaultTheme, Provider as PaperProvider, ActivityIndicator, Dialog, Portal, Button, TextInput } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient'
import { getDataFromLocalStorage, storeDataAuth } from '../../local storage/LocalStorage';
import Logo from '../Dashboard/Components/Logo';
import Loader from '../../assets/components/Loader'



import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { useIsFocused } from '@react-navigation/native';

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
            fontSize: fontSizes.LAR

        }

    }
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts({ config: fontConfig }),
};

const RegisterOrSignIn = ({ navigation }) => {
    useEffect(() => { getText() }, [])
    const isFocused = useIsFocused()


    useEffect(() => { getLanguge() }, [isFocused])


    //lng
    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            changeLaguagee('en')
        } else {
            changeLaguagee('hi')
        }
    }

    const changeLaguagee = (languageKey) => {
        strings.setLanguage(languageKey)
    }
    const [loader, setLoader] = useState(true)
    const [data, setData] = useState(null)
    const [visible, setVisible] = useState(false);
    const [corporateID, setCorporateID] = useState("")

    const hideDialog = () => setVisible(false);

    const loginWithCorporateId = async () => {

        if (corporateID == "") {
            Alert.alert("Alert", strings.CoporateIDEroor)
        } else {
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('lang')
            formdata.append("id", corporateID);

            var requestOptions = {
                method: 'POST',
                body: formdata,
            };
            try {
                const response = await fetch(`${Constants.BASE_URL}panel/corporate_exist`, requestOptions)
                const result = await response.json()

                console.log("result === ", result)

                if (result.status === 200) {

                    navigation.navigate("SigninCorporate", { "id": corporateID })

                    //setData(result)

                } else {
                    ShortToast(result.message, 'error', '')

                }

                setLoader(false)
            } catch (error) {
                ShortToast(error, 'error', '')
            }
        }
    }

    const getText = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('lang')
        if (temp == "hi") {
            formdata.append("language", "2");
        } else {
            formdata.append("language", "1");

        }

        var requestOptions = {
            method: 'POST',
            body: formdata,
        };
        try {


            const response = await fetch(`${Constants.BASE_URL}panel/textlist`, requestOptions)
            const result = await response.json()
            setData(result)

            console.log("Hindi ", result)


            setLoader(false)
        } catch (error) {
            ShortToast(error, 'error', '')
        }

    }

    return (
        <PaperProvider theme={theme}>
            <StatusBar
                backgroundColor={"white"}
            />
            {loader ?

                <Loader />

                :


                <View style={styles.mainContainer}>

                    <Image source={require('../../assets/icons/pexels-lorilee-e-1309753.jpg')}
                        style={{ height: H, width: W, position: "absolute", opacity: 0.22, }} />


                    <View style={{
                        //position: "absolute",
                        alignSelf: "center",
                        top: -H * 0.15,
                        zIndex: 2,

                    }}>
                        <Logo />
                    </View>

                    <View style={styles.buttonContainer}>

                        {/*<LinearGradient colors={['#9bdf61', '#7fc346']} style={styles.linearGradient}>*/}

                        <TouchableOpacity
                            style={[styles.linearGradient, styles.registerButton, { backgroundColor: colors.GREEN }]}
                            //    onPress={() => { navigation.navigate('Create Account') }}>
                            onPress={() => { navigation.navigate('SignupPhone') }}>

                            <View>

                                <Text style={styles.textRegister}>{data?.data[0]?.text1}</Text>

                            </View>

                        </TouchableOpacity>

                        {/*</LinearGradient>*/}

                        <TouchableOpacity onPress={() => {
                            navigation.navigate("Sign In")

                        }}
                            style={styles.signInButton}>

                            <View>

                                <Text style={styles.textSignIn}>{data?.data[0]?.text2}</Text>

                            </View>

                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={() => { setVisible(true) }}
                            style={[{
                                backgroundColor: colors.GREEN,
                                height: 52,
                                width: W * 0.8,
                                justifyContent: 'center',
                                borderRadius: 8,


                            }, { backgroundColor: colors.BUTTON_ORANGE, marginTop: H * 0.03 }]}>
                            <Text style={{
                                textAlign: 'center',
                                color: 'white',
                                fontSize: fontSizes.LAR,
                                ...fontFamily.bold
                            }}>{strings.AreyouaCorporateUser}</Text>
                        </TouchableOpacity> */}

                    </View>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Text style={{
                                ...fontFamily.bold,
                                alignSelf: "center",
                                marginTop: H * 0.04,
                                marginBottom: H * 0.02
                            }}> {strings.PleaseenteryourCorporateId}</Text>
                            <TextInput
                                maxLength={10}
                                underlineColor={colors.GREEN}
                                onChangeText={(t) => {
                                    if (t.length == 1 && (t == "-" || t == "." || t == ",")) {
                                        ShortToast("Invalid Corporate ID", "error", "")
                                    }
                                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ")) {
                                        ShortToast("Invalid Corporate ID", "error", "")
                                    }
                                    else {
                                        setCorporateID(t)
                                    }
                                }}
                                value={corporateID}
                                activeUnderlineColor={colors.GREEN}
                                style={{
                                    width: "90%",
                                    height: H * 0.09,
                                    alignSelf: "center",
                                    marginBottom: H * 0.015,
                                    backgroundColor: colors.OFFWHITE
                                }}
                                keyboardType="number-pad" />
                            <Dialog.Actions>
                                <Button color={"red"} onPress={() => setVisible(false)}>{strings.Cancel}</Button>
                                <Button color={colors.GREEN} onPress={() => {
                                    loginWithCorporateId()
                                    setVisible(false)
                                }}>{strings.Ok}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                </View>

            }
        </PaperProvider>

    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: colors.OFFWHITE,
        justifyContent: "center"
    },
    imageContainer:
    {
        height: '85%',
        width: '100%',
    },
    registerButton: {

        height: H * 0.08,
        width: W * 0.8,
        alignSelf: "center",
        // backgroundColor: colors.GREEN,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    signInButton:
    {
        height: H * 0.08,
        width: W * 0.8,
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
        marginTop: H * 0.03
    },
    buttonContainer:
    {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: H * 0.15,
    },
    textRegister:
    {
        textAlign: 'center',
        // marginVertical: '11%',
        color: 'white',
        ...fontFamily.bold

    },
    textSignIn:
    {
        justifyContent: 'center',
        textAlign: 'center',
        color: 'black',
        //marginVertical: '11%',
        ...fontFamily.bold

    },
    linearGradient:
    {
        height: H * 0.07,
        width: W * 0.9,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imagesLnf:
    {
        height: H * 0.07,
        width: H * 0.07 * 4.2,
        alignSelf: "center",
        marginBottom: H * 0.1,
        borderRadius: 10,
        opacity: 2,

    }
})

export default RegisterOrSignIn