import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Divider, Text } from 'react-native-paper'
import { colors, fontSizes, H, W } from '../../../../../colorSchemes/ColorSchemes'


const Medicine = (props) => {
    return (
        <View style={styles.mainContainer}>
            <Image source={props.image}
                style={styles.imageContainer} />
            <Text style={styles.text1}>{props.name}</Text>
            <View style={styles.containerForButtons}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text2}>After Breakfast</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2}>
                    <Text style={styles.text3}>After Lunch</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.containerForButtons2}>
                <TouchableOpacity style={styles.amountButton}>
                    <Image source={require('../../../../../assets/icons/syringe.png')}
                        style={styles.capSize} />
                    <View>
                        <Text style={styles.text4}>Cap Size</Text>
                        <Text style={styles.text5}>{props.quantity1}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.amountButton}>
                    <Image source={require('../../../../../assets/icons/completed-task.png')}
                        style={styles.amount} />
                    <View>
                        <Text style={styles.text6}>Amount</Text>
                        <Text style={styles.text5}>{props.quantity2}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Text style={styles.text8}>Start Date</Text>
            <Text style={styles.text9}>End Date</Text>
            <View style={styles.startButtonContainer}>
                <Text>Feb 28</Text>
                <Divider style={styles.divider} />
                <Text>Jan 12</Text>
            </View>
            <TouchableOpacity style={styles.completeCourseButton}>
                <Text style={styles.text10}>Complete Course</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        alignItems: 'center',
        width: W,
        height: H,
        justifyContent: 'space-evenly',
        paddingBottom: H * 0.1

    },
    imageContainer:
    {
        height: H * 0.1,
        width: H * 0.1,
        borderColor: 'silver',
        borderWidth: 0.5,
        borderRadius: 5,
    },
    button:
    {
        width: W * 0.4,
        backgroundColor: 'pink',
        borderRadius: 4,
        alignItems: 'center',
        height: H * 0.05,
        elevation: 8,
        justifyContent: 'center'
    },
    button2:
    {
        width: W * 0.4,
        backgroundColor: '#79dde8',
        borderRadius: 4,
        alignItems: 'center',
        height: H * 0.05,
        elevation: 8,
        justifyContent: 'center'
    },
    capSize:
    {
        height: H * 0.05,
        width: H * 0.05,
    },
    amount:
    {
        height: H * 0.05,
        width: H * 0.05,
    },
    amountButton:
    {
        backgroundColor: 'white',
        height: H * 0.08,
        width: W * 0.4,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderRadius: 8

    },
    containerForButtons:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: W,
    },
    containerForButtons2:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: W,
    },
    startButtonContainer:
    {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: H * 0.07,
        width: W * 0.8,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: W * 0.08,
        borderRadius: 8,
        borderColor: 'silver',
        borderWidth: 0.5,

    },
    divider:
    {
        height: H * 0.05,
        borderWidth: 0.5,
        borderColor: 'silver'
    },
    completeCourseButton:
    {
        height: H * 0.08,
        backgroundColor: colors.GREEN,
        width: W * 0.85,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    text5:
    {
        fontSize: fontSizes.SM
    },

    text8:
    {
        position: 'absolute',
        top: H * 0.599,
        zIndex: 1,
        color: 'grey',
        fontSize: fontSizes.SM,
        backgroundColor: 'white',
        right: W * 0.69
    },
    text9:
    {
        position: 'absolute',
        top: H * 0.599,
        zIndex: 1,
        color: 'grey',
        fontSize: fontSizes.SM,
        backgroundColor: 'white',
        right: W * 0.18
    },
    text10:
    {
        color: 'white'
    },
    text1:
    {
        fontSize: fontSizes.XXL,
        fontFamily: 'Montserrat-SemiBold'
    },
    text2:
    {
        fontSize: fontSizes.SM,
        color: '#b586af'
    },
    text3:
    {
        fontSize: fontSizes.SM,
        color: '#5997ba'

    },
})
export default Medicine
