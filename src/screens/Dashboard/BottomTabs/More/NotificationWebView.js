import { View } from 'react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator, Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import { Constants, H, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import { useLocales } from '../../../../utils/LocalizationUtil';
import { useIsFocused } from '@react-navigation/native'


const NotificationWebView = ({ navigation, route }) => {
  const isFocused = useIsFocused()

  const strings = useLocales()

  console.log("NAme ", strings.announcement)


  useEffect(() => {
    getUserId()
  }, [])

  
  const getUserId = async () => {
    const temp = JSON.stringify(await getDataFromLocalStorage('user_id'))
    // console.log("getUserId", `https://lnf.bizhawkztest.com/public/notification_list/${temp}` )
    return temp
  }
  return (
    <View style={{
      flex: 1,
    }}>
      <HeaderForSubmissionScreens Title={strings.announcement} />
      <WebView
        startInLoadingState={true}
        source={{ uri: `${Constants.BASE_URL}panel/usnotification_list/${JSON.parse(route.params.UserID)}` }}
        //"https://lnf.bizhawkztest.com/public/notification_list/\(userID)"
        style={{ height: H, width: W, }} />

    </View>
  )
}

export default NotificationWebView