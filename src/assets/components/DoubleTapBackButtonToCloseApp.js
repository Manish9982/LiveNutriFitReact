import { BackHandler, Alert } from 'react-native'
import React from 'react'
import { useFocusEffect } from '@react-navigation/native';

export default function DoubleTapBackButtonToCloseApp() {
    
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {

                Alert.alert('Exit App ', 'Are you sure you want to Exit the App?', [
                    {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel',
                    },
                    { text: 'YES', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );

}

