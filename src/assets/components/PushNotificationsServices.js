import { View, Text } from 'react-native'
import React from 'react'
import messaging from '@react-native-firebase/messaging';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage';
import { ShortToast } from '../../colorSchemes/ColorSchemes';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

export const getFcmToken = async () => {
    try {
        const fcmToken = await messaging().getToken()
        storeDataInLocalStorage('fcmToken', fcmToken)
        console.log("new Token=====>/.>", fcmToken)
    }
    catch (error) {
        ShortToast(error, 'error', '')
    }
}

export const NotificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log("remoteMessage.notification================================+++++++=" ,
         remoteMessage.notification);    
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                }
            });
    });


   
}