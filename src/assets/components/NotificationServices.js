
import notifee, {
    TimestampTrigger,
    TriggerType,
    RepeatFrequency,
    AuthorizationStatus,
    AndroidNotificationSetting,
    AndroidImportance,
    AndroidCategory
} from '@notifee/react-native'
import { AndroidColor } from '@notifee/react-native';
import { Alert } from 'react-native';

export async function checkNotificationPermission() {
    const settings = await notifee.getNotificationSettings();


    if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
        // 2. ask your users to disable the feature
        Alert.alert(
            'Restrictions Detected',
            'To ensure notifications are delivered, please enable notifications for the app.',
            [
                // 3. launch intent to navigate the user to the appropriate screen
                {
                    text: 'OK, open settings',
                    onPress: async () => await notifee.openNotificationSettings(),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    }
    // }

}


export const displayNotification = async (title, body) => {
    const channelId = await notifee.createChannel({
        id: 'donald',
        name: 'donald',
        importance: AndroidImportance.HIGH,
        sound: 'hollow',
    });
    await notifee.displayNotification({
        title: title,
        body: body,
        android: {
            channelId,
            pressAction: {
                id: 'default',
                mainComponent: 'custom-component',
            },
            importance: AndroidImportance.HIGH,
            sound: 'hollow',
        },
    });
}

export async function onAppBootstrap() {
    // Create a channel
    await notifee.createChannel({
        id: 'medication_reminder',
        name: 'Medication Reminder',
        importance: AndroidImportance.HIGH,
    });
}



