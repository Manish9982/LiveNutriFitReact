import { View, Text } from 'react-native'
import React from 'react'
import Medicine from './Components/Medicine'

export default function Darco() {
    return (
        <View>
            <Medicine name="Darco"
                image={require('../../../../assets/icons/potion.png')}
                quantity1="50 ml"
                quantity2="3 pills/da"/>
        </View>
    )
}