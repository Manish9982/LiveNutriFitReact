import { View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import { H, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'


const BlogWebView = () => {
    return (
        <View style={{
            flex: 1,
            //alignItems: 'center',
            //justifyContent: 'space-between',
        }}>
            <HeaderForSubmissionScreens Title="Blog"/>
            <WebView   startInLoadingState={true}
             source={{ uri: 'http://13.127.28.7/homee/blogs/' }}
                style={{ height: H, width: W, }} />

        </View>
    )
}

export default BlogWebView