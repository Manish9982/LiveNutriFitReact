import { View, Text, Image } from 'react-native'
import React from 'react'
import { H } from '../../../colorSchemes/ColorSchemes'


const Logo = () => {
    return (
        <View>
            <Image source={require('../../../assets/icons/LNF2.png')}
                style={{
                    height: H * 0.09,
                    aspectRatio: 29 / 11,
                }} />
        </View>
    )
}

export default Logo