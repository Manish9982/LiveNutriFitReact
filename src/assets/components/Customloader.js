import { View, Text ,ActivityIndicator} from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { H, W, fontFamily, fontSizes } from '../../colorSchemes/ColorSchemes';
import { useLocales } from '../../utils/LocalizationUtil';

const Customloader = () => {
    const strings = useLocales()
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: H * 0.12,
                width: W * 0.9,
                backgroundColor: 'white',
                flexDirection: 'row',
                borderRadius:8,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 2 },
                elevation:10, 
                borderWidth:1, 
                borderColor:"grey"
            }}
        >
            <ActivityIndicator
                size="large"
                color="#2196F3"
                style={{
                    marginRight: 5, 
                    marginStart:10, 
                   
                    
                    
                    // Add margin to separate loader and text
                }}
            />

            <Text
                style={{
                    flex: 1, // Allow the text to take remaining space
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    textAlign: 'center',
                    marginRight:10
                }}
            >
                {strings.BackendProcessingMessage}
            </Text>
        </View>

    )
}

export default Customloader