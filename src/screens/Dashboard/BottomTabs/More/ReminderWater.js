// import { StyleSheet, View, Dimensions, TouchableOpacity, FlatList } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { Text, Switch, Checkbox, Divider } from 'react-native-paper'
// import { H, PostApiData, W, colors, fontFamily, fontSizes, formatTimestamp } from '../../../../colorSchemes/ColorSchemes';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import HeaderForReminder from './HeaderForReminder';
// import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage';
// import { onCreateTriggerNotification } from '../../../../assets/components/NotificationServices';
// import ReminderItemWater from '../../../../assets/components/ReminderItemWater';
// import { ShortToast } from '../../../../colorSchemes/ColorSchemes';
// import ReminderHoursDropDown from './Components/ReminderHoursDropDown';


// const HEIGHT = Dimensions.get('window').height
// const WIDTH = Dimensions.get('window').width



// const DATA = [
//     {
//         id: '1',
//         name: '1 hour'
//     },
//     {
//         id: '2',
//         name: '3 hour'
//     },
//     {
//         id: '3',
//         name: '5 hour'
//     },
//     {
//         id: '4',
//         name: '8 hour'
//     },
//     {
//         id: '5',
//         name: '10 hour'
//     },
//     {
//         id: '6',
//         name: '12 hour'
//     },
// ]


// const ReminderWater = () => {


//     useEffect(() => {
//         //  getUserAlarms()

//     }, [])


//     const alarm = new Date()



//     const [isSwitchOn, setIsSwitchOn] = useState(false);
//     const [checked, setChecked] = useState(false);
//     const [checked2, setChecked2] = useState(false);

//     const [date, setDate] = useState(alarm) // to set default from props or current date

//     const [show, setShow] = useState(false)
//     const [value, setValue] = useState('')
//     const [data, setData] = useState([])
//     const [visible, setVisible] = useState(false)

//     const [turnonoffreminderdata, setTurnonoffreminderdata] = useState([])



//     const converter = (val) => {
//         return val < 10 ? `0${val}` : `${val}`
//     }



//     const onToggleSwitch = () => {

//         console.log("Value=== ", isSwitchOn)

//        // reminderTurnONOFF(isSwitchOn)

//         setIsSwitchOn((prev) => {
//             if (prev == false) {
//                 setChecked(false)
//                 return (
//                     true
//                 )
//             }
//             else {
//                 return false
//             }
//         }
//         )
//     }


//     useEffect(() => {
//         getRemindersListing()
//     }, [])

//     const reminderTurnONOFF = async (isSwitchOnn) => {
//         console.log("isSwitchOn", isSwitchOnn)

//         // setLoader(true)
//         const temp = await getDataFromLocalStorage('user_id')
//         var formdata = new FormData();
//         formdata.append("user_id", JSON.parse(temp));
//         formdata.append("reminder_type", "2");
//         formdata.append("reminder_onoff", isSwitchOnn ? "1" : "0");

//         const result = await PostApiData('turnreminderdata', formdata)
//         console.log("isSwitchOnresult============", result)

//         if (result.status == 200) {
//             setTurnonoffreminderdata(result)
//             //setChecked(true)
//             getRemindersListing()

//         } else {

//             ShortToast(result.message, 'error', '')

//         }

//         // setLoader(false)
//     }
//     const getRemindersListing = async () => {
//         // setLoader(true)

//         const temp = await getDataFromLocalStorage('user_id')
//         var formdata = new FormData();
//         formdata.append("user_id", JSON.parse(temp));
//         formdata.append("reminder_type", "2");

//         const result = await PostApiData('getuserreminder', formdata)
//         console.log("GAURAVVVVVVVVVVVVVVVVVVVVVVVV", result)

//         if (result.status == 200) {
//             setData(result.data)
//             //setChecked(true)
//         } else {
//             // ShortToast(result.message, 'error', '')

//         }

//         // setLoader(false)
//     }



//     const onCheckAPI = async (time, hours) => {
//         console.log("time ============= ", time)
//         console.log("hours ============= ", hours)
//         const UserId = await getDataFromLocalStorage('user_id')
//         var formdata = new FormData()
//         formdata.append('user_id', JSON.parse(UserId))
//         formdata.append('date', formatTimestamp(Date.now()))
//         //  formdata.append('time', time)
//         formdata.append('time', checked ? `${converter((date.getHours()))}:${converter((date.getMinutes()))}` : "")
//         formdata.append('everyday', checked ? "1" : "0")
//         formdata.append('reminder_section', "Water")
//         formdata.append('reminder_type', "2")
//         // formdata.append('reminder_key', isSwitchOn ? "1" : "0")
//         formdata.append('reminderhour', checked2 ? "1" : "0")
//         formdata.append('hourtime', (hours || time || "1 Hour"))


//         const result = await PostApiData('setuserreminder', formdata)
//         if (result.status == 200) {
//             // setData(result.data)
//             getRemindersListing()
//             ShortToast(result.message, 'success', '')

//         } else {
//             ShortToast(result.message, 'error', '')

//         }
//     }





//     const onPressOption = (t) => {
//         setValue(t)
//         setVisible(false)
//         onCheckAPI(t, "")
//     }


//     const renderItem = ({ item, index }) => {
//         return (
//             <ReminderItemWater
//                 date={item?.date}
//                 checked={item?.reminder}
//                 reminder={item?.reminder}
//                 remindersection={item?.reminder_section}
//                 time={item?.time}
//                 onChecked={() => getRemindersListing()}
//                 everydayreminder={checked ? "1" : "0"}
//                 isswitchon={isSwitchOn}
//             // timevalue={sendTimeValue}

//             />



//         )
//     }

//     return (
//         <View>
//             <HeaderForReminder />

//             {
//                 show == true ? <DateTimePicker
//                     mode={"time"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
//                     display='clock' // Android Only  
//                     // is24Hour={false} // Android Only 
//                     value={date}
//                     onChange={(t) => {
//                         setShow(false)
//                         // onCheckAPI("","",new Date((t.nativeEvent.timestamp)))
//                         // console.log("everydaytime ============= ", t.nativeEvent.timestamp)

//                         setDate(new Date(t.nativeEvent.timestamp))
//                         storeDataInLocalStorage('alarmE1',
//                             JSON.stringify(t.nativeEvent.timestamp))
//                         onCreateTriggerNotification(t.nativeEvent.timestamp - 50000,
//                             "Excercise Reminder!", "It's Time for your workout.", "1")
//                     }}
//                 />
//                     :
//                     null
//             }
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                 <Text style={{
//                     marginLeft: WIDTH * 0.03,
//                     fontSize: fontSizes.XL,
//                     padding: 15
//                 }}>
//                     Turn off Reminders</Text>

//                 <Switch
//                     value={isSwitchOn}
//                     onValueChange={onToggleSwitch}
//                     color={colors.GREEN}
//                     style={styles.switch} />
//             </View>


//             <View style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between'
//             }}>

//                 <View style={{
//                     flexDirection: 'row',
//                     alignItems: 'center', padding: 10
//                 }}>

//                     <Checkbox
//                         disabled={isSwitchOn}
//                         style={styles.checkBox}
//                         color={colors.GREEN}
//                         status={checked ? 'checked' : 'unchecked'}
//                         onPress={() => {
//                             setChecked(prev => !prev);
//                         }} />


//                     <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Remind me every day at</Text>
//                 </View>

//                 <TouchableOpacity

//                     onPress={() => {
//                         setShow(true)

//                         // onCheckAPI("","",(new Date(t.nativeEvent.timestamp)))

//                         // sendTimeValue(`${converter(date.getHours())}:${converter(date.getMinutes())}`)
//                     }}

//                     style={{ padding: 15 }}>
//                     <Text style={styles.text2}>{converter(date.getHours())}:{converter(date.getMinutes())}</Text>
//                 </TouchableOpacity>
//             </View>



//             {/* <View style={{
//                 //height: HEIGHT,
//             }}>
//                 <FlatList
//                     data={data}
//                     renderItem={renderItem}
//                     keyExtractor={(item, index) => `${index}`} />
//             </View> */}



//             <Divider style={{ borderWidth: 0.2, borderColor: 'silver' }} />


//             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>




//                 <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
//                     <Checkbox
//                         //disabled={isswitchon}
//                         //style={styles.checkBox}
//                         color={colors.GREEN}
//                         // status={checked ? 'checked' : 'unchecked'}
//                         status={data[0]?.reminder ? 'checked' : 'unchecked'}
//                         onPress={() => onCheckAPI("", value)}
//                     />

//                     <Text style={[styles.text1, {
//                         marginLeft: W * 0.04
//                     }]}>{"Remind me in every"}</Text>

//                     <TouchableOpacity

//                         onPress={() => {
//                             setShow(true)
//                         }}
//                         style={{
//                             left: W * 0.75, position: 'absolute',
//                             ...fontFamily.bold, top: 0
//                         }}>


//                         {/* <Text style={styles.text2}>{converter((alarmdate || time).getHours())}:
//                             {converter((alarmdate || time).getMinutes())}</Text> */}


//                         <ReminderHoursDropDown
//                             visible={visible}
//                             onPressInputCustomView={() => setVisible(true)}
//                             label={"1 Hour"}
//                             options={DATA}
//                             value={value}
//                             onPressOption={(t) => onPressOption(t)}
//                         />
//                     </TouchableOpacity>
//                 </View>






//             </View>



//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     mainContainer:
//     {
//         height: HEIGHT,
//         width: WIDTH,
//         paddingHorizontal: WIDTH * 0.05,
//         paddingBottom: HEIGHT * 0.35,
//         justifyContent: 'space-evenly'
//     },
//     switch:
//     {

//     },
//     text1:
//     {
//         fontFamily: 'Montserrat-SemiBold',

//     },
//     text2:
//     {
//         fontFamily: 'Montserrat-SemiBold',
//         backgroundColor: '#e1e3e6',
//         padding: WIDTH * 0.01,
//         borderRadius: 5,
//     }
// })
// export default ReminderWater





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


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const ReminderWater = () => {
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
            <HeaderForReminder />
            <View style={styles.mainContainer}>

                {/* {
                    show == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        //display='clock' // Android Only  
                        is24Hour={true} // Android Only 
                        value={date}
                        onChange={(t) => {
                            setChecked(false)
                            console.log(t)
                            setShow(false)
                            setDate(new Date(moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0)))
                            storeDataInLocalStorage('alarmE1', JSON.stringify(t.nativeEvent.timestamp))
                            setTimeStamp(moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0))
                            console.log("New", moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0))
                        }}
                    />
                        :
                        null

                } */}
                {
                    show2 == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        //display='clock' // Android Only  
                        is24Hour={true} // Android Only 
                        value={date2}
                        onChange={(t) => {
                            setChecked2(false)
                            setShow2(false)
                            setDate2(new Date(moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0)))
                            storeDataInLocalStorage('alarmE2', JSON.stringify(t.nativeEvent.timestamp))
                            setTimeStamp2(new Date(moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0)).getTime())
                            console.log("paris", new Date(moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0)).getTime())
                            //ToastAndroid.show(`Alarm will ring in ${(t.nativeEvent.timestamp - dateForRef)} hours ${(t.nativeEvent.timestamp - dateForRef)} minutes`, ToastAndroid.SHORT)

                        }}
                    />
                        :
                        null
                }
                {
                    show3 == true ? <DateTimePicker
                        mode={"date"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        //display='clock' // Android Only  
                        is24Hour={true} // Android Only 
                        value={date2}
                        onChange={(t) => {
                            setChecked2(false)
                            setShow3(false)
                            setDate2(new Date(moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0)))
                            storeDataInLocalStorage('alarmE2', JSON.stringify(t.nativeEvent.timestamp))
                            setTimeStamp2(new Date(moment(t.nativeEvent.timestamp).seconds(0).milliseconds(0)).getTime())

                            //ToastAndroid.show(`Alarm will ring in ${(t.nativeEvent.timestamp - dateForRef)} hours ${(t.nativeEvent.timestamp - dateForRef)} minutes`, ToastAndroid.SHORT)

                        }}
                    />
                        :
                        null
                }



               
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: H * 0.02,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
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
                                            onCreateTriggerNotification(timeStamp2, "Water Reminder!", "Remember to keep yourself hydrated.", "1")
                                            ToastAndroid.show(`Alarm will ring in ${new Date((Number.parseInt(date2.getTime(), 10))).getHours() - new Date(dateForRef).getHours()} hours ${new Date((Number.parseInt(date2.getTime(), 10))).getMinutes() - new Date(dateForRef).getMinutes()} minutes`, ToastAndroid.SHORT)
                                        }
                                        else if (frequency == "hourly") {
                                            onCreateTriggerNotificationHourly(timeStamp2, "Water Reminder!", "Remember to keep yourself hydrated.", "1")
                                            ToastAndroid.show(`Alarm will ring hourly`, ToastAndroid.SHORT)
                                        }
                                        else if (frequency == "daily") {
                                            onCreateTriggerNotificationDaily(timeStamp2, "Water Reminder!", "Remember to keep yourself hydrated.", "1")
                                            ToastAndroid.show(`Alarm will ring daily`, ToastAndroid.SHORT)
                                        }
                                        else if (frequency == "weekly") {
                                            onCreateTriggerNotificationWeekly(timeStamp2, "Water Reminder!", "Remember to keep yourself hydrated.", "1")
                                            ToastAndroid.show(`Alarm will ring every week`, ToastAndroid.SHORT)
                                        }
                                        return true
                                    }
                                });
                            }}
                        />
                        <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Remind me{" "}

                            <Text onPress={() => {
                                setFrequency(
                                    (prev) => {
                                        if (prev == "once") {
                                            setChecked2(false)
                                            return "hourly"
                                        }
                                        else if (prev == "hourly") {
                                            setChecked2(false)
                                            return "daily"
                                        }
                                        else if (prev == "daily") {
                                            setChecked2(false)
                                            return "weekly"
                                        }
                                        else if (prev == "weekly") {
                                            setChecked2(false)
                                            return "once"
                                        }
                                    })
                            }}
                                style={[styles.text2, { padding: 0 }]}>{frequency}
                            </Text>

                        </Text>
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                left: W * 0.56,
                                flexDirection: "row"
                            }}
                            onPress={() => {
                                setShow2(true)
                            }}>
                            <Text style={[styles.text2, { marginRight: W * 0.02 }]}>{converter(date2.getHours())}:{converter(date2.getMinutes())}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setShow3(true) }}
                            style={{
                                position: "absolute",
                                left: W * 0.68,
                                flexDirection: "row"
                            }} >

                            <Text style={[styles.text2, { left: W * 0.015 }]}>{converter(date2.getDate())}/{converter(date2.getMonth() + 1)}/{date2.getFullYear()}</Text>
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
    }
})
export default ReminderWater

