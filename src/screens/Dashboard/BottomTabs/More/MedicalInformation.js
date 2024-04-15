import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors, fontSizes, H, W } from '../../../../colorSchemes/ColorSchemes'
import { Text } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'


const MedicalInformation = ({ navigation }) => {
  const Card = (props) => {
    return (
      <>
        <View>
          <TouchableOpacity style={styles.cardContainer}
            onPress={() => { navigation.navigate(props.name) }}>
            <Image source={props.image}
              style={styles.image} />
            <View style={styles.secondaryContainer}>
              <Text style={styles.text1}>{props.name}</Text>
              <Text style={styles.text2}>{props.quantity}</Text>
            </View>
            <View style={{ width: W * 0.33 }}>
              <Text style={styles.text3}>{props.time}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <AntDesign name='right' size={H * 0.031} color={colors.GREEN} />
            </View>
          </TouchableOpacity>
        </View>
      </>
    )
  }
  return (
    <View>
      <View style={{ elevation: 8, zIndex: 2 }}>
        <HeaderForSubmissionScreens text="Medical Information" />
      </View>
      <View style={styles.mainContainer}>
        <Card image={require('../../../../assets/icons/medicine.png')}
          name="Vitamins"
          quantity="1 capsule"
          time="After Breakfast" />
        <Card image={require('../../../../assets/icons/tablets.png')}
          name="Aspirin"
          quantity="1/2 pill"
          time="Before Breakfast" />
        <Card image={require('../../../../assets/icons/potion.png')}
          name="Darco"
          quantity="50 ml"
          time="After Dinner" />
        <Card image={require('../../../../assets/icons/drugs.png')}
          name="Omeprazole"
          quantity="1 Injection"
          time="After Lunch" />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainContainer:
  {
    height: H,
    width: W,
    backgroundColor: 'white',
    paddingVertical: H * 0.02,
  },
  cardContainer:
  {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: H * 0.08,
    width: W * 0.95,
    marginTop: H * 0.008,
    backgroundColor: 'white',
    elevation: 8,
    borderRadius: 8,
    paddingHorizontal: W * 0.02,
  },
  image:
  {
    height: H * 0.05,
    width: H * 0.05
  },
  text1:
  {

  },
  text2:
  {
    fontSize: fontSizes.SM,
    color: 'silver'
  },
  text3:
  {
    fontFamily: 'Montserrat-SemiBold',
    color: 'silver',
    fontSize: fontSizes.MED,

  },
  secondaryContainer:
  {
    width: W * 0.4,
    marginLeft: W * 0.025,
    backgroundColor: 'white',
  },

})
export default MedicalInformation