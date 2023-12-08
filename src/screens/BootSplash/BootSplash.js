import { View, Image, StyleSheet, Dimensions, ToastAndroid, StatusBar, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, W, H } from '../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width



const BootSplash = ({ navigation }) => {

  useEffect(() => {
    getState()

    storeDataInLocalStorage('upgradepopup', "showpopup")

  }, [])
  //to get state of redirection

  const [opacity, setOpacity] = useState(0)

  const getState = async () => {
    try {
      const value = await AsyncStorage.getItem('stackValue')
      console.log('stackValue at Bootsplash------------------------->', value)

      if (value == null) {
        setOpacity(1)
        setTimeout(() => {
          navigation.replace("SelectPrefferedLanguage")
        }, 1500)

      }
      else if (value == '1') {
        setOpacity(0)
        redirectToSignIn()
      }
      else if (value == '2') {
        setOpacity(0)
        redirectToSplash()
        // navigation.replace("WelcomeScreenBeforeBottomTabs")// no questions to be answered
      }
      else if (value == '3') {
        setOpacity(0)
        redirectToBottomTabs()
        //redirectToSplash()
      }

      else if (value == '4') {
        setOpacity(0)
        navigation.replace("WelcomeScreenAfterRegistration") // questions
      }



      else if (value == '5') {
        setOpacity(0)
        navigation.replace("WelcomeScreenBeforeBottomTabs")// no questions to be answered
      }



      else if (value == "6") {
        setOpacity(0)
        const insulin = await getDataFromLocalStorage("insulin")
        const pregnant = await getDataFromLocalStorage("pregnant")
        const diabetes = await getDataFromLocalStorage("diabetes")
        const paidUserStatus = await getDataFromLocalStorage("paiduserStatus")


        if (paidUserStatus == "PaymentDone") {
          Alert.alert('Alert', "As your Payment has been done , please answer some questions to become paid user!", [
            { text: 'OK', onPress: () => navigation.navigate("PaidCustomQuestions") }]);
            
        } else if (paidUserStatus == "PaymentDoneWithQuestions") {
          redirectToBottomTabs()

        } else {
          if (pregnant == "Yes") {
            navigation.navigate("PlanChoosePromptAtStartup", { "comeFrom": "EXPLOREMORE" })

          } else if (insulin == "Yes" && diabetes == "Yes") {

            navigation.navigate("PlanChoosePromptAtStartup", { "comeFrom": "EXPLOREMORE" })

          } else if (insulin == "Yes") {

            navigation.navigate("PlanChoosePromptAtStartup", { "comeFrom": "EXPLOREMORE" })



          } else {
            navigation.navigate("PlanChoosePromptAtStartup", { "comeFrom": "NOTEXPLOREMORE" });

          }
        }





      }
      else ToastAndroid.show("Internal Server Error, Please Try Again", ToastAndroid.SHORT)       //check value to know which screen to redirect to
    }
    catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT)
    }
  }

  const redirectToSignIn = () => {
    setOpacity(0)                                      //redirectToSignIn() START
    navigation.replace("Sign In")

  }                                                                         // redirectToSignIn() END
  const redirectToSplash = () => {
    setOpacity(1)
    setTimeout(() => {
      navigation.replace("Splash")
    }, 1000)
  }
  const redirectToBottomTabs = () => {
    setOpacity(0)
    navigation.replace("BottomTabs")
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={"white"} />
      <Image source={require('../../assets/icons/splashscreen.png')}
        style={[styles.imageContainer, { opacity: opacity }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer:
  {
    height: HEIGHT,
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  imageContainer:
  {
    height: H,
    width: W,
    // aspectRatio: 16 / 5,
    backgroundColor: 'white',

  }
})
export default BootSplash

