import { TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Text } from 'react-native-paper'
import { colors, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'


const ChangeYourCoach = ({ navigation }) => {
  const sendReason = async () => {
    if (reason.length < 6) {
      ShortToast("Kindly tell us the reason to change your coach in more detail", "error", "")
    }
    else {
      const temp = await getDataFromLocalStorage("user_id")
      var formdata = new FormData();
      formdata.append("user_id", JSON.parse(temp));
      formdata.append("assigned_coach", "4");
      formdata.append("reason_change", reason);
      const result = await PostApiData('coachchange', formdata)
      if (result.status == "200") {
        ShortToast("Your Request has been Registered.", 'success', '')
        navigation.goBack()
      }
    }
  }
  const [reason, setReason] = useState("")
  return (
    <View>
      <HeaderForSubmissionScreens Title="Change Your Coach" />
      <ScrollView contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        width: W,
        backgroundColor: "white",
        height: H * 0.9,

      }}>
        <View style={{
          height: H * 0.45,
          width: W * 0.95,
          backgroundColor: colors.OFFWHITE,
          borderRadius: 12,
          elevation: 8,
        }}>
          <Text style={[styles.text1, { marginTop: H * 0.04 }]}>Change Coach Request</Text>
          <Text style={styles.text1}>REASON FOR CHANGE</Text>
          <TextInput style={styles.textInput}
            value={reason}
            onChangeText={(t) => { setReason(t) }}
            placeholder="Why do you want to change your Coach?"
            placeholderTextColor={"silver"}
            underlineColor={"transparent"}
            maxLength={200}
            activeUnderlineColor={colors.GREEN} />
          <TouchableOpacity
            onPress={() => {
              sendReason()
            }}
            style={styles.button}
          >
            <Text style={{ color: 'white' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
    </View>
  )
}

const styles = StyleSheet.create({
  button:
  {
    backgroundColor: colors.GREEN,
    width: W * 0.85,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: H * 0.06,
    borderRadius: 8,
  },
  textInput:
  {
    height: H * 0.08,
    width: W * 0.9,
    alignSelf: 'center',
    marginVertical: H * 0.05,
    backgroundColor: 'white',
    elevation: 4,
    fontSize: fontSizes.MED
  },
  text1:
  {
    fontFamily: 'Montserrat-SemiBold',
    marginVertical: H * 0.02,
    marginHorizontal: W * 0.1,
    marginTop: H * 0.02
  }
})

export default ChangeYourCoach