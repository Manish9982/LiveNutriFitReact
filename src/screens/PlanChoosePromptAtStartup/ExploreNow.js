import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Text } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, W } from '../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import { storeDataInLocalStorage } from '../../local storage/LocalStorage'


export default function ExploreNow({ navigation }) {
    useEffect(() => {
        storeDataInLocalStorage('stackValue', "3")
    }, [])

    return (
        <View>
            <HeaderForSubmissionScreens Title="Explore" />
            <View style={{ height: H, width: W, justifyContent: "center", alignItems: "center" }}>

                <Text style={{
                    fontSize:fontSizes.XL,
                    ...fontFamily.bold,
                    color:colors.FONT_BLACK
                }}>Coming Soon..</Text>
            </View>
        </View>
    )
}