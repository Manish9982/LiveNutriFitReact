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
    const [showFirstWebView, setShowFirstWebView] = useState(true);
    const [showSecondWebView, setShowSecondWebView] = useState(false);
    const { Nlanguage } = useContext(DataContext)

    const [language, setLanguage] = Nlanguage

    const strings = useLocales()
    const netinfo = useNetInfo()

    useEffect(() => {
        getWRID()
        //retrieveLanguage()
    }, [])


    useEffect(() => {
        if (isFocused) {
            //Alert.alert("Gaurav")
        }

    }, [isFocused])


    const retrieveLanguage = async () => {

    }


    const renderLoading = () => {
        return (
            <Loader />
        )
    }

    const getWRID = async () => {
        const userd = await getDataFromLocalStorage("wrid")
        const countrySelected = await getDataFromLocalStorage("country")
        const lang = await getDataFromLocalStorage("lang")
        setCountry(countrySelected)
        setUserId(userd)
        setLoader(false)
        //encodeBase64((userd))
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
                    // <View
                    //     style={{ flex: 1 }}>
                    //     <WebView
                    //         geolocationEnabled
                    //         pullToRefreshEnabled
                    //         startInLoadingState={true}
                    //         originWhitelist={['*']}
                    //         javaScriptEnabled={true}
                    //         renderLoading={renderLoading}
                    //         thirdPartyCookiesEnabled={true}
                    //         sharedCookiesEnabled={true}
                    //         cacheEnabled={true}
                    //         domStorageEnabled={true}
                    //         webviewDebuggingEnabled
                    //         textInteractionEnabled
                    //         //     injectedJavaScript={`
                    //         //     var style = document.createElement('style');
                    //         //     style.innerHTML = "div#new-shop { display: block !important; }";
                    //         //     document.head.appendChild(style);
                    //         //   `}
                    //         //source={{ uri: `${Constants.BASE_URL}${strings.code == 'en' ? '' : `${strings.code}/`}shop/?uid=${base64.encode(userId)}&type=mob` }}
                    //         //source={{ uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob`}}

                    //         source={
                    //             country == "India" ?
                    //                 { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob` }
                    //                 :
                    //                 { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob&ip=${netinfo?.details?.ipAddress}` }

                    //         }

                    //         //source={{ uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob&ip=${netinfo?.details?.ipAddress}` }}
                    //         style={{
                    //             flex: 1
                    //         }}
                    //         onNavigationStateChange={(info) => {
                    //             if (info.url == `${Constants.BASE_URL}failure/`) {
                    //                 // navigation.navigate("BottomTabs")
                    //             } else if (info.url == `${Constants.BASE_URL}success/`) {
                    //                 navigation.navigate("Stats")
                    //                 // Alert.alert("Alert", info.url)
                    //                 // Alert.alert('Payment successful', 'Your payment has been done sucessfully , press OKAY to go to dashboard!', [
                    //                 // {text: 'OKAY', onPress: () => { navigation.navigate("BottomTabs")  }},]);
                    //             } else {

                    //             }
                    //         }}
                    //     />
                    // </View>

                    <View style={{ flex: 1 }}>
                        {showFirstWebView && (
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
                                source={
                                    { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob` }

                                    // country == 'India'
                                    //     ? { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob` }
                                    //    // : { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob&ip=${netinfo?.details?.ipAddress}` }
                                    //     : { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob`}
                                }
                                onLoad={() => {
                                    setShowFirstWebView(false);
                                    setShowSecondWebView(true);
                                }}
                                style={{ flex: 1, display: showFirstWebView ? 'flex' : 'none' }}
                                onNavigationStateChange={(info) => {
                                    console.log('URL=>', info?.url)
                                    if (info.url == `${Constants.BASE_URL}failure/`) {
                                    } else if (info.url == `${Constants.BASE_URL}success/`) {
                                        navigation.navigate("Stats")

                                    } else {

                                    }
                                }}
                            />
                        )}
                        {showSecondWebView && (
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
                                textInteractionEnabled source={

                                    { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob` }

                                    // country == 'India'
                                    //     ? { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob` }
                                    //     : { uri: `${Constants.BASE_URL}shop/?uid=${userId}&type=mob&ip=${netinfo?.details?.ipAddress}` }
                                }

                                onLoad={() => {
                                    // Second WebView has loaded, you can navigate or perform other actions here
                                }}


                                style={{ flex: 1 }}
                                onNavigationStateChange={(info) => {
                                    console.log('URL=>', info?.url)
                                    if (info.url == `${Constants.BASE_URL}failure/`) {
                                        // navigation.navigate("BottomTabs")
                                    } else if (info.url == `${Constants.BASE_URL}success/`) {
                                        navigation.navigate("Stats")
                                        // Alert.alert("Alert", info.url)
                                        // Alert.alert('Payment successful', 'Your payment has been done sucessfully , press OKAY to go to dashboard!', [
                                        // {text: 'OKAY', onPress: () => { navigation.navigate("BottomTabs")  }},]);
                                    } else {

                                    }
                                }}
                            />
                        )}
                    </View>
            }


        </SafeAreaView>

    )
}

export default LNFShopWebView