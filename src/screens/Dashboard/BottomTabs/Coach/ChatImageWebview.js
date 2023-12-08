import { View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import { H, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'


const ChatImageWebview = ({ navigation, route }) => {
    console.log(route.params.link)
   
    return (
        <View style={{
            flex: 1,
          
        }}>
            <HeaderForSubmissionScreens Title="Coach" />
            <WebView source={{ uri: `${route.params.link}` }}
                style={{ height: H, width: W, }} />

        </View>
    )
}

export default ChatImageWebview