import { View, StatusBar, Alert, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { ActivityIndicator, Appbar, Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import { Constants, H, PostApiData, ShortToast, W, colors, fontSizes } from '../../colorSchemes/ColorSchemes'
import { useState } from 'react'
import Loader from '../../assets/components/Loader'
import base64 from 'react-native-base64'
import { useIsFocused } from '@react-navigation/native'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import { useLocales } from '../../utils/LocalizationUtil'
import { useNetInfo } from '@react-native-community/netinfo'
import DataContext from '../../context/DataContext'


const LNFShopWebView = ({ navigation }) => {
    const isFocused = useIsFocused();

    const [loader, setLoader] = useState(true)
    const [userId, setUserId] = useState("")
    const [country, setCountry] = useState("")
    const { Nlanguage } = useContext(DataContext)

    const [language, setLanguage] = Nlanguage

    const strings = useLocales()
    const netinfo = useNetInfo()

    useEffect(() => {
        getWRID()
    }, [])


    useEffect(() => {
        if (isFocused) {
        }

    }, [isFocused])

    const renderLoading = () => {
        return (
            <Loader />
        )
    }

    const getWRID = async () => {
        const userd = await getDataFromLocalStorage("wrid")
        const countrySelected = await getDataFromLocalStorage("country")
        setCountry(countrySelected)
        setUserId(userd)
        setLoader(false)
    }

    const encodeBase64 = (input) => {
        base64.encode(input);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={"dark-content"}
                backgroundColor={colors.GREEN} />
            {
                loader
                    ?
                    <Text>Please Wait...</Text>
                    :
                    <View style={{ flex: 1 }}>
                        <WebView
                            geolocationEnabled
                            pullToRefreshEnabled
                            startInLoadingState={true}
                            originWhitelist={['*']}
                            javaScriptEnabled={true}
                            renderLoading={renderLoading}
                            thirdPartyCookiesEnabled={true}
                            sharedCookiesEnabled={true}
                            cacheEnabled={true}
                            domStorageEnabled={true}
                            webviewDebuggingEnabled
                            textInteractionEnabled
                            source={{
                                uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob`
                            }}
                            style={{ flex: 1, }}
                            onNavigationStateChange={(info) => {
                                console.log('URL=>', info?.url)
                                if (info.url == `${Constants.BASE_URL}failure/`) {
                                } else if (info.url == `${Constants.BASE_URL}success/`) {
                                    navigation.navigate("Stats")
                                } else {

                                }
                            }}
                        />
                    </View>
            }
        </SafeAreaView>

    )
}

export default LNFShopWebView