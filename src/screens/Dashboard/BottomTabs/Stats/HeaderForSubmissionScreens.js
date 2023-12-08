import { View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { colors, fontSizes, W } from '../../../../colorSchemes/ColorSchemes'
import { useNavigation } from '@react-navigation/native'
import { Appbar, Text } from 'react-native-paper'


const HeaderForSubmissionScreens = (props) => {
    const navigation = useNavigation()
    return (
        <>
            <StatusBar backgroundColor={colors.GREEN} />
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} 
                onPress={() => { navigation.goBack() }} />

                <Appbar.Content style={{ alignItems:"center", marginRight:W*0.125 }}
                 title={<Text style={{ color: "white", fontSize: fontSizes.XL,
                  fontFamily: "Montserrat-SemiBold" }}>{props.Title}</Text>} />

            </Appbar.Header>
        </>
    )
}

const styles = StyleSheet.create({
    appBar:
    {
        backgroundColor: colors.GREEN,
        width:W
    }
})

export default HeaderForSubmissionScreens