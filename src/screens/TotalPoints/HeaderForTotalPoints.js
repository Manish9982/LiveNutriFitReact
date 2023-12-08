import { View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native-paper'
import { colors } from '../../colorSchemes/ColorSchemes'

const WIDTH = Dimensions.get('window').width

const HeaderForTotalPoints = () => {
    const navigation = useNavigation()
    return (
        <View style={{ elevation: 8, height: 45, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', width: WIDTH }}>

            <TouchableOpacity onPress={() => { navigation.goBack() }}
                style={{ flexDirection: 'row', alignItems: 'center' }}>

                <AntDesign name="left" size={25} color={colors.GREEN} />

            </TouchableOpacity>
            <Text style={{ marginLeft: WIDTH * 0.34, fontFamily: 'Montserrat-SemiBold' }}>Total Points</Text>
        </View>
    )
}

export default HeaderForTotalPoints