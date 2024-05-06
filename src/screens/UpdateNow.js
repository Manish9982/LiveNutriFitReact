import { Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import { updateLocale } from 'moment'
import { colors, fontFamily, fontSizes } from '../colorSchemes/ColorSchemes'

export default function UpdateNow({ navigation, route }) {

    const { message, link_android, link_ios } = route?.params

    const onPressNotNow = () => {
        navigation.goBack()
    }

    const onPressUpdate = () => {
        if (Platform.OS == 'android') {
            Linking.openURL(link_android || 'https://wwww.google.com')
        }
        else if (Platform.OS == 'ios') {
            Linking.openURL(link_ios || 'https://wwww.google.com')
        }
    }
    return (
        <View style={styles.container}>
            <Image source={require('../assets/icons/update.png')}
                style={styles.updateImage}
            />
            <Text style={styles.boldText}>Time To Update!</Text>
            <Text style={styles.normalText}>{message}</Text>
            <TouchableOpacity
                onPress={onPressUpdate}
                style={styles.updateButton}>
                <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onPressNotNow}
                style={styles.notNowButton}>
                <Text style={styles.notNow}>Not Now</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    updateImage:
    {
        height: 150,
        width: 150,
        alignSelf: 'center',
        marginVertical: 80,
    },
    updateButton:
    {
        height: 30,
        width: 150,
        backgroundColor: colors.GREEN,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: '30%',
        marginBottom: '5%'
    },
    updateText:
    {
        color: '#fff',
        ...fontFamily.bold,
    },
    notNow:
    {
        color: colors.ORANGE,
        ...fontFamily.bold,
    },
    notNowButton:
    {
        alignSelf: 'center',
    },
    boldText:
    {
        ...fontFamily.bold,
        marginBottom: 20,
        fontSize: fontSizes.XXXL
    },
    normalText:
    {
        fontSize: fontSizes.XL
    }

})