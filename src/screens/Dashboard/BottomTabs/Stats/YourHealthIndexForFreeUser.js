import { StatusBar, View, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import LinearGradient from 'react-native-linear-gradient'
import LottieView from 'lottie-react-native';
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect"
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'


import { useIsFocused } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'


//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


export default function YourHealthIndexForFreeUser({ navigation, route }) {

    const [loader, setLoader] = useState(true)
    const [userType, setUserType] = useState("")

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };

    useEffect(() => {
        setTimeout(() => {
            setLoader(false)
        }, 2200);
    }, [])

 
    const isFocused = useIsFocused()

    const [visible, setVisible] = useState(false)
    const [code, setCode] = useState("")

    const [duration, setDuration] = useState("3 months")
    useEffect(() => {
        storeDataInLocalStorage('stackValue', "3")
        //  getValues()
    }, [])


    useEffect(() => { getLanguage() }, [isFocused])


    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(lang)
        const userTypeValue = await getDataFromLocalStorage('user_type')
        setUserType(JSON.parse(userTypeValue))


        if ((JSON.parse(userTypeValue) == "3") || (JSON.parse(userTypeValue) == "2")) {
            navigateToQSNANS()
        }

    }



    const navigateToQSNANS = () => {
        navigation.navigate("HealthIndexQuestions")
    }






    console.log(route.params.healthIndex)
    return (
        loader ?
            <View style={styles.mainContainer}>
                <LottieView source={require('../../../../assets/animations/loader.json')}
                    style={{ height: H * 0.2, width: W * 0.2, alignSelf: "center", zIndex: 20, }} autoPlay />
                <Text style={{ ...fontFamily.bold, color: colors.FONT_BLACK }}> Please Wait..</Text>
            </View>
            :








            < View style={styles.mainContainer} >
                <StatusBar backgroundColor={colors.GREEN} />
                <GestureRecognizer
                    onSwipeUp={() => ShortToast(strings.healthindexmsg, 'warning', '')}
                    config={config}
                    style={{
                        backgroundColor: "red",
                    }}
                >

                    <View>
                        <LinearGradient colors={[colors.GREEN, colors.GREEN2, "white", "white"]}
                            style={styles.gradientStyle}>
                            <HeaderForSubmissionScreens Title={strings.HealthIndex} />
                            <Text style={styles.score}>{route.params.healthIndex}</Text>
                            <View style={styles.containerHealthIndex}>
                                <Text style={styles.healthIndex}>{strings.HealthIndex}</Text>
                            </View>


                            <LottieView source={require('../../../../assets/animations/11264-swipe-up-arrows.json')}
                                style={{
                                    height: 200,
                                    width: 200,
                                    alignSelf: "center",
                                    top: H * 0.1
                                }} autoPlay />

                            <Text style={{
                                position: "absolute",
                                alignSelf: "center",
                                top: H * 0.8,
                                ...fontFamily.bold,
                                width: W * 0.85,
                                textAlign: "center"
                            }}>{strings.SwipeUp}</Text>
                        </LinearGradient>
                    </View>
                </GestureRecognizer>
            </View >











    )
}

const styles = StyleSheet.create({
    gradientStyle: {
        height: H,
        width: W,
    },
    mainContainer:
    {
        height: H,
        width: W,
        justifyContent: "center",
        alignItems: "center",
    },
    score:
    {
        textAlign: "center",
        color: "white",
        ...fontFamily.bold,
        fontSize: 100,
        top: H * 0.1
    },
    swipeUp:
    {
        color: colors.FONT_BLACK,
        top: H * 0.45,
        textAlign: "center",
        ...fontFamily.bold,
        fontSize: 16
    },
    healthIndex:
    {
        color: colors.OFFWHITE,
        ...fontFamily.bold,
        fontSize: fontSizes.MED,
        textAlign: "center",

    },
    containerHealthIndex:
    {
        backgroundColor: colors.ORANGE,
        width: W * 0.3,
        alignSelf: "center",
        height: H * 0.055,
        borderRadius: 20,
        top: H * 0.085,
        justifyContent: "center",

    }
})
