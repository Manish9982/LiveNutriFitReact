import { View, Text } from 'react-native'
import React from 'react'
import Medicine from './Components/Medicine'

export default function Omeprazole() {
    return (
        <View>
            <Medicine name="Omeprazole"
                image={require('../../../../assets/icons/drugs.png')} />
        </View>
    )
}