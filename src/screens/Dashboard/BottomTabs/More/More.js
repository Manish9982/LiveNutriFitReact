import { StyleSheet, View, Dimensions, Image, TouchableOpacity, StatusBar, Modal, Linking, Alert } from 'react-native'
import { ActivityIndicator, Appbar, Divider, Switch, Text } from 'react-native-paper';
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes';
import { useEffect, useContext } from 'react';
import { useState } from 'react';
import { storeDataInLocalStorage } from '../../../../local storage/LocalStorage';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';
import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native';
import DataContext from '../../../../context/DataContext';
import Loader from '../../../../assets/components/Loader';
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens';


const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const More = ({ navigation }) => {
  const isFocused = useIsFocused()
  const { Nlanguage } = useContext(DataContext)
  const [language, setLanguage] = Nlanguage
  const [pdfURL, setPdfURL] = useState("")
  const [notificationCount, setNotificationCount] = useState("")
  const [usertypetext, setUsertypetext] = useState("")
  const [loader, setLoader] = useState(false)
  const [langModal, setLangModal] = useState(false)
  const [langText, setLangText] = useState("English")
  const [langText2, setLangText2] = useState("")
  const [langTypeText, setLangTypeText] = useState("")
  const [data, setData] = useState([])
  const [usertype, setUsertype] = useState("")

  useEffect(() => {
    // changeLanguageAPI()
    getLanguage()
  }, [])

  useEffect(() => {
    toastuserType()
    getuserType()
    getNotificationCount()
  }, [isFocused])


  const getLanguage = async () => {
    const lang = await getDataFromLocalStorage("lang")
    if (lang == "en") {
      changeLanguage('en')
      setLangTypeText("1")
    } else {
      setLangTypeText("2")
      changeLanguage('hi')
    }
  }


  const changeLanguage = (languageKey) => {
    strings.setLanguage(languageKey)
    // strings.setLanguage("en")
    setLangText2(languageKey)


    if (languageKey == "en") {
      setLangText(strings.english)
    } else {
      setLangText(strings.hindi)
      // convert to Hindi from english
      //  setLangText("English")   // convert to Hindi from english
    }
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
    console.log('Done.')
  }

  const getuserType = async () => {
    const userType = await getDataFromLocalStorage('user_type')
    console.log("USERTPEEEEEE+++++++++++", userType)
    setUsertype(JSON.parse(userType))
  }

  const toastuserType = async () => {
    const userType = await getDataFromLocalStorage('user_type')
    if (JSON.parse(userType) == "1") {
      setUsertypetext(strings.freeuser)
    } else if (JSON.parse(userType) == "3") {
      setUsertypetext(strings.paidUser)
    } else if (JSON.parse(userType) == "2") {
      setUsertypetext(strings.corporate)
    }
  }


  const changeCoachText = async () => {
    const userType = await getDataFromLocalStorage('user_type')
    if (JSON.parse(userType) == "1") {
      // setUsertypetext("Free User")
      Alert.alert('Alert', strings.ThisfeatureforPaidCorporateUser, [
        { text: strings.Ok, onPress: () => { { } } },]);
    } else if (JSON.parse(userType) == "3") {
      navigation.navigate('ChangeYourCoach')
    } else if (JSON.parse(userType) == "2") {
      navigation.navigate('ChangeYourCoach')
    }
  }

  const changeLanguageAPI = async (languageType) => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    const lang = await getDataFromLocalStorage("lang")

    //  const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp))
    formdata.append("language", languageType || lang)
    formdata.append("country", "IN")
    const result = await PostApiData('update_user_language', formdata)
    if (result.status == 200) {
      getLanguage()
    } else {
      ShortToast(result?.message, 'error', '')
    }
    setLoader(false)
  }
  const getNotificationCount = async () => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    //  const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp))
    const result = await PostApiData('group_message_count', formdata)
    console.log("Gaurav== ", result)
    if (result.status == 200) {
      //  setNotificationCount(result.count)
      setData(result)
    } else {
      ShortToast(result?.message, 'error', '')
    }
    setLoader(false)
  }

  const deleteUser = async () => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("user_id", JSON.parse(temp))
    formdata.append("delete_status", "1")
    const result = await PostApiData('archiveuser', formdata)
    if (result.status == 200) {
      Alert.alert('Success', result?.message, [
        { text: 'OK', onPress: () => { { killApp(), RNRestart.Restart() } } },]);
    } else {
      ShortToast(result?.message, 'error', '')
    }
    setLoader(false)
  }



  const readNotificationCount = async () => {
    setLoader(true)
    const temp = await getDataFromLocalStorage('user_id')
    //  const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp))
    const result = await PostApiData('group_read_message', formdata)
    if (result.status == 200) {
      console.log("GauravNotificationCount  == ", result)
    } else {
      //ShortToast(result?.message, 'error', '')
    }
    setLoader(false)
  }

  const openNotification = async () => {
    readNotificationCount()
    const userID = await getDataFromLocalStorage('user_id')
    navigation.navigate("NotificationWebView", { "UserID": `${userID}` })
    console.log("userID== ", userID)
  }

  const navigationTOScreen = async () => {
    const userType = await getDataFromLocalStorage('user_type')

    if (JSON.parse(userType) == "1") {
      Alert.alert('Alert', strings.UpgradePlanText, [
        {
          text: strings.Cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: strings.Ok, onPress: () => { { navigation.navigate("Upgrade") } } },
      ]);

    } else {

    }

  }

  const killApp = async () => {
    console.log("1P")
    setLoader(true)
    console.log("2P")
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData()
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("logout_time", Date.now())
    console.log("3P")
    const result = await PostApiData('user_session_out', formdata)
    console.log("4P")
    if (result?.status == "200") {
      console.log("5P")
      try {
        await AsyncStorage.clear()
        RNRestart.Restart()
        console.log("6P")
      } catch (e) {
      }
      console.log('Done.')
    }
  }

  const openURL = () => {
    navigation.navigate("BlogWebView")
    // Alert.alert("Coming Soon", "Feature Comming Soon!")
  }
  return (


    loader ?

      <Loader />
      :

      <View>
        <HeaderForSubmissionScreens Title="More" />
        <View style={styles.mainContainer}>
          <View style={styles.containerForOptions}>
            <View>
              <TouchableOpacity onPress={() => { navigation.navigate("UserProfile") }}>
                <View style={styles.displayBar}>
                  <Image source={require('../../../../assets/icons/userc.jpg')}
                    style={styles.imageContainer} />
                  {/* <Text style={styles.text1}>{t('Profile')}{' '}</Text> */}
                  <Text style={styles.text1}>{strings.profile}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} />
              {/* <TouchableOpacity onPress={() => { navigation.navigate("Upgrade") }}> */}
              {/* <TouchableOpacity onPress={() => { navigationTOScreen() }}>
                <View style={styles.displayBar}>
                  <Image
                    source={require('../../../../assets/images/Activate.jpg')}
                    style={styles.imageContainer} />
                  <Text style={styles.text1}>{strings.yourplan}</Text>
                  <View style={{
                    alignItems: "center",
                    marginLeft: W * 0.2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <View style={{
                        backgroundColor: colors.GREEN,
                        borderRadius: 8,
                        height: H * 0.036,
                        justifyContent: "center",
                        paddingHorizontal: W * 0.02,
                      }}>
                        <Text style={{
                          color: "white",
                          ...fontFamily.bold
                        }}>
                          {usertypetext}
                        </Text>
                      </View>
                      {
                       (usertype) == "1" ? null :
                          <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 8,
                            paddingHorizontal: W * 0.02,
                            // elevation: 5,
                          }}>
                            <Text style={{
                              color: "black",
                              ...fontFamily.bold,
                              fontSize: fontSizes.MED
                            }}>
                              till
                            </Text>
                          </View>
                      }
                    </View>
                    {
                      (usertype) == "1" ? null : <View style={{
                        justifyContent: "center",
                        alignItems: "center",

                      }}>
                        <Text style={{
                          color: "black",
                          fontSize: fontSizes.MED,
                          ...fontFamily.bold
                        }}>

                          {data?.valid_month?.substring(0,3)} {data?.valid_date} , {data?.valid_year}

                        </Text>
                      </View>
                    }
                  </View>
                </View>
              </TouchableOpacity> */}
              {/* <Divider style={styles.dividerStyle} /> */}
              {/* <TouchableOpacity onPress={() => { navigation.navigate("OnDetailsSubmitScreenOne") }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/images/Reminder.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.progress}</Text>
                </View>
              </TouchableOpacity> */}
              {/* <Divider style={styles.dividerStyle} /> */}
              {/* <TouchableOpacity onPress={() => {
                navigation.navigate('GroceryList')
                //ShortToast('Coming Soon..', 'warning', '')
              }}>
                <View style={styles.displayBar}>
                  <Image source={require('../../../../assets/icons/document.png')}
                    style={[styles.imageContainer, { width: (HEIGHT * 0.033), height: (HEIGHT * 0.033) }]}
                    tintColor="silver" />

                  <Text style={styles.text1}> {strings.grocerylist}</Text>
                </View>
              </TouchableOpacity> */}

              {/* <Divider style={styles.dividerStyle} /> */}

              <TouchableOpacity


              //  onPress={() => { setLangModal(true) }}  // modified to commnet
              >
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/icons/language.png')}
                    style={[styles.imageContainer]}
                    tintColor={"silver"}
                  />

                  <Text style={styles.text1}>{strings.lang}</Text>
                  <View style={{
                    backgroundColor: colors.GREEN,
                    marginLeft: W * 0.3,
                    height: H * 0.036,
                    //width: W * 0.15,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    paddingHorizontal: W * 0.02,
                    //elevation: 5,
                  }}>
                    <Text style={{
                      color: "white",
                      ...fontFamily.bold
                    }}>
                      {langText}
                    </Text>

                  </View>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} />

              {/* <TouchableOpacity onPress={() => { navigation.navigate('Reminder') }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/images/Reminder.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.reminder}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} /> */}

              <TouchableOpacity onPress={() => {
                //ShortToast('Coming Soon..', 'warning', '')
                navigation.navigate("PDFURLWebView", { "Value": `${pdfURL}` })
              }}>
                <View style={styles.displayBar}>
                  <Image source={require('../../../../assets/icons/healthyfood.png')}
                    style={[styles.imageContainer, { width: (HEIGHT * 0.033), height: (HEIGHT * 0.033) }]}
                    tintColor="silver" />

                  <Text style={styles.text1}> {strings.LowGIFruitsandVegatables}</Text>
                </View>
              </TouchableOpacity>




              {/* <Divider style={styles.dividerStyle} />

              <TouchableOpacity onPress={() => {


                navigation.navigate("LNFShopWebView")

                // ShortToast('Coming Soon..', 'warning', '')
              }}>
                <View style={styles.displayBar}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png' }}
                    style={[styles.imageContainer, { width: (HEIGHT * 0.033), height: (HEIGHT * 0.033) }]}
                    tintColor="silver" />

                  <Text style={styles.text1}> {strings.LNFshop}</Text>
                </View>
              </TouchableOpacity> */}


              <Divider style={styles.dividerStyle} />

              {/* <TouchableOpacity onPress={() => { navigation.navigate("Goal") }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/images/Goal.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.goals}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} /> */}
              {/* <TouchableOpacity onPress={() => { navigation.navigate("Gratification") }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/icons/charity.png')}
                    style={[styles.imageContainer, { tintColor: "silver" }]} />

                  <Text style={styles.text1}>{strings.gratitude}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} /> */}
              <TouchableOpacity onPress={() => { navigation.navigate("Coach") }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/images/Chat.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.chatwithcoach}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} />
              {/********************************************Reminder**********************************************/}

              {/*}
              <TouchableOpacity onPress={() => { navigation.navigate("CustomerSupport") }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/images/Customer_support.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.customersupport}</Text>
                </View>
              </TouchableOpacity>

              <Divider style={styles.dividerStyle} />

              <TouchableOpacity onPress={() => { navigation.navigate("FAQWebView") }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/icons/faq.png')}
                    style={{
                      height: HEIGHT * 0.04,
                      width: HEIGHT * 0.04,
                      marginLeft: WIDTH * 0.05, tintColor: 'gray'
                    }} />

                  <Text style={styles.text1}>{strings.faq}</Text>
                </View>
              </TouchableOpacity>





              <Divider style={styles.dividerStyle} />
              {/********************************************Leadership Board************************************************* */}
              {/* <TouchableOpacity onPress={() => { navigation.navigate('LeadershipBoard') }}>
                <View style={styles.displayBar}>
                  <Image source={require('../../../../assets/images/Leadership.jpg')}
                    style={[styles.imageContainer, { width: (HEIGHT * 0.04) * (11 / 16) }]} />

                  <Text style={styles.text1}>{strings.leadershipboard}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} /> */}
              {/********************************************************************************************************* */}
              {/* <TouchableOpacity onPress={() => { openURL() }}>
                <View style={styles.displayBar}>
                  <Image source={require('../../../../assets/icons/blog.png')}
                    style={[styles.imageContainer, { width: (HEIGHT * 0.033), height: (HEIGHT * 0.033) }]}
                    tintColor="silver" />

                  <Text style={styles.text1}> Blog</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} /> */}

              {/* <TouchableOpacity onPress={() => {
                ShortToast(strings.FeatureComingSoon, 'warning', '')
                //navigation.navigate('MedicalInformation') 
              }}>
                < View style={styles.displayBar} >

                  <Image source={require('../../../../assets/images/Medical_info.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.medicalinformation}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} /> */}
              <TouchableOpacity onPress={() => { navigation.navigate("TermsAndConditions") }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/icons/agreement.png')}
                    style={[styles.imageContainer, { tintColor: "silver" }]} />

                  <Text style={styles.text1}>{strings.TermsandConditions}</Text>
                </View>
              </TouchableOpacity>
              {/* <Divider style={styles.dividerStyle} /> */}
              {/* <TouchableOpacity onPress={() => { changeCoachText() }}>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/images/Change_your_coach.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.ChangeYourCoach}</Text>
                </View>
              </TouchableOpacity> */}

              {/* <Divider style={styles.dividerStyle} />
              <TouchableOpacity onPress={() => {
                Alert.alert('Alert', strings.deleteacc, [

                  {
                    text: strings.Cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: strings.Cancel,
                  },
                  { text: strings.Ok, onPress: () => { deleteUser() } },
                ]);


              }
              }>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/icons/deleteuser.png')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.deleteaccount}</Text>
                </View>
              </TouchableOpacity>
 */}



              <Divider style={styles.dividerStyle} />
              <TouchableOpacity onPress={() => {

                Alert.alert('Alert', strings.SureLogout, [
                  {
                    text: strings.Cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },

                  {
                    text: strings.Ok, onPress: () => {
                      killApp()
                    }
                  },
                ]);


              }
              }>
                <View style={styles.displayBar}>

                  <Image source={require('../../../../assets/images/Log_out.jpg')}
                    style={styles.imageContainer} />

                  <Text style={styles.text1}>{strings.logout}</Text>
                </View>
              </TouchableOpacity>
              <Divider style={styles.dividerStyle} />

            </View>

          </View>
        </View >
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
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: "white"
  },
  headerContainer:
  {
    height: 0.094 * HEIGHT,
    backgroundColor: 'white'

  },
  imageContainer:
  {
    height: HEIGHT * 0.04,
    width: HEIGHT * 0.04,
    marginLeft: WIDTH * 0.05,
  },
  text1:
  {
    ...fontFamily.bold,
    marginLeft: WIDTH * 0.08,
    fontSize: fontSizes.LAR,
    color: '#717378'
  },
  displayBar:
  {
    flexDirection: 'row',
    height: HEIGHT * 0.068,
    alignItems: 'center',
    marginHorizontal: WIDTH * 0.05,
    marginVertical: HEIGHT * 0.01,
    backgroundColor: 'white',
    borderRadius: 15,

  },

  dividerStyle:
  {
    color: 'silver',
    height: 1,
    width: '100%'
  },
  containerForOptions:
  {
    //marginBottom: HEIGHT * 0.17,
    marginBottom: HEIGHT * 0.1,
    backgroundColor: 'white',

  }
})
export default More
