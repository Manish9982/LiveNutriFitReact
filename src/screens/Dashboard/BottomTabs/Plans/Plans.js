import { StyleSheet, TouchableOpacity, View, Dimensions, StatusBar, RefreshControl, } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fontSizes, colors, GetApiData, H, W, PostApiData, ShortToast } from '../../../../colorSchemes/ColorSchemes';
import CollapsibleMenuForExercise from './CollapsibleMenuForExercise';
import HeaderForPlans from './HeaderForPlans';
import { ActivityIndicator, Appbar, Text } from 'react-native-paper';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';
import { FlatList } from 'react-native-gesture-handler';
import DataContext from '../../../../context/DataContext';
import { useIsFocused } from "@react-navigation/native"
import WeekViewMeals from './WeekViewMeals';
import Loader from '../../../../assets/components/Loader'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import AsyncStorage from '@react-native-async-storage/async-storage';

//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});

const date = new Date()

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const datee = (date.getDate()).toString().padStart(2, '0')
const month = (date.getMonth() + 1).toString().padStart(2, '0')
const year = date.getFullYear().toString()

const Plans = ({ navigation }) => {

  const isFocused = useIsFocused()

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
  useEffect(() => {
    removeValue()
  }, [])

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('upgradepopup')
    } catch (e) {
      // remove error
    }
  }

  const refContainer = useRef(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const { NmyMeals, NmyExercise, NisInfoButtonVisible } = useContext(DataContext)
  const [isInfoButtonVisible, setIsInfoButtonVisible] = NisInfoButtonVisible
  useEffect(() => {
    const getDataFromApi = async () => {
      const result = await GetApiData('new_calendar')
      setMyData(result)
    }
    setIsInfoButtonVisible(false)
    getDataFromApi()
  }, [])

  useEffect(() => {
    getMeals()
  }, [isFocused])

  const [myMeals, setMyMeals] = NmyMeals
  const [myExercise, setMyExercise] = NmyExercise
  const [myData, setMyData] = useState(null)
  const [buttonBgColor, setButtonBgColor] = useState('orange')
  const [buttonBgColor2, setButtonBgColor2] = useState('white')
  const [textColor, setTextColor] = useState('white')
  const [textColor2, setTextColor2] = useState('black')
  const [mealMenuIsVisible, setMealMenuIsVisible] = useState(true)
  const [loader, setLoader] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewCallBack = React.useCallback((viewableItems) => {
    console.log(viewableItems.viewableItems[0].index)
    setCurrentIndex(viewableItems.viewableItems[0].index)
  }, [mealMenuIsVisible])
  const onViewCallBack2 = React.useCallback((viewableItems) => {
    console.log(viewableItems)
    // Use viewable items in state or as intended
  }, [mealMenuIsVisible])
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })
  const viewConfigRef2 = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = (event.nativeEvent.contentOffset.y) / slideSize;
    const roundIndex = Math.round(index);
    console.log("contentHeight", slideSize)
    console.log("offset", event.nativeEvent.contentOffset.y)
    console.log("index", index)
    // setCurrentIndex(Math.round(roundIndex * 10))
  }


  const onRefresh = () => {
    setIsRefreshing(true)
    getMeals()
    getExercise(datee)
    // and set isRefreshing to false at the end of your callApiMethod()
  }




  const throwColorBubble = (n) => {
    if (date.getDate().toString().padStart(2, 0) == n) {
      return colors.GREEN
    }
    else if (selectedDate == n) {
      return "orange"
    }
    else {
      return "white"
    }

  }
  const throwColorText = (n) => {
    if (date.getDate().toString().padStart(2, 0) == n) {
      return "white"
    }
    else if (myData?.date[currentIndex].toString().padStart(2, 0) == n) {
      return "white"
    }
    else {
      return colors.FONT_BLACK
    }

  }




  const getExercise = async (date) => {

    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("date", date);
    formdata.append("month", month);
    formdata.append("year", year);


    const result = await PostApiData('get_userexcersie_list', formdata)

    console.log("EXC DATA == ", result)

    if (result.status == '200') {
      setMyExercise(result)
    }
    else {
      setMyExercise(null)
      ShortToast(result.message, 'error', '')
    }
    setIsRefreshing(false)
    setLoader(false)
  }

  const getMeals = async () => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    const result = await PostApiData('get_meal_list', formdata)
    console.log(result)
    if (result.status == '200') {
      getExercise(datee)

      setMyMeals(result)
    }
    else {
      setMyMeals(null)
      ShortToast(result.message, 'error', '')
    }
    setIsRefreshing(false)
    setLoader(false)

  }

  const renderItem = ({ item }) => {
    return (
      <CollapsibleMenuForExercise Exercise={item.heading}
        List={item.exercise}
        Flag={mealMenuIsVisible}
        Icon='2'
        Follow={item.follow}
      />
    )
  }

  const renderItem2 = ({ item, index }) => {
    return (
      <WeekViewMeals
        date={item?.date}
        day={item?.day}
        meals={item?.meals}

      />
    )
  }

  const handleTouch = (count, index) => {
    refContainer.current.scrollToIndex({ animated: true, index: index })
    setSelectedDate(count)
  }
  const handleTouchExercise = (date, index) => {
    setSelectedDate(date)
    getExercise(date)
  }


  const handleOnPress1 = () => {
    setButtonBgColor(colors.BUTTON_ORANGE)
    setButtonBgColor2('white')
    setTextColor('white')
    setTextColor2('black')
    setMealMenuIsVisible(true)
    setSelectedDate("")
    refContainer?.current?.scrollToIndex({ animated: true, index: 0 })
  }
  const handleOnPress2 = () => {
    setButtonBgColor('white')
    setButtonBgColor2(colors.BUTTON_ORANGE)
    setTextColor('black')
    setTextColor2('white')
    setMealMenuIsVisible(false)
    setSelectedDate("")
    //getExercise(date)
  }

  const renderMealOrExerciseList = (data, renderItemFunction) => {
    return (
      <View style={styles.displayCardsContainer}>
        <FlatList
          ref={refContainer}
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#F8852D"
            />
          }
          renderItem={renderItemFunction}
          listKey={(item, index) => `_key${index.toString()}`}
          keyExtractor={(item, index) => `_key${index.toString()}`}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
        />
      </View>
    );
  };

  return (
    <View>
      <StatusBar backgroundColor={colors.GREEN} />

      <Appbar.Header style={{
        backgroundColor: colors.GREEN,
        width: W
      }}>
        {/* <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} /> */}
        <Appbar.Content style={{
          alignItems: "center",
          //marginRight: W * 0.125 
        }} title={<Text style={{
          color: "white",
          fontSize: fontSizes.XL,
          fontFamily: "Montserrat-SemiBold"
        }}>{strings.Plans}</Text>} />
      </Appbar.Header>


      {
        loader
          ?
          <Loader />
          :
          <View style={styles.mainContainer}>

            <View style={styles.calendar}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly'
              }}>
                {/********************** DAYS*********************/}

                <TouchableOpacity
                  //  onPress={() => mealMenuIsVisible ?refContainer.current.scrollToIndex({ animated: true, index: 0 }):null}>
                  onPress={() => mealMenuIsVisible ? handleTouch((myData?.date[0]), 0) : handleTouchExercise(myData?.date[0], 0)}>
                  <Text style={styles.daysView}>{myData?.days[0]}</Text>
                  <View style={[styles.dateView, { backgroundColor: throwColorBubble(myData?.date[0]) }]}>
                    <Text
                      style={[styles.dates, { color: throwColorText(myData?.date[0]) }]}>{myData?.date[0]}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => mealMenuIsVisible ? handleTouch((myData?.date[1]), 1) : handleTouchExercise(myData?.date[1], 1)
                  }>

                  <Text style={styles.daysView}>{myData?.days[1]}</Text>
                  <View style={[styles.dateView, { backgroundColor: throwColorBubble(myData?.date[1]) }]}>
                    <Text
                      style={[styles.dates, { color: throwColorText(myData?.date[1]) }]}>{myData?.date[1]}</Text>
                  </View>



                </TouchableOpacity>

                <TouchableOpacity

                  style={{
                    //  backgroundColor:'green'
                  }}


                  // onPress={() => mealMenuIsVisible ?  refContainer.current.scrollToIndex({ animated: true, index: 2 }): null}>
                  onPress={() => mealMenuIsVisible ? handleTouch((myData?.date[2]), 2) : handleTouchExercise(myData?.date[2], 2)}>
                  <Text style={styles.daysView}>{myData?.days[2]}</Text>
                  <View style={[styles.dateView, { backgroundColor: throwColorBubble(myData?.date[2]) }]}>
                    <Text
                      style={[styles.dates, { color: throwColorText(myData?.date[2]) }]}>{myData?.date[2]}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  //  onPress={() =>mealMenuIsVisible ? refContainer.current.scrollToIndex({ animated: true, index: 3 }):null}>
                  onPress={() => mealMenuIsVisible ? handleTouch((myData?.date[3]), 3) : handleTouchExercise(myData?.date[3], 3)}>

                  <Text style={styles.daysView}>{myData?.days[3]}</Text>
                  <View style={[styles.dateView, { backgroundColor: throwColorBubble(myData?.date[3]) }]}>
                    <Text
                      style={[styles.dates, { color: throwColorText(myData?.date[3]) }]}>{myData?.date[3]}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => mealMenuIsVisible ?refContainer.current.scrollToIndex({ animated: true, index: 4 }):null}>
                  onPress={() => mealMenuIsVisible ? handleTouch((myData?.date[4]), 4) : handleTouchExercise(myData?.date[4], 4)}>

                  <Text style={styles.daysView}>{myData?.days[4]}</Text>
                  <View style={[styles.dateView, { backgroundColor: throwColorBubble(myData?.date[4]) }]}>
                    <Text style={[styles.dates, { color: throwColorText(myData?.date[4]) }]}>{myData?.date[4]}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() =>mealMenuIsVisible ? refContainer.current.scrollToIndex({ animated: true, index: 5 }):null}>
                  onPress={() => mealMenuIsVisible ? handleTouch((myData?.date[5]), 5) : handleTouchExercise(myData?.date[5], 5)}>
                  {/* onPress={() =>{getExercise()}}> */}

                  <Text style={styles.daysView}>{myData?.days[5]}</Text>
                  <View style={[styles.dateView, { backgroundColor: throwColorBubble(myData?.date[5]) }]}>
                    <Text style={[styles.dates, { color: throwColorText(myData?.date[5]) }]}>{myData?.date[5]}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => mealMenuIsVisible ? refContainer.current.scrollToIndex({ animated: true, index: 6 }):null}>
                  onPress={() => mealMenuIsVisible ? handleTouch((myData?.date[6]), 6) : handleTouchExercise(myData?.date[6], 6)}>
                  {/* onPress={() =>{getExercise()}}> */}

                  <Text style={styles.daysView}>{myData?.days[6]}</Text>
                  <View style={[styles.dateView, { backgroundColor: throwColorBubble(myData?.date[6]) }]}>
                    <Text style={[styles.dates, { color: throwColorText(myData?.date[6]) }]}>{myData?.date[6]}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/********************DATES *********************/}
            </View>

            <View>

              <View style={styles.ButtonDisplayContainer}>
                <TouchableOpacity onPress={() => { handleOnPress1() }} style={[styles.mealButton, { backgroundColor: buttonBgColor }]}>
                  {/* <Text style={[styles.textStyle, { color: textColor }]}>Meal Plan</Text> */}
                  <Text style={[styles.textStyle, { color: textColor }]}>{strings.MealPlan}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { handleOnPress2() }} style={[styles.mealButton, { backgroundColor: buttonBgColor2 }]}>
                  {/* <TouchableOpacity onPress={() => { ShortToast("Generating Exercise Plan. Please Check Again After Sometime.", "warning", "") }} style={[styles.ExerciseButton, { backgroundColor: buttonBgColor2 }]}> */}
                  {/* <Text style={[styles.textStyle, { color: textColor2 }]}>Exercises Plan</Text> */}
                  <Text style={[styles.textStyle, { color: textColor2 }]}>{strings.ExercisesPlan}</Text>
                </TouchableOpacity>

              </View>
              {
                mealMenuIsVisible ? (
                  renderMealOrExerciseList(myMeals?.data, renderItem2)
                ) : (
                  renderMealOrExerciseList(myExercise?.data, renderItem)
                )
              }
            </View>
          </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer:
  {
    height: '100%',
    width: '100%',
    //paddingBottom: HEIGHT * 0.15,
    backgroundColor: 'white',
  },
  calendar:
  {
    height: HEIGHT * 0.105,
    width: WIDTH * 0.9,
    backgroundColor: 'white',
    borderRadius: 8,
    //marginVertical: HEIGHT * 0.03,
    marginVertical: HEIGHT * 0.01,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    elevation: 3,
    borderWidth: 1,
  },
  mealButton:
  {
    borderWidth: 1,
    height: HEIGHT * 0.06,
    width: WIDTH * 0.35,
    borderRadius: 6,
    //marginHorizontal: WIDTH * 0.05,
    //elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ExerciseButton:
  {
    height: HEIGHT * 0.06,
    width: WIDTH * 0.35,
    borderRadius: 6,
    elevation: 2,
  },
  textStyle:
  {
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    //textAlignVertical: 'center',
    fontSize: fontSizes.LAR,
    //height: '100%'
  },
  ButtonDisplayContainer:
  {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: HEIGHT * 0.01,
    width: WIDTH,
  },
  displayCardsContainer:
  {
    height: H * 0.58,
    //paddingBottom: H * 0.37,
    alignItems: 'center',
    //marginTop: HEIGHT * 0.01,
    //backgroundColor: 'red'
  },
  fab:
  {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.GREEN
  },
  dates:
  {
    fontSize: fontSizes.SM,
    fontFamily: 'Montserrat-SemiBold',
  },
  dateView:
  {
    marginTop: HEIGHT * 0.01,
    borderWidth: 1,
    borderColor: 'silver',
    height: HEIGHT * 0.03,
    width: HEIGHT * 0.03,
    borderRadius: (HEIGHT * 0.03) / 2,
    justifyContent: 'center',
    alignItems: 'center',

  },
  daysView:
  {
    alignSelf: 'center',
    fontSize: fontSizes.MED,
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
  },
})
export default Plans
