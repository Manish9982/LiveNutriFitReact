import { View, StatusBar, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator, Appbar, Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import { Constants, H, W, colors, fontSizes } from '../../colorSchemes/ColorSchemes'
import { useState } from 'react'
import Loader from '../../assets/components/Loader'
import base64 from 'react-native-base64'
import { useIsFocused } from '@react-navigation/native'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'


const LNFShopWebView = ({ navigation }) => {
    const [loader, setLoader] = useState(false)
    const [userId, setUserId] = useState("")
    useEffect(() => {
        getWRID()
    }, [])


    const renderLoading = () => {
        return (
            <Loader />
        )
    }

    const getWRID = async () => {
        const userd = await getDataFromLocalStorage("wrid")
        setUserId(userd)
        encodeBase64((userd))

    }

    const encodeBase64 = (input) => {
        base64.encode(input);
    }

    return (
        <View >
            <StatusBar barStyle={"dark-content"}
                backgroundColor={colors.GREEN} />
            {
                <View
                    style={{ height: H * 0.95 }}>
                    <WebView
                        startInLoadingState={true}
                        renderLoading={renderLoading}
                        injectedJavaScript={`
                        var style = document.createElement('style');
                        style.innerHTML = "div#new-shop { display: block !important; }";
                        document.head.appendChild(style);
                      `}
                        source={{ uri: `${Constants.BASE_URL}shop/?uid=${base64.encode(userId)}&type=mob` }}
                        style={{ height: H * 0.95, width: W, }}

                        onNavigationStateChange={(info) => {
                            if (info.url == `${Constants.BASE_URL}failure/`) {
                                // navigation.navigate("BottomTabs")

                            } else if (info.url == `${Constants.BASE_URL}success/`) {
                                navigation.navigate("Stats")
                                // Alert.alert("Alert", info.url)
                                //  Alert.alert('Payment successfull', 'Your payment has been done sucessfully , press OKAY to go to dashboard!', [
                                //  {text: 'OKAY', onPress: () => { navigation.navigate("BottomTabs")  }},]);
                            } else {

                            }
                            console.log("URL == ", info)
                        }}
                    />
                </View>
            }
        </View>


    )

}

export default LNFShopWebView