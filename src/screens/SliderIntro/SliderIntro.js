import { StyleSheet, View, Image, StatusBar, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text } from 'react-native-paper'
import AppIntroSlider from 'react-native-app-intro-slider';
import { H, W, colors, fontSizes, fontFamily } from '../../colorSchemes/ColorSchemes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, withDelay } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import Logo from '../Dashboard/Components/Logo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';




import { useIsFocused } from '@react-navigation/native';
import { getDataFromLocalStorage } from '../../local storage/LocalStorage';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import Loader from '../../assets/components/Loader';

//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});



const SliderIntro = ({ navigation }) => {
     const [loader, setLoader] = useState(false)

    const progress = useSharedValue(0)
    const scale = useSharedValue(0)
    const scale2 = useSharedValue(0)
    const scale3 = useSharedValue(0)

    const isFocused = useIsFocused()


    useEffect(() => { getLanguge() }, [isFocused])


  //lng
  const getLanguge = async () => {
    setLoader(true)
    const lang = await getDataFromLocalStorage("lang")

    if (lang == "en") {
      changeLaguagee('en')
    } else {
      changeLaguagee('hi')

    }

    setLoader(false)

  }


  const changeLaguagee = (languageKey) => {
    strings.setLanguage(languageKey)
  }


    const reanimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
        }
    }, [])
    const reanimatedStyle2 = useAnimatedStyle(() => {
        return {
            transform: [{ scaleX: scale.value }],
        }
    }, [])
    const reanimatedStyle3 = useAnimatedStyle(() => {
        return {
            transform: [{ scaleX: scale2.value }],
        }
    }, [])
    const reanimatedStyle4 = useAnimatedStyle(() => {
        return {
            transform: [{ scaleX: scale3.value }]
        }
    }, [])

    const slides = [
        {
            key: 1,
            title: 'Title 1',
            text: strings.YourWellnessWithOurFunctionalHealthPillars,
            image: require('../../assets/icons/LNF.png'),
            backgroundColor: '#59b2ab',
        },
        {
            key: 2,
            title: 'Title 2',
            text: '',
            text2: strings.YourWellnessWithOurFunctionalHealthPillars,
            image: require('../../assets/animations/13.11.38.mp4.lottie.json'),
            backgroundColor: '#febe29',
        },
        {
            key: 3,
            title: 'Title 3',
            text: '',
            text2: strings.YourWellnessWithOurFunctionalHealthPillars,
            image: require('../../assets/icons/LNF.png'),
            backgroundColor: '#febe29',
        },

    ];

    const startAnimation = () => {
        progress.value = withDelay(600, withSpring(1))
        scale.value = withDelay(200, withSpring(1))
        scale2.value = withDelay(400, withSpring(1))
        scale3.value = withDelay(600, withSpring(1))

    }
    const returnStyle = (num) => {
        if (num == 0) {
            return styles.image
        }
        else if (num == 1) {
            return styles.image3
        }
        else if (num == 2) {

            return styles.image2
        }
    }

    const renderItem = ({ item, index }) => {

        return (
            <View style={styles.slide}>
                <LinearGradient colors={(index == 0) || (index == 2) ? [colors.GREEN, "white", "white"] : ["white", "white"]}
                    style={styles.slide}>

                    {index == 1 ?
                        <>
                            {/*<Image source={require('../../assets/icons/LNF.png')}
                                style={{
                                    height: H * 0.07,
                                    width: H * 0.07 * 4,
                                    position: "absolute",
                                    alignSelf: "center",
                                    top: H * 0.11,
                                    zIndex: 2
                                }} />*/}
                            <View style={{
                                position: "absolute",
                                alignSelf: "center",
                                top: H * 0.06
                            }}>
                                <Logo />
                            </View>
                            <LottieView style={returnStyle(index)}
                                source={item.image}
                                autoPlay loop />
                        </>
                        :
                        <>

                        </>
                    }

                    {index == 0 ?
                        <>
                            <View style={{
                                position: "absolute",
                                alignSelf: "center",
                                top: H * 0.09
                            }}>
                                <Logo />
                            </View>
                            <View style={[styles.containerTasks, { top: H * 0.50 }]}>
                                <Image source={require('../../assets/icons/personalisednutritionplansite.png')}
                                    style={styles.smallImage} />
                                <Text style={styles.textOfPros}>{strings.DigitalMateToResetYourHabits}</Text>
                            </View>
                            <View style={[styles.containerTasks, { top: H * 0.60 }]}>
                                <Image source={require('../../assets/icons/fittnessplansite.png')}
                                    style={styles.smallImage} />
                                <Text style={styles.textOfPros}>{strings.PatientCenteredCare}</Text>
                            </View>
                            <View style={[styles.containerTasks, { top: H * 0.70 }]}>
                                <Image source={require('../../assets/icons/realtimetracking.png')}
                                    style={styles.smallImage} />
                                <Text style={styles.textOfPros}>{strings.TrackYourHealthMetricsRealtime}</Text>
                            </View>
                            <View style={[styles.containerTasks, { top: H * 0.80 }]}>
                                <Image source={require('../../assets/icons/coachsite.png')}
                                    style={styles.smallImage} />
                                <Text style={styles.textOfPros}>{strings.SetShareGoalWithYourPersonalCoaches}</Text>
                            </View>
                        </>

                        : null}
                    <Text style={index == 2 ? styles.text2 : styles.text}>{item.text}</Text>
                    {index == 2 ?
                        <View>
                            <View style={{
                                position: "absolute",
                                alignSelf: "center",
                                top: H * 0.14,
                                zIndex: 2,
                            }}>
                                <Logo />
                            </View>
                            <Animated.View style={reanimatedStyle}>
                                <LottieView style={styles.aniImage}
                                    source={require('../../assets/animations/74389-weight-loss-progress.json')}
                                    autoPlay loop />
                            </Animated.View>
                            <Text style={[styles.mantraSubheading, { marginTop: H * 0.05,
                                 paddingTop: H * 0.02 }]}>{strings.GetNotified}</Text>
                            <Text style={[[styles.mantraSubheading,
                            {
                                // color: "silver",
                                fontSize: fontSizes.XL,
                                marginTop: H * 0.03,

                            }]]}>{strings.Getnotificationsonyourphoneforanyalertsoractivities}</Text>

                        </View>
                        : null}
                    {index == 1 ?
                        <>
                           
                            <Text style={{
                                fontFamily: fontFamily.bold,
                                color: colors.FONT_BLACK,
                                //textAlign: "center",
                                width: W * 0.7,
                                marginTop: H * 0.1,
                                //alignSelf: "center",
                                fontSize: fontSizes.XL,
                                lineHeight: H * 0.03,
                                marginLeft: W * 0.2
                            }}> <AntDesign name="checkcircle" size={20} color={"green"} /> {strings.NoCalorieCounting}
                            </Text>
                            <Text style={{
                                fontFamily: fontFamily.bold,
                                color: colors.FONT_BLACK,
                                //textAlign: "center",
                                width: W * 0.7,
                                marginTop: H * 0.03,
                                // alignSelf: "center",
                                fontSize: fontSizes.XL,
                                lineHeight: H * 0.03,
                                marginLeft: W * 0.2
                            }}> <AntDesign name="checkcircle" size={20} color={"green"} /> {strings.NoFillingFoodLogs}
                            </Text>
                            <Text style={{
                                fontFamily: fontFamily.bold,
                                color: colors.FONT_BLACK,
                                //textAlign: "center",
                                width: W * 0.7,
                                marginTop: H * 0.03,
                                // alignSelf: "center",
                                fontSize: fontSizes.XL,
                                lineHeight: H * 0.03,
                                marginLeft: W * 0.2
                            }}> <AntDesign name="checkcircle" size={20} color={"green"} /> {strings.NoGym}
                            </Text>
                            
                            <Text style={{
                                fontFamily: fontFamily.bold,
                                color: colors.FONT_BLACK,
                                //textAlign: "center",
                                width: W * 0.7,
                                marginTop: H * 0.03,
                                //alignSelf: "center",
                                fontSize: fontSizes.XL,
                                lineHeight: H * 0.03,
                                marginLeft: W * 0.2
                            }}> <AntDesign name="checkcircle" size={20} color={"green"} /> {strings.NoFadDiet}
                            </Text>

                        </>
                        : null}
                </LinearGradient>
            </View>)
    }

    const renderNextButton = () => {
        return (
            <TouchableOpacity
                style={styles.nextButton}>
                <Text style={{ color: "white" }}>{strings.Next}</Text>
            </TouchableOpacity>)
    }

    const onDone = () => {
        navigation.navigate("Splash")
    }
    const renderDoneButton = () => {
        return (
            <TouchableOpacity style={styles.getStartedButton}>
                <Text style={{ color: "white" }}>
                    {strings.GetStarted}
                </Text>
            </TouchableOpacity>
        )
    }

    return (

        loader
        ?
        <>
            <Loader />
        </>
        :
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={colors.GREEN} />
            <AppIntroSlider renderItem={renderItem}
                data={slides}
                onDone={onDone}
                renderNextButton={renderNextButton}
                activeDotStyle={styles.activeDotStyle}
                renderDoneButton={renderDoneButton}
                onSlideChange={(index) => { index == 2 ? startAnimation() : null }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: H,
        width: W,
        backgroundColor: "white"
    },
    image:
    {
        height: H * 0.09,
        width: H * 0.38,
        position: "absolute",
        alignSelf: "center",
        top: H * 0.15,
    },
    slide:
    {
        height: H,
        width: W,
    },
    text:
    {
        position: "absolute",
        fontSize: fontSizes.XXXL,
        textAlign: "center",
        width: W * 0.75,
        marginTop: H * 0.3,
        lineHeight: H * 0.043,
        marginLeft: W * 0.06,
        fontFamily: "Montserrat-SemiBold",
        alignSelf: "center"
    },
    nextButton:
    {
        height: H * 0.06,
        backgroundColor: colors.ORANGE,
        width: W * 0.2,
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    image2:
    {
        height: H * 0.103,
        width: W * 0.74,
        alignSelf: "center",
        // aspectRatio: 3.2,
        position: "absolute",
        top: H * 0.12,
        backgroundColor: "transparent",
        zIndex: 40,
    },
    text2:
    {
        textDecorationLine: "underline",
        fontFamily: "Montserrat-SemiBold",
        position: "absolute",
        textAlign: "center",
        fontSize: fontSizes.XXL,
        top: H * 0.5,
        // left: W * 0.34,
        alignSelf: "center",

    },
    activeDotStyle:
    {
        backgroundColor: colors.GREEN2
    },
    mantraSubheading:
    {
        // position: "absolute",
        top: H * 0.5,
        alignSelf: "center",
        fontSize: fontSizes.greeting,
        width: W * 0.8,
        lineHeight: H * 0.03,
        color: colors.FONT_BLACK,
        fontFamily: "Montserrat-SemiBold",
        textAlign: "center"
    },
    getStartedButton:
    {
        height: H * 0.06,
        backgroundColor: colors.ORANGE,
        width: W * 0.3,
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    smallImage:
    {
        height: H * 0.06,
        width: H * 0.06,
        margin: H * 0.01,
        backgroundColor: colors.GREEN,
        borderRadius: H * 0.03,

    },
    containerImages:
    {

    },
    containerTasks:
    {
        position: "absolute",
        flexDirection: "row",
        top: H * 0.58,
        alignItems: "center",
        left: W * 0.04,

    },
    textOfPros:
    {
        color: colors.FONT_BLACK,
        fontFamily: "Montserrat-SemiBold",
        width: W * 0.75,
        fontSize: fontSizes.XL,
        lineHeight: H * 0.026
    },
    websiteFonts:
    {
        fontFamily: "Montserrat-SemiBold",
        position: "absolute",
        top: H * 0.65,
        left: W * 0.1,
        fontSize: fontSizes.XL,
    },
    graphImage:
    {
        height: H * 0.16,
        width: H * 0.16,
        alignSelf: "center",
        marginTop: H * 0.25,
        position: "absolute",
        backgroundColor: "white"
    },
    image3:
    {
        height: H * 0.48,
        width: H * 0.48,
        alignSelf: "center",
        marginTop: H * 0.1,
        backgroundColor: "transparent",
        borderRadius: 8,

    },
    aniImage:
    {
        height: H * 0.29,
        width: W * 0.9,
        alignSelf: "center",
        // aspectRatio: 3.2,
        position: "absolute",
        top: H * 0.1,
        backgroundColor: "white",
        borderRadius: 8
    },


})

export default SliderIntro