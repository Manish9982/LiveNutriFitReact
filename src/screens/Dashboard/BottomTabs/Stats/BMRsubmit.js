import { View, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Text } from 'react-native-paper'
import { colors, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'



const BMRSubmit = ({ navigation, route }) => {

  const [painValue, setPainValue] = useState(null)

  const saveValueForPain = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("value", painValue);
    formdata.append("type", "BMR");

    const result = await PostApiData('updateuserpaidhealthplan', formdata)
    if (result.status == 200) {
      ShortToast('Success!', 'success', '')
      navigation.navigate("BootSplash")

    }
    else {
      ShortToast('Error', 'error', '')
      console.log(result)
    }
  }
  console.log("========>", route.params.bmiValue)
  return (
    <View style={styles.mainContainer}>
      <HeaderForSubmissionScreens Title="Basal Metabolic Rate" />
      <Text style={styles.text}>BMR</Text>
      <TextInput style={styles.textInput}
        underlineColor="transparent"
        onChangeText={(t) => { setPainValue(t) }}
        value={painValue}
        placeholder={'Please enter your BMR value*'}
        placeholderTextColor={"silver"}
        activeOutlineColor={colors.GREEN}
        activeUnderlineColor={colors.GREEN}
        keyboardType="number-pad" />
      <View style={styles.buttonDisplay}>
        <TouchableOpacity style={styles.buttonStyle}
          onPress={() => { saveValueForPain() }}>
          <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>Save</Text>
        </TouchableOpacity>

      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  mainContainer:
  {
    height: H,
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
    height: H * 0.06,
    width: W * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    borderRadius: 8,
  },
  textInput:
  {
    height: H * 0.06,
    width: W * 0.85,
    alignSelf: 'center',
    marginBottom: H * 0.05,
    elevation: 6,
    backgroundColor: 'white',
    fontSize: fontSizes.MED,
  },
  text:
  {
    marginLeft: W * 0.08,
    marginBottom: H * 0.01,
    marginTop: H * 0.05,
    fontFamily: 'Montserrat-SemiBold'
  }
})

export default BMRSubmit