import { StyleSheet, Image, View, Dimensions, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider, Text } from 'react-native-paper'
import HeaderForReminder from './HeaderForReminder'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import { W, H, PostApiData } from '../../../../colorSchemes/ColorSchemes'
import RNCalendarEvents from "react-native-calendar-events"
import { colors } from '../../../../colorSchemes/ColorSchemes'


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'

import { useIsFocused } from '@react-navigation/native';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import { ShortToast } from '../../../../colorSchemes/ColorSchemes'
import Loader from '../../../../assets/components/Loader'





const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});

const Reminder = ({ navigation }) => {

    const [loader, setLoader] = useState(false)
    const [data, setData] = useState([])

    const [savedtime, setSavedtime] = useState("")


    const converter = (val) => {
        console.log("val", val)

        return val < 10 ? `0${val}` : `${val}`
    }

    useEffect(() => {
        getLanguage(),
            getTimevalue()
        //getReminders()


    }, [])


    const getTimevalue = async () => {
        const time = await getDataFromLocalStorage("time")

        // setSavedtime(JSON.parse(time))
        console.log("lang", JSON.parse(time))
    }

    const getLanguage = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")

        if (lang == "en") {
            strings.setLanguage(lang)
        } else {
            strings.setLanguage(lang)
        }
        setLoader(false)
    }

    useEffect(() => {

    }, [])


    const navigationToScreen = (title) => {
        if (title == "Track Food Reminder") {
            navigation.navigate("ReminderFood")

        } else if (title == "Water Reminder") {
            navigation.navigate("ReminderWater")

        } else if (title == "Exercise Reminder") {
            navigation.navigate("ReminderExercise")

        } else {

        }
    }

    const getReminders = async () => {
        setLoader(true)

        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));

        const result = await PostApiData('DashboardApi/getreminderdetail', formdata)
        console.log(result)
        if (result.status == 200) {
            setData(result.data)

            // ShortToast(result.message, 'success', '')

        } else {
            ShortToast(result.message, 'error', '')

        }

        setLoader(false)
    }



    const renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => { navigationToScreen(item.title) }}>
                    <View style={styles.displayContainer}>
                        <Image source={require('../../../../assets/icons/spoon.png')}
                            style={styles.imageContainer} />

                        <Divider />

                        <View style={styles.secondaryDisplayContainer}>
                            <Text style={styles.text1}>{item.title}</Text>
                            <Text style={styles.text2}>{item.description}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }




    return (
        loader ?
            
        <Loader/>

            :

            <View>
                <HeaderForSubmissionScreens Title={strings.Reminder} />

                <View style={styles.mainContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate("ReminderFood") }}>
                        <View style={styles.displayContainer}>
                            <Image source={require('../../../../assets/icons/spoon.png')}
                                style={styles.imageContainer} />

                            <Divider />

                            <View style={styles.secondaryDisplayContainer}>
                                <Text style={styles.text1}>{strings.TrackFoodReminder}</Text>
                                <Text style={styles.text2}>{strings.threeMealsatdifferenttimes}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={() => { navigation.navigate("ReminderWater") }}>
                        <View style={styles.displayContainer}>
                            <Image source={require('../../../../assets/icons/water-glass.png')}
                                style={styles.imageContainer} />

                            <View style={styles.secondaryDisplayContainer}>
                                <Text style={styles.text1}>{strings.WaterReminder}</Text>
                                <Text style={styles.text2}>{strings.Remindmeevery3Hour}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={() => { navigation.navigate("ReminderExercise") }}>
                        <View style={styles.displayContainer}>
                            <Image source={require('../../../../assets/icons/fitness.png')}
                                style={styles.imageContainer} />

                            <View style={styles.secondaryDisplayContainer}>
                                <Text style={styles.text1}>{strings.ExerciseReminder}</Text>
                                {/* <Text style={[styles.text2, { width: W * 0.8 }]}>{strings.Remindmeeverydayat}</Text> */}
                                {
                                    savedtime == "" ? <Text style={[styles.text2, { width: W * 0.8 }]}>{strings.Remindmeeverydayat}</Text>



                                        : <Text style={[styles.text2, { width: W * 0.8 }]}> {converter(savedtime.getHours())}:{converter(savedtime.getMinutes())}</Text>
                                }


                            </View>
                        </View >
                    </TouchableOpacity>
                    <Divider />

                    {/* <View style={{
                        height: HEIGHT,
                        paddingBottom: H * 0.59,
                    }}>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${index}`} />

                    </View> */}
                </View >






            </View >
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: HEIGHT,
        width: WIDTH,
        backgroundColor: 'white'

    },
    text1:
    {
        fontFamily: 'Montserrat-SemiBold',
        marginLeft: WIDTH * 0.06

    },
    text2:
    {
        fontFamily: 'Montserrat-Regular',
        marginLeft: WIDTH * 0.06,
        marginTop: HEIGHT * 0.01,
    },
    displayContainer:
    {
        height: HEIGHT * 0.11,
        backgroundColor: 'white',
        flexDirection: 'row',


    },
    secondaryDisplayContainer:
    {
        justifyContent: 'center'

    },
    imageContainer:
    {
        height: HEIGHT * 0.04,
        width: HEIGHT * 0.04,
        tintColor: '#9c9c9c',
        marginLeft: WIDTH * 0.06,
        alignSelf: 'center'
    }
})

export default Reminder;
