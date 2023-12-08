import { View, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar, ActivityIndicator} from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput, Text, Appbar, Dialog, Paragraph, Portal } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'


import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'

//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});


const WHRsubmit = ({ navigation }) => {

  const isFocused = useIsFocused()

  const [loader, setLoader] = useState(false)

  useEffect(() => { getLanguge() }, [isFocused])

  //lng
  const getLanguge = async () => {
    setLoader(true)
    
    const lang = await getDataFromLocalStorage("lang")
    console.log("WHR=============   = ", lang)
    strings.setLanguage(lang)

    setLoader(false)

  }


  const [waist, setWaist] = useState(null)
  const [hip, setHip] = useState(null)
  const [finalVal, setFinalVal] = useState(null)
  const [visible, setVisible] = useState(false)

  const hideDialog = () => setVisible(false)

  const saveValueForPain = async () => {
    if (waist == null || hip == null || waist == "" || hip == "") {
      ShortToast("Required Field is missing", 'error', '')
    }
    else {
      const temp = await getDataFromLocalStorage("user_id")
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("type", "WHR");
      formdata.append("value", ((finalVal == null) || (finalVal == Infinity) || isNaN(finalVal) ? "0" : (Math.round(finalVal * 100) / 100).toFixed(2)));
      const result = await PostApiData('updateuserpaidhealthplan', formdata)
      ShortToast("Success!", 'success', '')
      navigation.navigate("BootSplash")
    }
  }


  return (

    loader ? <View style={{
      height: H,
      width: W,
      alignItems: "center",
      justifyContent: "center"
  }}>
      <ActivityIndicator size="large"
          color={colors.GREEN} />
  </View>
  :




    <View>
      <StatusBar backgroundColor={colors.GREEN} />

      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />
        <Appbar.Content style={{ alignItems: "center", }} title={<Text style={{ color: "white", fontSize: fontSizes.XL, fontFamily: "Montserrat-SemiBold" }}>{strings.WaisttoHipRatio}</Text>} />
        {/* <Appbar.Action icon="information" onPress={() => { setVisible(true) }} color={"white"} size={30} /> */}
      </Appbar.Header>


      <ScrollView contentContainerStyle={styles.mainContainer}>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={{ zIndex: 10 }}>
            <Dialog.Title>Waist Hip Ratio</Dialog.Title>
            <Dialog.Content style={{ zIndex: 10 }}>
              <Paragraph style={{ zIndex: 10, lineHeight: H * 0.04 }}>The Waist Hip Ratio is calculated by dividing your waist measurement by your hip measurement.
                In both men and women, a WHR of 1.0 or higher increases the risk of heart disease and other conditions that are linked to having overweight.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>

            </Dialog.Actions>
          </Dialog>
        </Portal>
        {<Image source={require('../../../../assets/icons/whrsil.png')}
          style={styles.sil} />}
        <Text style={{ alignSelf: "center", marginTop: H * 0.03 }}>{strings.AWaistCircumference}</Text>
        <Text style={{ alignSelf: "center", marginTop: H * 0.03 }}>{strings.BHipCircumference}</Text>
        <Text style={styles.text}>WHR</Text>
        <TextInput style={styles.textInput}
          //  label="Enter Your Waist Circumference (Inches)"
          label={strings.EnterYourWaistValueininch}

          underlineColor="transparent"
          onChangeText={(t) => {
            if (t == '0') {
              ShortToast("Value Can Not Be Zero!", 'error', '')
            }
            else {

              setWaist(t)
              setFinalVal(t / hip)
            }
          }}
          value={waist}
          activeOutlineColor={colors.GREEN}
          activeUnderlineColor={colors.GREEN}
          keyboardType="number-pad"
          maxLength={4}
          onEndEditing={() => { setFinalVal(waist / hip) }} />
        <TextInput style={styles.textInput}
          // label="Enter Your Hip Circumference (Inches)"
          label={strings.EnterYourHipValueininch}
          underlineColor="transparent"
          onChangeText={(t) => {
            if (t == '0') {
              ShortToast("Value Can Not Be Zero!", 'error', '')
            }
            else {
              setHip(t)
              setFinalVal(waist / t)
            }
          }}
          value={hip}
          activeOutlineColor={colors.GREEN}
          activeUnderlineColor={colors.GREEN}
          keyboardType="number-pad"
          maxLength={4}
          onEndEditing={() => { setFinalVal(waist / hip) }} />
        <Text style={[styles.newText, { marginBottom: 0 }]}>{strings.YourWaisttoHipRatiois}:</Text>
        <Text style={[styles.newText, { color: finalVal >= 1 ? "red" : colors.GREEN, marginBottom: 0, marginTop: H * 0.02 }]}>{(finalVal == null) || (finalVal == Infinity) || isNaN(finalVal) ? "--" : (Math.round(finalVal * 100) / 100).toFixed(2)}</Text>
        {finalVal >= 1 ? <Text style={[styles.newText, { color: finalVal >= 1 ? "red" : colors.GREEN }]}>({strings.hignRisk})</Text> : <Text style={[styles.newText, {
          color: finalVal >= 1 ? "red"
            :
            colors.GREEN
        }]}>({strings.lowRisk})</Text>}


        <View style={styles.buttonDisplay}>
          <TouchableOpacity style={styles.buttonStyle}
            onPress={() => { saveValueForPain() }}>
            <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>{strings.Save}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
    </View >
  )
}

const styles = StyleSheet.create({
  sil: {
    height: H * 0.3,
    width: H * 0.3 * 0.45,
    alignSelf: "center",
    marginTop: H * 0.05
  },
  appBar:
  {
    backgroundColor: colors.GREEN,
    width: W
  },
  mainContainer:
  {
    height: H * 1.3,
    width: W,
    backgroundColor: 'white'
  },
  text2:
  {
    color: 'black',
    backgroundColor: 'white',
    fontFamily: 'Montserrat-SemiBold'
  },
  buttonDisplay:
  {
    flexDirection: 'row',
    width: W,
    alignSelf: 'center',
    justifyContent: 'space-evenly'
  },
  buttonStyle:
  {
    backgroundColor: colors.GREEN,
    height: H * 0.07,
    width: W * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    borderRadius: 8,
  },
  textInput:
  {
    height: H * 0.08,
    width: W * 0.85,
    alignSelf: 'center',
    marginBottom: H * 0.05,
    elevation: 6,
    backgroundColor: 'white',
    fontSize: fontSizes.MED,
    borderRadius: 8,
  },
  text:
  {
    marginLeft: W * 0.08,
    marginBottom: H * 0.01,
    marginTop: H * 0.05,
    fontFamily: 'Montserrat-SemiBold'
  },
  newText:
  {
    textAlign: "center",
    marginVertical: H * 0.05,
    fontFamily: fontFamily.bold,
    fontSize: fontSizes.XL
  }
})

export default WHRsubmit