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
import SweetAlert from 'react-native-sweet-alert';
import Loader from '../../../../assets/components/Loader';

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const date = new Date()

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});



const WHRSubmitMedium = ({ navigation }) => {

    const isFocused = useIsFocused()

    useEffect(() => {
        getGraphForSystolic(`${selectedYear}-${selectedMonth}-11`)
    }, [])

    useEffect(() => { getLanguage() }, [isFocused])

    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(lang)

    }

    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
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
        const result = await PostApiData('whr_graph', formdata)
        console.log("dat---->", dat)
        if (result?.status == 200) {
            const res = result?.data?.whr.map(function (x) {
                return Number.parseFloat(x, 10)
            });
            console.log(res)
            setSystolicData(res)
            setXaxis(result?.data?.date)

        }
        else {
            SweetAlert.showAlertWithOptions({
                title: strings.whrnovalue,
                subTitle: '',
                confirmButtonTitle: 'OK',
                confirmButtonColor: colors.GREEN,
                otherButtonTitle: 'Cancel',
                otherButtonColor: '#dedede',
                style: 'warning',
                cancellable: true,
            },
                callback => navigation.navigate("WHRsubmit")
            )
            setSystolicData([0, 0, 0, 0, 0])
        }
        setLoader(false)
    }
    console.log(((date.getMonth() + 1).toString().padStart(2, 0)))
    return (
        loader ?
            <>
                <Loader />
            </>
            :
            <>
                <View>
                    <HeaderForSubmissionScreens Title={strings.WHRGraph} />
                    <ScrollView contentContainerStyle={styles.mainContainer}>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                         width: WIDTH * 0.9, alignItems: "center" }}>

                            <Text style={{ fontFamily: 'Montserrat-SemiBold', 
                            fontSize: fontSizes.XL }}>{strings.WHR2}</Text>


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
                            data={{
                                labels: xaxis,
                                datasets: [
                                    {
                                        data: systolicData
                                    }
                                ]
                            }}
                            fromZero
                            width={WIDTH * 0.9} // from react-native
                            height={HEIGHT * 0.38}
                            yAxisSuffix="   "
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundGradientFrom: "white",
                                backgroundGradientFromOpacity: 1,
                                backgroundGradientTo: "white",
                                backgroundGradientToOpacity: 1,
                                decimalPlaces: 2, // optional, defaults to 2dp
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
                            style={{ borderRadius: 10, backgroundColor: 'white', marginTop: H * 0.05 }}
                        />
                        <View style={[styles.recordWeightView, { marginTop: H * 0.05 }]}>
                            <Text style={styles.textSet}>{strings.SetWHR}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("WHRsubmit")
                                }}
                                style={styles.nextButton}>
                                <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                                    style={styles.nextButton}>
                                    <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>


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
        paddingVertical: H * 0.1,
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
export default WHRSubmitMedium
