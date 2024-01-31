/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import { Text, TextInput } from 'react-native-paper';

if (Platform.OS == "ios") {
    //firebase.initializeApp()


    notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification, pressAction } = detail;

        // Check if the user pressed the "Mark as read" action
        if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
            console.log("I'm Listening")
            // Remove the notification
            await notifee.cancelNotification(notification.id);
        }
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            const { notification, pressAction } = detail;

            // Check if the user pressed the "Mark as read" action
            if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
                console.log("I'm Listening")
                // Remove the notification
                await notifee.cancelNotification(notification.id);
            }
        });
    });

}

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <App />;
}

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => App);
