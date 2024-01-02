import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { configureFonts, DefaultTheme, TextInput, Provider as PaperProvider, Appbar } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import Loader from '../../assets/components/Loader'






import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'


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

const ForgetPassword = ({ navigation, route }) => {
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loader, setLoader] = useState("")
    useEffect(() => { getLanguge() }, [])


    const testEmail = (text) => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regex.test(text)
    }


    const getLanguge = async () => {
        // setLoader(true)
        setEmail(route?.params?.email)
        const lang = await getDataFromLocalStorage("lang")

        strings.setLanguage(lang)

        setLoader(false)

    }




    const forgetPassword = async () => {
        setLoader(true)

        if (!testEmail(email)) {
            ShortToast('Invalid Email Address!', 'error', '')
        } else {
            var formdata = new FormData();
            formdata.append("email", email);
            // formdata.append("password", password)
            // formdata.append("confirm_password", confirmpassword)

            const result = await PostApiData("forgotpassword_api", formdata)
            console.log("result= ", result)

            if (result.status == "200") {
                ShortToast(result.message, 'success', '')

            } else {
                ShortToast(result.message, 'error', '')

            }


        }



        setLoader(false)
    }





    return (

        loader
            ?
            <>
                <Loader />
            </>
            :



            <KeyboardAwareScrollView>

                <StatusBar backgroundColor={colors.GREEN} />
                <Appbar.Header style={{
                    backgroundColor: colors.GREEN,
                    width: W
                }}>
                    <Appbar.BackAction color={colors.GREEN}
                        style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />


                    <Appbar.Content style={{
                        alignItems: "center",
                        marginRight: W * 0.125
                    }}
                        title={<Text style={{
                            color: "white",
                            fontSize: fontSizes.XL,
                            ...fontFamily.bold
                        }}></Text>} />
                </Appbar.Header>

                <PaperProvider theme={theme}>
                    <View style={styles.mainContainer}>
                        <StatusBar backgroundColor={colors.GREEN} />

                        <LinearGradient
                            colors={[colors.GREEN, colors.GREEN3, colors.GREEN3]}
                            style={styles.upperContainer}>

                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.greeting}>{strings.forgetpassword}</Text>
                                <Text style={styles.welcomeText}>{strings.forgetmailmsg}</Text>
                            </View>
                        </LinearGradient>

                        <View style={styles.lowerContainer}>

                            {/* <Text style={styles.text}>Sign In</Text>
                            <Text style={styles.text3}>Please enter your credentials to continue</Text>
 */}







                            <View
                                style={{
                                }}>



                                <View>
                                    <TextInput style={{
                                        backgroundColor: 'white',
                                        fontSize: fontSizes.LAR,
                                        height: 40,
                                        marginTop: H * 0.03,
                                        padding: 1
                                    }}

                                        placeholder={strings.EnterEmailAddress}
                                        activeUnderlineColor={colors.GREEN}
                                        value={email}
                                        onChangeText={(text) => { setEmail(text) }} />

                                </View>

                                <View style={{ marginTop: H * 0.05, alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                        forgetPassword()
                                    }}
                                        style={styles.button}>
                                        <Text style={styles.textAgree}>{strings.Submit}</Text>
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
        top: 155,
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
        color: 'black',
        fontSize: fontSizes.greeting,
        padding: 10,
        marginTop: H * 0.02,
        fontFamily: 'Montserrat-Medium',

    },
    welcomeText:
    {
        color: 'black',
        paddingTop: 0,
        // paddingLeft: 10,
        fontSize: fontSizes.XL,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        margin: 10


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
        marginTop: H * 0.03,
        padding: 1,
    }
})

export default ForgetPassword