import { StyleSheet, View, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Text } from 'react-native-paper'
import { colors, fontFamily, fontSizes, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForOnDetailsSubmitScreenOne from './HeaderForOnDetailsSubmitScreenOne'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import { useNavigation } from '@react-navigation/native'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const SetCurrentAndTargetWeight = () => {

    const [fastingSugar, setFastingSugar] = useState("")
    const [nonFastingSugar, setNonFastingSugar] = useState("")
    const navigation = useNavigation()

    const updateValues = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage("user_id")
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("type", "Weight");
        formdata.append("valuename", "target weight");
        formdata.append("value", nonFastingSugar)
        const result = await PostApiData('updateuserpaidhealthplan', formdata)
        console.log(result)
        updateOtherValue()

    }

    const updateOtherValue = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage("user_id")
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("type", "Weight");
        formdata.append("valuename", "current weight");
        formdata.append("value", fastingSugar);
        const result = await PostApiData('updateuserpaidhealthplan', formdata)

        { navigation.navigate("BootSplash") && ShortToast("Success", 'success', '') }
    }

    return (
        <View>
            <HeaderForSubmissionScreens Title="Edit Weight" />
            <View style={styles.mainContainer}>
                <Text style={styles.text1}>Current Weight</Text>
                <TextInput style={styles.inputText}
                    placeholder='Please Enter Your Current Weight'
                    underlineColor='white'
                    activeOutlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    outlineColor='silver'
                    keyboardType='numeric'
                    value={fastingSugar}
                    onChangeText={(text) => { setFastingSugar(text) }}
                />
                <Text style={styles.text1}>Target Weight</Text>
                <TextInput style={styles.inputText}
                    placeholder='Please Enter Your Target Weight'
                    underlineColor='white'
                    activeOutlineColor={colors.GREEN}
                    activeUnderlineColor={colors.GREEN}
                    outlineColor='silver'
                    keyboardType='numeric'
                    value={nonFastingSugar}
                    onChangeText={(text) => { setNonFastingSugar(text) }}
                />
                <View style={styles.displayButtonsContainer}>
                    <TouchableOpacity
                        onPress={() => { updateValues() }}
                        style={styles.buttons}>
                        <Text style={[styles.text2, { fontFamily: fontFamily.bold }]}>Save</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: HEIGHT,
        width: WIDTH,
        paddingVertical: HEIGHT * 0.02
    },
    inputText:
    {
        backgroundColor: 'white',
        fontSize: fontSizes.LAR,
        width: WIDTH * 0.85,
        alignSelf: 'center',
        height: HEIGHT * 0.07,
        marginVertical: HEIGHT * 0.02
    },
    text1:
    {
        paddingLeft: WIDTH * 0.078,
        fontFamily: 'Montserrat-SemiBold'
    },
    displayButtonsContainer:
    {
        flexDirection: 'row',
        width: WIDTH,
        justifyContent: 'space-evenly'
    },
    buttons:
    {
        backgroundColor: colors.GREEN,
        width: W * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: HEIGHT * 0.02,
        height: HEIGHT * 0.06,
        borderRadius: 5,
    },
    text2:
    {
        color: 'white'
    }
})
export default SetCurrentAndTargetWeight
