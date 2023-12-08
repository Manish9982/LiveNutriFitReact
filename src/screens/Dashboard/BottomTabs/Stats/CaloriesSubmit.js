import { View, TouchableOpacity, StyleSheet, ToastAndroid, ScrollView, StatusBar, } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Text, Appbar, Dialog, Paragraph, Portal } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, W } from '../../../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'


const CaloriesSubmit = ({ navigation }) => {

  const [waist, setWaist] = useState(null)
  const [hip, setHip] = useState(null)
  const [visible, setVisible] = useState(false)

  const hideDialog = () => setVisible(false)

  const saveValueForPain = async () => {
    const temp = await getDataFromLocalStorage("user_id")
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("type", "calories");
    formdata.append("value", ((waist == null) || (waist == Infinity) || isNaN(waist) ? "--" : (Math.round(waist * 100) / 100).toFixed(2)));
    const result = await PostApiData('updateuserpaidhealthplan', formdata)
    shortToast(result.message, 'success', '')
    navigation.navigate("BootSplash")

  }


  console.log((waist == NaN))
  return (
    <View>
      <StatusBar backgroundColor={colors.GREEN} />

      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />
        <Appbar.Content style={{ alignItems: "center", }} title={<Text style={{ color: "white", fontSize: fontSizes.XL, fontFamily: "Montserrat-SemiBold" }}>Daily Calories Budget</Text>} />
        <Appbar.Action icon="information" onPress={() => { setVisible(true) }} color={"white"} size={30} />
      </Appbar.Header>


      <ScrollView contentContainerStyle={styles.mainContainer}>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={{ zIndex: 10 }}>
            <Dialog.Title>Calories</Dialog.Title>
            <Dialog.Content style={{ zIndex: 10 }}>
              <Paragraph style={{ zIndex: 10, lineHeight: H * 0.04 }}>The recommended calorie intake for adult women ranges from 1,600 calories per day to 2,400 calories per day, according to the 2020-2025 Dietary Guidelines.
                For men, the amount is slightly higher, ranging from 2,200 to 3,200 calories per day.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>

            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Text style={styles.text}>Daily Calories Budget</Text>
        <TextInput style={styles.textInput}
          label="Enter Your Calories Consumption Today"
          underlineColor="transparent"
          onChangeText={(t) => { setWaist(t) }}
          value={waist}
          activeOutlineColor={colors.GREEN}
          activeUnderlineColor={colors.GREEN}
          keyboardType="number-pad"
          />
      
      

        <View style={styles.buttonDisplay}>
          <TouchableOpacity style={styles.buttonStyle}
            onPress={() => { saveValueForPain() }}>
            <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
    </View >
  )
}

const styles = StyleSheet.create({
  appBar:
  {
    backgroundColor: colors.GREEN,
    width: W
  },
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
    marginBottom: H * 0.03,
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

export default CaloriesSubmit