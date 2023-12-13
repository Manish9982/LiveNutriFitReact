import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { Text, configureFonts, DefaultTheme, Provider as PaperProvider, Portal, Dialog, Paragraph, Button, Snackbar } from 'react-native-paper';
import { colors, fontSizes, H, PostApiData, ShortToast, W, ShadowsiOS } from '../../../colorSchemes/ColorSchemes';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Icon2 from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getDataFromLocalStorage } from '../../../local storage/LocalStorage';
import DataState from '../../../context/DataState';
import DataContext from '../../../context/DataContext';


import LocalizedStrings from 'react-native-localization';
import hindi from '../../../hi'
import english from '../../../en'



//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

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
    fonts: configureFonts({ config: fontConfig }),
};

const InfoCard = (props) => {
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



    const navigation = useNavigation();
    useEffect(() => { loadPreviousData() }, [])

    const [activity_id, setActivity_id] = useState('')
    const [bgclr1, setBgclr1] = useState('white')
    const [bgclr2, setBgclr2] = useState('white')
    const [bgclr3, setBgclr3] = useState('white')
    const [medals, setMedals] = useState(0)

    const { Nvisible, Nheading, NsubHeading, NvisibleSnackOne, NvisibleSnackTwo, NvisibleSnackThree, NvisibleMood } = useContext(DataContext)

    const [visible, setVisible] = Nvisible
    const [heading, setHeading] = Nheading
    const [subHeading, setSubHeading] = NsubHeading
    const [visibleSnackOne, setVisibleSnackOne] = NvisibleSnackOne
    const [visibleSnackTwo, setVisibleSnackTwo] = NvisibleSnackTwo
    const [visibleSnackThree, setVisibleSnackThree] = NvisibleSnackThree
    const [visibleMood, setVisibleMood] = NvisibleMood

    const arrowIcon = <Icon name="right" size={20} color='white' />
    const arrowIcon2 = <Icon name="down" size={20} color='white' />
    const medalIcon = <Image source={require('../../../assets/icons/goldcoin.png')}
        style={{ height: 20, width: 20 }} />

    const ArrowPressed = (id) => {

        if (id == "Meal Plan") {
            navigation.navigate("SubmitMealPlan")
        }
        else if (id == "Exercise") {
            navigation.navigate("SubmitExcercise")
        }
        else if (id == "Sleep") {
            navigation.navigate("SubmitSleep")
        }
        else if (id == "Hydration") {
            navigation.navigate("SubmitHydration")
        }
        else if (id == "Mood") {
            navigation.navigate("SubmitMood")
        }
        else if (id == "Fasting") {
            navigation.navigate("SubmitFasting")
        }
        else if (id == "Monitoring") {
            // navigation.navigate("SubmitMonitoring")
            // ShortToast("Feature Coming Soon!", 'warning', '')
            //    console.log('Monitoring pressed')
            props.onPressScroll()
        }
        else null

    }

    const onToggleSnackBarOne = () => setVisibleSnackOne(!visibleSnackOne);
    const onToggleSnackBarTwo = () => setVisibleSnackTwo(!visibleSnackTwo);
    const onToggleSnackBarThree = () => setVisibleSnackThree(!visibleSnackThree);

    // const getBestMessage = () => {
    //     const CongArray = ["Cheers! The fruit of your own hard work is the sweetest.",
    //         "Congratulations! Today is your day. You’re off to great places. You’re off and away!",
    //         "Congratulations! We’re so very proud of you!",
    //         "Well done! Keep it up!",
    //         "Wow! You’re going to rock this",
    //     ]
    //     return CongArray[Math.floor(Math.random() * CongArray.length)]
    // }


    const getBestMessage = () => {
        const CongArray = [strings.Cheers,
        strings.CongratulationsTodayisyourday,
        strings.Congratulationssoveryproudofyou,
        strings.WellDoneKeepItUp,
        ]
        return CongArray[Math.floor(Math.random() * CongArray.length)]
    }

    // const getOkMessage = () => {
    //     const OkArray = ["Good! But you can still do better.",
    //         "You're getting closer. Keep it up.",
    //         "Great! Think you can and you can do it.Your thoughts are your life.",
    //         "Motivate yourself, you can be great.",
    //         "Good! Be all that you can be.You can be great."
    //     ]
    //     return OkArray[Math.floor(Math.random() * OkArray.length)]
    // }


    const getOkMessage = () => {
        const OkArray = [strings.Good,
        strings.YouaregettingcloserKeepitup,
        strings.GreatThink,
        strings.Motivate,
        strings.GoodBeall

        ]
        return OkArray[Math.floor(Math.random() * OkArray.length)]
    }






    // const getBadMessage = () => {
    //     const BadArray = ["Don't worry! The future belongs to those who believe in the beauty of their dreams.",
    //         "Relax! Think of tomorrow, the past can't be mended.",
    //         "No worries! Yesterday is not ours to recover, but tomorrow is ours to win or lose.",
    //         "It's ok if today wasn't your day. Tomorrow is a new day.",
    //         "No Problem! Tomorrow will be different.",
    //     ]
    //     return BadArray[Math.floor(Math.random() * BadArray.length)]
    // }


    const getBadMessage = () => {
        const BadArray = [strings.DontworryThefuturebelongstothosewhobelieveinthebeautyoftheirdreams,
        strings.RelaxThinkoftomorrow,
        strings.NoworriesYesterday,
        strings.Itsok,
        strings.NoProblem,
        ]
        return BadArray[Math.floor(Math.random() * BadArray.length)]
    }


    function Medals() {
        if (medals === 1) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {medalIcon}
                </View>
            )

        }
        else if (medals === 2) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

                    {medalIcon}

                    {medalIcon}

                </View>
            )


        }
        else if (medals === 3) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {medalIcon}
                    {medalIcon}
                    {medalIcon}
                </View>
            )

        }
        else {
            return null
        }
    }
    const loadPreviousData = () => {
        if (props.Text == "Monitoring") {
            if (props.SelectedOption.includes('1')) {
                setBgclr1(colors.BEST_COLOR)
                setMedals(props.SelectedOption.length)

            }
            if (props.SelectedOption.includes('2')) {
                setBgclr2(colors.BEST_COLOR)
                setMedals(props.SelectedOption.length)

            }
            if (props.SelectedOption.includes('3')) {
                setBgclr3(colors.BEST_COLOR)
                setMedals(props.SelectedOption.length)
            }
        }
        else {
            if (props.SelectedOption == '1') {
                setBgclr1(colors.BAD_COLOR)
                setMedals(3)
            }
            if (props.SelectedOption == '2') {
                setBgclr2(colors.GOOD_COLOR)
                setMedals(3)
            }
            if (props.SelectedOption == '3') {
                setBgclr3(colors.BEST_COLOR)
                setMedals(3)
            }
        }
    }





    const sendFirstChoiceToApi = async () => {

        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("activity_id", props.Key + 1);
        formdata.append("selected_option", "1");
        const result = await PostApiData('add_user_activity_data', formdata)
        //console.log(result)

    }
    const sendSecondChoiceToApi = async () => {

        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("activity_id", props.Key + 1);
        formdata.append("selected_option", "2");
        const result = await PostApiData('add_user_activity_data', formdata)
        // console.log(result)
    }
    const sendThirdChoiceToApi = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("activity_id", props.Key + 1);
        formdata.append("selected_option", "3");
        const result = await PostApiData('add_user_activity_data', formdata)
        // console.log(result)
    }
    const firstChoiceTrigger = async (heading) => {

        if (heading == 'Monitoring') {

            setBgclr1(
                (prev) => {
                    if (prev == colors.BEST_COLOR) {
                        return "white"
                    }
                    else {
                        props?.onPressWeight(prev => !prev)
                        return colors.BEST_COLOR
                    }
                }
            )
            if (bgclr1 == colors.BEST_COLOR) {
                await sendFirstChoiceToApi()
                setMedals(prev => prev - 1)
                await props.onPressButton()
            }
            if (bgclr1 == 'white') {
                await sendFirstChoiceToApi()
                setMedals(prev => prev + 1)
                await props.onPressButton()
            }

        }
        else {
            sendFirstChoiceToApi()
            props.onPressButton()
            setBgclr2('white')
            setBgclr3('white')
            //setMedals(1)
            setMedals(3)
            setBgclr1(colors.BAD_COLOR)
        }
    }
    const secondChoiceTrigger = async (heading) => {
        if (heading == 'Monitoring') {

            setBgclr2(
                (prev) => {
                    if (prev == colors.BEST_COLOR) {
                        return "white"
                    }
                    else {
                        props?.onPressSugar(prev => !prev)
                        return colors.BEST_COLOR
                    }
                }
            )
            if (bgclr2 == colors.BEST_COLOR) {
                await sendSecondChoiceToApi()
                setMedals(prev => prev - 1)
                await props.onPressButton()
            }
            if (bgclr2 == 'white') {
                await sendSecondChoiceToApi()
                setMedals(prev => prev + 1)
                await props.onPressButton()
            }

        }
        else {
            await sendSecondChoiceToApi()
            await props.onPressButton()
            setBgclr1('white')
            setBgclr3('white')
            //setMedals(2)
            setMedals(3)
            setBgclr2(colors.GOOD_COLOR)

        }
    }
    const thirdChoiceTrigger = async (heading) => {
        if (heading == 'Monitoring') {
            setBgclr3(
                (prev) => {
                    if (prev == colors.BEST_COLOR) {
                        return "white"
                    }
                    else {
                        props?.onPressBP(prev => !prev)
                        return colors.BEST_COLOR
                    }
                }
            )
            if (bgclr3 == colors.BEST_COLOR) {
                await sendThirdChoiceToApi()
                setMedals(prev => prev - 1)
                await props.onPressButton()
            }
            if (bgclr3 == 'white') {
                await sendThirdChoiceToApi()
                setMedals(prev => prev + 1)
                await props.onPressButton()
            }
        }
        else {
            await sendThirdChoiceToApi()
            await props.onPressButton()
            setBgclr1('white')
            setBgclr2('white')
            setBgclr3(colors.BEST_COLOR)
            setMedals(3)

        }
    }

    const openInformationofindex = (num) => {
        // if (props.Text == "Meal Plan") {
        //     navigation.navigate("WalkthroughMeal")
        // }
        // if (props.Text == "Exercise") {
        //     navigation.navigate("WalkthroughExercise")
        // }
        // if (props.Text == "Sleep") {
        //     navigation.navigate("WalkthroughSleep")
        // }
        // if (props.Text == "Hydration") {
        //     navigation.navigate("WalkthroughHydration")
        // }
        // if (props.Text == "Fasting") {
        //     navigation.navigate("WalkthroughFasting")
        // }
        // if (props.Text == "Mood") {
        //     navigation.navigate("WalkthroughMood")
        // }
        // if (props.Text == "Monitoring") {
        //     navigation.navigate("WalkthroughMonitoring")
        // }
        console.log("i button is pressed")
    }

    const openSnackbarOne = () => {
        onToggleSnackBarOne()
    }
    const openSnackbarTwo = () => {
        onToggleSnackBarTwo()
    }
    const openSnackbarThree = () => {
        onToggleSnackBarThree()
    }


    return (
        <DataState>

            <PaperProvider theme={theme}>


                <View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, width: '100%', }}>
                        <Image source={{ uri: props.Location }}
                            style={{ marginLeft: WIDTH * 0.02, height: HEIGHT * 0.035, width: HEIGHT * 0.035, borderRadius: HEIGHT * 0.035 / 2 }} />
                        <Text style={styles.headingText}>{props.Text}</Text>
                        <View>
                            <TouchableOpacity onPress={() => openInformationofindex()}>
                                <Image source={require('../../../assets/icons/information.png')}
                                    style={{ height: H * 0.018, width: H * 0.018, marginTop: H * 0.01, tintColor: "grey" }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 80, position: 'absolute', left: WIDTH * 0.73, }}>
                            <Medals />
                        </View>


                    </View>
                    <View style={styles.userChoiceBar}>

                        <TouchableOpacity onPress={() => {
                            if (props.Attributes[0] == "1") {
                                setVisibleMood(true)
                            }
                            else if (props.Attributes[0] !== "Weight" && props.Attributes[0] !== "1") {
                                // ShortToast(getBadMessage(), 'success', '')
                            }

                            firstChoiceTrigger(props.Text)

                        }}
                            style={[styles.choiceButtons, { backgroundColor: bgclr1 }]}>


                            {props.Attributes[0] == 1 ? <Image source={require('../../../assets/icons/sad.png')}
                                style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                :
                                <Text style={styles.userChoiceText}>{props.Attributes[0]}</Text>}
                            {props.FollowNeeded ? <Text style={{ fontSize: fontSizes.SM, textAlign: 'center' }}>Follow</Text> : null}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            if (props.Attributes[1] == "2") {
                                setVisibleMood(true)
                            }
                            else if (props.Attributes[1] !== "Sugar" && props.Attributes[1] !== "2") {
                                //ShortToast(getOkMessage(), 'success', '')
                            }

                            secondChoiceTrigger(props.Text)
                        }}
                            style={[styles.choiceButtons, { backgroundColor: bgclr2 }]}>

                            {props.Attributes[1] == 2 ? <Image source={require('../../../assets/icons/confused.png')}
                                style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                :
                                <Text style={styles.userChoiceText}>{props.Attributes[1]}</Text>}
                            {props.FollowNeeded ? <Text style={{ fontSize: fontSizes.SM, textAlign: 'center' }}>Follow</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if (props.Attributes[2] !== "BP") {
                                //  ShortToast(getBestMessage(), 'success', '')
                            }

                            thirdChoiceTrigger(props.Text)
                        }}
                            style={[styles.choiceButtons, { backgroundColor: bgclr3 }]}>
                            {props.Attributes[2] == 3 ? <Image source={require('../../../assets/icons/happy.png')}
                                style={{ height: 20, width: 20, alignSelf: 'center', }} />
                                :
                                <Text style={styles.userChoiceText}>{props.Attributes[2]}</Text>}
                            {props.FollowNeeded ? <Text style={{ fontSize: fontSizes.SM, textAlign: 'center' }}>Follow</Text> : null}
                        </TouchableOpacity>
                        <LinearGradient colors={['#9bdf61', '#7fc346']} style={styles.linearGradient}>

                            {props.Text == "Monitoring" ? <TouchableOpacity
                                onPress={() => ArrowPressed(props.Text)}
                                style={styles.arrowButton}>{arrowIcon2}
                            </TouchableOpacity> : <TouchableOpacity
                                onPress={() => ArrowPressed(props.Text)}
                                style={styles.arrowButton}>{arrowIcon}
                            </TouchableOpacity>}

                        </LinearGradient>
                    </View>
                </View >
            </PaperProvider>
        </DataState>
    )
}
const styles = StyleSheet.create({
    headingText:
    {
        fontFamily: 'Montserrat-Medium',
        fontSize: fontSizes.XL,
        marginLeft: 8,
        marginTop: 5,
        marginRight: W * 0.02
    },
    icon:
    {
        height: 20,
        width: 20,
    },
    userChoiceBar:
    {
        flexDirection: 'row',
        width: '100%',
        flexWrap: "wrap",
        padding: 0,
        justifyContent: 'space-evenly',


    },
    choiceButtons:
    {
        //height: 45,
        width: 80,
        padding: 2,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 20,
        ...ShadowsiOS
    },
    arrowButton:
    {
    },
    userChoiceText:
    {
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        fontSize: fontSizes.choiceText
    },
    linearGradient: {
        height: HEIGHT * 0.06,
        width: WIDTH * 0.13,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    }
})

export default InfoCard
