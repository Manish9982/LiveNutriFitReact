import { StyleSheet, View, Dimensions, ActivityIndicator, Image, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Text, Divider } from 'react-native-paper'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, W } from '../colorSchemes/ColorSchemes'

import LocalizedStrings from 'react-native-localization';
import hindi from '../hi'
import english from '../en'
import { useIsFocused } from '@react-navigation/native'
import { getDataFromLocalStorage } from '../local storage/LocalStorage';
import HeaderForSubmissionScreens from './Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens';

import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { useLocales } from '../utils/LocalizationUtil';

const screenWidth = Dimensions.get("window").width * 0.94;

const data = ['Option 1', 'Option 2', 'Option 3', 'Option 4']; // Your array of values

//linechartdata
const linedata = {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
        {
            data: [500, 1500, 1000, 800, 1500, 700, 2000],
            // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Change the color to red

            strokeWidth: 3 // optional
        }
    ],
    legend: ["Step Counts"] // optional

};


// const linedata = {
//     labels: ["{strings.Mon}", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     data: [100, 50, 40, 75, 100, 150, 50],
//     color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
//     strokeWidth: 2,
//     legend: "Total Steps",
//   };


const date = new Date()

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const SubmitSteps = () => {
    const isFocused = useIsFocused()
    const [graphData, setGraphData] = useState(null)
    const [loader, setLoader] = useState(true)
    const [data, setData] = useState(null)
    const [myCalendar, setMyCalendar] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState("java")

    const strings = useLocales()

    useEffect(() => {
        getCalendar()
        getWeeklyOverview()
        getSelectedOption()
    }, [])

    useEffect(() => { getLanguage() }, [isFocused])

    const languages = [
        { label: 'MI Band', value: 'mi' },
        { label: 'Fitbit', value: 'fitbit' },
        { label: 'AppleHealth', value: 'applehealth' },
        // Add more language options as needed
    ];


    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")



    }

    const getCalendar = async () => {
        var formdata = new FormData()
        formdata.append('lang', strings.code)
        const result = await PostApiData('calendar', formdata)
        setMyCalendar(result)
    }

    const getSelectedOption = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("activity_id", "6")
        const task = await PostApiData('user_dashboard_progress_details_today', formdata)
        setData(task)
        setLoader(false)
    }

    const getWeeklyOverview = async () => {
        setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("activity_id", "6");
        const result = await PostApiData('DashboardApi/new_weekly_overview', formdata)
        setGraphData(result)
        setLoader(false)
    }


    const dontDisplay = () => {
        return (
            <View style={styles.filler}>
                <View style={styles.dontDisplay}></View>
            </View>
        )
    }

    handleDataPointClick = ({ value, index }) => {
        const { datasets } = linedata;
        const yValue = datasets[0].data[index];
        console.log('Y-axis value:', yValue);
        ToastAndroid.show("Step Count:- " + yValue, ToastAndroid.SHORT);
        // You can perform further actions with the Y-axis value here
    };



    return (

        loader ?
            <View style={{ height: H, width: W, justifyContent: "center", alignItems: "center" }}>
                < ActivityIndicator size={"large"}
                    color={colors.GREEN} />
            </View >
            :
            <View>
                <HeaderForSubmissionScreens Title={"Total Steps"} />
                <View style={styles.mainContainer}>
                    <View style={styles.Calendar}>
                        <View style={styles.displayDataContainer}>
                            <View>

                                <Text style={[styles.textWeekDays, { color: date.getDate() > myCalendar?.date[0] || date.getDate() < myCalendar?.date[0] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[0]}</Text>
                                <Text style={[styles.textWeekDates, { color: date.getDate() > myCalendar?.date[0] || date.getDate() < myCalendar?.date[0] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.date[0]}</Text></View>
                            <View>
                                <Text style={[styles.textWeekDays, { color: date.getDate() > myCalendar?.date[1] || date.getDate() < myCalendar?.date[1] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[1]}</Text>
                                <Text style={[styles.textWeekDates, { color: date.getDate() > myCalendar?.date[1] || date.getDate() < myCalendar?.date[1] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.date[1]}</Text></View>
                            <View>
                                <Text style={[styles.textWeekDays, { color: date.getDate() > myCalendar?.date[2] || date.getDate() < myCalendar?.date[2] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[2]}</Text>
                                <Text style={[styles.textWeekDates, { color: date.getDate() > myCalendar?.date[2] || date.getDate() < myCalendar?.date[2] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.date[2]}</Text></View>
                            <View>
                                <Text style={[styles.textWeekDays, { color: date.getDate() > myCalendar?.date[3] || date.getDate() < myCalendar?.date[3] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[3]}</Text>
                                <Text style={[styles.textWeekDates, { color: date.getDate() > myCalendar?.date[3] || date.getDate() < myCalendar?.date[3] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.date[3]}</Text></View>
                            <View>
                                <Text style={[styles.textWeekDays, { color: date.getDate() > myCalendar?.date[4] || date.getDate() < myCalendar?.date[4] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[4]}</Text>
                                <Text style={[styles.textWeekDates, { color: date.getDate() > myCalendar?.date[4] || date.getDate() < myCalendar?.date[4] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.date[4]}</Text></View>
                            <View>
                                <Text style={[styles.textWeekDays, { color: date.getDate() > myCalendar?.date[5] || date.getDate() < myCalendar?.date[5] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[5]}</Text>
                                <Text style={[styles.textWeekDates, { color: date.getDate() > myCalendar?.date[5] || date.getDate() < myCalendar?.date[5] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.date[5]}</Text></View>
                            <View>
                                <Text style={[styles.textWeekDays, { color: date.getDate() > myCalendar?.date[6] || date.getDate() < myCalendar?.date[6] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[6]}</Text>
                                <Text style={[styles.textWeekDates, { color: date.getDate() > myCalendar?.date[6] || date.getDate() < myCalendar?.date[6] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.date[6]}</Text></View>

                        </View>
                    </View>
                    <Text style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: fontSizes.XXL
                    }}>Today's Steps</Text>
                    <View style={styles.ApiDataText}>
                        {/* {data?.data[0].selected_text} */}
                        <Text style={{
                            textAlign: "center", ...fontFamily.bold,
                            fontSize: fontSizes.XL
                        }}>1.5k</Text>
                    </View>

                    <Text style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: fontSizes.LAR
                    }}>Select Device</Text>


                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        borderRadius: 3,
                        width: W * 0.8,
                        marginTop: 10
                    }}>

                        <Picker
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}>
                            {languages.map((language, index) => (
                                <Picker.Item label={language.label} value={language.value} key={index} />
                            ))}
                        </Picker>
                    </View>



                    <Text style={{
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        marginTop: 20,
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: fontSizes.LAR,
                        marginStart: W * 0.05
                    }}>{strings.WeeklyOverview}</Text>


                    {/*///////////////////////////////////////////graph view/////////////////////////// */}
                    <View style={styles.graphView}>

                        <LineChart
                            data={linedata}
                            width={screenWidth}
                            height={200}
                            chartConfig={chartConfig}
                            onDataPointClick={handleDataPointClick} />
                    </View>

                </View>
            </View>

    )
}
const chartConfig = {
    //  backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    width: W * 0.94,
    //   backgroundGradientTo: "#08130D",
    backgroundGradientTo: "silver",
    backgroundGradientToOpacity: 0.5,
    //color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    color: (opacity = 0.5) => `rgba(0, 128, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,// optional
    decimalPlaces: 0, // Set decimal places to 0

};
const styles = StyleSheet.create({

    mainContainer:
    {
        height: HEIGHT,
        width: WIDTH,
        alignItems: 'center',
    },
    Calendar:
    {
        height: HEIGHT * 0.1,
        width: WIDTH * 0.92,
        backgroundColor: 'white',
        marginVertical: HEIGHT * 0.02,
        justifyContent: 'center',
        borderRadius: 4,

    },
    displayDataContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: HEIGHT * 0.007,
    },
    textWeekDates:
    {
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',


    },
    textWeekDays:
    {
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
        color: 'black',
    },
    xaxis:
    {
        borderWidth: 0.3,
        width: WIDTH * 0.85,
        borderColor: 'silver',
        marginLeft: WIDTH * 0.1
    },
    yaxis:
    {
        borderWidth: 0.3,
        width: 1,
        height: HEIGHT * 0.3,
        borderColor: 'silver',

    },
    xaxisContainer:
    {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: WIDTH * 0.82,
        marginLeft: WIDTH * 0.104,
    },
    yaxisContainer:
    {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    graphView:
    {
        width: WIDTH * 0.94,
        height: HEIGHT * 0.4,
        marginTop: HEIGHT * 0.02
    },
    markerContainer:
    {
        justifyContent: "space-between",
        height: HEIGHT * 0.23,
        width: WIDTH,
        position: 'absolute',
        backgroundColor: 'transparent',
        top: HEIGHT * 0.402
    },
    goodMarker:
    {
        borderColor: "green",
        borderWidth: 1,
        height: 1,
        width: WIDTH * 0.87,
        borderBottomWidth: 0,
        borderStyle: 'dashed',
        alignSelf: 'flex-end'
    },
    okMarker:
    {
        borderColor: '#ebdd46',
        borderWidth: 1,
        height: 1,
        width: WIDTH * 0.87,
        borderBottomWidth: 0,
        borderStyle: 'dashed',
        alignSelf: 'flex-end'
    },
    badMarker:
    {
        borderColor: 'red',
        borderWidth: 1,
        height: 1,
        width: WIDTH * 0.87,
        borderBottomWidth: 0,
        borderStyle: 'dashed',
        alignSelf: 'flex-end'
    },
    ApiDataText:
    {
        height: HEIGHT * 0.1,
        justifyContent: 'center',
        width: WIDTH * 0.85,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: HEIGHT * 0.02
    },
    badGraph:
    {
        height: HEIGHT * 0.05,
        backgroundColor: 'red',
        width: WIDTH * 0.02,
        alignSelf: 'flex-end',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,

    },
    okGraph:
    {
        height: HEIGHT * 0.165,
        backgroundColor: '#ebdd46',
        width: WIDTH * 0.02,
        alignSelf: 'flex-end',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    goodGraph:
    {
        height: HEIGHT * 0.28,
        backgroundColor: 'green',
        width: WIDTH * 0.02,
        alignSelf: 'flex-end',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    filler:
    {
        alignSelf: 'flex-end',
        width: WIDTH * 0.1,
        paddingRight: WIDTH * 0.04,
        zIndex: 1,
    },
    fillerTwo:
    {
        width: WIDTH * 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
})
export default SubmitSteps
