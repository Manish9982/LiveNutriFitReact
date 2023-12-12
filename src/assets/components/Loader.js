import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { H, W } from '../../colorSchemes/ColorSchemes';

const Loader = () => {
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'white',
        }}>
            <LottieView
                style={{
                    height: H * 0.2
                }}
                source={require('../animations/lf30_editor_xibt7sue.json')}
                autoPlay loop />
        </View>
    )
}

export default Loader