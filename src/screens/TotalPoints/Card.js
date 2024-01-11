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


const Card = ({ points, maxPoints, date, cardData }) => {
    const isFocused = useIsFocused()
    //useEffect(() => { openFirstCard() }, [])
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


    const IconThrow = (num) => {
        if (num)
            return <Icon name='check' size={25} color='#b2de72' />
        else
            return <Entypo name="cross" size={25} color={"red"} />
    }

    return (
        <View>
            <View style={[styles.totalPoints, { borderBottomRightRadius: visible ? 0 : 8, borderBottomLeftRadius: visible ? 0 : 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {myIcon}
                    <Text style={{ fontFamily: 'Montserrat-Regular', paddingLeft: W * 0.03, color: 'black' }}>{points}</Text>
                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSizes.LAR, paddingTop: W * 0.014, color: "silver" }}>/{maxPoints}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Montserrat-Regular', color: 'black', fontSize: fontSizes.LAR, paddingRight: 5 }}>{date}</Text>
                    <TouchableOpacity onPress={() => { setVisible(!visible) }}>
                        {
                            visible
                                ?
                                <Icon name='upcircleo' size={25} color='#dfe5eb' />
                                :
                                <Icon name='downcircleo' size={25} color='#dfe5eb' />
                        }
                    </TouchableOpacity>
                </View>
            </View>
            {visible ?
                <View>
                    {
                        cardData?.map((item, index, self) => {
                            return (
                                <View
                                    key={index}
                                    style={[styles.displayActivity, {
                                        borderBottomLeftRadius: self?.length == index + 1 ? 8 : 0,
                                        borderBottomRightRadius: self?.length == index + 1 ? 8 : 0,
                                    }]}>
                                    {IconThrow(item?.activity_completed)}
                                    <Text style={styles.textActivity}>{item?.activity_name}</Text>
                                    <Text style={styles.textStyleForPoints}>{item?.selected_option}</Text>
                                </View>
                            )
                        })
                    }

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
        width: W * 0.9,
        backgroundColor: colors.OFFWHITE,
        flexDirection: 'row',
        paddingHorizontal: W * 0.05,
        paddingVertical: W * 0.01,
        alignSelf: 'center',
        backgroundColor: '#fff',
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
        justifyContent: 'space-between',
        // marginHorizontal:W*0.03,
        backgroundColor: '#fff',
        padding: H * 0.018,
        width: W * 0.9,
        marginTop: H * 0.02,
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