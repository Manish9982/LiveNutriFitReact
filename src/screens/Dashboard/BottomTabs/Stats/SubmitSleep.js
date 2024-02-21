import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, Divider } from 'react-native-paper'
import { colors, fontSizes, GetApiData, H, PostApiData, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import { useIsFocused } from '@react-navigation/native'


import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useLocales } from '../../../../utils/LocalizationUtil'


const date = new Date()

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const SubmitSleep = () => {

    const strings = useLocales()

    const isFocused = useIsFocused()

    useEffect(() => { getLanguage() }, [isFocused])

    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            changeLanguage('en')

        } else {
            changeLanguage('hi')

        }

    }


    const changeLanguage = (languageKey) => {
        
    }



    const [graphData, setGraphData] = useState(null)
    const [loader, setLoader] = useState(true)
    const [data, setData] = useState(null)
    const [myCalendar, setMyCalendar] = useState(null)
    useEffect(() => {
        getCalendar()
        getWeeklyOverview()
    }, [])


    const getCalendar = async () => {
        const result = await GetApiData('calendar')
        setMyCalendar(result)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("activity_id", "3")
        const task = await PostApiData('user_dashboard_progress_details_today', formdata)
        console.log(task)
        //+ getLanguage()
        setData(task)
        setLoader(false)
    }
    const getWeeklyOverview = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("activity_id", "3");
        const result = await PostApiData('DashboardApi/new_weekly_overview', formdata)
        setGraphData(result)
        //getLanguage()
        setLoaderGraph(false)
    }
    const dontDisplay = () => {
        return (
            <View style={styles.filler}>
                <View style={styles.dontDisplay}></View>
            </View>
        )
    }
    const bad = () => {
        return (
            <View style={styles.filler}>
                <View style={styles.badGraph}></View>
            </View>
        )
    }
    const ok = () => {
        return (
            <View style={styles.filler}>
                <View style={styles.okGraph}></View>
            </View>
        )
    }
    const good = () => {
        return (

            <View style={styles.filler}>
                <View style={styles.goodGraph}></View>
            </View>
        )
    }

    const attributeShow = (n) => {
        console.log("RECORDDDDDDDDDDDDDDDDDDDDDDDDDDD", n)
        if (n?.status == 203)
            return "No records Found"
        else if (n?.data[0].selected_number == '1')
            return "3-4 Hours"
        else if (n?.data[0].selected_number == '2')
            return "5-7 Hours"
        else if (n?.data[0].selected_number == '3')
            return "7-9 Hours"

    }

    return (

        loader ?
            <View style={{ height: H, width: W, justifyContent: "center", alignItems: "center" }}>
                < ActivityIndicator size={"large"}
                    color={colors.GREEN} />
            </View >
            :
            <View>
                <HeaderForSubmissionScreens Title={strings.SleepProgress} />
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
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.XXL }}>{strings.TodaysSleep} </Text>
                    <View style={styles.ApiDataText}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.LAR, textDecorationLine: 'underline' }}>{attributeShow(data)}</Text>
                    </View>
                    <Text>{strings.WeeklyOverview}</Text>
                    {/*///////////////////////////////////////////graph view/////////////////////////// */}
                    <View style={styles.graphView}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.yaxisContainer}>
                                <Text style={styles.textYaxis}>{strings.Good}</Text>
                                <Text style={styles.textYaxis}>{strings.Ok}</Text>
                                <Text style={styles.textYaxis}>{strings.Bad}</Text>
                            </View>
                            <Divider style={styles.yaxis} />
                            {/*///////////////////////////////////////////BarGraph///////////////////////////////////////// */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: WIDTH * 0.82, }}>


                                {graphData?.data[0].selected_number == '0' ? dontDisplay() : null}
                                {graphData?.data[0].selected_number == '1' ? bad() : null}
                                {graphData?.data[0].selected_number == '2' ? ok() : null}
                                {graphData?.data[0].selected_number == '3' ? good() : null}
                                {/*///////////////////////////////////////////////////////////*/}
                                {graphData?.data[1].selected_number == '0' ? dontDisplay() : null}
                                {graphData?.data[1].selected_number == '1' ? bad() : null}
                                {graphData?.data[1].selected_number == '2' ? ok() : null}
                                {graphData?.data[1].selected_number == '3' ? good() : null}
                                {/*///////////////////////////////////////////////////////////*/}
                                {graphData?.data[2].selected_number == '0' ? dontDisplay() : null}
                                {graphData?.data[2].selected_number == '1' ? bad() : null}
                                {graphData?.data[2].selected_number == '2' ? ok() : null}
                                {graphData?.data[2].selected_number == '3' ? good() : null}
                                {/*///////////////////////////////////////////////////////////*/}
                                {graphData?.data[3].selected_number == '0' ? dontDisplay() : null}
                                {graphData?.data[3].selected_number == '1' ? bad() : null}
                                {graphData?.data[3].selected_number == '2' ? ok() : null}
                                {graphData?.data[3].selected_number == '3' ? good() : null}
                                {/*///////////////////////////////////////////////////////////*/}
                                {graphData?.data[4].selected_number == '0' ? dontDisplay() : null}
                                {graphData?.data[4].selected_number == '1' ? bad() : null}
                                {graphData?.data[4].selected_number == '2' ? ok() : null}
                                {graphData?.data[4].selected_number == '3' ? good() : null}
                                {/*///////////////////////////////////////////////////////////*/}
                                {graphData?.data[5].selected_number == '0' ? dontDisplay() : null}
                                {graphData?.data[5].selected_number == '1' ? bad() : null}
                                {graphData?.data[5].selected_number == '2' ? ok() : null}
                                {graphData?.data[5].selected_number == '3' ? good() : null}
                                {/*///////////////////////////////////////////////////////////*/}
                                {graphData?.data[6].selected_number == '0' ? dontDisplay() : null}
                                {graphData?.data[6].selected_number == '1' ? bad() : null}
                                {graphData?.data[6].selected_number == '2' ? ok() : null}
                                {graphData?.data[6].selected_number == '3' ? good() : null}

                            </View>

                        </View>
                        <Divider style={styles.xaxis} />
                        {/* <View style={styles.xaxisContainer}>

                            <View style={styles.fillerTwo}>
                                <Text style={styles.textXaxis}>{strings.Mon}</Text>
                            </View>
                            <View style={styles.fillerTwo}>
                                <Text style={styles.textXaxis}>Tue</Text>
                            </View>
                            <View style={styles.fillerTwo}>
                                <Text style={styles.textXaxis}>Wed</Text>
                            </View>
                            <View style={styles.fillerTwo}>
                                <Text style={styles.textXaxis}>Thu</Text>
                            </View>
                            <View style={styles.fillerTwo}>
                                <Text style={styles.textXaxis}>Fri</Text>
                            </View>
                            <View style={styles.fillerTwo}>
                                <Text style={styles.textXaxis}>Sat</Text>
                            </View>
                            <View style={styles.fillerTwo}>
                                <Text style={styles.textXaxis}>Sun</Text>
                            </View>
                        </View> */}

                        <View style={styles.xaxisContainer}>

                            <View style={styles.fillerTwo}>
                                {/* <Text style={styles.textXaxis}>Fri</Text> */}
                                <Text style={[styles.textXaxis, { color: date.getDate() > myCalendar?.date[0] || date.getDate() < myCalendar?.date[0] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[0]}</Text>

                            </View>
                            <View style={styles.fillerTwo}>
                                {/* <Text style={styles.textXaxis}>Sat</Text> */}
                                <Text style={[styles.textXaxis, { color: date.getDate() > myCalendar?.date[1] || date.getDate() < myCalendar?.date[1] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[1]}</Text>

                            </View>
                            <View style={styles.fillerTwo}>
                                {/* <Text style={styles.textXaxis}>Sun</Text> */}
                                <Text style={[styles.textXaxis, { color: date.getDate() > myCalendar?.date[2] || date.getDate() < myCalendar?.date[2] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[2]}</Text>

                            </View>
                            <View style={styles.fillerTwo}>
                                {/* <Text style={styles.textXaxis}>{strings.Mon}</Text> */}
                                <Text style={[styles.textXaxis, { color: date.getDate() > myCalendar?.date[3] || date.getDate() < myCalendar?.date[3] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[3]}</Text>

                            </View>
                            <View style={styles.fillerTwo}>
                                {/* <Text style={styles.textXaxis}>Tue</Text> */}
                                <Text style={[styles.textXaxis, { color: date.getDate() > myCalendar?.date[4] || date.getDate() < myCalendar?.date[4] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[4]}</Text>

                            </View>
                            <View style={styles.fillerTwo}>
                                {/* <Text style={styles.textXaxis}>Wed</Text> */}
                                <Text style={[styles.textXaxis, { color: date.getDate() > myCalendar?.date[5] || date.getDate() < myCalendar?.date[5] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[5]}</Text>

                            </View>
                            <View style={styles.fillerTwo}>
                                {/* <Text style={styles.textXaxis}>Thu</Text> */}
                                <Text style={[styles.textXaxis, { color: date.getDate() > myCalendar?.date[6] || date.getDate() < myCalendar?.date[6] ? colors.FONT_BLACK : colors.GREEN }]}>{myCalendar?.days[6]}</Text>

                            </View>
                        </View>
                    </View>
                    {/*///////////////////////////////////////////graph view/////////////////////////// */}
                    <View style={styles.markerContainer}>
                        <View style={styles.goodMarker}></View>
                        <View style={styles.okMarker}></View>
                        <View style={styles.badMarker}></View>
                    </View>
                </View>
            </View>

    )
}

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
        marginTop: HEIGHT * 0.04
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
export default SubmitSleep
