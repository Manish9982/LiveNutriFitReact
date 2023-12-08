import { View, Text } from 'react-native'
import React from 'react'
import Medicine from './Components/Medicine'


export default function Aspirin() {
    return (
        <View>
            <Medicine name="Aspirin"
                image={require('../../../../assets/icons/tablets.png')}
                quantity1="1 pill"
                quantity2="3 pills/day" />
        </View>
    )
}