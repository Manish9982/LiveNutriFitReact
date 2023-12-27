import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { H, W } from '../../colorSchemes/ColorSchemes';

const Loader = ({ ht = 1 }) => {
    return (
        <View style={{
            height: H * ht,
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: 'white',
        }}>
            <LottieView
                style={{
                    height: H * 0.7,
                    width: W * 0.7
                }}
                source={require('../animations/lf30_editor_xibt7sue.json')}
                autoPlay loop />
        </View>
    )
}

export default Loader