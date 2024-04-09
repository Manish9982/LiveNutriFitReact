import { StyleSheet, View, Dimensions, Image, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider, Text, TextInput } from 'react-native-paper'
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
import { useLocales } from '../../../../utils/LocalizationUtil';



const WHRSubmitMedium = ({ navigation }) => {

    const [editWHR, setEditWHR] = useState(false)
    const [waist, setWaist] = useState('')
    const [hip, setHip] = useState('')
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
    const [data, setData] = useState(null)
    const [data2, setData2] = useState(null)
    const [loader, setLoader] = useState(false)

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

    const strings = useLocales()
    const isFocused = useIsFocused()

    useEffect(() => {
        getGraphForSystolic(`${selectedYear}-${selectedMonth}-11`)
    }, [])

    useEffect(() => { getLanguage() }, [isFocused])

    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")


    }
    const getCalendarData = async () => {
        var formdata = new FormData()
        formdata.append('lang', strings.code)
        const result = await PostApiData('calendar', formdata)
        setData(result)
        setLoader(false)
    }

    const updateWHR = async () => {
        setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("waist", waist);
        formdata.append("hip", hip);
        const result = await PostApiData('add_user_whr', formdata)
        if (result?.status == '200') {
            ShortToast(result?.message)
            setEditWHR(false)
            getGraphForSystolic()
        }
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
            setData2(result)
            setWaist(result?.data?.waist)
            setHip(result?.data?.hip)
            const res = result?.data?.whr.map(function (x) {
                return Number.parseFloat(x, 10)
            });
            console.log(res)
            setSystolicData(res)
            setXaxis(result?.data?.date)
        }
        else {
            Alert.alert(strings.whrnovalue)
            setSystolicData([0, 0, 0, 0, 0])
        }
        setLoader(false)
    }
    return (
        loader ?
            <>
                <Loader />
            </>
            :
            <>
                <Modal
                    style={{

                    }}
                    animationType="slide"
                    //presentationStyle='fullScreen'
                    transparent={true}
                    visible={editWHR}
                //visible={true}
                >
                    {/* Input Weights Pop Up */}
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        flex: 1
                    }}>
                        <View style={{
                            width: W * 0.8,
                            backgroundColor: colors.OFFWHITE,
                            borderRadius: 10,
                            alignSelf: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            top: H * 0.07,
                            elevation: 5,
                            padding: 10,
                        }}>
                            <Image source={require('../../../../assets/icons/waist.png')}
                                style={{
                                    height: H * 0.05,
                                    width: H * 0.05,
                                    marginBottom: H * 0.02,
                                }} />
                            {/* Current Weight Input Container */}
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <Text numberOfLines={1}

                                    style={styles.attributeHeading}> {strings.EnterYourWaistValueininch} </Text>
                                <TextInput
                                    value={waist}
                                    onChangeText={(t) => {
                                        setWaist(t)
                                    }}
                                    underlineColor={colors.GREEN}
                                    activeUnderlineColor={colors.GREEN}
                                    style={{
                                        width: W * 0.2,
                                        height: H * 0.07,
                                        alignSelf: "center",
                                        backgroundColor: "white",
                                        margin: 5,
                                    }}
                                    maxLength={5}
                                    keyboardType="numeric"
                                />
                                <Text style={{
                                    color: colors.FONT_BLACK,
                                    marginLeft: W * 0.01
                                }}></Text>
                            </View>
                            {/* Target Weight Input Container */}
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10
                            }}>
                                <Text numberOfLines={1}

                                    style={styles.attributeHeading}>{strings.EnterYourHipValueininch} </Text>
                                <TextInput
                                    underlineColor={colors.GREEN}
                                    onChangeText={(t) => {
                                        setHip(t)
                                    }}
                                    value={hip}
                                    activeUnderlineColor={colors.GREEN}
                                    style={{
                                        width: W * 0.2,
                                        height: H * 0.07,
                                        alignSelf: "center",
                                        backgroundColor: "white",
                                        margin: 5,
                                    }}
                                    keyboardType="numeric"
                                    maxLength={5}
                                />

                            </View>
                            <View style={{ flexDirection: "row", width: W * 0.5, justifyContent: "space-evenly" }}>
                                <TouchableOpacity
                                    //disabled={weightOkButttonDisabled}
                                    onPress={() => {
                                        updateWHR()

                                    }}
                                    style={{
                                        width: W * 0.18,
                                        height: H * 0.04,
                                        backgroundColor: colors.GREEN,
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: H * 0.03,

                                    }}>
                                    <Text style={{
                                        color: "white"
                                    }}>{strings.Ok}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setEditWHR(false)
                                    }}
                                    style={{
                                        width: W * 0.18,
                                        height: H * 0.04,
                                        backgroundColor: "white",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: H * 0.03,
                                    }}>
                                    <Text style={{
                                        color: colors.FONT_BLACK
                                    }}>{strings.Cancel}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View>
                    <HeaderForSubmissionScreens Title={strings.WHRGraph} />
                    <ScrollView contentContainerStyle={styles.mainContainer}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            width: WIDTH * 0.9, alignItems: "center"
                        }}>
                            <Text style={{
                                fontFamily: 'Montserrat-SemiBold',
                                fontSize: fontSizes.XL
                            }}>{strings.WHR2}</Text>
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
                        <Text style={{
                            fontSize: fontSizes.XL,
                            fontWeight: '500',
                            padding: 10,
                        }}>Current WHR: {data2?.data?.whr_latest}</Text>
                        <Text style={{
                            fontSize: fontSizes.XL,
                            fontWeight: '500',
                            padding: 10,
                            color:data2?.data?.whr_color
                        }}>Risk: {data2?.data?.whr_status}</Text>
                        <Image
                            source={{ uri: data2?.data?.silhouette }}
                            //source={require('../../../../assets/icons/whrsil.png')}
                            style={styles.sil} />

                        <View style={[styles.recordWeightView, { marginTop: H * 0.05 }]}>
                            <Text style={styles.textSet}>{strings.SetWHR}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setEditWHR(true)
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
        paddingBottom: H * 0.2,
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
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        padding: 10,
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
    sil: {
        height: H * 0.3,
        width: H * 0.3 * 0.45,
        alignSelf: "center",
        marginTop: H * 0.05
    },
    attributeHeading:
    {
        fontSize: fontSizes.LAR,
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: '600',
    }
})
export default WHRSubmitMedium
