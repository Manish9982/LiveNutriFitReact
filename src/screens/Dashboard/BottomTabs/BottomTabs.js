
import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, Dimensions, Image, Alert, Platform, AppState } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Plans from '../BottomTabs/Plans/Plans'
import Coach from '../BottomTabs/Coach/Coach'
import StatsNav from './Stats/StatsNav';
import { colors, Constants, fontSizes, H, PostApiData } from '../../../colorSchemes/ColorSchemes';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../local storage/LocalStorage';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import DataContext from '../../../context/DataContext';
import { displayNotification } from '../../../assets/components/NotificationServices';
import LNFShopWebView from '../../LNFShopWebView/LNFShopWebView';
import notifee, { EventType } from '@notifee/react-native'
import { useLocales } from '../../../utils/LocalizationUtil';

const Tab = createBottomTabNavigator();

const BottomTabs = ({ route }) => {

  const { Nlanguage } = useContext(DataContext)
  const [language, setLanguage] = Nlanguage
  const [langTypeText, setLangTypeText] = useState("")
  const [hidetab, sethHidetab] = useState("")
  const strings = useLocales();
  const navigation = useNavigation()
  React.useEffect(() => { storeDataInLocalStorage('stackValue', '3') }, [])
  //React.useEffect(() => { setRegStatus() }, [])
  React.useEffect(() => {
    getCoach()
    sendFcmToken()
    getMessageCount()
    getChatStatus()
  }, [])
  React.useEffect(() => {
    const unsubscribe = messaging()?.onMessage(async remoteMessage => {
      displayNotification(remoteMessage?.notification?.title, remoteMessage?.notification?.body)
      getMessages()
    });
    return unsubscribe;
  }, []);
  React.useEffect(() => { getLanguage() }, [language])

  const getLanguage = async () => {
    const lang = await getDataFromLocalStorage("lang")
    const countrySelected = await getDataFromLocalStorage("country")

    console.log("countrySelected============================     ", countrySelected)
    sethHidetab(countrySelected)
    setLangTypeText(lang)
  }
  React.useEffect(() => {
    messaging()
      ?.getInitialNotification()
      ?.then(remoteMessage => {
        if (remoteMessage?.data?.ctype == "1") {
          navigation.navigate("Coach")

          console.log(
            'Notification caused app to open from quit state:==================', remoteMessage.notification,
          );
        } else {

        }
      });
    const notificationPressSubscription = notifee?.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          if (detail?.notification?.data?.ctype == "1") {
            navigation.navigate("Coach")
          }
        }
      }
    );
    return () => {
      // notificationPressSubscription?.remove();
    };
  }, [])
  React.useEffect(() => {
    getAppUpdateStatus()
  }, [])


  React.useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' || nextAppState === 'inactive' || nextAppState === 'background') {
        // Refresh message count when app transitions to different states
        getMessageCount();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);


  const { Nmessages, Ncount } = useContext(DataContext)
  const [messages, setMessages] = Nmessages
  const [count, setCount] = Ncount

  const getMessageCount = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp));
    const result = await PostApiData('message_count', formdata)

    console.log("AANCHAL=====>", result?.count)
    if (result.status == '200') {
      if (result.count == "0") {
        setCount(null)
      }
      else setCount(result.count)
    }
  }

  const getAppUpdateStatus = async () => {
    var formdata = new FormData()
    formdata.append('app_version', Constants.APP_VERSION)
    formdata.append('device_type', Platform.OS)
    const result = await PostApiData('get_versioncheck', formdata)
    console.log('get_versioncheck', result)
    if (result?.status == '201') {
      navigation.navigate('UpdateNow', { 'link': Platform.OS == 'android' ? `${result?.link_android}` : `${result?.link_ios}`, 'message': `${result?.message}` })
    }
  }

  const getMessages = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    const temp2 = await getDataFromLocalStorage('coach_id')
    formdata.append("user_id", JSON.parse(temp));
    formdata.append("reciever_id", JSON.parse(temp2))
    const result = await PostApiData('getusermessage', formdata)
    if (result.status == '200') {
      // console.log(result)
      setMessages(result.data.reverse())
      var formdata2 = new FormData();
      formdata2.append("id", JSON.parse(temp));
      const result2 = await PostApiData('message_count', formdata2)
      //setCount(result2.count)
    }
  }

  const getChatStatus = async () => {
    const temp = await getDataFromLocalStorage('stackValue')
    if (temp == '6') {
      navigation.navigate('Coach')
    }
  }
  const sendFcmToken = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    const temp2 = await getDataFromLocalStorage('fcmToken')
    formdata.append("id", JSON.parse(temp));
    formdata.append("fcm_token", temp2);
    formdata.append("device_type", Platform.OS)
    const result = await PostApiData('get_device_token', formdata)
    console.log(result)
  }

  const getCoach = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    const result = await PostApiData('coachassign', formdata)
    storeDataInLocalStorage('coach_id', result.coach)
  }

  return (
    <Tab.Navigator
      initialRouteName=" "
      screenOptions={(propsTab) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (propsTab.route.name === "Upgrade") {
            iconName = 'upload';
            return <Image source={require('../../../assets/icons/upload.png')}
              tintColor={color}
              style={{ height: 24, aspectRatio: 8 / 8 }} />
          }
          else if (propsTab.route.name === 'Plans') {
            iconName = 'bars';
            return <Image source={require('../../../assets/icons/more/list.png')}
              tintColor={color}
              style={{ height: 24, aspectRatio: 7 / 8 }} />
          }
          else if (propsTab.route.name === ' ') {
            return <Image source={require('../../../assets/icons/home.png')}
              tintColor={color}
              style={{ height: 24, aspectRatio: 8 / 8 }} />
          }
          else if (propsTab.route.name === 'Coach') {
            return <Image source={require('../../../assets/icons/comment.png')}
              tintColor={color}
              style={{ height: 24, aspectRatio: 8 / 8 }} />
          }
          else if (propsTab.route.name === 'LNF Shop') {
            return <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png' }}
              tintColor={color}
              style={{ height: 24, aspectRatio: 8 / 8 }} />
          }
          // else if (propsTab.route.name === 'More') {
          //   return <Image source={require('../../../assets/icons/more.png')}
          //     tintColor={color}
          //     style={{ height: 24, aspectRatio: 8 / 8 }} />
          // }
        },
        tabBarActiveTintColor: colors.GREEN,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          height: H * 0.1,
          paddingBottom: Platform.OS == 'android' ? H * 0.01 : H * 0.03,
          //paddingTop: Platform.OS == 'android' ? 3 : 10
        },
        tabBarLabelStyle: {
          fontSize: fontSizes.MED,
          fontFamily: 'Montserrat-Medium'

        },
        initialRouteName: " "
      })} >
      <Tab.Screen name=" " component={StatsNav} options={{ tabBarLabel: strings.Home }} />
      {/* <Tab.Screen name={"Upgrade"} component={Upgrade} options={{ tabBarLabel: (language || langTypeText) == "en" ? "Upgrade" : "Upgrade" }} /> */}
      <Tab.Screen name="Plans" component={Plans} options={{ tabBarLabel: strings.Plans }} />
      <Tab.Screen name="Coach" component={Coach} options={{ tabBarHideOnKeyboard: true, tabBarBadge: count, tabBarLabel: strings.Message }} />
      {/* {hidetab == "India" ? <Tab.Screen name="LNF Shop" component={LNFShopWebView} options={{ tabBarLabel: (language || langTypeText) == "en" ? "LNF Shop" : "LNF शॉप" }} />
        : null} */}
      < Tab.Screen name="LNF Shop" component={LNFShopWebView} options={{ tabBarLabel: strings.LNF_Shop }} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  plusIcon:
  {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'white',
    borderRadius: 35
  },
}
)

export default BottomTabs;