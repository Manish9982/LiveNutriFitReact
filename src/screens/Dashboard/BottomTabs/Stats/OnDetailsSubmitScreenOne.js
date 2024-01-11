import { StyleSheet, View, Dimensions, Image, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider, Text, Dialog, Portal, Button, Paragraph } from 'react-native-paper'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { LineChart } from "react-native-chart-kit";
import HeaderForOnDetailsSubmitScreenOne from './HeaderForOnDetailsSubmitScreenOne';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';
import { Picker } from '@react-native-picker/picker';
import Svg, { Rect, Text as TextSVG } from 'react-native-svg';
import moment from 'moment/moment';

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


const OnDetailsSubmitScreenOne = ({ navigation }) => {

  const isFocused = useIsFocused()

  useEffect(() => {
    getGraphForSystolic(`${selectedYear}-${selectedMonth}-11`)
    getGraphForProjectedWeight("1")
    //getPlanArray("1")
  }, [])


  useEffect(() => { getLanguage() }, [isFocused])


  //lng
  const getLanguage = async () => {
    const lang = await getDataFromLocalStorage("lang")

    if (lang == "en") {
      changeLanguage('en')

    } else {
      changeLanguage('hi')

    }

  }


  const changeLanguage = (languageKey) => {
    strings.setLanguage(languageKey)
  }

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
  const [data, setData] = useState(null)
  const [loader, setLoader] = useState(true)
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
  const [targetWeight, setTargetWeight] = useState([0, 0, 0, 0, 0])
  const [modalReset, setModalReset] = useState(false)

  const getPlanArray = (plan) => {
    var arr = []
    var arrMonths = []
    var current_weight = 90
    var target_weight = 75
    if (current_weight > target_weight) {
      var diff = current_weight - target_weight
      for (let i = 0; i < diff; i++) {
        if (current_weight > target_weight)
          arr.push(current_weight - plan)
        arrMonths.push(moment().add(i, 'months').format('MMMM'))
        current_weight = current_weight - plan
      }
    }
    else if (current_weight < target_weight) {
      var diff = target_weight - current_weight
      for (let i = 0; i < diff; i++) {
        if (current_weight < target_weight)
          arr.push(current_weight + plan)
        arrMonths.push(moment(6).add(i, 'months').format('MMM'))
        current_weight = current_weight + plan
      }
    }
    console.log("array==>", arr)
    console.log("arrayM==>", arrMonths)
  }

  const resetGraph = async () => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    //formdata.append("user_id", '805');
    formdata.append("userplan", "1")
    formdata.append("reset", "1")
    const result = await PostApiData('projected_weight', formdata)
    console.log(result)
    if (result?.status == 200) {
      var res = result?.data?.projected_weight.map(function (x) {
        return Number.parseInt(x, 10);

      });
      var res2 = result?.data?.target_weight.map(function (x) {
        return Number.parseInt(x, 10);
      })
      console.log(res)
      if (res.length > 8) {
        res.length = Math.min(res.length, 8)
        setDiastolicData(res)

      }
      else setDiastolicData(res)
      if (res2.length > 8) {
        res2.length = Math.min(res2.length, 8)
        setTargetWeight(res2)
      }
      else setTargetWeight(res2)
      if (result?.data?.date.length > 8) {
        var res3 = result?.data?.date
        res3.length = Math.min(res3.length, 8)
        setXaxis(res3)
      }
      else setXaxis(result?.data?.date)


      setLoader(false)
    }
    else {
      ShortToast(result.message, 'warning', '')
      setDiastolicData([0, 0, 0, 0, 0])
      setTargetWeight([0, 0, 0, 0, 0])
      setLoader(false)
    }
    setLoader(false)
    setModalReset(false)
  }


  const getGraphForSystolic = async (dat) => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    //formdata.append("user_id", '805');
    //formdata.append("date", dat)
    const result = await PostApiData('current_weight_graph', formdata)
    console.log("dat---->", dat)
    if (result?.status == 200) {
      const res = result?.data?.weight.map(function (x) {
        return Number.parseInt(x, 10);
      });
      console.log(res)
      setSystolicData(res)

    }
    else {
      ShortToast(result.message, 'warning', '')
      navigation.goBack()
      setSystolicData([0, 0, 0, 0, 0])
    }
  }
  const getGraphForProjectedWeight = async (plan) => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    //formdata.append("user_id", '805');
    formdata.append("userplan", plan)
    const result = await PostApiData('projected_weight', formdata)
    console.log(result)
    if (result?.status == 200) {
      var res = result?.data?.projected_weight.map(function (x) {
        return Number.parseInt(x, 10);

      });
      var res2 = result?.data?.target_weight.map(function (x) {
        return Number.parseInt(x, 10);
      })
      console.log(res)
      if (res.length > 8) {
        res.length = Math.min(res.length, 8)
        setDiastolicData(res)

      }
      else setDiastolicData(res)
      if (res2.length > 8) {
        res2.length = Math.min(res2.length, 8)
        setTargetWeight(res2)
      }
      else setTargetWeight(res2)
      if (result?.data?.date.length > 8) {
        var res3 = result?.data?.date
        res3.length = Math.min(res3.length, 8)
        setXaxis(res3)
      }
      else setXaxis(result?.data?.date)


      setLoader(false)
    }
    else if (plan == "1") {
      console.log("done")
    }
    else {

      setDiastolicData([0, 0, 0, 0, 0])
      setTargetWeight([0, 0, 0, 0, 0])
      ShortToast(result.message, 'warning', '')
      setLoader(false)
    }
    setLoader(false)
  }
  // console.log(((date.getMonth() + 1).toString().padStart(2, 0)))
  console.log("moment===>", moment("Jun", "MMM").add(2, 'months').format('MMMM'))

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
          <Portal>
            <Dialog visible={modalReset} onDismiss={() => setModalReset(false)}>
              <Dialog.Content>
                <Paragraph>All your previous records won't be visible on graph. Are you sure you want to reset your progress?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>

                <Button onPress={() => setModalReset(false)}>Cancel</Button>
                <Button onPress={() => resetGraph()}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
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

            {<View style={styles.goalProjection}>
              <TouchableOpacity onPress={() => {
                getGraphForProjectedWeight("1")
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
                getGraphForProjectedWeight("2")
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
                getGraphForProjectedWeight("3")
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
                getGraphForProjectedWeight("4")
              }}>
                <View style={styles.goalProjectionNumber}>
                  <View style={[styles.circularDisplayContainer, { backgroundColor: '#ed9145' }]}>
                    <Text style={styles.textNumber}>4</Text>
                  </View>
                  <Text style={styles.textGoal}>4 kg/Month</Text>
                  <Text style={styles.textDifficulty}>Hard</Text>
                </View>
              </TouchableOpacity>
              { /* <Divider style={styles.dividerStyle} />
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
            </TouchableOpacity>*/}

            </View>}

            {/*  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: WIDTH * 0.9, alignItems: "center" }}>

              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.XL }}>Weight</Text>
              <Picker
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
              </Picker>

            </View>*/}
            <TouchableOpacity
              onPress={() => { setModalReset(true) }}
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: 10,
                marginTop: H * 0.02,
                marginLeft: W * 0.54,
              }}>
              <Text>Reset Graph <AntDesign name="retweet" color={colors.GREEN} /></Text>
            </TouchableOpacity>
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
              data={{
                labels: xaxis,
                datasets: [
                  {
                    //current
                    data: systolicData,
                    strokeWidth: 2,
                    //color: (opacity = 1) => `rgba(255,0,0,${opacity})`
                  },
                  {
                    //expected or projected
                    data: diastolicData,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(0,102,0, ${opacity})`,
                  },
                  {
                    //target
                    data: targetWeight,
                    strokeWidth: 2,
                    color: (opacity = 1) => `red`,
                  },

                ],
                legend: ['Current', 'Expected', 'Target']
              }}
              width={WIDTH * 0.9} // from react-native
              height={HEIGHT * 0.38}
              yAxisSuffix=" Kgs"
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
                  r: "4",
                  strokeWidth: "1",
                  stroke: "#ffa726"
                },

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

              style={{ borderRadius: 10, backgroundColor: 'white', padding: 10, margin: HEIGHT * 0.015, marginTop: H * 0.02 }}
            />

            {/*   <LineChart
              //bezier
              withHorizontalLabels={false}
              withVerticalLabels={false}
              data={{
                labels: [' 1', ' 2', ' 3', ' 4', ' 5', ' 6'],
                datasets: [
                  {
                    data: [1, 3, 10, 11.2, 11.6, 14],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(255,0,0,${opacity})`, // optional
                  },
                  {
                    data: [11, 11, 11, 11, 11, 11],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(0,102,0, ${opacity})`, // optional
                  },
                ],
                legend: ['Current Weight', 'Projected Weight'],
              }}
              width={Dimensions.get('window').width - 16}
              height={200}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />*/}

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
export default OnDetailsSubmitScreenOne
