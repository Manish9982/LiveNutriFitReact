import { StyleSheet, View, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider, Text } from 'react-native-paper'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { LineChart } from "react-native-chart-kit";
import HeaderForOnDetailsSubmitScreenOne from './HeaderForOnDetailsSubmitScreenOne';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';
import { Picker } from '@react-native-picker/picker';
import Svg, { Rect, Text as TextSVG } from 'react-native-svg';


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const date = new Date()


const OnDetailsSubmitScreenTwo = ({ navigation }) => {

    useEffect(() => {
        getGraphForSystolic(`${selectedYear}-${selectedMonth}-11`)
        getGraphForDiastolic(`${selectedYear2}-${selectedMonth2}-11`)
    }, [])

    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
    const [tooltipPos2, setTooltipPos2] = useState({ x: 0, y: 0, visible: false, value: 0 })
    const [data, setData] = useState(null)
    const [loader, setLoader] = useState(false)
    const [graphData, setGraphData] = useState([0])
    const [graphDataMonths, setGraphDataMonths] = useState([0])
    const [userPlan, setUserPlan] = useState("1")
    const [selectedMonth, setSelectedMonth] = useState((date.getMonth() + 1).toString().padStart(2, 0));
    const [selectedMonth2, setSelectedMonth2] = useState((date.getMonth() + 1).toString().padStart(2, 0));
    const [selectedMonth3, setSelectedMonth3] = useState((date.getMonth() + 1).toString().padStart(2, 0));
    const [selectedYear, setSelectedYear] = useState((date.getFullYear()).toString());
    const [selectedYear2, setSelectedYear2] = useState((date.getFullYear()).toString());
    const [selectedYear3, setSelectedYear3] = useState((date.getFullYear()).toString());
    const [systolicData, setSystolicData] = useState([0, 0, 0, 0, 0])
    const [diastolicData, setDiastolicData] = useState([0, 0, 0, 0, 0])
    const [bpmData, setBpmData] = useState([0, 0, 0, 0, 0])
    const [xaxis, setXaxis] = useState([0, 0, 0, 0, 0])
    const getCalendarData = async () => {

        const result = await GetApiData('calendar')
        setData(result)
        setLoader(false)
    }

    const getGraphForSystolic = async (dat) => {
        setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        //formdata.append("user_id", '805');
        formdata.append("date", dat)
        const result = await PostApiData('sugar_graph', formdata)
        console.log("dat---->", dat)
        if (result?.status == 200) {
            const res = result?.data?.fasting.map(function (x) {
                return Number.parseInt(x, 10);
            });
            setSystolicData(res)
            setXaxis(result?.data?.fasting_date)
        }
        else {
            setSystolicData([0, 0, 0, 0, 0])
        }
        setLoader(false)
    }
    const getGraphForDiastolic = async (dat) => {
        setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        //formdata.append("user_id", '805');
        formdata.append("date", dat)
        const result = await PostApiData('sugar_graph', formdata)
        if (result?.status == 200) {
            const res = result?.data?.non_fasting.map(function (x) {
                return Number.parseInt(x, 10);
            });
            setDiastolicData(res)
            // setXaxis(result?.data?.date)
        }
        else {
            ShortToast("You've not entered values yet. Please go back and add sugar values.", '', '')
            navigation.goBack()

            setDiastolicData([0, 0, 0, 0, 0])
        }
        setLoader(false)
    }

    console.log(((date.getMonth() + 1).toString().padStart(2, 0)))
    return (
        loader ?
            <>
                <View style={styles.loadingContainer}>
                    <Image source={require('../../../../assets/icons/Spinner-1s-200px.gif')}
                        style={{ height: HEIGHT * 0.15, width: HEIGHT * 0.15 }} />
                </View>
            </>
            :
            <>
                <View>
                    <HeaderForSubmissionScreens Title="Blood Sugar Level" />
                    <ScrollView contentContainerStyle={styles.mainContainer}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: WIDTH * 0.96, alignItems: "center" }}>

                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.LAR, marginVertical: H * 0.02 }}>Fasting Sugar (unit: mg/dL)</Text>
                            {/* <Picker
                                style={{
                                    backgroundColor: "white",
                                    width: W * 0.3,
                                    borderRadius: 8,
                                    elevation: 8,
                                    marginTop: H * 0.015,
                                    fontSize: fontSizes.SM,
                                }}
                                selectedValue={selectedMonth}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedMonth(itemValue)
                                    getGraphForSystolic(`${selectedYear}-${itemValue}-11`)
                                }
                                }>
                                <Picker.Item label="Jan" value="01" />
                                <Picker.Item label="Feb" value="02" />
                                <Picker.Item label="Mar" value="03" />
                                <Picker.Item label="Apr" value="04" />
                                <Picker.Item label="May" value="05" />
                                <Picker.Item label="Jun" value="06" />
                                <Picker.Item label="Jul" value="07" />
                                <Picker.Item label="Aug" value="08" />
                                <Picker.Item label="Sep" value="09" />
                                <Picker.Item label="Oct" value="10" />
                                <Picker.Item label="Nov" value="11" />
                                <Picker.Item label="Dec" value="12" />
                            </Picker>
                            <Picker
                                style={{
                                    backgroundColor: "white",
                                    width: W * 0.33,
                                    borderRadius: 8,
                                    elevation: 8,
                                    marginTop: H * 0.015,
                                }}
                                selectedValue={selectedYear}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedYear(itemValue)
                                    getGraphForSystolic(`${itemValue}-${selectedMonth}-11`)
                                }
                                }>
                                <Picker.Item label={`${date.getFullYear()}`} value={`${date.getFullYear()}`} />
                                <Picker.Item label={`${date.getFullYear() - 1}`} value={`${date.getFullYear() - 1}`} />
                                <Picker.Item label={`${date.getFullYear() - 2}`} value={`${date.getFullYear() - 2}`} />
                                <Picker.Item label={`${date.getFullYear() - 3}`} value={`${date.getFullYear() - 3}`} />
                                <Picker.Item label={`${date.getFullYear() - 4}`} value={`${date.getFullYear() - 4}`} />
                            </Picker>*/}

                        </View>
                        <LineChart
                            decorator={() => {
                                return tooltipPos2.visible ? <View>
                                    <Svg>
                                        <Rect x={tooltipPos2.x - 15} y={tooltipPos2.y + 10} width="30"
                                            height="20" fill="grey" />
                                        <TextSVG
                                            x={tooltipPos2.x + 1}
                                            y={tooltipPos2.y + 25}
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="bold"
                                            textAnchor="middle">
                                            {tooltipPos2.value}
                                        </TextSVG>
                                    </Svg>
                                </View> : null
                            }}
                            onDataPointClick={
                                (data) => {
                                    // check if we have clicked on the same point again
                                    let isSamePoint = (tooltipPos2.x === data.x
                                        && tooltipPos2.y === data.y)

                                    // if clicked on the same point again toggle visibility
                                    // else,render tooltip to new position and update its value
                                    isSamePoint ? setTooltipPos2((previousState) => {
                                        return {
                                            ...previousState,
                                            value: data.value,
                                            visible: !previousState.visible
                                        }
                                    })
                                        :
                                        setTooltipPos2({
                                            x: data.x,
                                            value: data.value, y: data.y,
                                            visible: true
                                        });
                                } // end function
                            }
                            fromZero
                            data={{
                                labels: xaxis,
                                datasets: [
                                    {
                                        data: systolicData
                                    }
                                ]
                            }}
                            width={W} // from react-native
                            height={HEIGHT * 0.38}
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundGradientFrom: "white",
                                backgroundGradientFromOpacity: 1,
                                backgroundGradientTo: "white",
                                backgroundGradientToOpacity: 1,
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 0) => "#ffa726",
                                labelColor: (opacity = 1) => `black`,
                                style: {
                                    borderRadius: 1,

                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "1",
                                    stroke: "#ffa726"
                                }
                            }}
                            style={{ borderRadius: 10, backgroundColor: 'white', padding: 10, margin: HEIGHT * 0.015 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: WIDTH * 0.96, alignItems: "center" }}>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.LAR, marginVertical: H * 0.02 }}>Non Fasting  (unit: mg/dL)</Text>
                            { /*  <Picker
                                style={{
                                    backgroundColor: "white",
                                    width: W * 0.3,
                                    borderRadius: 8,
                                    elevation: 8,
                                    marginTop: H * 0.015,
                                    fontSize: fontSizes.SM,
                                }}
                                selectedValue={selectedMonth2}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedMonth2(itemValue)
                                    getGraphForDiastolic(`${selectedYear2}-${itemValue}-11`)
                                }
                                }>
                                <Picker.Item label="Jan" value="01" />
                                <Picker.Item label="Feb" value="02" />
                                <Picker.Item label="Mar" value="03" />
                                <Picker.Item label="Apr" value="04" />
                                <Picker.Item label="May" value="05" />
                                <Picker.Item label="Jun" value="06" />
                                <Picker.Item label="Jul" value="07" />
                                <Picker.Item label="Aug" value="08" />
                                <Picker.Item label="Sep" value="09" />
                                <Picker.Item label="Oct" value="10" />
                                <Picker.Item label="Nov" value="11" />
                                <Picker.Item label="Dec" value="12" />
                            </Picker>
                            <Picker
                                style={{
                                    backgroundColor: "white",
                                    width: W * 0.33,
                                    borderRadius: 8,
                                    elevation: 8,
                                    marginTop: H * 0.015,
                                }}
                                selectedValue={selectedYear2}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedYear2(itemValue)
                                    getGraphForDiastolic(`${itemValue}-${selectedMonth2}-11`)
                                }
                                }>
                                <Picker.Item label={`${date.getFullYear()}`} value={`${date.getFullYear()}`} />
                                <Picker.Item label={`${date.getFullYear() - 1}`} value={`${date.getFullYear() - 1}`} />
                                <Picker.Item label={`${date.getFullYear() - 2}`} value={`${date.getFullYear() - 2}`} />
                                <Picker.Item label={`${date.getFullYear() - 3}`} value={`${date.getFullYear() - 3}`} />
                                <Picker.Item label={`${date.getFullYear() - 4}`} value={`${date.getFullYear() - 4}`} />
                            </Picker>*/}
                        </View>
                        <LineChart
                            decorator={() => {
                                return tooltipPos.visible ? <View>
                                    <Svg>
                                        <Rect x={tooltipPos.x - 15} y={tooltipPos.y + 10} width="30"
                                            height="20" fill="grey" />
                                        <TextSVG
                                            x={tooltipPos.x + 1}
                                            y={tooltipPos.y + 25}
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="bold"
                                            textAnchor="middle">
                                            {tooltipPos.value}
                                        </TextSVG>
                                    </Svg>
                                </View> : null
                            }}
                            onDataPointClick={
                                (data) => {
                                    // check if we have clicked on the same point again
                                    let isSamePoint = (tooltipPos.x === data.x
                                        && tooltipPos.y === data.y)

                                    // if clicked on the same point again toggle visibility
                                    // else,render tooltip to new position and update its value
                                    isSamePoint ? setTooltipPos((previousState) => {
                                        return {
                                            ...previousState,
                                            value: data.value,
                                            visible: !previousState.visible
                                        }
                                    })
                                        :
                                        setTooltipPos({
                                            x: data.x,
                                            value: data.value, y: data.y,
                                            visible: true
                                        });
                                } // end function
                            }
                            fromZero
                            data={{
                                labels: xaxis,
                                datasets: [
                                    {
                                        data: diastolicData
                                    }
                                ]
                            }}
                            width={W} // from react-native
                            height={HEIGHT * 0.38}
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundGradientFrom: "white",
                                backgroundGradientFromOpacity: 1,
                                backgroundGradientTo: "white",
                                backgroundGradientToOpacity: 1,
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 0) => "#ffa726",
                                labelColor: (opacity = 1) => `black`,
                                style: {
                                    borderRadius: 1,

                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "1",
                                    stroke: "#ffa726"
                                }
                            }}
                            style={{ borderRadius: 10, backgroundColor: 'white', }}
                        />


                    </ScrollView>

                </View >
            </>

    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        width: WIDTH,
        alignItems: 'center',
        justifyContent: "space-evenly",
        paddingBottom: H * 0.1,
    },
    loadingContainer:
    {
        justifyContent: 'center',
        alignItems: 'center',
        height: HEIGHT,
        width: WIDTH,
        backgroundColor: 'white',

    },
    Calendar:
    {
        height: HEIGHT * 0.1,
        width: WIDTH * 0.92,
        backgroundColor: 'white',
        marginVertical: HEIGHT * 0.02,
        justifyContent: 'center',
        borderRadius: 8

    },
    displayDataContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: HEIGHT * 0.007,
        borderRadius: 8,
    },
    goalProjection:
    {
        flexDirection: 'row',
        width: WIDTH * 0.93,
        justifyContent: 'space-evenly',
        alignSelf: 'center'
    },
    goalProjectionNumber:
    {
        //backgroundColor: 'purple',
        marginHorizontal: 1,
        height: HEIGHT * 0.15,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    circularDisplayContainer:
    {
        backgroundColor: colors.GREEN,
        height: HEIGHT * 0.06,
        width: HEIGHT * 0.06,
        borderRadius: (HEIGHT * 0.06) / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textGoal:
    {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: fontSizes.SM,
        textAlign: 'center'
    },
    textDifficulty: {
        fontFamily: 'Montserrat-Regular',
        fontSize: fontSizes.SM,
        color: 'grey',
        textAlign: 'center'
    },
    textNumber:
    {
        color: 'white',
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
    dividerStyle:
    {
        borderWidth: 0.2,
        marginTop: HEIGHT * 0.046,
        width: WIDTH * 0.07,
        borderColor: 'silver'
    },
    nextButton:
    {
        borderRadius: 10,
        height: HEIGHT * 0.066,
        width: HEIGHT * 0.066,
        justifyContent: 'center',
        alignItems: 'center',

    },
    recordWeightView:
    {
        height: H * 0.1,
        backgroundColor: "white",
        width: W * 0.9,
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row"

    },
    textSet:
    {
        ...fontFamily.bold
    },
    displayDataContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: HEIGHT * 0.007,
    },
})
export default OnDetailsSubmitScreenTwo
