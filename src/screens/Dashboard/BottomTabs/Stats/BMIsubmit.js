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
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const date = new Date()


const BMIsubmit = ({ navigation, route }) => {

  const isFocused = useIsFocused()

  useEffect(() => {
    getGraphForSystolic(`${selectedYear}-${selectedMonth}-11`)
  }, [])

  useEffect(() => { getLanguge() }, [isFocused])

  //lng
  const getLanguge = async () => {
      const lang = await getDataFromLocalStorage("lang")
      if (lang == "en") {
          strings.setLanguage(lang)
      } else {
          strings.setLanguage(lang)

      }
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

  const getColorForGraph = () => {
    if (route.params.bmiValue <= 18.4) {
      return "#ffdf88"
    }
    else if (route.params.bmiValue >= 18.5 && route.params.bmiValue <= 24.9) {
      return "#8cd47e"
    }
    else if (route.params.bmiValue >= 25.0 && route.params.bmiValue <= 39.9) {
      return "#ffb44c"
    }
    else if (route.params.bmiValue >= 40.0) {
      return "#ff6761"
    }
  }

  const getGraphForSystolic = async (dat) => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    //formdata.append("user_id", '805');
    formdata.append("date", dat)
    const result = await PostApiData('bmi_graph', formdata)
    console.log("dat---->", dat)
    if (result?.status == 200) {
      const res = result?.data?.bmi.map(function (x) {
        return Number.parseFloat(x, 10);
      });
      console.log(res)
      setSystolicData(res)
      setXaxis(result?.data?.date)
      setLoader(false)
    }
    else {
      ShortToast("You've not entered BMI value yet. Please add value.", 'warning', '')
      navigation.goBack()
      setSystolicData([0, 0, 0, 0, 0])
    }
  }
  console.log(((date.getMonth() + 1).toString().padStart(2, 0)))
  console.log("========>", route.params.bmiValue)
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
          <HeaderForSubmissionScreens Title={strings.ProgressChart} />
          <ScrollView contentContainerStyle={styles.mainContainer}>
            {/* <View style={styles.Calendar}>
                            <View style={styles.displayDataContainer}>


                                <View >

                                    <Text style={[styles.textWeekDays, { color: date.getDate() > data?.date[0] || date.getDate() < data?.date[0] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.days[0]}</Text>
                                    <Text style={[styles.textWeekDates, { color: date.getDate() > data?.date[0] || date.getDate() < data?.date[0] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.date[0]}</Text></View>
                                <View>
                                    <Text style={[styles.textWeekDays, { color: date.getDate() > data?.date[1] || date.getDate() < data?.date[1] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.days[1]}</Text>
                                    <Text style={[styles.textWeekDates, { color: date.getDate() > data?.date[1] || date.getDate() < data?.date[1] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.date[1]}</Text></View>
                                <View>
                                    <Text style={[styles.textWeekDays, { color: date.getDate() > data?.date[2] || date.getDate() < data?.date[2] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.days[2]}</Text>
                                    <Text style={[styles.textWeekDates, { color: date.getDate() > data?.date[2] || date.getDate() < data?.date[2] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.date[2]}</Text></View>
                                <View>
                                    <Text style={[styles.textWeekDays, { color: date.getDate() > data?.date[3] || date.getDate() < data?.date[3] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.days[3]}</Text>
                                    <Text style={[styles.textWeekDates, { color: date.getDate() > data?.date[3] || date.getDate() < data?.date[3] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.date[3]}</Text></View>
                                <View>
                                    <Text style={[styles.textWeekDays, { color: date.getDate() > data?.date[4] || date.getDate() < data?.date[4] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.days[4]}</Text>
                                    <Text style={[styles.textWeekDates, { color: date.getDate() > data?.date[4] || date.getDate() < data?.date[4] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.date[4]}</Text></View>
                                <View>
                                    <Text style={[styles.textWeekDays, { color: date.getDate() > data?.date[5] || date.getDate() < data?.date[5] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.days[5]}</Text>
                                    <Text style={[styles.textWeekDates, { color: date.getDate() > data?.date[5] || date.getDate() < data?.date[5] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.date[5]}</Text></View>
                                <View>
                                    <Text style={[styles.textWeekDays, { color: date.getDate() > data?.date[6] || date.getDate() < data?.date[6] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.days[6]}</Text>
                                    <Text style={[styles.textWeekDates, { color: date.getDate() > data?.date[6] || date.getDate() < data?.date[6] ? colors.FONT_BLACK : colors.GREEN }]}>{data?.date[6]}</Text></View>


                            </View>
                        </View>*/}

            {/* <View style={styles.goalProjection}>
                            <TouchableOpacity onPress={() => {
                                getGraph("1")
                            }}
                            >
                                <View style={styles.goalProjectionNumber}>
                                    <View style={[styles.circularDisplayContainer, { backgroundColor: '#1c8203' }]}>
                                        <Text style={styles.textNumber}>1</Text>
                                    </View>
                                    <Text style={styles.textGoal}>1 kg/Month</Text>
                                    <Text style={styles.textDifficulty}>Very Easy</Text>
                                </View>
                            </TouchableOpacity>
                            <Divider style={styles.dividerStyle} />
                            <TouchableOpacity onPress={() => {
                                getGraph("2")
                            }}
                            >
                                <View style={styles.goalProjectionNumber}>
                                    <View style={[styles.circularDisplayContainer,]}>
                                        <Text style={styles.textNumber}>2</Text>
                                    </View>
                                    <Text style={styles.textGoal}>2 kg/Month</Text>
                                    <Text style={styles.textDifficulty}>Easy</Text>
                                </View>
                            </TouchableOpacity>
                            <Divider style={styles.dividerStyle} />
                            <TouchableOpacity onPress={() => {
                                getGraph("3")
                            }}>
                                <View style={styles.goalProjectionNumber}>
                                    <View style={[styles.circularDisplayContainer, { backgroundColor: '#c9b306' }]}>
                                        <Text style={styles.textNumber}>3</Text>
                                    </View>
                                    <Text style={styles.textGoal}>3 kg/Month</Text>
                                    <Text style={styles.textDifficulty}>Moderate</Text>
                                </View>
                            </TouchableOpacity>
                            <Divider style={styles.dividerStyle} />
                            <TouchableOpacity onPress={() => {
                                getGraph("4")
                            }}>
                                <View style={styles.goalProjectionNumber}>
                                    <View style={[styles.circularDisplayContainer, { backgroundColor: '#ed9145' }]}>
                                        <Text style={styles.textNumber}>4</Text>
                                    </View>
                                    <Text style={styles.textGoal}>4 kg/Month</Text>
                                    <Text style={styles.textDifficulty}>Hard</Text>
                                </View>
                            </TouchableOpacity>
                            <Divider style={styles.dividerStyle} />
                            <TouchableOpacity onPress={() => {
                                getGraph("5")
                            }}>
                                <View style={styles.goalProjectionNumber}>
                                    <View style={[styles.circularDisplayContainer, { backgroundColor: '#f70000' }]}>
                                        <Text style={styles.textNumber}>5</Text>
                                    </View>

                                    <Text style={styles.textGoal}>5 kg/Month</Text>
                                    <Text style={styles.textDifficulty}>Very Hard</Text>
                                </View>
                            </TouchableOpacity>

                        </View>*/}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: WIDTH * 0.9, alignItems: "center" }}>

              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.XL }}>BMI</Text>
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
                    data: systolicData
                  }
                ]
              }}
              width={WIDTH} // from react-native
              height={HEIGHT * 0.38}
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundGradientFrom: "white",
                backgroundGradientFromOpacity: 1,
                backgroundGradientTo: "white",
                backgroundGradientToOpacity: 1,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 0) => getColorForGraph(),
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
    fontFamily: fontFamily.bold
  },
  displayDataContainer:
  {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: HEIGHT * 0.007,
  },
})
export default BMIsubmit
