import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const HeaderForPlans = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => { navigation.navigate('Total Points') }}>
                <Image style={{ height: 30, width: 45 / 2 }}
                    source={require('../../../../assets/icons/badgec.jpg')} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>Plans</Text>
            <TouchableOpacity onPress={() => { navigation.navigate('UserProfile') }}>
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
export default HeaderForPlans
