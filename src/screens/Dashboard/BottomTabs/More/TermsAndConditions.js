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
                    source={{ uri: `${Constants.BASE_URL}terms-conditions-2/` }} />
            </View>
        </View>
    )
}

export default TermsAndCondtitons