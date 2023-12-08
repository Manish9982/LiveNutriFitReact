import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Divider } from 'react-native-paper'
import { Checkbox } from 'react-native-paper'
import { H, PostApiData, W, colors } from '../../colorSchemes/ColorSchemes'
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
import DateTimePicker from '@react-native-community/datetimepicker';
import { ShortToast } from '../../colorSchemes/ColorSchemes'
import { formatTimestamp } from '../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'






const ReminderItem = ({ date, reminder, remindersection, time, checked, onChecked, everydayreminder, isswitchon }) => {
    const alarm = new Date()
    const [alarmdate, setDate] = useState(alarm)
    // const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false)


console.log("VALUEEEEEEEEEEEEEEEEEEEEEEEEEEEE====", isswitchon)
    const converter = (val) => {
        return val < 10 ? `0${val}` : `${val}`
    }


    const onCheckAPI = async (time) => {
        const UserId = await getDataFromLocalStorage('user_id')
        var formdata = new FormData()
        formdata.append('user_id', JSON.parse(UserId))
        formdata.append('date', formatTimestamp(Date.now()))
        //formdata.append('time', "19:24")
        formdata.append('time', `${converter((time || alarmdate).getHours())}:${converter((time || alarmdate).getMinutes())}`)
        formdata.append('everyday', everydayreminder)
        formdata.append('reminder_section', remindersection)
        formdata.append('reminder_type', "1")
        formdata.append('reminder_key', checked ? "0" : "1")
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




<Text style={[styles.textgray, {
                            marginLeft: W * 0.04
                        }]}>{remindersection}</Text>
                   

                    <TouchableOpacity

                        onPress={() => {
                            setShow(true)
                        }}
                        style={{ left: W * 0.85, position: 'absolute' }}>


                        <Text style={styles.text2}>{converter((alarmdate || time).getHours())}:
                            {converter((alarmdate || time).getMinutes())}</Text>
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
    textgray:
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
export default ReminderItem