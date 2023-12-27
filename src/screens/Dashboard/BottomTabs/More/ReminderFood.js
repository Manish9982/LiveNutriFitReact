import { StyleSheet, View, Dimensions, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Checkbox, Divider, Switch } from 'react-native-paper'
import { PostApiData, colors, fontSizes } from '../../../../colorSchemes/ColorSchemes';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage';
import { onCreateTriggerNotification } from '../../../../assets/components/NotificationServices';
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens';
import { FlatList } from 'react-native-gesture-handler';
import AlarmComponent from '../../../../assets/components/AlarmComponent';

const APIDATA = {
    status: '200',
    alarmStatus: true,
    data: [
        {
            id: 233,
            meal: 'Breakfast',
            time: '2023-12-27T09:02:26.770Z',
            status: true
        },
        {
            id: 233,
            meal: 'Brunch',
            time: '2023-12-27T09:02:26.770Z',
            status: true
        },
        {
            id: 233,
            meal: 'Lunch',
            time: '2023-12-27T09:02:26.770Z',
            status: true
        },
        {
            id: 233,
            meal: 'Snacks',
            time: '2023-12-27T09:02:26.770Z',
            status: true
        },
        {
            id: 233,
            meal: 'Dinner',
            time: '2023-12-27T09:02:26.770Z',
            status: true
        },
    ]
}
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const ReminderFood = () => {

    const [alarmData, setAlarmData] = useState(null)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        getUserAlarmData()
    }, [])

    const getUserAlarmData = async () => {
        // var formdata = new FormData()
        // formdata.append('id', )
        // const result = await PostApiData('meal_reminders', formdata)
        // {
        //     if(result.status == 200)
        //     {
        setAlarmData(APIDATA)
        setLoader(false)
        //     }
        // }
    }

    const onToggleSwitch = async () => {
        // var formdata = new FormData()
        // formdata.append('id',)
        // const result = await PostApiData('meal_reminders', formdata)
        // {
        //     if (result.status == 200) {
        //        setAlarmData(APIDATA)
        //     }
        // }
    }

    const handleCheckboxPress = async () => {
        // var formdata = new FormData()
        // formdata.append('id',)
        // const result = await PostApiData('meal_reminders', formdata)
        // {
        //     if (result.status == 200) {
        //        setAlarmData(APIDATA)
        //     }
        // }
    }

    const renderAlarms = ({ item, index }) => {
        return (
            <AlarmComponent
                time={new Date(item?.time)}
                active={item?.status}
                mealName={item?.meal}
                id={item?.id}
            />
        )
    }

    console.log("new Date()", new Date())
    return (
        <View>
            <HeaderForSubmissionScreens Title={"Meal Reminders"} />
            <View style={styles.mainContainer}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 }}>
                    <Text style={{ marginLeft: WIDTH * 0.03, fontSize: fontSizes.XL }}>Turn off Reminders</Text>
                    <Switch value={alarmData?.alarmStatus} onValueChange={onToggleSwitch} color={colors.GREEN} style={styles.switch} />
                </View>

                <View style={styles.flatlist}>
                    <FlatList
                        data={alarmData?.data}
                        renderItem={renderAlarms}
                        keyExtractor={(item, index) => `${index}`}
                    />
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
    },
    alarmContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flatlist:
    {
        //backgroundColor: 'red',
        height: HEIGHT * 0.75,
        padding: 10,
    }
})
export default ReminderFood