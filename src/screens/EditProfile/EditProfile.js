import { View, TouchableOpacity, ScrollView, Image, StyleSheet, ToastAndroid, FlatList } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { ActivityIndicator, RadioButton, Text, TextInput } from 'react-native-paper'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import DataContext from '../../context/DataContext'
import { useIsFocused } from '@react-navigation/native'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'






//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});

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

  const { NglobalBmi, Ncrrnt, Ntrgt, Nht, Nfeet, Ninch } = useContext(DataContext)
  const [globalBmi, setGlobalBmi] = NglobalBmi
  const [crrnt, setCrrnt] = Ncrrnt
  const [trgt, setTrgt] = Ntrgt
  const [ht, setHt] = Nht
  const [feet, setFeet] = Nfeet
  const [inch, setInch] = Ninch
  const [data, setData] = useState(null)


  const isFocused = useIsFocused()


  useEffect(() => { getDataFromApi() }, [])
  useEffect(() => { setChecked() }, [])

  useEffect(() => { getLanguge() }, [isFocused])


  //lng
  const getLanguge = async () => {
    const lang = await getDataFromLocalStorage("lang")
    if (lang == "en") {
      changeLaguagee('en')
    } else {
      changeLaguagee('hi')

    }

  }


  const changeLaguagee = (languageKey) => {
    strings.setLanguage(languageKey)
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

    if (textOfUnit == "Feet/In") {
      const temp = await getDataFromLocalStorage('user_id')
      var formdata = new FormData();
      formdata.append("id", JSON.parse(temp));
      formdata.append("user_name", user_name);
      formdata.append("weight", weight);
      formdata.append("age", age);
      formdata.append("height", ((Number.parseInt(feet, 10)) * 30.48) + (Number.parseInt(inch, 10) * 2.54));
      // formdata.append("email", email);
      // formdata.append("mobile", mobile);
      formdata.append("address", address);
      formdata.append("food_type", checked);
      formdata.append("intensity", exerciseLevel)
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
      formdata.append("food_type", checked);
      formdata.append("intensity", exerciseLevel)
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

  const foodTypeQsnAndOptionAPI = async () => {
    setLoader(true)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    const usertype = await getDataFromLocalStorage('user_type')

    //formdata.append("user_id", JSON.parse(temp));
    formdata.append("user_id", "463");
    formdata.append("question", "29");
    formdata.append("answer", "Weight Loss")
    formdata.append("user_type", "1"); // chnged from usertype
    formdata.append("language", "1")


    const result = await PostApiData('first_answer_submit', formdata)

    console.log("formdataRequest========================================", formdata)

    setData(result)

    setLoader(false)
  }
















  const getDataFromApi = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp));

    const result = await PostApiData('userprofile', formdata)
    console.log(result)
    // setMyData(result)
    setFeet(toFeet(result?.data[0]?.height))
    setInch(toInches(result?.data[0]?.height))
    setheight(result?.data[0]?.height == null ? "" : result?.data[0]?.height)
    setaddress(result?.data[0]?.address == null ? "" : result?.data[0]?.address)
    setuser_name(result?.data?.[0] == null ? "" : result?.data[0]?.name)
    setweight(result?.data[0]?.weight == null ? "" : result?.data[0]?.weight)
    setage(result?.data?.[0]?.age == null ? "" : result?.data[0]?.age)
    setChecked(result?.data[0].food_type == true ? "true" : "false")
    setExerciseLevel(getNumberForWorkoutIntensity(result?.data[0].workout_intensity))
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



  // const renderItem = ({ item }) => {
  //   console.log('GAURAV---->', console.log(item))

  //   return (
  //     <View style={{
  //       backgroundColor: "red"
  //     }}>
  //       <TouchableOpacity
  //         style={{
  //           borderRadius: 5,
  //           margin: 10,
  //           width: W * 0.85,
  //           //height: H * 0.1,
  //           justifyContent: "center",
  //          // backgroundColor: getColor(item),
  //           backgroundColor: "red",
  //           alignItems: "center",
  //           alignSelf: "center",
  //           flexDirection: "row",
  //           paddingVertical: H * 0.025,
  //           paddingHorizontal: W * 0.0

  //         }}
  //         onPress={() => {
  //         //  handleOptionPress(item)
  //         }}>
  //         {/* {(data?.question_type.question_type == "2") ?
  //           <View style={{

  //             marginLeft: W * 0.1,
  //           }}>
  //             <Checkbox
  //               status={arr.includes(item) ? 'checked' : 'unchecked'}
  //               color={"white"} />
  //           </View>
  //           : null} */}

  //         <Text style={{
  //           width: W * 0.65,
  //           fontFamily: "Montserrat-Medium",
  //           color: getColorForText(item),
  //           textAlign: "center",
  //           marginRight: (data?.question_type == "2") ? W * 0.1 : null,

  //         }}>{item}</Text>
  //       </TouchableOpacity>
  //     </View >
  //   )
  // }








  return (
    loader ?
      <View style={styles.activityIndicator}>
        <ActivityIndicator size={"large"}
          color={colors.GREEN} />
      </View>
      :
      <View>
        <HeaderForSubmissionScreens Title={strings.EditProfile} />
        < ScrollView contentContainerStyle={{ paddingVertical: H * 0.06 }} >
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
            <Image source={require('../../assets/icons/location100.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />
            <View>
              <Text style={styles.text}>{strings.Location}</Text>
              <TextInput
                onChangeText={(tex) => { setaddress(tex) }}
                value={address}
                underlineColor={"transparent"}
                activeUnderlineColor={colors.GREEN}
                style={styles.textInput}
              /></View>
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
                <View style={{
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
                </View>

              </View>


              {/* <Text style={styles.text}>{"Question"}</Text>

              <View style={{
                height: H * 0.55,
                W: W * 0.9,
                alignSelf: "center",
                alignItems: "center",
                backgroundColor:"red"
              }}>
                <FlatList
                  data={data?.option}
                  renderItem={renderItem}
                  keyExtractor={(index) => `${index}`}
                  persistentScrollbar={true}
                  //showsVerticalScrollIndicator={true}
                />
              </View> */}

            </View>





          </View>
          <View style={{ flexDirection: "row" }}>
            <Image source={require('../../assets/icons/exerciseEditProfile.png')}
              style={{
                top: H * 0.017,
                left: W * 0.05,
                height: H * 0.035,
                width: H * 0.035,
              }}
            />
            <View>
              <Text style={styles.text}>{strings.ExcercisesPlan} </Text>
              <View style={{
                justifyContent: "space-between",
                marginVertical: H * 0.01
              }}>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 8,
                  width: W * 0.35,
                  paddingVertical: H * 0.02,
                  // justifyContent: "center",
                  width: W * 0.6,
                  paddingLeft: W * 0.04
                }}>
                  <RadioButton
                    value="1"
                    status={exerciseLevel === '1' ? 'checked' : 'unchecked'}

                    onPress={() => {
                      setExerciseLevel('1')
                      ShortToast("Changing your workout intensity will change all your exercise plans.", 'warning', '')
                    }}

                  />
                  <Text>Beginner</Text>

                </View>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 8,
                  width: W * 0.35,
                  paddingVertical: H * 0.02,
                  // justifyContent: "center",
                  width: W * 0.6,
                  marginTop: H * 0.015,
                  paddingLeft: W * 0.04
                }}>
                  <RadioButton
                    value="3"
                    status={exerciseLevel === '3' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setExerciseLevel('3')
                      ShortToast("Changing your workout intensity will change all your exercise plans.", 'warning', '')
                    }}
                  // onPress={() => { ShortToast("We don't support changing workout intensity for now. Feature will be available soon", 'warning', '') }}
                  />
                  <Text>Intermediate</Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 8,
                  width: W * 0.35,
                  paddingVertical: H * 0.02,
                  // justifyContent: "center",
                  width: W * 0.6,
                  marginTop: H * 0.015,
                  paddingLeft: W * 0.04
                }}>
                  <RadioButton
                    value="2"
                    status={exerciseLevel === '2' ? 'checked' : 'unchecked'}
                    //onPress={() => { ShortToast("We don't support changing workout intensity for now. Feature will be available soon", 'warning', '') }}
                    onPress={() => {
                      setExerciseLevel('2')
                      ShortToast("Changing your workout intensity will change all your exercise plans.", 'warning', '')
                    }}
                  />
                  <Text>Advance</Text>
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
                      onChangeText={(t) => { setFeet(t) }}
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
                      fontFamily: fontFamily.bold
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
                      fontFamily: fontFamily.bold,
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
                    fontFamily: fontFamily.bold,
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
              <Text style={styles.text}>{strings.Age} (in years)</Text>
              <TextInput
                onChangeText={(tex) => { setage(tex) }}
                value={age}
                underlineColor={"transparent"}
                activeUnderlineColor={colors.GREEN}
                style={styles.textInput}
                keyboardType="numeric"
              /></View>
          </View>

          <TouchableOpacity style={styles.updateButton}
            onPress={() => { updateDetails() }}>
            <Text style={{ color: 'white' }}>Update</Text>
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
    fontFamily: "Montserrat-SemiBold",
    elevation: 3,
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
    fontFamily: fontFamily.bold,
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
})

export default EditProfile