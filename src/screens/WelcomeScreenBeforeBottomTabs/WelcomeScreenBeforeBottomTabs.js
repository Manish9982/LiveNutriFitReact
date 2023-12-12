import { View, Image, StatusBar, ImageBackground, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { H, W, colors, fontSizes, PostApiData, fontFamily } from '../../colorSchemes/ColorSchemes'
import { ActivityIndicator, Text } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { ProgressBar } from 'react-native-paper'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
import Logo from '../Dashboard/Components/Logo'
import { useIsFocused } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import RNRestart from 'react-native-restart'
import Customloader from '../../assets/components/Customloader'


//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


export default function WelcomeScreenBeforeBottomTabs({ navigation }) {
    const isFocused = useIsFocused()

    useEffect(() => { registerStatus() }, [])
    useEffect(() => { firstLogin() }, [])


    useEffect(() => { getLanguge() }, [isFocused])


   const navigationToDashboard = async () => {
        await storeDataInLocalStorage('stackValue', "3")
        RNRestart.Restart()
    }

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

    const progres = useSharedValue(0)
    const [colorOfCheckBox1, setColorOfCheckBox1] = useState("grey")
    const [colorOfCheckBox2, setColorOfCheckBox2] = useState("grey")
    const [colorOfCheckBox3, setColorOfCheckBox3] = useState("grey")
    const [valueOfProgressBar, setValueOfProgressBar] = useState(0)
    const [flag, setFlag] = useState(0)
    const [name, setName] = useState("")
    const [loader, setLoader] = useState(true)
    const [customText, setCustomText] = useState(strings.PreparingYourPersonalizedMealPlan)
    useEffect(() => {
        runProgressbarAndCheckbox()
        setFlag(0)
    }, [loader])

    const firstLogin = () => {
        storeDataInLocalStorage('firstTimeLogin', '1')
    }
    const runProgressbarAndCheckbox = () => {
        setTimeout(() => {
            setValueOfProgressBar(0.1)
            runBarToLevelTwo()
            setCustomText(strings.PreparingYourPersonalizedMealPlan)
        }, 1000);
        const runBarToLevelTwo = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.2)
                runBarToLevelThree()
                setCustomText(strings.PreparingYourPersonalizedMealPlan)
            }, 1000)
        }
        const runBarToLevelThree = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.3)
                setColorOfCheckBox1("green")
                runBarToLevelFour()
                setCustomText(strings.PreparingYourPersonalizedMealPlan)
                setFlag(1)
            }, 1000)
        }
        const runBarToLevelFour = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.4)
                runBarToLevelFive()
                setCustomText(strings.PreparingYourPersonalizedMealPlan)

            }, 1000)
        }
        const runBarToLevelFive = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.5)
                runBarToLevelSix()
                setCustomText(strings.PreparingYourPersonalizedExercisePlan)
            }, 1000)
        }
        const runBarToLevelSix = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.6)
                setColorOfCheckBox2("green")
                runBarToLevelSeven()
                setCustomText(strings.PreparingYourPersonalizedExercisePlan)
            }, 1000)
        }
        const runBarToLevelSeven = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.7)
                runBarToLevelEight()
                setCustomText(strings.PreparingYourPersonalizedExercisePlan)

            }, 1000)
        }
        const runBarToLevelEight = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.8)
                runBarToLevelNine()
                setCustomText(strings.PreparingYourPersonalizedExercisePlan)
            }, 1000)
        }
        const runBarToLevelNine = () => {
            setTimeout(() => {
                setValueOfProgressBar(0.9)
                setColorOfCheckBox3("green")
                runBarToLevelTen()
                setCustomText(strings.PreparingYourPersonalizedExercisePlan)
            }, 1000)
        }
        const runBarToLevelTen = () => {
            setTimeout(() => {
                setValueOfProgressBar(1)
                progres.value = withSequence(withTiming(1.1), withSpring(1))
                setCustomText(strings.PreparingYourPersonalizedExercisePlan)
                setCustomText("")
                setFlag(2)
                //navigation.replace("PlanChoosePromptAtStartup")
            }, 1000)

        }
    }
    const reanimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: progres.value }],
        };
    }, []);


    const registerStatus = async () => {
        const userType = await getDataFromLocalStorage('user_type')
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("id", JSON.parse(temp))
        formdata.append("register_status", "1");
        formdata.append("device_type", "android");

        const result = await PostApiData('registerstatus', formdata)
        console.log("resultstatus = ", result)
        setName(result.name)
        setLoader(false)

    }
    return (
        loader ?
            <>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: H,
                        width: W,
                    }}>
                    {/* <ActivityIndicator size={"large"}
                        color={colors.GREEN} /> */}

                        <Customloader/>
                </View>
            </>



            :


            <>


                < View style={{ height: H, width: W }}>
                    <StatusBar backgroundColor={colors.GREEN} />

                    <View style={{
                        position: "absolute",
                        alignSelf: "center",
                        top: flag == "1" ? H * 0.05 : H * 0.25,
                        zIndex: 2,
                    }}>
                        <Logo />
                    </View>
                    <View style={{
                        zIndex: 40, width: W * 0.85,
                        alignSelf: 'center',
                        top: flag == "1" ? H * 0.2 : H * 0.4
                    }}>

                        <Text style={{
                            alignSelf: 'center',
                            marginBottom: H * 0.02,
                            fontFamily: "Montserrat-SemiBold",
                            position: 'absolute',
                            zIndex: 2,
                            color: 'white',
                            top: H * 0.06,
                        }}></Text>
                        {/*  <ProgressBar progress={valueOfProgressBar} color={colors.ORANGE}
                            style={{
                                height: H * 0.01,
                                borderRadius: 2,
                                marginTop: H * 0.01
                            }} />*/}

                    </View>
                    <View style={{
                        zIndex: 40,
                        alignItems: "center",
                        marginTop: H * 0.4
                    }}>
                        {flag == 0 ?
                            <>
                                <Text
                                    style={{
                                        ...fontFamily.bold,
                                        marginTop: H * 0.08,
                                        fontSize: fontSizes.greeting,
                                        marginBottom: H * 0.03
                                    }}>{strings.Welcome}, {name}!</Text>

                                <Text style={{
                                    ...fontFamily.bold,
                                    marginTop: H * 0.01,
                                    fontSize: fontSizes.XL,
                                    textAlign: "center",
                                    paddingHorizontal: W * 0.1
                                }}>{strings.Readytocommit}</Text>
                            </>
                            :
                            null}
                        {flag == 1 ?
                            <>
                                <Image source={require('../../assets/icons/ImageDemo.jpg')}
                                    style={{
                                        height: H * 0.56,
                                        aspectRatio: 9 / 16,
                                        marginTop: - H * 0.24,
                                        borderRadius: 1,
                                    }} />
                                <Text style={{
                                    ...fontFamily.bold,
                                    marginTop: H * 0.02,
                                    fontSize: fontSizes.LAR,
                                    width: W * 0.85,
                                }}>{strings.Ourpreventivehealth}</Text>
                            </>
                            :
                            null}
                        {flag == 2 ?
                            <>
                                <Text
                                    style={{
                                        ...fontFamily.bold,
                                        marginTop: flag == "2" ? H * 0.04 : H * 0.1,
                                        fontSize: fontSizes.XL,
                                        marginBottom: H * 0.05,
                                        width: W * 0.8
                                    }}>{strings.Wellprovidenutritional}</Text>


                            </>
                            :
                            null}

                        <Text style={{
                            width: W,
                            ...fontFamily.bold,
                            marginLeft: W * 0.15,
                            marginTop: flag == "1" ? H * 0.05 : H * 0.2
                        }}>{customText}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (flag == 2 && (valueOfProgressBar !== 1)) {
                                    console.log("Do Nothing")
                                }
                                else if (flag == 2 && (valueOfProgressBar == 1))
                                    //  navigation.replace("PlanChoosePromptAtStartup")

                                    navigationToDashboard()


                            }}
                            style={{
                                height: H * 0.07,
                                width: W * 0.85,
                                zIndex: 100,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: colors.GREEN,
                                borderRadius: 8,
                                marginTop: H * 0.014
                            }}>
                            <Text style={{
                                color: "white",
                                ...fontFamily.bold
                            }}>{(valueOfProgressBar !== 1) ? `${valueOfProgressBar * 100}%` : strings.Proceed}</Text>
                        </TouchableOpacity>
                    </View>


                    {/* <ImageBackground source={require('../../assets/icons/welcome-bg1.jpg')}
                        style={{ height: H * 1.04, width: W, zIndex: 0, position: 'absolute' }} />*/}

                </View>
            </>
    )
}

const styles = StyleSheet.create({
    viewOfCheckbox:
    {
        flexDirection: 'row',
        width: W,
        height: H * 0.15,
        //justifyContent: 'center',
        alignItems: 'center',
        marginVertical: H * 0.07,
        paddingRight: W * 0.15
    },
    activityIndicator:
    {
        marginRight: W * 0.02,
        marginLeft: W * 0.07,
        //marginBottom: H * 0.12
    },
    button:
    {
        height: H * 0.1,
        width: W * 0.75,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: H * 0.05,
        alignSelf: 'center',
        zIndex: 1
    },
    primary:
    {
        marginTop: H * 0.46,
        justifyContent: "space-evenly",
        height: H * 0.2,
        zIndex: 1
    },
    text1:
    {
        color: 'grey',
        fontSize: fontSizes.LAR,
        position: 'absolute',
        top: H * 0.010,
        left: W * 0.16,
        paddingRight: W * 0.1,
        paddingBottom: H * 0.03,
        width: W * 0.9
    },
    checkbox1:
    {
        zIndex: 1,
        marginLeft: W * 0.08,
        marginRight: W * 0.02,
        marginTop: H * 0.008,
    },
    checkbox2:
    {
        zIndex: 1,
        marginLeft: W * 0.08,
        marginRight: W * 0.02,
        marginBottom: H * 0.02
    },
    checkbox3:
    {
        zIndex: 1,
        marginLeft: W * 0.08,
        marginRight: W * 0.02,
        marginTop: H * 0.008
    },
})