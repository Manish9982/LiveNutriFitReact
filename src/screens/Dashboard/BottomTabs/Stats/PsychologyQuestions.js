import { FlatList, View, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import React, { useState, useEffect } from 'react'
import { H, W, fontFamily, colors, fontSizes, PostApiData, ShortToast } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from './HeaderForSubmissionScreens'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'
import Loader from '../../../../assets/components/Loader'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'
import { useLocales } from '../../../../utils/LocalizationUtil'
import { registerSensor } from 'react-native-reanimated/lib/typescript/reanimated2/core'

export default function PsychologyQuestions({ navigation }) {
    // useEffect(() => { getAnswersForPsychology() }, [])
    const isFocused = useIsFocused()
    const strings = useLocales()
    useEffect(() => {
        getPsychologyQuestions()
    }, [])


    useEffect(() => { getLanguage() }, [isFocused])

    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {

        } else {


        }
    }

    const [loader, setLoader] = useState(true)

    const [selectedOption1, setSelectedOption1] = useState(null)
    const [selectedOption2, setSelectedOption2] = useState(null)
    const [selectedOption3, setSelectedOption3] = useState(null)
    const [selectedOption4, setSelectedOption4] = useState(null)
    const [selectedOption5, setSelectedOption5] = useState(null)
    const [selectedOption6, setSelectedOption6] = useState(null)
    const [selectedOption7, setSelectedOption7] = useState(null)
    const [selectedOption8, setSelectedOption8] = useState(null)
    const [selectedOption9, setSelectedOption9] = useState(null)
    const [totalPain, setTotalPain] = useState("--")
    const [first, setFirst] = useState(null)
    const [second, setSecond] = useState(null)
    const [third, setThird] = useState(null)
    const [fourth, setFourth] = useState(null)
    const [fifth, setFifth] = useState(null)
    const [sixth, setSixth] = useState(null)
    const [seventh, setSeventh] = useState(null)
    const [eighth, setEighth] = useState(null)
    const [ninth, setNinth] = useState(null)
    const [arr, setArr] = useState([])
    const [data, setData] = useState(null)

    const getPsychologyQuestions = async () => {

        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        const result = await PostApiData('getphyschology', formdata)
        if (result.status == '200') {
            setData(result)
            console.log('data===>', result)
        }
        setLoader(false)
    }

    const throwScore = () => {
        var sum = 0
        arr.map(item => {
            if (item == 'Not at all') {
                sum = sum + 0
            }
            else if (item == 'Several days') {
                sum = sum + 1
            }
            else if (item == 'More than half the days') {
                sum = sum + 2
            }
            else if (item == 'Nearly every day') {
                sum = sum + 3
            }
        })
        return sum
    }

    const submitPsychology = async () => {
        const temp = await getDataFromLocalStorage("user_id")
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("type", "Psychology");
        formdata.append("value", throwScore());
        const result = await PostApiData('updateuserpaidhealthplan', formdata)
        if (result?.status == '200') {
            navigation.navigate("BootSplash")
        }
    }

    const handleOptionPress = async (option, id) => {
        const newArr = [...arr];
        newArr[id - 1] = option;
        newArr.length = 9,
            setArr(newArr);
    }

    const renderQuestions = ({ item, index }) => {
        return (
            <View
                style={styles.bubble}>
                <Text
                    style={styles.questionText}>
                    {item?.question}
                </Text>
                <TouchableOpacity
                    onPress={() => handleOptionPress(item?.option[0]?.default, item?.id)}>
                    <View

                        style={[styles.option, { backgroundColor: (arr[index] == item?.option[0].default) ? colors.ORANGE : colors.GREEN }]}>

                        <Text

                            style={styles.text1} >
                            {item?.option[0]?.text}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleOptionPress(item?.option[1]?.default, item?.id)}>
                    <View

                        style={[styles.option, { backgroundColor: (arr[index] == item?.option[1].default) ? colors.ORANGE : colors.GREEN }]}>
                        <Text

                            style={styles.text1} >
                            {item?.option[1]?.text}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleOptionPress(item?.option[2]?.default, item?.id)}>
                    <View

                        style={[styles.option, { backgroundColor: (arr[index] == item?.option[2].default) ? colors.ORANGE : colors.GREEN }]}>
                        <Text

                            style={styles.text1} >
                            {item.option[2]?.text}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleOptionPress(item?.option[3]?.default, item?.id)}>
                    <View
                        style={[styles.option, { backgroundColor: (arr[index] == item?.option[3].default) ? colors.ORANGE : colors.GREEN }]}>
                        <Text

                            style={styles.text1} >
                            {item.option[3]?.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    console.log("myArr", arr)
    return (

        loader ?
            <Loader />
            :
            <View style={{ flex: 1 }}>

                <HeaderForSubmissionScreens Title={strings.Psychology} />
                <View style={styles.list}>
                    <FlatList
                        data={data?.data}
                        renderItem={renderQuestions}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
                <View style={{
                    backgroundColor: "white",
                    height: '10%',
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: W
                }}>
                    <Text style={{ color: colors.FONT_BLACK, ...fontFamily.bold }}>{strings.TotalScore} {throwScore()} /27</Text>
                    <TouchableOpacity
                        onPress={() => {
                            submitPsychology()
                        }}
                        style={{
                            backgroundColor: colors.ORANGE,
                            borderRadius: 8,
                            padding: H * 0.005,
                            alignItems: "center",
                            height: H * 0.04,
                            width: W * 0.2,
                            justifyContent: "center"
                        }}
                    >
                        <Text style={{
                            color: "white",
                            ...fontFamily.bold
                        }}>{strings.Submit}</Text>
                    </TouchableOpacity>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    text1:
    {
        ...fontFamily.bold,
        color: "white"
    },
    questionText:
    {
        ...fontFamily.bold,
        color: colors.FONT_BLACK,
        fontSize: fontSizes.XL,
        marginBottom: H * 0.01,

    },
    bubble:
    {
        backgroundColor: "white",
        marginVertical: H * 0.02,
        alignItems: "center",
        width: W * 0.85,
        paddingHorizontal: W * 0.05,
        borderRadius: 10,
        elevation: 2,
        paddingVertical: H * 0.02
    },
    option:
    {
        backgroundColor: colors.GREEN,
        width: W * 0.6,
        alignItems: "center",
        marginVertical: H * 0.01,
        borderRadius: 8,
        paddingVertical: H * 0.01,
    },
    textTotal:
    {
        color: colors.FONT_BLACK,
        marginTop: H * 0.04,
        ...fontFamily.bold,
        fontSize: fontSizes.XL,
    },
    list:
    {
        height: '76%',
        width: '100%',
        alignItems: 'center'
    }

})