import { StyleSheet, View, FlatList, TouchableOpacity, SectionList, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Divider, Text, TextInput } from 'react-native-paper'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import DataContext from '../../../../context/DataContext'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'

import { useIsFocused } from '@react-navigation/native';


const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});





const Goal = () => {

  const isFocused = useIsFocused()

  useEffect(() => { getUserTasks() }, [])
 useEffect(() => { getLanguage() }, [isFocused])
  

  const getLanguage = async () => {
    setLoader(true)
    const lang = await getDataFromLocalStorage("lang")
    strings.setLanguage(lang)

    // if (lang == "en") {
    //   changeLanguage('en')
    // } else {
    //   changeLanguage('hi')
    // }
    setLoader(false)
  }
 

  const [data, setData] = useState(null)
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState("")
  const [loader, setLoader] = useState(true)
  const { NisInfoButtonVisible } = useContext(DataContext)
  const [isInfoButtonVisible, setIsInfoButtonVisible] = NisInfoButtonVisible

  useEffect(() => { setIsInfoButtonVisible(false) }, [])


  const getUserTasks = async () => {
    //setLoader(true)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    const result = await PostApiData('get_user_goal', formdata)
    console.log(result)
    if (result.status == 200) {
      
      setData(result)
      setLoader(false)
    }
    else {
      ShortToast(result.message, 'warning', '')
    }
  }

  const addGoal = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp))
    formdata.append("text", text)
    const result = await PostApiData('add_user_goal', formdata)
    console.log(result)
    if (result.status == 200) {
      getUserTasks()
      setText("")
    }
  }

  const renderItem = ({ item, index }) => {

    return (
      <View style={{
        alignItems: "center",
        alignSelf: "center",
        marginTop: H * 0.05
      }}>

        <View style={{
          width: W * 0.9,
          justifyContent: "center",
          //paddingHorizontal: W * 0.04,
          // alignItems: "center",
          // marginTop: H * 0.022,
          // backgroundColor: "white",
          borderRadius: 8,
         // paddingVertical: H * 0.01,
          paddingLeft: W * 0.1,
          //  elevation: 2
        }}>
          <View style={{ flexDirection: "row" }}>

            <Text style={styles.text2}>{index + 1}. </Text>

            <Text style={styles.text2}>{item?.title}</Text>
            <Text style={{
              color: "white",
              fontSize: fontSizes.SM,
              position: "absolute",
              top: H * 0.16
            }}></Text>
          </View>
        </View>

      </View >
    )
  }

  return (
    <View style={{}}>
      <HeaderForSubmissionScreens Title={strings.goals} />
      <View style={{
        paddingBottom: H * 0.1,
        height: H,
      }}>
        <Text style={styles.text1}>{strings.Top5goals}</Text>
        <View style={{
          height: H * 0.7
        }}>
          <FlatList
            data={data?.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}`}

          />
        </View>
        <TouchableOpacity
          style={{
            height: H * 0.06,
            width: W * 0.4,
            backgroundColor: colors.GREEN,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            borderRadius: H * 0.1,
            position: "absolute",
            top: H * 0.75,
            elevation: 10
          }}
          onPress={() => { setVisible(true) }}>
          <Text style={styles.addText}><AntDesign name="pluscircleo" color={"white"} size={fontSizes.XXL} />  {strings.Add}</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={visible}>
          <View style={{
            height: H,
            width: W,
            backgroundColor: "rgba(0,0,0,0.2)"
          }}>
            <View style={{
              height: H * 0.5,
              backgroundColor: "white",
              width: W * 0.9,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: H * 0.25,
              borderRadius: 10,
            }}>

              <Text style={{
                ...fontFamily.bold
              }}>{strings.EnteryourGoal}:</Text>
              <TextInput
                maxLength={25}
                placeholder={strings.EnteryourGoal}
                value={text}
                onChangeText={(t) => { setText(t) }}
                activeUnderlineColor={colors.GREEN}
                underlineColor="transparent"
                style={{
                  height: H * 0.1,
                  backgroundColor: colors.OFFWHITE,
                  width: W * 0.82,
                  alignSelf: "center",
                  marginTop: H * 0.05,
                  fontSize: fontSizes.MED,
                  borderRadius: 10,
                  fontSize: fontSizes.LAR

                }} />
              <View style={{ flexDirection: "row", width: W, justifyContent: "space-evenly", marginTop: H * 0.05, }}>
                <TouchableOpacity style={styles.button}
                  onPress={() => {
                    setVisible(false)
                    addGoal()
                  }}>
                  <Text style={{ color: "white" }}>{strings.Submit}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.OFFWHITE }]}
                  onPress={() => { setVisible(false) }}>
                  <Text>{strings.Cancel}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  circle:
  {
    height: H * 0.05,
    width: H * 0.05,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: H * 0.025,
    marginRight: W * 0.03,
  },
  button:
  {
    paddingVertical: H * 0.015,
    backgroundColor: colors.GREEN,
    paddingHorizontal: W * 0.02,
    borderRadius: 8,
  },
  text1:
  {
    ...fontFamily.bold,
    //alignSelf: "center",
    marginTop: H * 0.045,
    fontSize: fontSizes.XXL,
    marginLeft: W * 0.055
  },
  text2:
  {
    ...fontFamily.bold,
    alignSelf: "center",
    // marginTop: H * 0.02,
    fontSize: fontSizes.XL,
  },
  addText:

  {
    ...fontFamily.bold,
    alignSelf: "center",
    //marginTop: H * 0.08,
    fontSize: fontSizes.XL,
    color: "white"
  }

})
export default Goal
