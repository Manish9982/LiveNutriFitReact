import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, Divider, Text } from 'react-native-paper'
import { colors } from '../../colorSchemes/ColorSchemes'
import DateTimePicker from '@react-native-community/datetimepicker'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const AlarmComponent = ({ id, active, status, onPressCheckBox, mealName, time = new Date() }) => {
    const [show, setShow] = useState(false)
    return (
        <View>
            <View style={styles.alarmContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox.Android
                        disabled={active}
                        style={styles.checkBox}
                        color={colors.GREEN}
                        status={status ? 'checked' : 'unchecked'}
                        onPress={onPressCheckBox}
                    />
                    <Text style={[styles.text1, { marginLeft: WIDTH * 0.04 }]}>{mealName}</Text>
                </View>
                {
                    Platform.OS == "android"
                        ?
                        (
                            show == true
                                ?
                                <DateTimePicker
                                    mode={"time"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                                    display='clock' // Android Only  
                                    // is24Hour={false} // Android Only 
                                    value={time}
                                    onChange={(t) => {
                                        //     setShow(false)
                                        //     setDate(new Date(t.nativeEvent.timestamp))
                                        //     storeDataInLocalStorage('alarmE1', JSON.stringify(t.nativeEvent.timestamp))
                                        //     onCreateTriggerNotification(t.nativeEvent.timestamp - 50000, "Reminder!", "It's Time for your reminder alert!.", "1")

                                    }}
                                />
                                :
                                <TouchableOpacity onPress={() => setShow(true)}>
                                    <Text style={styles.text2}>{converter(date.getHours())}:{converter(date.getMinutes())}</Text>
                                </TouchableOpacity>
                        )
                        :
                        <DateTimePicker
                            mode={"time"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                            display='clock' // Android Only  
                            // is24Hour={false} // Android Only 
                            value={time}
                            onChange={(t) => {
                                // setShow(false)
                                // setDate(new Date(t.nativeEvent.timestamp))
                                // storeDataInLocalStorage('alarmE1', JSON.stringify(t.nativeEvent.timestamp))
                                // onCreateTriggerNotification(t.nativeEvent.timestamp - 50000, "Reminder!", "It's Time for your reminder alert!.", "1")
                            }}
                        />
                }
            </View>
            <Divider style={{ borderWidth: 0.2, borderColor: 'silver' }} />
        </View>
    )
}

export default AlarmComponent

const styles = StyleSheet.create({
    alarmContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:2,
    }
})