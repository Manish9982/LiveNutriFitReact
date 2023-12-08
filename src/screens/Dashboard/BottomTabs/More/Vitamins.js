import { View, Text } from 'react-native'
import React from 'react'
import Medicine from './Components/Medicine'

export default function Vitamins() {
    return (
        <View>
            <Medicine name="Vitamins"
                image={require('../../../../assets/icons/medicine.png')}
                quantity1="1 cap"
                quantity2="2 capsules/day" />
        </View>
    )
}