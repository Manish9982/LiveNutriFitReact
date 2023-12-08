import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import DataContext from '../../../context/DataContext'
import { colors } from '../../../colorSchemes/ColorSchemes'
import { useNavigation } from '@react-navigation/native'



const CustomHeader2 = (props) => {
    
const navigation = useNavigation()

    const backPressed = () => {
        if (questionNumber == 0) {
            navigation.navigate("WelcomeScreenAfterRegistration")
        }
        else {
            setNum(questionNumber - 1)
            setQuestionNumber(questionNumber - 1)
        }
    }

    const { NquestionNumber, Nnum, Ndisable } = useContext(DataContext)
    const [questionNumber, setQuestionNumber] = NquestionNumber
    const [num, setNum] = Nnum
    const [disbale, setDisable] = Ndisable
    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'flex-start', width: '40%' }}>
                <TouchableOpacity onPress={() => { backPressed() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                        <Icon name='left' size={20} color={colors.GREEN} />
                        <Text style={{ marginHorizontal: 4 }}></Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <View style={{ marginHorizontal: "26%" }}>
                    <Text>{props.title}</Text>
                </View>
            </TouchableOpacity>
            <View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        width: "100%",
        backgroundColor: 'red',
        height: 55,
        elevation: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',


    },
})

export default CustomHeader2