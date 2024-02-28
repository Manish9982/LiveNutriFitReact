import { View, TouchableOpacity, ScrollView, Image, StyleSheet, ToastAndroid, FlatList, Platform } from 'react-native'
import React, { useEffect, useState, useContext, useCallback } from 'react'
import { ActivityIndicator, Checkbox, RadioButton, Text, TextInput } from 'react-native-paper'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W, convertTimestampToYYYYMMDD, formatDate } from '../../colorSchemes/ColorSchemes'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import DataContext from '../../context/DataContext'
import { useIsFocused } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import Customloader from '../../assets/components/Customloader'
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAccordion from '../../assets/components/CustomAccordion'
import { useLocales } from '../../utils/LocalizationUtil'
import { Colors } from 'react-native/Libraries/NewAppScreen'



function getTimestamp10YearsAgo() {
  // Get the current date
  const currentDate = new Date();

  // Subtract 10 years from the current date
  const tenYearsAgo = new Date(currentDate);
  tenYearsAgo.setFullYear(currentDate.getFullYear() - 10);

  // Return the timestamp in milliseconds
  return tenYearsAgo?.getTime();
}

const EditProfile = ({ navigation }) => {
  const [checked, setChecked] = useState('true');
  const [myData, setMyData] = useState(null)
  const [loader, setLoader] = useState(true)
  const [image, setImage] = useState(null)
  const [user_name, setuser_name] = useState("")
  const [age, setage] = useState("")
  const [height, setheight] = useState("")
  const [weight, setweight] = useState("")
  const [email, setemail] = useState("")
  const [mobile, setmobile] = useState("")
  const [address, setaddress] = useState("")
  const [veg, setVeg] = useState(true)
  const [textOfUnit, setTextOfUnit] = useState("Feet/In")
  const [exerciseLevel, setExerciseLevel] = useState("beginner")
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showOptionsForFoodType, setShowOptionsForFoodType] = useState(false)
  const [foodType, setFoodType] = useState([])
  const [goal, setGoal] = useState([])

  const { NglobalBmi, Ncrrnt, Ntrgt, Nht, Nfeet, Ninch } = useContext(DataContext)
  const [globalBmi, setGlobalBmi] = NglobalBmi
  const [crrnt, setCrrnt] = Ncrrnt
  const [trgt, setTrgt] = Ntrgt
  const [ht, setHt] = Nht
  const [feet, setFeet] = Nfeet
  const [inch, setInch] = Ninch
  const [data, setData] = useState(null)


  const isFocused = useIsFocused()
  const strings = useLocales()

  useEffect(() => { getDataFromApi() }, [])
  useEffect(() => { setChecked() }, [])
  useEffect(() => { getLanguage() }, [isFocused])

  const handleDateChange = useCallback((event, newDate) => {
    setShowCalendar(false)
    setage(convertTimestampToYYYYMMDD(newDate))
    setSelectedDate(JSON.stringify(newDate))
  }, [])

  const toggleAccordion = () => {
    setShowOptionsForFoodType(prev => !prev);
  };
  const handleDOB = () => {
    setShowCalendar(prev => !prev)
  }
  //lng
  const getLanguage = async () => {
    const lang = await getDataFromLocalStorage("lang")
    if (lang == "en") {
      changeLanguage('en')
    } else {
      changeLanguage('hi')
    }
  }

  function convertDateFormat(dateString) {
    //Create a Date object from the input date string
    const date = new Date(dateString);
    //Extract year, month, day, hours, minutes, seconds, and milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    //Construct the ISO format string
    const isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    //console.log('isoString',isoString)
    return isoString;
  }


  const changeLanguage = (languageKey) => {

  }



  function toFeet(n) {
    var realFeet = ((n * 0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    console.log("Feet=====>", feet)
    return `${feet}`;
  }

  function toInches(n) {
    var realFeet = ((n * 0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    console.log("Inches====>", inches)
    return `${inches}`;
  }


  const updateDetails = async () => {

    if (feet == "" || inch == "") {
      ShortToast('Feet or Inch can not be empty', 'Error', '')
    } else {
      setLoader(true)
      if (textOfUnit == "Feet/In") {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("id", JSON.parse(temp));
        formdata.append("user_name", user_name);
        formdata.append("weight", weight);
        formdata.append("age", age);
        formdata.append("height", ((Number.parseInt(feet, 10)) * 30.48) + (Number.parseInt(inch, 10) * 2.54));
        formdata.append("address", address);
        formdata.append("goal", goal.map(item => item.default).join(","))
        // formdata.append("intensity", exerciseLevel)
        formdata.append("food_type", foodType.map(item => item.default).join(","));
        formdata.append("intensity", "")
        const result = await PostApiData('userprofileupdate', formdata)
        console.log(result)
        if (result.status == 200) {
          ShortToast('Success!', 'success', '')
          setTimeout(() => { navigation.goBack() }, 1000)
        }
      }
      else {
        const temp = await getDataFromLocalStorage('user_id')
        console.log('temp---->', JSON.parse(temp))
        var formdata = new FormData();
        formdata.append("id", JSON.parse(temp));
        formdata.append("user_name", user_name);
        formdata.append("weight", weight);
        formdata.append("age", age);
        formdata.append("height", height);
        formdata.append("mobile", mobile);
        formdata.append("address", address);
        formdata.append("goal", goal?.join(","))
        formdata.append("food_type", foodType?.join(","));
        formdata.append("intensity", "")
        {/*
      formdata.append("profile_pic", {
        uri: image?.assets[0]?.uri,
        type: image?.assets[0]?.type,
        name: image?.assets[0]?.fileName,
      })*/}

        const result = await PostApiData('userprofileupdate', formdata)
        console.log(result)
        if (result.status == 200) {
          ShortToast('Success!', 'success', '')
          setTimeout(() => { navigation.goBack() }, 1000)
        }
      }
    }
  }

  const getNumberForWorkoutIntensity = (t) => {
    if (t == "Beginner") {
      return "1"
    }
    if (t == "Advance") {
      return "2"
    }
    if (t == "Intermediate") {
      return "3"
    }
  }

  const handleOptionPress = (item) => {
    //setAnswer(item)
  }

  const renderOptions = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.optionlayout, {
          //backgroundColor: answer?.includes(item) ? colors.GREEN : "white"
        }]}
        onPress={() => {
          handleOptionPress(item)
        }}>
        <View style={{
          marginLeft: W * 0.1,
        }}>
          <Checkbox
            //status={answer?.includes(item) ? 'checked' : 'unchecked'}
            color={"white"} />
        </View>
        <Text style={[styles.optionText2,
        {
          //color: answer?.includes(item) ? "white" : "black"
        }]}>{item}</Text>
      </TouchableOpacity>
    )
  }

  const getDataFromApi = async () => {

    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp));

    const result = await PostApiData('userprofile', formdata)
    console.log(result)
    setMyData(result)
    setFeet(toFeet(result?.data[0]?.height))
    setInch(toInches(result?.data[0]?.height))
    setheight(result?.data[0]?.height == null ? "" : result?.data[0]?.height)
    setaddress(result?.data[0]?.address == null ? "" : result?.data[0]?.address)
    setuser_name(result?.data?.[0] == null ? "" : result?.data[0]?.name)
    setweight(result?.data[0]?.weight == null ? "" : result?.data[0]?.weight)
    setage(result?.data?.[0]?.age == null ? "" : result?.data[0]?.age)
    setChecked(result?.data[0].food_type == true ? "true" : "false")
    setExerciseLevel(getNumberForWorkoutIntensity(result?.data[0].workout_intensity))
    setSelectedDate(result?.data[0]?.age)
    setLoader(false)
  }

  const handleChangePhoto = async () => {
    try {
      const result = await launchImageLibrary()
      console.log('img---->', result?.assets[0]?.uri)
      setImage(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDobPress = () => {
    setShowCalendar(prev => !prev)
  }

  console.log("goal", goal)
  console.log("food type from API ======>", new Date())

  return (
    loader ?
      <View style={styles.activityIndicator}>
        {/* <ActivityIndicator size={"large"}
          color={colors.GREEN} /> */}

        <Customloader></Customloader>

      </View>
      :
      <View>
        <HeaderForSubmissionScreens Title={strings.EditProfile} />
        < ScrollView contentContainerStyle={{ paddingBottom: H * 0.15 }} >
          {/* <Image source={{ uri: image == null ? myData?.data[0]?.profile_pic : image.assets[0]?.uri }}
            style={styles.profilePic} />
          <TouchableOpacity
            onPress={() => { handleChangePhoto() }}>
            <Text style={styles.textChangePhoto}>Change Photo</Text>
          </TouchableOpacity>
          */}

          <View style={{ flexDirection: "row" }}>
            <Image source={require('../../assets/icons/user100.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />


            <View>
              <Text style={styles.text}>{strings.Name}</Text>
              <TextInput
                onChangeText={(tex) => { setuser_name(tex) }}
                value={user_name}
                underlineColor={"transparent"}
                activeUnderlineColor={colors.GREEN}
                style={styles.textInput}
              /></View>
          </View>


          <View style={{ flexDirection: "row" }}>
            {/* <Image source={require('../../assets/icons/location100.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            /> */}
            {/* <View>
              <Text style={styles.text}>{strings.Location}</Text>
              <TextInput
                onChangeText={(tex) => { setaddress(tex) }}
                value={address}
                underlineColor={"transparent"}
                activeUnderlineColor={colors.GREEN}
                style={styles.textInput}
              /></View> */}
          </View>

          <View style={{ flexDirection: "row" }}>
            <Image source={require('../../assets/icons/goal.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />
            <View>
              <Text style={styles.text}>{strings.Goals}</Text>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: H * 0.01,
              }}>

                {/* <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 8,
      width: W * 0.35,
      paddingVertical: H * 0.02,
      justifyContent: "center"
    }}>
      <RadioButton
        value="true"
        status={checked === 'true' ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked('true')
          ShortToast("Changing your food type will change your meal plan.", 'warning', '')
        }}
      // onPress={() => { ShortToast("We don't support changing food type for now. Feature will be available soon", 'warning', '') }}
      />
      <Text>Veg</Text>

    </View>

    <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 8,
      width: W * 0.35,
      paddingVertical: H * 0.02,
      marginLeft: W * 0.15,
      justifyContent: "center"
    }}>
      <RadioButton
        value="false"
        status={checked === 'false' ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked('false')
          ShortToast("Changing your food type will change your meal plan.", 'warning', '')
        }}

      //onPress={() => { ShortToast("We don't support changing food type for now. Feature will be available soon", 'warning', '') }}
      />
      <Text>Non-Veg</Text>
    </View> */}
                <View>
                  <CustomAccordion
                    onSelectionChange={setGoal}
                    title={myData?.data[0]?.goal?.question}
                    options={myData?.data[0]?.goal?.option}
                    answers={myData?.data[0]?.goal?.answer}
                  />
                </View>

              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Image source={require('../../assets/icons/vegetarian.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />
            <View>
              <Text style={styles.text}>{strings.Foodtype} </Text>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: H * 0.01,
              }}>

                {/* <View style={{
       flexDirection: "row",
       alignItems: "center",
       backgroundColor: "white",
       borderRadius: 8,
       width: W * 0.35,
       paddingVertical: H * 0.02,
       justifyContent: "center"
     }}>
       <RadioButton
         value="true"
         status={checked === 'true' ? 'checked' : 'unchecked'}
         onPress={() => {
           setChecked('true')
           ShortToast("Changing your food type will change your meal plan.", 'warning', '')
         }}
       // onPress={() => { ShortToast("We don't support changing food type for now. Feature will be available soon", 'warning', '') }}
       />
       <Text>Veg</Text>

     </View>

     <View style={{
       flexDirection: "row",
       alignItems: "center",
       backgroundColor: "white",
       borderRadius: 8,
       width: W * 0.35,
       paddingVertical: H * 0.02,
       marginLeft: W * 0.15,
       justifyContent: "center"
     }}>
       <RadioButton
         value="false"
         status={checked === 'false' ? 'checked' : 'unchecked'}
         onPress={() => {
           setChecked('false')
           ShortToast("Changing your food type will change your meal plan.", 'warning', '')
         }}

       //onPress={() => { ShortToast("We don't support changing food type for now. Feature will be available soon", 'warning', '') }}
       />
       <Text>Non-Veg</Text>
     </View> */}
                <View>
                  <CustomAccordion
                    onSelectionChange={setFoodType}
                    title={myData?.data[0]?.food_type?.question}
                    options={myData?.data[0]?.food_type?.option}
                    answers={myData?.data[0]?.food_type?.answer}
                  />
                </View>

              </View>
            </View>
          </View>


          <View style={{ flexDirection: "row" }}>
            <Image source={require('../../assets/icons/height100.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />
            <View>
              <Text style={styles.text}>{strings.Height}</Text>
              {/*<TextInput
                onChangeText={(tex) => { setheight(tex) }}
                value={height}
                underlineColor={"transparent"}
                activeUnderlineColor={colors.GREEN}
                style={styles.textInput}
                keyboardType="numeric"
              />*/}
              <View style={
                [styles.textInput, { flexDirection: "row" }]
              }>
                {textOfUnit == "Feet/In" ?
                  <>
                    <TextInput
                      // onChangeText={(t) => { setFeet(t) }}
                      onChangeText={(t) => {
                        if (t == " ")
                          ShortToast("Blank Spaces Not Allowed", 'error', '')
                        else if (t == '0') {
                          ShortToast("Height can't be Zero", 'error', '')
                          setFeet("1")
                        }
                        else if ((t > 8) || (t == ".") || (t == ",") || (t == "-") || (t == " ")) {
                          ShortToast("Height is not Valid", 'error', '')
                        }
                        else {
                          setFeet(t.toString())
                          //  setAnswer(() => { return ((Number.parseInt(t, 10) * 30.48) + (Number.parseInt(inch, 10) * 2.54)).toString() })
                        }
                      }}
                      value={feet}
                      maxLength={1}
                      keyboardType={"number-pad"}
                      style={{
                        width: W * 0.12,
                        backgroundColor: "white",
                        marginLeft: W * 0.02,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    />
                    <Text style={{
                      marginLeft: W * 0.02,
                      ...fontFamily.bold
                    }}>'</Text>
                    <TextInput
                      onChangeText={(t) => { setInch(t) }}
                      maxLength={2}
                      keyboardType={"number-pad"}
                      value={inch}
                      style={{
                        width: W * 0.12,
                        backgroundColor: "white",
                        marginLeft: W * 0.025,
                        justifyContent: "center",
                        alignItems: "center"
                      }}

                    />
                    <Text style={{
                      ...fontFamily.bold,
                      marginLeft: W * 0.02
                    }}>"</Text>

                  </>
                  :
                  <>
                    <TextInput
                      value={height}
                      keyboardType={"number-pad"}
                      onChangeText={(t) => { setheight(t) }}
                      style={{
                        width: W * 0.3,
                        backgroundColor: "white",
                        marginLeft: W * 0.025,
                        justifyContent: "center",
                        //alignItems: "center"
                      }} />
                  </>
                }
                <TouchableOpacity onPress={() => {
                  if (textOfUnit == "Cms")
                    setTextOfUnit("Feet/In")
                  else setTextOfUnit("Cms")
                }}
                  style={{
                    backgroundColor: colors.LIGHT_GREEN,
                    height: H * 0.039,
                    width: W * 0.15,
                    borderRadius: 8,
                    marginLeft: textOfUnit == "Cms" ? W * 0.32 : W * 0.35,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <Text style={{
                    fontSize: fontSizes.SM,
                    ...fontFamily.bold,
                  }}>
                    {textOfUnit}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>





          <View style={{ flexDirection: "row" }}>
            <Image source={require('../../assets/icons/weight-loss.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />
            <View>
              <Text style={styles.text}>{strings.Weight}</Text>
              <TextInput
                onChangeText={(tex) => { setweight(tex) }}
                value={weight}
                underlineColor={"transparent"}
                activeUnderlineColor={colors.GREEN}
                style={styles.textInput}
                keyboardType="numeric"
              /></View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Image source={require('../../assets/icons/age100.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />
            <View>
              <Text style={styles.text}>{strings.DOB}</Text>
              {
                Platform.OS == "android"
                  ?
                  (
                    <View>
                      {
                        showCalendar
                        &&
                        <DateTimePicker
                          value={(new Date(convertDateFormat(selectedDate))) || new Date()}
                          mode="date"
                          display="default"
                          onChange={(a, t) => handleDateChange(a, t)}
                        //maximumDate={getTimestamp10YearsAgo()}
                        //onTouchCancel={() =>setShowCalendar(prev => !prev)}
                        />
                      }
                      <TouchableOpacity
                        onPress={handleDobPress}
                        style={styles.dobContainer}>
                        <Text>{selectedDate}</Text>
                      </TouchableOpacity>

                    </View>
                  )
                  :
                  (
                    <DateTimePicker
                      value={(new Date(convertDateFormat(selectedDate))) || new Date()}
                      mode="date"
                      display="default"
                      onChange={(a, t) => handleDateChange(a, t)}
                    //maximumDate={getTimestamp10YearsAgo()}
                    //onTouchCancel={() =>setShowCalendar(prev => !prev)}
                    />
                  )
              }
              {
                showCalendar &&
                < TouchableOpacity
                  onPress={handleDOB}
                  style={styles.textdatestyle} >

                  <Text style={styles.texttyle}>{formatDate(age) || "Enter DOB"}</Text>

                </TouchableOpacity >
              }
              {/* <TextInput
                onChangeText={(tex) => { setage(tex) }}
                value={age}
                underlineColor={"transparent"}
                activeUnderlineColor={colors.GREEN}
                style={styles.textInput}
                keyboardType="numeric"
              /> */}
            </View>
          </View>

          <TouchableOpacity style={styles.updateButton}
            onPress={() => { updateDetails() }}>
            <Text style={{ color: 'white' }}>{strings.Update}</Text>
          </TouchableOpacity>
        </ScrollView >
      </View>
  )
}

const styles = StyleSheet.create({
  activityIndicator:
  {
    height: H,
    width: W,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput:
  {
    height: H * 0.06,
    width: W * 0.85,
    //fontSize: fontSizes.LAR,
    alignSelf: 'center',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
    ...fontFamily.bold,
    elevation: 3,
  },
  textdatestyle:
  {
    height: H * 0.06,
    width: W * 0.85,
    //fontSize: fontSizes.LAR,
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
    ...fontFamily.bold,
    elevation: 3,
    justifyContent: "center",
  },
  texttyle:
  {
    marginLeft: W * 0.04
  },
  profilePic:
  {
    height: H * 0.125,
    width: H * 0.125,
    borderRadius: (H * 0.125) / 2,
    alignSelf: 'center',
    marginTop: H * 0.025,
    borderWidth: 1,
    borderColor: 'white'
  },
  text:
  {
    ...fontFamily.bold,
    color: 'black',
    marginLeft: W * 0.08,
    marginVertical: H * 0.02
  },
  textChangePhoto:
  {
    color: colors.GREEN,
    marginVertical: H * 0.02,
    alignSelf: 'center',
    marginVertical: H * 0.03
  },
  updateButton:
  {
    height: H * 0.02,
    backgroundColor: colors.GREEN,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: H * 0.04,
    height: H * 0.07,
    width: W * 0.85,
    alignSelf: 'center',
    elevation: 5,
  },
  optionText: {
    width: W * 0.65,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    fontSize: fontSizes.XL
  },

  optionlayout: {
    borderRadius: 8,
    margin: 10,
    width: W * 0.85,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: H * 0.025,
    paddingHorizontal: W * 0.0
  },
  optionText2: {
    width: W * 0.65,
    fontFamily: "Montserrat-Medium",
    fontSize: fontSizes.XL, marginLeft: 10
  },
  dobContainer:
  {
    backgroundColor: colors.DARK_GRAY,
    justifyContent: 'center',
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  }
})

export default EditProfile