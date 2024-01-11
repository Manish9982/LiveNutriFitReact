import { FlatList, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
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

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


export default function PsychologyQuestions({ navigation }) {
    // useEffect(() => { getAnswersForPsychology() }, [])
    const isFocused = useIsFocused()
    useEffect(() => {
        getPsychologyQuestions()
    }, [])


    useEffect(() => { getLanguage() }, [isFocused])

    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            strings.setLanguage(lang)
        } else {
            strings.setLanguage(lang)

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
    const [data, setData] = useState(null)

    const getPsychologyQuestions = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        const result = await PostApiData('getphyschology', formdata)
        if (result.status == '200') {
            setData(result)
            setSelectedOption1(result?.data?.[0]?.selected_option)
            // submitPoints(result?.data?.[0]?.selected_option, "1")
            // submitPoints(result?.data?.[1]?.selected_option, "2")
            // submitPoints(result?.data?.[2]?.selected_option, "3")
            // submitPoints(result?.data?.[3]?.selected_option, "4")
            // submitPoints(result?.data?.[4]?.selected_option, "5")
            // submitPoints(result?.data?.[5]?.selected_option, "6")
            // submitPoints(result?.data?.[6]?.selected_option, "7")
            // submitPoints(result?.data?.[7]?.selected_option, "8")
            // submitPoints(result?.data?.[8]?.selected_option, "9")
            setSelectedOption2(result?.data?.[1]?.selected_option)
            setSelectedOption3(result?.data?.[2]?.selected_option)
            setSelectedOption4(result?.data?.[3]?.selected_option)
            setSelectedOption5(result?.data?.[4]?.selected_option)
            setSelectedOption6(result?.data?.[5]?.selected_option)
            setSelectedOption7(result?.data?.[6]?.selected_option)
            setSelectedOption8(result?.data?.[7]?.selected_option)
            setSelectedOption9(result?.data?.[8]?.selected_option)
        }
        setLoader(false)
    }


    const submitPsychology = async () => {
        if ((selectedOption1 !== "") && (selectedOption2 !== "") && (selectedOption3 !== "") && (selectedOption4 !== "") && (selectedOption5 !== "") && (selectedOption6 !== "") && (selectedOption7 !== "") && (selectedOption8 !== "") && (selectedOption9 !== "")) {
            const temp = await getDataFromLocalStorage("user_id")
            var formdata = new FormData();
            formdata.append("user_id", JSON.parse(temp));
            formdata.append("type", "Psychology");
            formdata.append("value", first + second + third + fourth + fifth + sixth + seventh + eighth + ninth);
            const result = await PostApiData('updateuserpaidhealthplan', formdata)
            console.log(result)
            navigation.navigate("BootSplash")
        }
        else
            ShortToast(strings.PsychologyValidation, 'error', '')
    }

    const getAnswersForPsychology = async () => {
        const temp1 = await getDataFromLocalStorage('selectedOption1')
        setSelectedOption1(temp1)
        submitPoints(temp1, '1')
        const temp2 = await getDataFromLocalStorage('selectedOption2')
        setSelectedOption2(temp2)
        submitPoints(temp2, '2')
        const temp3 = await getDataFromLocalStorage('selectedOption3')
        setSelectedOption3(temp3)
        submitPoints(temp3, '3')
        const temp4 = await getDataFromLocalStorage('selectedOption4')
        setSelectedOption4(temp4)
        submitPoints(temp4, '4')
        const temp5 = await getDataFromLocalStorage('selectedOption5')
        setSelectedOption5(temp5)
        submitPoints(temp5, '5')
        const temp6 = await getDataFromLocalStorage('selectedOption6')
        setSelectedOption6(temp6)
        submitPoints(temp6, '6')
        const temp7 = await getDataFromLocalStorage('selectedOption7')
        setSelectedOption7(temp7)
        submitPoints(temp7, '7')
        const temp8 = await getDataFromLocalStorage('selectedOption8')
        setSelectedOption8(temp8)
        submitPoints(temp8, '8')
        const temp9 = await getDataFromLocalStorage('selectedOption9')
        setSelectedOption9(temp9)
        submitPoints(temp9, '9')
        setLoader(false)
    }


    const submitPoints = async (t, num) => {
        const temp = await getDataFromLocalStorage("user_id")
        if (t == "Not at all") {
            num == 1 ? setFirst(0) : null
            num == 2 ? setSecond(0) : null
            num == 3 ? setThird(0) : null
            num == 4 ? setFourth(0) : null
            num == 5 ? setFifth(0) : null
            num == 6 ? setSixth(0) : null
            num == 7 ? setSeventh(0) : null
            num == 8 ? setEighth(0) : null
            num == 9 ? setNinth(0) : null
        }
        if (t == "Several days") {
            num == 1 ? setFirst(1) : null
            num == 2 ? setSecond(1) : null
            num == 3 ? setThird(1) : null
            num == 4 ? setFourth(1) : null
            num == 5 ? setFifth(1) : null
            num == 6 ? setSixth(1) : null
            num == 7 ? setSeventh(1) : null
            num == 8 ? setEighth(1) : null
            num == 9 ? setNinth(1) : null
        }
        if (t == "More than half the days") {
            num == 1 ? setFirst(2) : null
            num == 2 ? setSecond(2) : null
            num == 3 ? setThird(2) : null
            num == 4 ? setFourth(2) : null
            num == 5 ? setFifth(2) : null
            num == 6 ? setSixth(2) : null
            num == 7 ? setSeventh(2) : null
            num == 8 ? setEighth(2) : null
            num == 9 ? setNinth(2) : null
        } if (t == "Nearly every day") {
            num == 1 ? setFirst(3) : null
            num == 2 ? setSecond(3) : null
            num == 3 ? setThird(3) : null
            num == 4 ? setFourth(3) : null
            num == 5 ? setFifth(3) : null
            num == 6 ? setSixth(3) : null
            num == 7 ? setSeventh(3) : null
            num == 8 ? setEighth(3) : null
            num == 9 ? setNinth(3) : null
        }

        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("question_id", num);
        formdata.append("selected_option", t);
        const result = await PostApiData('postphyschology', formdata)
        if (result.status == '200') {
            console.log(result)
        }
    }

    console.log("myArr", first + second + third + fourth + fifth + sixth + seventh + eighth + ninth)

    return (

        loader ?
            <Loader />
            :
            <View style={{ flex: 1 }}>
                <HeaderForSubmissionScreens Title={strings.Psychology} />
                <ScrollView contentContainerStyle={{ alignItems: "center",  }}>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data?.[0]?.question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption1(data?.data?.[0]?.option[0])
                                submitPoints(data?.data?.[0]?.option[0], data?.data?.[0]?.id)
                                storeDataInLocalStorage('selectedOption1', data?.data?.[0]?.option[0])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption1 == data?.data[0].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[0].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption1(data?.data?.[0]?.option[1])
                                submitPoints(data?.data[0]?.option[1], data?.data?.[0]?.id)
                                storeDataInLocalStorage('selectedOption1', data?.data[0]?.option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption1 == data?.data?.[0]?.option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[0]?.option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption1(data?.data?.[0]?.option[2])
                                submitPoints(data?.data[0]?.option[2], data?.data[0].id)
                                storeDataInLocalStorage('selectedOption1', data?.data[0].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption1 == data?.data[0].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[0].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption1(data?.data[0].option[3])
                                submitPoints(data?.data[0].option[3], data?.data[0].id)
                                storeDataInLocalStorage('selectedOption1', data?.data[0].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption1 == data?.data[0].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[0].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[1].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption2(data?.data[1].option[0])
                                submitPoints(data?.data[1].option[0], data?.data[1].id)
                                storeDataInLocalStorage('selectedOption2', data?.data[1].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption2 == data?.data[1].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[1].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption2(data?.data[1].option[1])
                                submitPoints(data?.data[1].option[1], data?.data[1].id)
                                storeDataInLocalStorage('selectedOption2', data?.data[1].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption2 == data?.data[1].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[1].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption2(data?.data[1].option[2])
                                submitPoints(data?.data[1].option[2], data?.data[1].id)
                                storeDataInLocalStorage('selectedOption2', data?.data[1].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption2 == data?.data[1].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[1].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption2(data?.data[1].option[3])
                                submitPoints(data?.data[1].option[3], data?.data[1].id)
                                storeDataInLocalStorage('selectedOption2', data?.data[1].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption2 == data?.data[1].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[1].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[2].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption3(data?.data[2].option[0])
                                submitPoints(data?.data[2].option[0], data?.data[2].id)
                                storeDataInLocalStorage('selectedOption3', data?.data[2].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption3 == data?.data[2].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[2].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption3(data?.data[2].option[1])
                                submitPoints(data?.data[2].option[1], data?.data[2].id)
                                storeDataInLocalStorage('selectedOption3', data?.data[2].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption3 == data?.data[2].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[2].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption3(data?.data[2].option[2])
                                submitPoints(data?.data[2].option[2], data?.data[2].id)
                                storeDataInLocalStorage('selectedOption3', data?.data[2].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption3 == data?.data[2].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[2].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption3(data?.data[2].option[3])
                                submitPoints(data?.data[2].option[3], data?.data[2].id)
                                storeDataInLocalStorage('selectedOption3', data?.data[2].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption3 == data?.data[2].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[2].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[3].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption4(data?.data[3].option[0])
                                submitPoints(data?.data[3].option[0], data?.data[3].id)
                                storeDataInLocalStorage('selectedOption4', data?.data[3].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption4 == data?.data[3].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[3].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption4(data?.data[3].option[1])
                                submitPoints(data?.data[3].option[1], data?.data[3].id)
                                storeDataInLocalStorage('selectedOption4', data?.data[3].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption4 == data?.data[3].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[3].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption4(data?.data[3].option[2])
                                submitPoints(data?.data[3].option[2], data?.data[3].id)
                                storeDataInLocalStorage('selectedOption4', data?.data[3].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption4 == data?.data[3].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[3].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption4(data?.data[3].option[3])
                                submitPoints(data?.data[3].option[3], data?.data[3].id)
                                storeDataInLocalStorage('selectedOption4', data?.data[3].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption4 == data?.data[3].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[3].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[4].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption5(data?.data[4].option[0])
                                submitPoints(data?.data[4].option[0], data?.data[4].id)
                                storeDataInLocalStorage('selectedOption5', data?.data[4].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption5 == data?.data[4].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[4].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption5(data?.data[4].option[1])
                                submitPoints(data?.data[4].option[1], data?.data[4].id)
                                storeDataInLocalStorage('selectedOption5', data?.data[4].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption5 == data?.data[4].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[4].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption5(data?.data[4].option[2])
                                submitPoints(data?.data[4].option[2], data?.data[4].id)
                                storeDataInLocalStorage('selectedOption5', data?.data[4].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption5 == data?.data[4].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[4].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption5(data?.data[4].option[3])
                                submitPoints(data?.data[4].option[3], data?.data[4].id)
                                storeDataInLocalStorage('selectedOption5', data?.data[4].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption5 == data?.data[4].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[4].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[5].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption6(data?.data[5].option[0])
                                submitPoints(data?.data[5].option[0], data?.data[5].id)
                                storeDataInLocalStorage('selectedOption6', data?.data[5].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption6 == data?.data[5].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[5].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption6(data?.data[5].option[1])
                                submitPoints(data?.data[5].option[1], data?.data[5].id)
                                storeDataInLocalStorage('selectedOption6', data?.data[5].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption6 == data?.data[5].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[5].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption6(data?.data[5].option[2])
                                submitPoints(data?.data[5].option[2], data?.data[5].id)
                                storeDataInLocalStorage('selectedOption6', data?.data[5].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption6 == data?.data[5].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[5].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption6(data?.data[5].option[3])
                                submitPoints(data?.data[5].option[3], data?.data[5].id)
                                storeDataInLocalStorage('selectedOption6', data?.data[5].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption6 == data?.data[5].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[5].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[6].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption7(data?.data[6].option[0])
                                submitPoints(data?.data[6].option[0], data?.data[6].id)
                                storeDataInLocalStorage('selectedOption7', data?.data[6].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption7 == data?.data[6].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[6].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption7(data?.data[6].option[1])
                                submitPoints(data?.data[6].option[1], data?.data[6].id)
                                storeDataInLocalStorage('selectedOption7', data?.data[6].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption7 == data?.data[6].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[6].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption7(data?.data[6].option[2])
                                submitPoints(data?.data[6].option[2], data?.data[6].id)
                                storeDataInLocalStorage('selectedOption7', data?.data[6].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption7 == data?.data[6].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[6].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption7(data?.data[6].option[3])
                                submitPoints(data?.data[6].option[3], data?.data[6].id)
                                storeDataInLocalStorage('selectedOption7', data?.data[6].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption7 == data?.data[6].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[6].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[7].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption8(data?.data[7].option[0])
                                submitPoints(data?.data[7].option[0], data?.data[7].id)
                                storeDataInLocalStorage('selectedOption8', data?.data[7].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption8 == data?.data[7].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[7].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption8(data?.data[7].option[1])
                                submitPoints(data?.data[7].option[1], data?.data[7].id)
                                storeDataInLocalStorage('selectedOption8', data?.data[7].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption8 == data?.data[7].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[7].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption8(data?.data[7].option[2])
                                submitPoints(data?.data[7].option[2], data?.data[7].id)
                                storeDataInLocalStorage('selectedOption8', data?.data[7].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption8 == data?.data[7].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[7].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption8(data?.data[7].option[3])
                                submitPoints(data?.data[7].option[3], data?.data[7].id)
                                storeDataInLocalStorage('selectedOption8', data?.data[7].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption8 == data?.data[7].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[7].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.bubble}>
                        <Text
                            style={styles.questionText}>
                            {data?.data[8].question}
                        </Text>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption9(data?.data[8].option[0])
                                submitPoints(data?.data[8].option[0], data?.data[8].id)
                                storeDataInLocalStorage('selectedOption9', data?.data[8].option[0])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption9 == data?.data[8].option[0]) ? colors.GREEN : colors.ORANGE }]}>

                                <Text

                                    style={styles.text1} >
                                    {data?.data[8].option[0]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption9(data?.data[8].option[1])
                                submitPoints(data?.data[8].option[1], data?.data[8].id)
                                storeDataInLocalStorage('selectedOption9', data?.data[8].option[1])
                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption9 == data?.data[8].option[1]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[8].option[1]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption9(data?.data[8].option[2])
                                submitPoints(data?.data[8].option[2], data?.data[8].id)
                                storeDataInLocalStorage('selectedOption9', data?.data[8].option[2])

                            }}>
                            <View

                                style={[styles.option, { backgroundColor: !(selectedOption9 == data?.data[8].option[2]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[8].option[2]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                setSelectedOption9(data?.data[8].option[3])
                                submitPoints(data?.data[8].option[3], data?.data[8].id)
                                storeDataInLocalStorage('selectedOption9', data?.data[8].option[3])
                            }}>
                            <View
                                style={[styles.option, { backgroundColor: !(selectedOption9 == data?.data[8].option[3]) ? colors.GREEN : colors.ORANGE }]}>
                                <Text

                                    style={styles.text1} >
                                    {data?.data[8].option[3]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{
                    backgroundColor: "white",
                    height: H * 0.1,
                    alignItems: "center",
                    paddingTop: H * 0.02,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingBottom: H * 0.03,
                    width: W
                }}>
                    <Text style={{ color: colors.FONT_BLACK, ...fontFamily.bold }}>{strings.TotalScore} {first + second + third + fourth + fifth + sixth + seventh + eighth + ninth} /27</Text>
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
    }

})