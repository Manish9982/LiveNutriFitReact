import { View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { colors } from '../../../../colorSchemes/ColorSchemes'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native-paper'

const HeaderForUpgrade = () => {
    const navigation = useNavigation()
    return (
        <View style={{ elevation: 8, height: 45, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>

            <TouchableOpacity onPress={() => { navigation.goBack() }}
            style={{flexDirection:'row', alignItems:'center'}}>

                <AntDesign name="left" size={25} color={colors.GREEN} />
                <Text style={{marginHorizontal:8}}>Upgrade</Text>

            </TouchableOpacity>

        </View>
    )
}

export default HeaderForUpgrade