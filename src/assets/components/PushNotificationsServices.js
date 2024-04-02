import { View, Text } from 'react-native'
import React from 'react'
import messaging from '@react-native-firebase/messaging';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage';
import { ShortToast } from '../../colorSchemes/ColorSchemes';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
const BadgeManager = NativeModules.BadgeManager;

export async function requestUserPermissionAndGetToken() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        getFcmToken()
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
// Call this function to update badge count
const updateBadgeCount = (count) => {
    BadgeManager.updateBadgeCount(count);
    console.log("=======================================>>>>", count)
  };
  
  // Example usage:
  //ßupdateBadgeCount(5); // Set badge count to 5


// export const NotificationListener = () => {
//     console.log("remoteMessage.notification================================+++++++=", "GHaurav")

//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log("remoteMessage.notification================================+++++++=" , remoteMessage.notification);    
//         messaging()
//             .getInitialNotification()
//             .then(remoteMessage => {
//                 if (remoteMessage) {
//                     console.log(
//                         'Notification caused app to open from quit state:',
//                         remoteMessage.notification,
//                     );
//                 }
//             });
//     });
// }

// import React, { useEffect } from 'react';
// import messaging from '@react-native-firebase/messaging';
// import { storeDataInLocalStorage } from '../../local storage/LocalStorage';
// import { ShortToast } from '../../colorSchemes/ColorSchemes';

// export async function requestUserPermissionAndGetToken() {
//     try {
//         const authStatus = await messaging().requestPermission();
//         const enabled =
//             authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//             authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//         if (enabled) {
//             getFcmToken();
//             console.log('Authorization status:', authStatus);
//         }

//         NotificationListener();
//     } catch (error) {
//         console.error('Error requesting permission:', error);
//     }
// }

// const getFcmToken = async () => {
//     try {
//         const fcmToken = await messaging().getToken();
//         storeDataInLocalStorage('fcmToken', fcmToken);
//         console.log("New Token:", fcmToken);
//     } catch (error) {
//         ShortToast(error, 'error', '');
//     }
// }

// const handleIncomingNotification = () => {
//     console.log("Handling incoming notification");
//     // Handle your notification logic here
//     // Set the badge count to 0
//     messaging().setBadgeCount(0).then(() => {
//         console.log("Badge count set to 0");
//     }).catch(error => {
//         console.error("Error setting badge count:", error);
//     });
// }

// export const NotificationListener = () => {
//     useEffect(() => {
//         console.log("Setting up notification listener");
//         const unsubscribe = messaging().onMessage(async remoteMessage => {
//             console.log('Remote message:', remoteMessage);
//             handleIncomingNotification();
//         });
//         return unsubscribe;
//     }, []);
// }

