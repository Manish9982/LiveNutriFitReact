import { View } from 'react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator, Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import { useState } from 'react'
import base64 from 'react-native-base64'
import { useIsFocused } from '@react-navigation/native'
import Loader from '../assets/components/Loader'
import { getDataFromLocalStorage } from '../local storage/LocalStorage'
import { Constants, H, W } from '../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../screens/Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'





const FAQWebView = () => {
    const [loader, setLoader] = useState(false)
    const [userId, setUserId] = useState("")

    const runFirst = `
    let selector = document.querySelector("main-footer")
    
    selector.style.display = "none"
       
          true; // note: this is required, or you'll sometimes get silent failures
        `;
        
    const isFocused = useIsFocused()

    useEffect(() => {
        if(isFocused){
            toastMobileEmail()

        }
    }, [isFocused])


   

    const toastMobileEmail = async () => {
        const userd = await getDataFromLocalStorage("user_id")

        console.log("UserID= ", (userd) )
        setUserId(userd) 
        encodeBase64((userd))

        console.log("GAURAVAVAVAVVA=========", `${Constants.BASE_URL}shop/?uid=${base64.encode(userd)}`)
    }



    const encodeBase64 = (input) => {
        base64.encode(input);
        console.log("IDBASE= ", base64.encode(input))
    }

    return (

        loader
            ?
            <>
                <Loader />
            </>
            :

            <View style={{
                flex: 1,
            }}>
                <HeaderForSubmissionScreens
                    Title="FAQ" />

                <WebView
                    //  renderLoading={LoadingIndicatorView()}
                    startInLoadingState={true}
                    injectedJavaScript={runFirst}
                    source={{ uri: `${Constants.BASE_URL}frequently-asked-questions/` }}
                    style={{ height: H, width: W, }} />
            </View>
    )
}

export default FAQWebView