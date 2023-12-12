import { Dimensions, StyleSheet, TouchableOpacity, View, Image, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { colors, fontFamily, fontSizes, H, PostApiData, W } from '../../colorSchemes/ColorSchemes'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import CustomHeader from '../Dashboard/Components/CustomHeader'
import HeaderForTotalPoints from './HeaderForTotalPoints'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import moment from 'moment'
import { Text } from 'react-native-paper'
import Entypo from 'react-native-vector-icons/Entypo'


import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'

import { useIsFocused } from '@react-navigation/native';


const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const Card = (props) => {
    const isFocused = useIsFocused()
    useEffect(() => { openFirstCard() }, [])
    useEffect(() => { getLanguge() }, [isFocused])


    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            strings.setLanguage(lang)
        } else {
            strings.setLanguage(lang)
        }
    }
   


    //  const [dataFromApi, setDataFromApi] = React.useState(null)
    const [visible, setVisible] = useState(false)
    const myIcon = <Image source={require('../../assets/icons/reward.jpg')}
        style={{ height: 20, width: 20, borderRadius: 10 }} />
    //   const getTotalPoints = async () => {
    //      var formdata = new FormData();
    //      const temp = await getDataFromLocalStorage('user_id')
    //    formdata.append("user_id", JSON.parse(temp));
    //  const result = await PostApiData('get_total_point', formdata)
    // setDataFromApi(result)
    //console.log(result)
    //}
    const openFirstCard = () => {
        if (props.Key == '0') {
            setVisible(true)
        }
    }
    const TextThrow = (num) => {
        if (num == "1") {
            return strings.MealPlan
        }
        if (num == "2") {
            return strings.ExcercisesPlan
        }
        if (num == "3") {
            return strings.Sleep
        }
        if (num == "4") {
            return strings.Hydration
        }
        if (num == "5") {
            return strings.Fasting
        }
        if (num == "6") {
            return strings.MoodText
        }
        if (num == "7") {
            return strings.Monitoring
        }
    }

    const IconThrow = (num) => {
        if (num == 0)
            return <Entypo name="cross" size={25} color={"red"} />
        else
            return <Icon name='check' size={25} color='#b2de72' />
    }

    return (
        <View>
            <View style={styles.totalPoints}>
                <View style={{ flexDirection: 'row', }}>
                    {myIcon}
                    <Text style={{ fontFamily: 'Montserrat-Regular', paddingLeft: W * 0.03, color: 'black' }}>{props.TotalPointsToday}</Text>
                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSizes.LAR, paddingTop: W * 0.014, paddingLeft: W * 0.01, color: "silver" }}>/21</Text>
                </View>
                <Text style={{ fontFamily: 'Montserrat-Regular', color: 'black', marginLeft: W * 0.4, fontSize: fontSizes.LAR }}>{props.Date}</Text>
                <TouchableOpacity onPress={() => { setVisible(!visible) }}>
                    <Icon name='downcircleo' size={25} color='#dfe5eb' />
                </TouchableOpacity>
            </View>
            {visible ? <View>
                <View style={styles.displayActivity}>
                    {IconThrow(props.Aid1)}
                    <Text style={styles.textActivity}>{TextThrow(props.Id1)}</Text>
                    <Text style={styles.textStyleForPoints}>{props.Id1 == "7" ? props.Aid1.length : props.Aid1}</Text>
                </View>
                <View style={styles.displayActivity}>
                    {IconThrow(props.Aid2)}
                    <Text style={styles.textActivity}>{TextThrow(props.Id2)}</Text>
                    <Text style={styles.textStyleForPoints}>{props.Id2 == "7" ? props.Aid2.length : props.Aid2}</Text>
                </View>
                <View style={styles.displayActivity}>
                    {IconThrow(props.Aid3)}
                    <Text style={styles.textActivity}>{TextThrow(props.Id3)}</Text>
                    <Text style={styles.textStyleForPoints}>{props.Id3 == "7" ? props.Aid3.length : props.Aid3}</Text>
                </View>
                <View style={styles.displayActivity}>
                    {IconThrow(props.Aid4)}
                    <Text style={styles.textActivity}>{TextThrow(props.Id4)}</Text>
                    <Text style={styles.textStyleForPoints}>{props.Id4 == "7" ? props.Aid4.length : props.Aid4}</Text>
                </View>
                <View style={styles.displayActivity}>
                    {IconThrow(props.Aid5)}
                    <Text style={styles.textActivity}>{TextThrow(props.Id5)}</Text>
                    <Text style={styles.textStyleForPoints}>{props.Id5 == "7" ? props.Aid5.length : props.Aid5}</Text>
                </View>
                <View style={styles.displayActivity}>
                    {IconThrow(props.Aid6)}
                    <Text style={styles.textActivity}>{TextThrow(props.Id6)}</Text>
                    <Text style={styles.textStyleForPoints}>{props.Id6 == "7" ? props.Aid6.length : props.Aid6}</Text>
                </View>
                <View style={styles.displayActivity}>
                    {IconThrow(props.Aid7)}
                    <Text style={styles.textActivity}>{TextThrow(props.Id7)}</Text>
                    <Text style={styles.textStyleForPoints}>{props.Id7 == "7" ? props.Aid7.length : props.Aid7}</Text>
                </View>
            </View>
                :
                null}

        </View>
    )
}


const styles = StyleSheet.create({
    mainContainer:
    {
        width: W,
        backgroundColor: 'white',
    },
    displayActivity:
    {
        flexDirection: 'row',
        paddingHorizontal: W * 0.05,
        paddingVertical: W * 0.01
    },
    textActivity:
    {
        fontFamily: 'Montserrat-Regular',
        marginHorizontal: W * 0.04,
        fontSize: fontSizes.LAR,
        color: colors.FONT_BLACK
    },
    detailsContainer:
    {
        backgroundColor: '#eaedf2',
        width: W,
        height: H * 0.2,
        marginTop: H * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    secondaryMidContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: W * 0.03,
    },
    redeemPointsButton:
    {
        height: H * 0.05,
        width: W * 0.3,
        backgroundColor: colors.GREEN,
        justifyContent: 'center',
        borderRadius: 8,
    },
    totalPoints:
    {
        flexDirection: 'row',
        paddingHorizontal: W * 0.05,
        justifyContent: 'space-between',
        // marginHorizontal:W*0.03,
        backgroundColor: 'white',
        padding: H * 0.015,
        width: W * 0.96,
        marginTop: H * 0.05,
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 8,
    },
    textStyleForPoints:
    {
        ...fontFamily.bold,
        position: "absolute",
        left: W * 0.8
    }
})

export default Card