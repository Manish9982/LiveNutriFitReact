import { View, Text, Image, Platform } from 'react-native'
import React from 'react'
import { H } from '../../../colorSchemes/ColorSchemes'


const Logo = () => {
    return (
        <View>
            <Image source={require('../../../assets/icons/LNF2.png')}
                style={{
                    height: H * 0.09,
                    aspectRatio: 29 / 11,
                    resizeMode: Platform.OS == "ios" ? 'contain' : 'cover'
                }} />
        </View>
    )
}

export default Logo