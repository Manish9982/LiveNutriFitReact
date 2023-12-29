import { View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import { Constants, H, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'


const ReportsWebView = ({ navigation, route }) => {
    console.log(route.params.link)
    console.log(route.params.isLink)
    return (
        <View style={{
            flex: 1,
            //alignItems: 'center',
            //justifyContent: 'space-between',
        }}>
            <HeaderForSubmissionScreens Title="View Reports" />
            <WebView source={{ uri: route.params.isLink ? `${route.params.link}` : `${Constants.BASE_URL}user_reports/${route.params.link}` }}
                style={{ height: H, width: W, }} />

        </View>
    )
}

export default ReportsWebView