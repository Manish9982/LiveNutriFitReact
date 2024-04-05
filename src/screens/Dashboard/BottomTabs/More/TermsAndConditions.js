import { View, Text } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import { Constants, H, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useEffect } from 'react';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import { useLocales } from '../../../../utils/LocalizationUtil'


const TermsAndCondtitons = () => {
    useEffect(() => {
        getLanguage()
    }, [])
    const strings = useLocales()

    const getLanguage = async () => {
        // setLoader(true)
        const lang = await getDataFromLocalStorage("lang")

        //setLoader(false)

    }




    return (
        <View style={{
            height: H,
            width: W,
        }}>
            <HeaderForSubmissionScreens Title={strings.termsandcondition} />

            <View style={{
                flex: 1
            }}>
                <WebView
                    startInLoadingState={true}
                    source={{ uri: `${Constants.BASE_URL}${strings.TermsAndConditionsURL}` }}
                    onNavigationStateChange={(info) => {
                        console.log('info.url', info.url)
                        if (info.url == `${Constants.BASE_URL}failure/`) {
                            // navigation.navigate("BottomTabs")
                        } else if (info.url == `${Constants.BASE_URL}success/`) {
                            navigation.navigate("Stats")
                            // Alert.alert("Alert", info.url)
                            // Alert.alert('Payment successful', 'Your payment has been done sucessfully , press OKAY to go to dashboard!', [
                            // {text: 'OKAY', onPress: () => { navigation.navigate("BottomTabs")  }},]);
                        } else {

                        }
                    }
                    }
                />
            </View>
        </View>
    )
}

export default TermsAndCondtitons