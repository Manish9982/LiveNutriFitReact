import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, Dimensions, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, W } from '../../colorSchemes/ColorSchemes'
import DataContext from '../../context/DataContext'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage'
import CustomHeader2 from '../Dashboard/Components/CustomHeader2'
import Progress from './Progress'
import RNRestart from 'react-native-restart'
import { Checkbox } from 'react-native-paper'




const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const Questions = () => {

    useEffect(() => { getDataFromApi() }, [])


    const { NquestionNumber, Nnum } = useContext(DataContext)
    const [questionNumber, setQuestionNumber] = NquestionNumber
    const [num, setNum] = Nnum
    const [myData, setMyData] = useState(null)
    const [customAnswer, setCustomAnswer] = useState('')
    const [totalQuestions, setTotalQuestions] = useState(2)
    const [loader, setLoader] = useState(true)
    const [itemIsSelected, setItemIsSelected] = useState(null)
    const [selectItem, setSelectItem] = useState(null)
    const [arr, setArr] = useState([])
    const [feet, setFeet] = useState('')
    const [inches, setInches] = useState('')


    var [sortedArray, setSortedArray] = useState([])


    const getDataFromApi = async () => {
        const result = await GetApiData('custom_question')

        if (result.status === 200) {
            setMyData(result)
            setTotalQuestions(result.data.length)
            setSortedArray(result.data)
            setLoader(false)
        }
        else {
            ToastAndroid.show(result.message, ToastAndroid.SHORT)
        }

    }

    const handleQuestionTypeTwo = (item) => {
        setSelectItem(prevItem => {
            if (prevItem == item)
                return null
            else return item
        })

        //////////////////


        if (arr.length == 0) {
            setArr([item])

        }
        else if (arr.length == 1 && arr.includes("None")) {
            arr.length = 0
        }
        else if (item == "None") {
            if (arr.includes("None")) {
                arr.length = 0
            }
            else setArr(["None"])
        }

        else if (arr.includes(item)) {
            for (let i = 0; i < arr.length; i++) {
                var index = arr.indexOf(item)
                if (index !== -1) {
                    arr.splice(index, 1)
                }
                else null

            }
        }
        else if (!arr.includes(item)) {
            setArr([...arr, item])

        }


        ///////////////



    }


    const regStatusUpdate = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage("user_id")
        formdata.append("id", JSON.parse(temp));
        formdata.append("register_status", "1")
        const result = await PostApiData('registerstatus')
    }

    const submitDataViaApi = async () => {
        if (myData?.data[questionNumber].question_type === '1' && itemIsSelected == null) {
            ToastAndroid.show("Please select an Option", ToastAndroid.SHORT) //error when nothing is selected for question_type 1
        }
        else if (myData?.data[questionNumber].question_type === '1') {
            setLoader(true)
            const temp = await getDataFromLocalStorage('user_id')
            var formdata = new FormData();
            formdata.append("question", questionNumber + 1);
            formdata.append("answer", itemIsSelected);
            formdata.append("user_id", JSON.parse(temp));

            const result = await PostApiData('Question-Answer', formdata)

            if (questionNumber < (totalQuestions - 1)) {
                setQuestionNumber(questionNumber + 1)
                setNum(questionNumber + 1)
                setLoader(false)
            }
            else if (questionNumber === (totalQuestions - 1)) {
                storeDataInLocalStorage('stackValue', '5')
                ToastAndroid.show('Registration Successful!', ToastAndroid.SHORT)
                regStatusUpdate()
                { storeDataInLocalStorage('stackValue', '5') && RNRestart.Restart() }                              // restart app to show Welcome Screen Before Bottom Tabs => signin
            }
        }
        else if (myData?.data[questionNumber].question_type === '3' && customAnswer.length == 0) {
            ToastAndroid.show("Required Field!", ToastAndroid.SHORT)
        }
        else if (myData?.data[questionNumber].question_type === '3' && customAnswer.length !== 0) {
            setLoader(true)
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('user_id')
            formdata.append("question", questionNumber + 1);
            formdata.append("answer", customAnswer);
            formdata.append("user_id", JSON.parse(temp));

            const result = await PostApiData('Question-Answer', formdata)
            setCustomAnswer('')
            if (questionNumber < (totalQuestions - 1)) {
                setQuestionNumber(questionNumber + 1)
                setNum(questionNumber + 1)
                setLoader(false)
            }
            else if (questionNumber === (totalQuestions - 1)) {
                setQuestionNumber(totalQuestions - 1)
                setNum(questionNumber + 1)
                setLoader(false)
            }
        }

        else if (myData?.data[questionNumber].question_type === '2' && arr.length == 0) {
            ToastAndroid.show("Select 'None' if you don't have any", ToastAndroid.SHORT)
        }
        else if (myData?.data[questionNumber].question_type === '2') {
            setLoader(true)
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('user_id')
            formdata.append("question", questionNumber);
            formdata.append("answer", JSON.stringify(arr));
            formdata.append("user_id", JSON.parse(temp));

            const result = await PostApiData('Question-Answer', formdata)

            setCustomAnswer('')
            if (questionNumber < (totalQuestions - 1)) {
                setQuestionNumber(questionNumber + 1)
                setNum(questionNumber + 1)
                setLoader(false)
            }
            else if (questionNumber === (totalQuestions - 1)) {
                setQuestionNumber(totalQuestions - 1)
                setNum(questionNumber + 1)
                setLoader(false)
            }
        }

    }

    const loopQuestion = () => {
        //Next Button Trigger
        submitDataViaApi(itemIsSelected)
        setItemIsSelected(null)
    }

    const optionSelected = (item) => {
        setItemIsSelected(item)
    }

    const convertIntoCm = (feet, inch) => {
        return (((feet * 12) + Number.parseInt(inch, 10)) * 2.54)
        // return ((feet))
    }


    //-------Main-------//



    console.log('arrr', arr)
    console.log('aaaa', selectItem)
    return (

        loader ?
            <View style={{ justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                <ActivityIndicator size='large' color={colors.GREEN} />
            </View>
            :
            <View>
                <CustomHeader2 title="" />
                <ScrollView contentContainerStyle={styles.mainContainer}>


                    <View style={{ width: WIDTH, alignItems: 'center' }}>
                        <View style={styles.progressBarView}>
                            <Progress progress={num / totalQuestions} />
                        </View>
                    </View>


                    <View style={styles.questionsView}>

                        <Text style={{ fontFamily: 'Montserrat-Medium' }}>{sortedArray[questionNumber].question}</Text>

                    </View>


                    <View style={{ alignItems: 'center', height: HEIGHT * 0.41, borderRadius: 1, borderColor: 'red' }}>
                        {
                            questionNumber === 4 ?                                       //Text Input For Question 4
                                <View style={styles.inputStyle}>
                                    <View>
                                        <TextInput activeOutlineColor={colors.GREEN}
                                            selectionColor={colors.GREEN}
                                            placeholder='Enter Weight'
                                            mode="outlined"
                                            style={{ fontSize: fontSizes.MED }}
                                            onChangeText={(text) => {
                                                setCustomAnswer(text)
                                            }}
                                            keyboardType='decimal-pad'
                                            value={customAnswer}
                                            maxLength={5} />
                                    </View>
                                    <View style={{ position: 'absolute', top: HEIGHT * 0.036, left: WIDTH * 0.6 }}>
                                        <Text>Kgs</Text>
                                    </View>
                                </View>
                                :
                                null
                        }


                        {
                            questionNumber === 5 ?                                         //Text Input For Question 5
                                <View style={styles.inputStyle}>
                                    <View>
                                        <TextInput activeOutlineColor={colors.GREEN}
                                            selectionColor={colors.GREEN}
                                            placeholder='Enter Weight'
                                            mode="outlined"
                                            style={{ fontSize: fontSizes.MED }}
                                            onChangeText={(text) => {
                                                setCustomAnswer(text)
                                            }}
                                            keyboardType='numeric'
                                            value={customAnswer}
                                            maxLength={5} />
                                    </View>
                                    <View style={{ position: 'absolute', top: HEIGHT * 0.036, left: WIDTH * 0.6 }}>
                                        <Text>Kgs</Text>
                                    </View>
                                </View>
                                :
                                null
                        }


                        {
                            questionNumber === 6 ?                                          //Text Input For Question 6
                                <View style={styles.inputStyle}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <TextInput activeOutlineColor={colors.GREEN}
                                            selectionColor={colors.GREEN}
                                            mode="outlined"
                                            style={{ fontSize: fontSizes.MED }}
                                            onChangeText={(text) => {
                                                setFeet(text)
                                            }}
                                            keyboardType='numeric'
                                            value={feet}
                                            maxLength={5} />
                                        <TextInput activeOutlineColor={colors.GREEN}
                                            selectionColor={colors.GREEN}
                                            mode="outlined"
                                            style={{ fontSize: fontSizes.MED }}
                                            onChangeText={(text) => {
                                                setInches(text)
                                                const temp = convertIntoCm(feet, text)
                                                setCustomAnswer(temp.toString())
                                            }}
                                            keyboardType='numeric'
                                            value={inches}
                                            maxLength={5} />
                                    </View>
                                    <View style={{ position: 'absolute', top: HEIGHT * 0.036, left: WIDTH * 0.3 }}>
                                        <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>Ft</Text>
                                    </View>
                                    <View style={{ position: 'absolute', top: HEIGHT * 0.036, left: WIDTH * 0.6 }}>
                                        <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>In</Text>
                                    </View>
                                </View>
                                :
                                null
                        }



                        <ScrollView>

                            {sortedArray[questionNumber].option.map(item => {


                                if (sortedArray[questionNumber].question_type === '2') {

                                    return (
                                        <View key={item}><TouchableOpacity onPress={() => {
                                            handleQuestionTypeTwo(item)

                                        }}
                                            style={{
                                                alignItems: 'center',
                                                borderRadius: 5,
                                                margin: 10,
                                                width: WIDTH * 0.75,
                                                height: HEIGHT * 0.1,
                                                backgroundColor: arr.includes(item) ? colors.GREEN : colors.GREY,
                                                flexDirection: 'row',
                                                paddingLeft: W * 0.1
                                            }}>
                                            <Checkbox
                                                status={arr.includes(item) ? 'checked' : 'unchecked'}
                                                style={{}}
                                                color={"white"} />

                                            <Text style={{ textAlign: 'center', color: arr.includes(item) ? 'white' : 'black' }}>{item}</Text></TouchableOpacity>


                                        </View>
                                    )
                                }

                                return (

                                    <View key={item}>
                                        <TouchableOpacity onPress={() => { optionSelected(item) }}
                                            style={{
                                                borderRadius: 5,
                                                margin: 10,
                                                width: WIDTH * 0.75,
                                                height: HEIGHT * 0.1,
                                                justifyContent: 'center',
                                                backgroundColor: itemIsSelected == item ? colors.GREEN : colors.GREY
                                            }}
                                            key={item}>
                                            <Text style={{ textAlign: 'center', color: itemIsSelected == item ? 'white' : 'black' }}>{item}</Text>
                                        </TouchableOpacity>

                                    </View>
                                )
                            })}


                        </ScrollView>

                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => { loopQuestion() }}
                            style={styles.nextButton}>
                            <Text style={[styles.textStyle, { color: 'white' }]}>Next</Text>
                        </TouchableOpacity>
                    </View>


                </ScrollView>
            </View>




    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: H * 0.9,
        //width: '100%',
        justifyContent: 'space-evenly',
        paddingVertical: '10%'

    },
    progressBarView:
    {

        width: WIDTH * 0.8,

    },
    questionsView:
    {
        alignItems: 'center',
        paddingHorizontal: WIDTH * 0.1
    },
    answerView:
    {

    },
    nextButton:
    {
        backgroundColor: colors.GREEN,
        height: HEIGHT * 0.06,
        justifyContent: 'center',
        borderRadius: 5,
        width: WIDTH * 0.75
    },
    textStyle:
    {
        ...fontFamily.bold,
        textAlign: 'center',
    },
    answerOptionsButtonStyle:
    {

    },
    inputStyle:
    {
        height: 20,
        width: WIDTH * 0.7
    },
})
export default Questions



