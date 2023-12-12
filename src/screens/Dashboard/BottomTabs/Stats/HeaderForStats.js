import { StyleSheet, View, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native'
import React, { useContext } from 'react'
import { Appbar, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import MoreNavigation from '../More/MoreNavigation'
import { colors, fontFamily, fontSizes, H, W } from '../../../../colorSchemes/ColorSchemes'
import DataContext from '../../../../context/DataContext'
import DataState from '../../../../context/DataState'


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width


const HeaderForStats = (props) => {
    const navigation = useNavigation()
    return (
        /*  <View style={styles.headerContainer}>
            <TouchableOpacity>
                <Image style={{ height: HEIGHT * 0.035, width: HEIGHT * 0.11 }}
                    source={require('../../../../assets/icons/splash.png')} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center', marginHorizontal: WIDTH * 0.14 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>Today's Stats</Text>
            </View>
            <TouchableOpacity onPress={() => { navigation.navigate("Total Points") }}>
                <Image style={{ height: HEIGHT * 0.042, width: HEIGHT * 0.032, marginLeft: WIDTH * 0.13 }}
                    source={require('../../../../assets/icons/badgec.jpg')} />
            </TouchableOpacity>
    </View>*/
        <DataState>
            <View>
                < StatusBar backgroundColor={colors.OFFWHITE} />
                <Appbar.Header style={styles.appBar}>
                    <Appbar.Action style={{ marginLeft: W * 0.85 }} icon="information" color={colors.GREEN} size={30} onPress={() => { navigation.navigate("Walkthrough") }} />
                </Appbar.Header>
                <View style={{ flexDirection: "column", height: H * 0.1, position: "absolute", alignSelf: "center", top: H * 0.015 }}>
                    <TouchableOpacity style={{}}>
                        <Image source={require('../../../../assets/icons/LNF.png')}
                            style={{ height: 20, width: 90, alignSelf: "center" }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", ...fontFamily.bold, marginTop: H * 0.005 }}>Hello, {props.Name}</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate("Total Points") }}
                    style={{
                        position: "absolute",
                        backgroundColor: colors.MEDAL_GOLD,
                        height: 30,
                        width: 30,
                        borderRadius: 30 / 2,
                        top: H * 0.019,
                        left: W * 0.032,
                        justifyContent: "center"
                    }}>
                    <Image source={require('../../../../assets/icons/ribbon.png')}
                        style={{ height: 23, width: 23, position: "absolute", zIndex: 5, alignSelf: "center" }}
                        tintColor={"white"} />
                </TouchableOpacity>
            </View>
        </DataState>

    )
}

const styles = StyleSheet.create({
    appBar:
    {
        backgroundColor: colors.OFFWHITE,
        justifyContent: "space-between",
        width: W,
        height: H * 0.08
    },
    headerContainer:
    {
        //justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 8,
        height: HEIGHT * 0.08,
        width: WIDTH,
        paddingHorizontal: WIDTH * 0.02
    }
})
export default HeaderForStats
