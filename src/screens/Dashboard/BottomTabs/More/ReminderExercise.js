import { StyleSheet, View, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Switch, Checkbox, Divider } from 'react-native-paper'
import { colors, fontSizes, H, W } from '../../../../colorSchemes/ColorSchemes';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderForReminder from './HeaderForReminder';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage';
import { displayNotification, onCreateTriggerNotification, onCreateTriggerNotificationDaily, onCreateTriggerNotificationHourly, onCreateTriggerNotificationWeekly } from '../../../../assets/components/NotificationServices';
import DatePicker from 'react-native-modern-datepicker'
import moment from 'moment/moment';
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens';


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const ReminderExercise = () => {
    const dateForRef = Date.now()
    const currentDate = new Date()
    var today = (currentDate.getDate()).toString().padStart(2, 0)
    var month = (currentDate.getMonth() + 1).toString().padStart(2, 0)
    var year = currentDate.getFullYear()
    //  useEffect(() => { getUserAlarms() }, [])

    // const getUserAlarms = async () => {
    //     const temp = await getDataFromLocalStorage('alarmE1')
    //     if (temp) {
    //         setDate(new Date(JSON.parse(temp)))
    //         onCreateTriggerNotification((JSON.parse(temp)))
    //     }
    //     else {
    //         setDate(new Date())
    //     }

    //     const temp2 = await getDataFromLocalStorage('alarmE2')
    //     if (temp2) {
    //         onCreateTriggerNotification((JSON.parse(temp2)))
    //         setDate2(new Date(JSON.parse(temp2)))
    //     }
    //     else setDate2(new Date())
    //     const temp3 = await getDataFromLocalStorage('alarmE3')
    //     if (temp3) {
    //         onCreateTriggerNotification((JSON.parse(temp3)))
    //         setDate3(new Date(JSON.parse(temp3)))
    //     }
    //     else setDate3(new Date())
    //     const temp4 = await getDataFromLocalStorage('alarmE4')
    //     if (temp4) {
    //         onCreateTriggerNotification((JSON.parse(temp4)))
    //         setDate4(new Date(JSON.parse(temp4)))
    //     }
    //     else setDate4(new Date())
    //     const temp5 = await getDataFromLocalStorage('alarmE5')
    //     if (temp5) {
    //         onCreateTriggerNotification((JSON.parse(temp5)))
    //         setDate5(new Date(JSON.parse(temp5)))
    //     }
    //     else setDate5(new Date())
    //     const temp6 = await getDataFromLocalStorage('alarmE6')
    //     if (temp6) {
    //         onCreateTriggerNotification((JSON.parse(temp6)))
    //         setDate6(new Date(JSON.parse(temp6)))
    //     }
    //     else setDate6(new Date())

    // }

    const alarm = new Date()
    const alarm2 = new Date()


    const [selectedDate, setSelectedDate] = useState('')
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [timeStamp, setTimeStamp] = useState()
    const [timeStamp2, setTimeStamp2] = useState()

    const [date, setDate] = useState(alarm) // to set default from props or current date
    const [date2, setDate2] = useState(alarm2) // to set default from props or current date
    const [frequency, setFrequency] = useState("once")
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)

    const converter = (val) => {
        return val < 10 ? `0${val}` : `${val}`
    }

    const onToggleSwitch = () => {
        setIsSwitchOn((prev) => {
            if (prev == false) {
                setChecked(false)
                setChecked2(false)
                return (
                    true
                )
            }
            else {
                return false
            }
        }
        )
    }

    console.log("============>", dateForRef)
    console.log("timeStamp", date2)

    return (
        <View>
            <HeaderForSubmissionScreens Title="Exercise Reminder" />
            <View style={styles.mainContainer}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: H * 0.02,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Android
                            disabled={isSwitchOn}
                            style={styles.checkBox}
                            color={colors.GREEN}
                            status={checked2 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked2((prev) => {
                                    if (prev == true) {

                                        return false
                                    }
                                    else if (prev == false) {
                                        if (frequency == "once") {
                                            onCreateTriggerNotification(timeStamp2, "Exercise Reminder!", "It's Time for your workout.", "1")
                                            ToastAndroid.show(`Alarm will ring in ${new Date((Number.parseInt(date2.getTime(), 10))).getHours() - new Date(dateForRef).getHours()} hours ${new Date((Number.parseInt(date2.getTime(), 10))).getMinutes() - new Date(dateForRef).getMinutes()} minutes`, ToastAndroid.SHORT)
                                        }
                                        else if (frequency == "hourly") {
                                            onCreateTriggerNotificationHourly(timeStamp2, "Exercise Reminder!", "It's Time for your workout.", "1")
                                            ToastAndroid.show(`Alarm will ring hourly`, ToastAndroid.SHORT)
                                        }
                                        else if (frequency == "daily") {
                                            onCreateTriggerNotificationDaily(timeStamp2, "Exercise Reminder!", "It's Time for your workout.", "1")
                                            ToastAndroid.show(`Alarm will ring daily`, ToastAndroid.SHORT)
                                        }
                                        else if (frequency == "weekly") {
                                            onCreateTriggerNotificationWeekly(timeStamp2, "Exercise Reminder!", "It's Time for your workout.", "1")
                                            ToastAndroid.show(`Alarm will ring every week`, ToastAndroid.SHORT)
                                        }
                                        return true
                                    }
                                });
                            }}
                        />
                        <Text>Remind me </Text>
                        <Text>everyday at </Text>
                        <TouchableOpacity style={styles.durationContainer}>
                            <Text>11:26 AM</Text>
                        </TouchableOpacity>
                    </View>

                </View >
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: HEIGHT,
        width: WIDTH,
        paddingHorizontal: WIDTH * 0.05,
        paddingBottom: HEIGHT * 0.35,
        // justifyContent: 'space-evenly'
    },
    switch:
    {

    },
    text1:
    {
        fontFamily: 'Montserrat-SemiBold',
        alignSelf: "center"

    },
    text2:
    {
        alignSelf: "center",
        fontFamily: 'Montserrat-SemiBold',
        backgroundColor: '#e1e3e6',
        padding: W * 0.01,
        borderRadius: 5,
    },
    durationContainer:
    {
        backgroundColor: colors.DARK_GRAY,
        padding: 5,
        borderRadius: 8,
    }
})
export default ReminderExercise
