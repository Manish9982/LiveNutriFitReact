import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Divider } from 'react-native-paper'
import { Checkbox } from 'react-native-paper'
import { H, PostApiData, ShortToast, W, colors, fontFamily, fontSizes } from '../../colorSchemes/ColorSchemes'
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatTimestamp } from '../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import ReminderHoursDropDown from '../../screens/Dashboard/BottomTabs/More/Components/ReminderHoursDropDown'




const DATA = [
    {
        id: '1',
        name: '1 hour'
    },
    {
        id: '2',
        name: '3 hour'
    },
    {
        id: '3',
        name: '5 hour'
    },
    {
        id: '4',
        name: '8 hour'
    },
    {
        id: '5',
        name: '10 hour'
    },
    {
        id: '6',
        name: '12 hour'
    },
]



const ReminderItemWater = ({ date, reminder, remindersection, time, checked, onChecked, everydayreminder, isswitchon, timevalue }) => {
    const alarm = new Date()
    const [alarmdate, setDate] = useState(alarm)
    // const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false)
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState('')



  //  console.log("==============================================================", timevalue)

    const converter = (val) => {
        return val < 10 ? `0${val}` : `${val}`
    }


    const onPressOption = (t) => {
        console.log(t)
        setValue(t)
        setVisible(false)

        onCheckAPI("",t)


        // API hit here 
    }

    const onCheckAPI = async (time, hours) => {
        const UserId = await getDataFromLocalStorage('user_id')
        var formdata = new FormData()
        formdata.append('user_id', JSON.parse(UserId))
        formdata.append('date', formatTimestamp(Date.now()))
        //formdata.append('time', "19:24")
        formdata.append('time', `${converter((time || alarmdate).getHours())}:${converter((time || alarmdate).getMinutes())}`)
        formdata.append('everyday', everydayreminder)
        formdata.append('reminder_section', "Water")
        formdata.append('reminder_type', "2")
        formdata.append('reminder_key', checked ? "0" : "1")


        formdata.append('reminderhour', "")
        formdata.append('hourtime', hours)


        const result = await PostApiData('setuserreminder', formdata)
        if (result.status == 200) {
            // setData(result.data)
            onChecked()
            ShortToast(result.message, 'success', '')

        } else {
            ShortToast(result.message, 'error', '')

        }
    }



    return (
        <View style={{}}>

            {
                show == true ? <DateTimePicker
                    mode={"time"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                    display='clock' // Android Only  
                    // is24Hour={false} // Android Only 
                    value={alarmdate}
                    onChange={(t) => {
                        setShow(false)
                        onCheckAPI(new Date(t.nativeEvent.timestamp))
                        setDate(new Date(t.nativeEvent.timestamp))
                        storeDataInLocalStorage('alarmE1',
                            JSON.stringify(t.nativeEvent.timestamp))
                        onCreateTriggerNotification(t.nativeEvent.timestamp - 50000,
                            "Excercise Reminder!", "It's Time for your workout.", "1")
                    }}
                />
                    :
                    null
            }


            <Divider style={{ borderWidth: 0.2, borderColor: 'silver' }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>



                    <Checkbox
                        disabled={isswitchon}
                        //style={styles.checkBox}
                        color={colors.GREEN}
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => onCheckAPI()}
                    />
                    <Text style={[styles.text1, {
                        marginLeft: W * 0.04
                    }]}>{remindersection}</Text>

                    <TouchableOpacity

                        onPress={() => {
                            setShow(true)
                        }}
                        style={{
                            left: W * 0.75, position: 'absolute',
                            fontFamily: fontFamily.bold, top: 0
                        }}>


                        {/* <Text style={styles.text2}>{converter((alarmdate || time).getHours())}:
                            {converter((alarmdate || time).getMinutes())}</Text> */}



                        <ReminderHoursDropDown
                            visible={visible}
                            onPressInputCustomView={() => setVisible(true)}
                            label={"1 Hour"}
                            options={DATA}
                            value={value}
                            onPressOption={(t) => onPressOption(t)}
                        />
                    </TouchableOpacity>
                </View>




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
        justifyContent: 'space-evenly'
    },
    switch:
    {

    },
    text1:
    {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 15,
        color: "#000000"

    },
    text2:
    {
        fontFamily: 'Montserrat-SemiBold',
        backgroundColor: '#e1e3e6',
        padding: WIDTH * 0.01,
        borderRadius: 5,
    }
})
export default ReminderItemWater