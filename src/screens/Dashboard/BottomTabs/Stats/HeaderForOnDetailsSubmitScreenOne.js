import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { colors } from '../../../../colorSchemes/ColorSchemes'
import { useNavigation } from '@react-navigation/native'


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const HeaderForOnDetailsSubmitScreenOne = (props) => {
    const navigation = useNavigation();
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}
                style={{ flexDirection: 'row', alignItems: 'center' }}>

                <AntDesign name="left" size={25} color={colors.GREEN} />


            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>{props.Text}</Text>
            </View>
            <TouchableOpacity>
                <Image style={{ height: 30, width: 30 }}
                    source={require('../../../../assets/icons/userc.jpg')} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer:
    {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 8,
        height: 50,
        width: WIDTH,
        paddingHorizontal: 10
    }
})
export default HeaderForOnDetailsSubmitScreenOne
