import { Dimensions, StyleSheet, TouchableOpacity, View, Image, Linking, StatusBar } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { fontSizes, colors, ShortToast, PostApiData, H, W, fontFamily } from '../../colorSchemes/ColorSchemes'
import { Text, configureFonts, DefaultTheme, Provider as PaperProvider, shadow, ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import DataContext from '../../context/DataContext'
import LinearGradient from 'react-native-linear-gradient'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage';
const fontConfig = {

    android: {
        regular: {
            fontFamily: 'Montserrat-Regular',
            fontWeight: 'normal',
            fontSize: fontSizes.MED,
        }

    }
};





const theme = {
    ...DefaultTheme,
    fonts: configureFonts({config:fontConfig}),
};

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const CreateAccount = ({ navigation }) => {

    const { NsignupType } = useContext(DataContext)
    const [signup_type, setSignup_type] = NsignupType

    const handleSignupWithPhone = () => {
        navigation.navigate('SignupPhone')
        setSignup_type(1)
    }
    const handleSignupWithEmail = () => {
        navigation.navigate('SignupEmail')
        setSignup_type(2)
    }

    const facebookIcon = <Icon name="facebook" size={20} color='#3c5897' />
    const googleIcon = <Image source={require('../../assets/icons/google.png')} style={{ height: 16.5, width: 16.5 }} />
    const phoneIcon = <Icon name="phone" size={20} color='#389333' />
    const emailIcon = <Icon name="email" size={20} color='#fbb30a' />


    const openURL = async () => {
        { Linking.openURL('https://www.livenutrifit.com/term-and-condition') }
    }

    useEffect(() => { getText() }, [])
    const [data, setData] = useState(null)
    const [loader, setLoader] = useState(true)
    const getText = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('lang')
        formdata.append("language", temp);

        const result = await PostApiData('textlist', formdata)
        setData(result)
        setLoader(false)

    }
    return (
        loader ?
            <>
                <View
                    style={{
                        height: H,
                        width: W,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <ActivityIndicator size={"large"}
                        color={colors.GREEN}
                    />
                </View>
            </>
            :
            <>
                <KeyboardAwareScrollView>
                    <PaperProvider theme={theme}>


                        <View style={styles.mainContainer}>

                            <LinearGradient colors={[colors.GREEN, colors.GREEN]} style={styles.linearGradient}>

                                <View style={styles.upperContainer}>
                                    <TouchableOpacity onPress={() => { navigation.navigate('Sign In') }}>
                                        <Text style={styles.text1}>{data?.data[0]?.text3}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.text2}>Let's Start!</Text>


                                </View>

                            </LinearGradient>

                            <View style={styles.lowerContainer}>
                                <StatusBar

                                    backgroundColor={colors.GREEN}
                                />

                                <Text style={styles.text4}>{data?.data[0]?.text6}</Text>

                                <View style={{ marginVertical: HEIGHT * 0.045 }}>

                                    <Text style={styles.text5}>{data?.data[0]?.text7}</Text>


                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.text5}>LiveNutriFit</Text>
                                        <TouchableOpacity
                                            onPress={() => { openURL() }}>
                                            <Text style={{ color: colors.GREEN, fontSize: fontSizes.LAR }}> {data?.data[0]?.text8}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                                {/* <TouchableOpacity style={styles.socialBar}>

                            <View style={styles.iconMargin}>
                                {googleIcon}
                            </View>

                            <View>
                                <Text style={styles.signupText}>Sign Up with Google</Text>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialBar}>


                            <View style={styles.iconMargin}>
                                {facebookIcon}
                            </View>

                            <View>
                                <Text style={styles.signupText}>Sign Up with Facebook</Text>
                            </View>

    </TouchableOpacity>*/}

                                <TouchableOpacity onPress={() => handleSignupWithPhone()}
                                    style={styles.socialBar}>

                                    <View style={styles.iconMargin}>
                                        {phoneIcon}
                                    </View>

                                    <View>
                                        <Text style={styles.signupText}>{data?.data[0]?.text9}</Text>
                                    </View>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleSignupWithEmail()}
                                    style={styles.socialBar}>

                                    <View style={styles.iconMargin}>
                                        {emailIcon}
                                    </View>

                                    <View>
                                        <Text style={styles.signupText}>{data?.data[0]?.text10}</Text>
                                    </View>

                                </TouchableOpacity>

                            </View>

                        </View>


                    </PaperProvider>
                </KeyboardAwareScrollView>
            </>

    )
}



const styles = StyleSheet.create({
    mainContainer:
    {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
    },
    upperContainer:
    {

        padding: 25,
        height: '50%'
    },
    linearGradient:
    {
        height: '50%'
    },
    lowerContainer:
    {
        position: 'absolute',
        top: '25%',
        width: '100%',
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white'
    },
    textTnC:
    {
        color: colors.GREEN,
        margin: '3%',
    },
    signupText:
    {
        fontFamily: 'Montserrat-Regular',
        fontSize: fontSizes.LAR,
        color: 'black',
        fontFamily: 'Montserrat-Regular'
    },
    text1:
    {
        color: 'white',
        textAlign: 'right',
        fontFamily: 'Montserrat-Regular',
        fontSize: fontSizes.LAR
    },
    text2:
    {
        paddingTop: HEIGHT * 0.04,
        color: 'white',
        fontSize: fontSizes.greeting,
        fontFamily: fontFamily.bold
    },
    text3:
    {
        color: 'white',
        fontSize: fontSizes.LAR
    },
    text4:
    {
        marginTop: '3%',
        fontSize: fontSizes.XXXL,
        fontFamily: 'Montserrat-Regular',
    },
    text5:
    {
        fontSize: fontSizes.LAR
    },
    socialBar:
    {
        flexDirection: 'row',
        height: H * 0.08,
        alignContent: 'center',
        alignItems: 'center',
        elevation: 2,
        borderRadius: 10,
        backgroundColor: 'white',
        marginVertical: '4%',


    },
    iconMargin: {
        marginHorizontal: 30
    },

})
export default CreateAccount
