import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { ProgressBar, Colors } from 'react-native-paper';
import { colors, H } from '../../colorSchemes/ColorSchemes';


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width


const Progress = (props) => {
    return (
        <View style={styles.mainContainer}>
            <ProgressBar progress={props.progress} color={colors.GREEN} style={styles.progressBar} />
            <View style={styles.progressBarIconContainer}>
                <Image style={styles.progressBarIcon} />
                <Image source={require('../../assets/icons/favourites.png')}
                    style={styles.progressBarIcon} />
                <Image source={require('../../assets/icons/favourites.png')}
                    style={styles.progressBarIcon} />
                <Image source={require('../../assets/icons/favourites.png')}
                    style={styles.progressBarIcon} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer:
    {

    },
    progressBar:
    {
        height: H * 0.009,
        borderRadius: 4,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "center",
     },
    progressBarIconContainer:
    {
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        width: "100%",
        alignItems: "center",
        alignContent: "center",
        top: - H * 0.003
    },
    progressBarIcon:
    {
        alignSelf: "center",
        height: H * 0.012,
        width: H * 0.012,
        tintColor: 'grey',
    },

})

export default Progress