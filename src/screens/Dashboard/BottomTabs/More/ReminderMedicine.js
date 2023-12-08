import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Switch, Checkbox, Divider } from 'react-native-paper'
import { colors, fontSizes } from '../../../../colorSchemes/ColorSchemes';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderForReminder from './HeaderForReminder';
import { storeDataInLocalStorage, getDataFromLocalStorage } from '../../../../local storage/LocalStorage';

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const ReminderExcercise = () => {

    useEffect(() => { getUserAlarms() }, [])

    const getUserAlarms = async () => {
        const temp = await getDataFromLocalStorage('alarmM1')
        if (temp)
            setDate(new Date(JSON.parse(temp)))
        else setDate(new Date())

        const temp2 = await getDataFromLocalStorage('alarmM2')
        if (temp2)
            setDate2(new Date(JSON.parse(temp2)))
        else setDate2(new Date())
        const temp3 = await getDataFromLocalStorage('alarmM3')
        if (temp3)
            setDate3(new Date(JSON.parse(temp3)))
        else setDate3(new Date())
        const temp4 = await getDataFromLocalStorage('alarmM4')
        if (temp4)
            setDate4(new Date(JSON.parse(temp4)))
        else setDate4(new Date())
        const temp5 = await getDataFromLocalStorage('alarmM5')
        if (temp5)
            setDate5(new Date(JSON.parse(temp5)))
        else setDate5(new Date())
        const temp6 = await getDataFromLocalStorage('alarmM6')
        if (temp6)
            setDate6(new Date(JSON.parse(temp6)))
        else setDate6(new Date())

    }

    const alarm = new Date()
    const alarm2 = new Date()
    const alarm3 = new Date()
    const alarm4 = new Date()
    const alarm5 = new Date()
    const alarm6 = new Date()


    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    const [checked5, setChecked5] = useState(false);
    const [checked6, setChecked6] = useState(false);
    const [date, setDate] = useState(alarm) // to set default from props or current date
    const [date2, setDate2] = useState(alarm2) // to set default from props or current date
    const [date3, setDate3] = useState(alarm3) // to set default from props or current date
    const [date4, setDate4] = useState(alarm4) // to set default from props or current date
    const [date5, setDate5] = useState(alarm5) // to set default from props or current date
    const [date6, setDate6] = useState(alarm6) // to set default from props or
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)
    const [show5, setShow5] = useState(false)
    const [show6, setShow6] = useState(false)


    const converter = (val) => {
        return val < 10 ? `0${val}` : `${val}`
    }

    const onToggleSwitch = () => {
        setIsSwitchOn((prev) => {
            if (prev == false) {

                setChecked(false)
                setChecked2(false)
                setChecked3(false)
                setChecked4(false)
                setChecked5(false)
                setChecked6(false)

                return (
                    true)


            }

            else {

                return false
            }


        }
        )

    }



    return (
        <View>
            <HeaderForReminder />
            <View style={styles.mainContainer}>

                {
                    show == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        display='clock' // Android Only  
                        // is24Hour={false} // Android Only 
                        value={date}
                        onChange={(t) => {
                            setShow(false)
                            setDate(new Date(t.nativeEvent.timestamp))
                            storeDataInLocalStorage('alarmM1', JSON.stringify(t.nativeEvent.timestamp))
                        }}
                    />
                        :
                        null
                }
                {
                    show2 == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT MORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        display='clock' // Android Only  
                        // is24Hour={false} // Android Only 
                        value={date2}
                        onChange={(t) => {
                            setShow2(false)
                            setDate2(new Date(t.nativeEvent.timestamp))
                            storeDataInLocalStorage('alarmM2', JSON.stringify(t.nativeEvent.timestamp))
                        }}
                    />
                        :
                        null
                }
                {
                    show3 == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT MORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        display='clock' // Android Only  
                        // is24Hour={false} // Android Only 
                        value={date3}
                        onChange={(t) => {
                            setShow3(false)
                            setDate3(new Date(t.nativeEvent.timestamp))
                            storeDataInLocalStorage('alarmM3', JSON.stringify(t.nativeEvent.timestamp))
                        }}
                    />
                        :
                        null
                }
                {
                    show4 == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT MORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        display='clock' // Android Only  
                        // is24Hour={false} // Android Only 
                        value={date4}
                        onChange={(t) => {
                            setShow4(false)
                            setDate4(new Date(t.nativeEvent.timestamp))
                            storeDataInLocalStorage('alarmM4', JSON.stringify(t.nativeEvent.timestamp))
                        }}
                    />
                        :
                        null
                }
                {
                    show5 == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT MORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        display='clock' // Android Only  
                        // is24Hour={false} // Android Only 
                        value={date5}
                        onChange={(t) => {
                            setShow5(false)
                            setDate5(new Date(t.nativeEvent.timestamp))
                            storeDataInLocalStorage('alarmM5', JSON.stringify(t.nativeEvent.timestamp))
                        }}
                    />
                        :
                        null
                }
                {
                    show6 == true ? <DateTimePicker
                        mode={"time"} // THIS DOES NOT MORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                        display='clock' // Android Only  
                        // is24Hour={false} // Android Only 
                        value={date6}
                        onChange={(t) => {
                            setShow6(false)
                            setDate6(new Date(t.nativeEvent.timestamp))
                            storeDataInLocalStorage('alarmM6', JSON.stringify(t.nativeEvent.timestamp))

                        }}
                    />
                        :
                        null
                }



                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ marginLeft: WIDTH * 0.03, fontSize: fontSizes.XL }}>Turn off Reminders</Text>
                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={colors.GREEN} style={styles.switch} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={isSwitchOn}
                            style={styles.checkBox}
                            color={colors.GREEN}
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked(!checked);
                            }}
                        />
                        <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Remind me every day at</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShow(true)}>
                        <Text style={styles.text2}>{converter(date.getHours())}:{converter(date.getMinutes())}</Text>
                    </TouchableOpacity>
                </View>
                <Divider style={{ borderWidth: 0.2, borderColor: 'silver' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={isSwitchOn}
                            style={styles.checkBox}
                            color={colors.GREEN}
                            status={checked2 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked2(!checked2);
                            }}
                        />
                        <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Breakfast</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setShow2(true)
                    }}>
                        <Text style={styles.text2}>{converter(date2.getHours())}:{converter(date2.getMinutes())}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={isSwitchOn}
                            style={styles.checkBox}
                            color={colors.GREEN}
                            status={checked3 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked3(!checked3);
                            }}
                        />
                        <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Morning Snack</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setShow3(true)
                    }}>
                        <Text style={styles.text2}>{converter(date3.getHours())}:{converter(date3.getMinutes())}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={isSwitchOn}
                            style={styles.checkBox}
                            color={colors.GREEN}
                            status={checked4 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked4(!checked4);
                            }}
                        />
                        <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Lunch</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setShow4(true)
                    }}>
                        <Text style={styles.text2}>{converter(date4.getHours())}:{converter(date4.getMinutes())}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                                disabled={isSwitchOn}
                                style={styles.checkBox}
                                color={colors.GREEN}
                                status={checked5 ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked5(!checked5);
                                }}
                            />
                            <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Evening Snack</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setShow5(true)
                    }}>
                        <Text style={styles.text2}>{converter(date5.getHours())}:{converter(date5.getMinutes())}</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            disabled={isSwitchOn}
                            style={styles.checkBox}
                            color={colors.GREEN}
                            status={checked6 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked6(!checked6);
                            }}
                        />
                        <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>Dinner</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setShow6(true)
                    }}>
                        <Text style={styles.text2}>{converter(date6.getHours())}:{converter(date6.getMinutes())}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        </View>
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

    },
    text2:
    {
        fontFamily: 'Montserrat-SemiBold',
        backgroundColor: '#e1e3e6',
        padding: WIDTH * 0.01,
        borderRadius: 5,
    }
})
export default ReminderExcercise
