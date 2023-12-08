import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView, StatusBar, BackHandler, Modal, Image, Dimensions, Alert, } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { ActivityIndicator, Text, TextInput, Checkbox, } from 'react-native-paper'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage'
import DataContext from '../../context/DataContext'
//import Progress from './Progress'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import { Appbar } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import Logo from '../Dashboard/Components/Logo'
import { Animated } from 'react-native'
import LottieView from 'lottie-react-native'
import Loader from '../../assets/components/Loader'
import Progress from '../Questions/Progress'

import { useIsFocused } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import AsyncStorage from '@react-native-async-storage/async-storage';


//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const PaidCustomQuestions = ({ navigation, route }) => {
    const isFocused = useIsFocused()

    const [planduration, setPlanDuration] = useState('')



    useEffect(() => {
        retrieveAnswerFirst()
        //animate()
    }, [])


    useEffect(() => { getLanguge(), getPLanDuration() }, [isFocused])


    const getPLanDuration = async () => {
        const PlanDuration = await getDataFromLocalStorage("PlanDuration")
        setPlanDuration(PlanDuration || '3 Months')
        console.log("PLANDURATION+++++++++++++++++++++++++++++++++++++++++", PlanDuration)
    }



    //lng
    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            changeLaguagee('en')
            getQuestions("1")
        } else {
            changeLaguagee('hi')
            getQuestions("2")

        }
    }

    const changeLaguagee = (languageKey) => {
        strings.setLanguage(languageKey)
    }


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    const { NquestionNumber, Nnum, NglobalBmi, Ncrrnt, Ntrgt, Nht, Nfeet, Ninch, Nweight, Nweight2, Nweight3 } = useContext(DataContext)
    const [questionNumber, setQuestionNumber] = NquestionNumber
    const [num, setNum] = Nnum
    const [globalBmi, setGlobalBmi] = NglobalBmi
    const [crrnt, setCrrnt] = Ncrrnt
    const [trgt, setTrgt] = Ntrgt

    const [weight, setWeight] = Nweight
    const [weight2, setWeight2] = Nweight2
    const [weigh3, setWeight3] = Nweight3

    const [ht, setHt] = Nht
    const [feet, setFeet] = Nfeet
    const [inch, setInch] = Ninch


    const [arrCounter, setArrCounter] = useState(0)
    const [loader, setLoader] = useState(true)
    const [customAnswer, setCustomAnswer] = useState("")
    const [oldAnswer, setOldAnswer] = useState(null)
    const [nextAnswer, setNextAnswer] = useState(null)
    const [secondQuestionAnswer, setSecondQuestionAnswer] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)

    const [flag, setFlag] = useState(0)
    const [flag2, setFlag2] = useState(0)
    const [arr, setArr] = useState([])
    const [selectItem, setSelectItem] = useState(null)
    const [showFirstModal, setShowFirstModal] = useState(false)
    const [showSecondModal, setShowSecondModal] = useState(false)
    const [showThirdModal, setShowThirdModal] = useState(false)
    const [showFourthModal, setShowFourthModal] = useState(false)
    const [showFifthModal, setShowFifthhModal] = useState(false)
    const [showSixthModal, setShowSixthModal] = useState(false)
    const [showSeventhModal, setShowSeventhModal] = useState(false)
    const [showEighthModal, setShowEighthModal] = useState(false)
    const [showNinthModal, setShowNinthModal] = useState(false)
    const [textToDisplayInModalTwo, setTextToDisplayInModalTwo] = useState("")
    const [shouldGoBackToTargetWeight, setshouldGoBackToTargetWeight] = useState(false)
    const [showCustomAnswerModal, setShowCustomAnswerModal] = useState(false)
    const [ageForm, setAgeForm] = useState("")

    const [weekMealForm, setWeekMealForm] = useState("")

    const [mealForm2, setMealForm2] = useState("")

    const [mealForm3, setMealForm3] = useState("")

    const [mealForm4, setMealForm4] = useState("")
    const [mealForm5, setMealForm5] = useState("")

    const [myData, setMyData] = useState([])
    const [ans, setAns] = useState(null)
    const [ans2, setAns2] = useState(null)
    const [ans3, setAns3] = useState(null)
    const [ans4, setAns4] = useState(null)
    const [ans5, setAns5] = useState(null)
    const [ans6, setAns6] = useState(null)
    const [ans7, setAns7] = useState(null)
    const [ans8, setAns8] = useState(null)
    const [ans9, setAns9] = useState(null)
    const [ans10, setAns10] = useState(null)
    const [ans11, setAns11] = useState(null)
    const [ans12, setAns12] = useState(null)
    const [ans13, setAns13] = useState(null)
    const [ans14, setAns14] = useState(null)

    const [noneselected, setNoneselected] = useState(false)


    const translation = useRef(new Animated.Value(-W / 2)).current;


    useEffect(() => {
        getuserType()
    }, [])


    const handleNonePress = () => {
        if (noneselected) {
            //  setNoneselected(false)
            setCustomAnswer('None')
        } else {
            setCustomAnswer('None')
            //   setWeekMealForm("None")
            setNoneselected(true)

        }
    }


    const removeValue = async () => {
        try {
            await AsyncStorage.removeItem('upgradepopup')
        } catch (e) {
        }
    }

    const setRegisterStatusAPI = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp))
        formdata.append("user_type", "3");
        formdata.append("plan_type", planduration);
        const result = await PostApiData('registerpaid', formdata)

        removeValue()
        storeDataInLocalStorage("paiduserStatus", "PaymentDoneWithQuestions")


        if (result?.status == "200") {
            await storeDataInLocalStorage('stackValue', "3")
            console.log("RegisterStatus API SUCCESSS================", result)
            navigation.navigate("BottomTabs")

        } else {

            Alert.alert("Alert", result?.message)
        }

        // setName(result.name)
        setLoader(false)
    }

    const getuserType = async () => {
        const usertype = await getDataFromLocalStorage("user_type")
    }


    const getQuestions = async (language) => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp))
        formdata.append("language", "language")
        const result = await PostApiData('paid_user_profile', formdata)
        console.log(" paid result req=", result)
        setMyData(result.data)
        setLoader(false)

    }

    const handleNextPressForOptions = () => {
        if (((selectedOption == null) || (selectedOption == "")) && (customAnswer == "")) {
            ShortToast("Please select an Option", "warning", "")
        }
        else {

            setLoader(true)


            if (myData[arrCounter]?.id == "109") {
                setAns11(selectedOption)

                if (selectedOption == "Yes") {

                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }

                else {
                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
            }
            else if (myData[arrCounter]?.id == "111") {
                setAns12(selectedOption)

                if (selectedOption == "Yes") {

                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }

                else {
                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
            }



            else if (myData[arrCounter]?.id == "123") {
                setAns4(selectedOption)
                if (selectedOption == "No") {

                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }

                else {
                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
            }
            else if (myData[arrCounter]?.id == "125") {
                setAns5(selectedOption)
                if (selectedOption == "No") {

                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }

                else {
                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
            }

            else if (myData[arrCounter]?.id == "127") {
                setAns6(selectedOption)
                if (selectedOption == "No") {

                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 2)
                    setArrCounter(prev => prev + 2)
                    setLoader(false)
                }

                else {
                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
            }
            else if (myData[arrCounter]?.id == "130") {
                setAns8(selectedOption)
                if (selectedOption == "No") {

                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 2)
                    setArrCounter(prev => prev + 2)
                    setLoader(false)

                }
            }
            else if (myData[arrCounter]?.id == "131") {
                setAns7(selectedOption)
                if (selectedOption == "No") {
                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }

                else {
                    setLoader(true)
                    submitAnswer(selectedOption)
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
            }
            else if (myData[arrCounter]?.id == "133") {
                setAns10(selectedOption)
                setLoader(true)
                submitAnswer(selectedOption)
                setLoader(false)
               setRegisterStatusAPI()

            }

            else if (arrCounter == (myData.length - 1)) {
                setLoader(true)
                submitAnswer(selectedOption)
                setLoader(false)
                //  navigation.navigate("WelcomeScreenBeforeBottomTabs")
                setRegisterStatusAPI()

            }

           

            // else if (arrCounter == (myData.length - 1)) {
            //     setLoader(true)
            //     submitAnswer(selectedOption)
            //     setLoader(false)
            //     navigation.navigate("WelcomeScreenBeforeBottomTabs")

            // }
            else {
                setLoader(true)
                submitAnswer(selectedOption)
                setQuestionNumber(prev => prev + 1)
                setArrCounter(prev => prev + 1)
                setCustomAnswer("")

                setLoader(false)
                setFlag2(0)
            }
            setSelectedOption(null)
            setCustomAnswer("")
            retrieveAnswerCurrent(myData[arrCounter + 1]?.id)
        }
    }

    const submitAnswer = async (item) => {
        if (myData[arrCounter]?.id == '71') {
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('user_id')
            formdata.append("user_id", JSON.parse(temp));
            formdata.append("question", myData[arrCounter]?.id);
            formdata.append("answer", trgt)
            const result = await PostApiData('Question-Answer', formdata)
            console.log("resultttt==  ", result)
            console.log(" submit ans1 ====  ", formdata)

        }
        else {
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('user_id')
            formdata.append("user_id", JSON.parse(temp));
            formdata.append("question", myData[arrCounter]?.id);
            formdata.append("answer", item)

            //  formdata.append("others", "")

            const result = await PostApiData('Question-Answer', formdata)

            storeDataInLocalStorage("insulin", result?.insulin)
            storeDataInLocalStorage("diabetes", result?.diabetes)
            storeDataInLocalStorage("pregnant", result?.pregnant)

            setNoneselected(false)

        }
    }

    const retrieveAnswerFirst = async () => {

        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("question_id", "29")
        const result = await PostApiData('user_question_answer_selected', formdata)
        console.log("user_question_answer_selected= ", result)
        if (result.status == 200) {
            setOldAnswer(result)
            setSelectedOption(result?.answer[0])

        }
    }



    const retrieveAnswerCurrent = async (id) => {
        console.log("GAURAV================================================", id)

        setLoader(true)
        if (questionNumber == 1) {
            const temp = await getDataFromLocalStorage('user_id')
            var formdata = new FormData();
            formdata.append("user_id", JSON.parse(temp));
            formdata.append("question_id", id)
            const result = await PostApiData('user_question_answer_selected', formdata)
            console.log("GAURAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV", result)
            if (result.status == 200) {

                if (myData[arrCounter + 1]?.question_type == "2") {
                    setArr(result?.answer)
                }
                else if (myData[arrCounter + 1]?.question_type == "1") {
                    setSelectedOption(result?.answer[0])
                }
                else if (myData[arrCounter + 1]?.question_type == "3") {
                    setCustomAnswer(result?.answer[0])
                }
            }
        }
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("question_id", id)
        const result = await PostApiData('user_question_answer_selected', formdata)

        if (result.status == 200) {
            //setOldAnswer(result)

            if (myData[arrCounter + 1]?.question_type == "2") {
                setArr(result?.answer)
            }
            else if (myData[arrCounter + 1]?.question_type == "1") {
                setSelectedOption(result?.answer[0])
            }
            else if (myData[arrCounter + 1]?.id == "69") {
                setCustomAnswer(result?.answer[0])
                setCrrnt(result?.answer[0])
            }
            else if (myData[arrCounter + 1]?.id == "70") {
                setCustomAnswer(result?.answer[0])
                var realFeet = ((result?.answer[0] * 0.393700) / 12);
                var f = Math.floor(realFeet);
                var i = Math.round((realFeet - f) * 12);
                console.log(f)
                console.log(i)
                setFeet(JSON.stringify(f))
                setInch(JSON.stringify(i))
                setHt(() => { return ((Number.parseInt(f, 10) * 30.48) + (Number.parseInt(i, 10) * 2.54)) })
            }
            else if (myData[arrCounter + 1]?.id == "71") {
                setCustomAnswer(result?.answer[0])
                setTrgt(result?.answer[0])
            }
            else if (myData[arrCounter + 1]?.id == "65") {
                setCustomAnswer(result?.answer[0])
                setAgeForm(result?.answer[0])
            }
            else if (myData[arrCounter + 1]?.question_type == "3") {
                setCustomAnswer(result?.answer[0])
            }
            console.log('GAurva--------------------------->', result)
        }
        setLoader(false)
    }

    {/******************************************************************************** MAIN FUNCTION THAT HANDLES OPTION PRESS**************************************************************************************/ }
    const handleOptionPress = (item) => {
        if (item.toLowerCase().includes("other")) {
            setShowCustomAnswerModal(true)
        }
        if (myData[arrCounter]?.question_type == "2") {
            handleQuestionTypeTwo(item)
        }
        setSelectedOption(item)
        setOldAnswer(null)
        setNum(item)
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

    const backHandle = () => {

        setLoader(true)
        setOldAnswer(null)

        {
            if (arrCounter == 0) {
                navigation.goBack()
            }
            else if (arrCounter == 1) {
                setMyData([myData[0]])
                setQuestionNumber((prev) => prev - 1)
                setArrCounter(prev => prev - 1)
            }
            else if (flag == 1) {
                setQuestionNumber(prev => prev - 2)
                setArrCounter(prev => prev - 2)
                setLoader(false)
                setFlag(0)
            }



            else if (myData[arrCounter]?.id == "109") {
                if (ans11 == "No") {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }

            }


            else if (myData[arrCounter]?.id == "111") {
                if (ans12 == "No") {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }

            }




            else if (myData[arrCounter]?.id == "124") {
                if (ans4 == "No") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }

            }

            else if (myData[arrCounter]?.id == "126") {
                if (ans5 == "No") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }
            }

            else if (myData[arrCounter]?.id == "127") {
                if (ans6 == "No") {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }
            }

            else if (myData[arrCounter]?.id == "128") {
                if (ans6 == "No") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }
            }


            else if (myData[arrCounter]?.id == "132") {
                if (ans7 == "No") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }

            }
            else if (myData[arrCounter]?.id == "133") {
                if (ans10 == "No") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }

            }
            else if (myData[arrCounter]?.id == "134") {
                if (ans8 == "No") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)
                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }

            }

            else if (myData[arrCounter]?.id == "129") {

                console.log("ans= ", ans)

                if (ans6 == "No") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)


                }
                else {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }
            }

            else {
                setQuestionNumber((prev) => prev - 1)
                setArrCounter(prev => prev - 1)
            }
        }
        retrieveAnswerPrev()
        //setLoader(false)

    }

    const sendArray = async () => {
        if (arr.length == 0) {
            ShortToast("Please Select an Option", 'error', '')
        }
        else if (arrCounter == (myData.length - 1)) {
            setLoader(true)
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('user_id')
            formdata.append("question", myData[arrCounter]?.id);
            formdata.append("answer", arr);
            formdata.append("user_id", JSON.parse(temp))
            const result = await PostApiData('Question-Answer', formdata)

            setCustomAnswer("")
            navigation.navigate("WelcomeScreenBeforeBottomTabs")
            // navigation.navigate("QuestionsHealthAndBehavior", { "answer": route.params.answer })
            setLoader(false)
            setArr([])
        }
        else {
            if (myData[arrCounter]?.id == "94") {
                if (ans == "No") {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", arr);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")

                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)

                    // navigation.navigate("QuestionsHealthAndBehavior", { "answer": route.params.answer })
                    setLoader(false)
                    setArr([])
                }

                else {
                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", arr);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    // navigation.navigate("QuestionsHealthAndBehavior", { "answer": route.params.answer })

                    setLoader(false)
                    setArr([])
                }


            }


            else if (myData[arrCounter]?.id == "105") {
                if (ans == "Yes") {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", arr);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)

                    // navigation.navigate("QuestionsHealthAndBehavior", { "answer": route.params.answer })
                    setLoader(false)
                    setArr([])
                }

                else {
                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", arr);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)

                    // navigation.navigate("QuestionsHealthAndBehavior", { "answer": route.params.answer })
                    setLoader(false)
                    setArr([])
                }
            }
            else {
                setLoader(true)
                var formdata = new FormData();
                const temp = await getDataFromLocalStorage('user_id')
                formdata.append("question", myData[arrCounter]?.id);
                formdata.append("answer", arr);
                formdata.append("user_id", JSON.parse(temp))
                const result = await PostApiData('Question-Answer', formdata)

                setCustomAnswer("")
                setQuestionNumber(prev => prev + 1)
                setArrCounter(prev => prev + 1)

                setLoader(false)
                setArr([])
            }
        }
        retrieveAnswerCurrent(myData[arrCounter + 1]?.id)

    }

    const retrieveAnswerPrev = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("question_id", myData[arrCounter - 1]?.id)
        const result = await PostApiData('user_question_answer_selected', formdata)

        if (result.status == 200) {
            setOldAnswer(result)

            if (myData[arrCounter - 1]?.question_type == "2") {
                setArr(result?.answer)
            }
            else if (myData[arrCounter - 1]?.question_type == "1") {
                setSelectedOption(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "69") {
                setCustomAnswer(result?.answer[0])
                setCrrnt(result?.answer[0])
            }


            else if (myData[arrCounter - 1]?.id == "65") {
                setCustomAnswer(result?.answer[0])
                setAgeForm(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "116") {
                setCustomAnswer(result?.answer[0])
                setWeight2(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "112") {
                setCustomAnswer(result?.answer[0])
                setWeekMealForm(result?.answer[0])
            }

            else if (myData[arrCounter - 1]?.id == "117") {
                setCustomAnswer(result?.answer[0])
                setMealForm2(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "120") {
                setCustomAnswer(result?.answer[0])
                setMealForm3(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "121") {
                setCustomAnswer(result?.answer[0])
                setMealForm4(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "122") {
                setCustomAnswer(result?.answer[0])
                setMealForm5(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "130") {
                setCustomAnswer(result?.answer[0])
                setWeight3(result?.answer[0])
            }
            console.log(result)
            setLoader(false)
        }
    }


    const handleCustomAnswer = async (t) => {


        if (myData[arrCounter]?.question_type == "3") {
            setLoader(true)

            if (t.length !== 0) {

                var formdata = new FormData();
                const temp = await getDataFromLocalStorage('user_id')
                formdata.append("question", myData[arrCounter]?.id);
                formdata.append("answer", customAnswer);
                formdata.append("user_id", JSON.parse(temp))
                const result = await PostApiData('Question-Answer', formdata)

                setCustomAnswer("")
                setQuestionNumber(prev => prev + 1)
                setArrCounter(prev => prev + 1)
                setNoneselected(false)
                // navigation.navigate("QuestionsHealthAndBehavior", { "answer": route.params.answer })
                setLoader(false)
            }
            else if (customAnswer == "") {
                ShortToast('Please enter your Answer', 'warning', '')
                setSelectedOption("")
            }

        }

        retrieveAnswerCurrent(myData[arrCounter + 1]?.id)


    }



    const getColor = (item) => {
        if (myData[arrCounter]?.question_type == "2") {
            if (arr.includes(item)) {
                return colors.GREEN
            }
            else {
                return "white"
            }
        }
        else {
            if ((oldAnswer?.answer[0] == item) || (selectedOption == item))
                return colors.GREEN
            else return "white"

        }
    }
    const getColorForText = (item) => {
        if (myData[arrCounter]?.question_type == "2") {
            if (arr.includes(item)) {
                return "white"
            }
            else {
                return colors.FONT_BLACK
            }
        }
        else {
            if ((oldAnswer?.answer[0] == item) || (selectedOption == item))
                return "white"
            else return colors.FONT_BLACK
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{

            }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 5,
                        margin: 10,
                        width: W * 0.85,
                        //height: H * 0.1,
                        justifyContent: "center",
                        backgroundColor: getColor(item),
                        alignItems: "center",
                        alignSelf: "center",
                        flexDirection: "row",
                        paddingVertical: H * 0.025,
                        paddingHorizontal: W * 0.0

                    }}
                    onPress={() => {
                        handleOptionPress(item)
                    }}>
                    {(myData[arrCounter]?.question_type == "2") ?
                        <View style={{

                            marginLeft: W * 0.1,
                        }}>
                            <Checkbox
                                status={arr.includes(item) ? 'checked' : 'unchecked'}
                                color={"white"} />
                        </View>
                        : null}

                    <Text style={{
                        width: W * 0.65,
                        fontFamily: "Montserrat-Medium",
                        color: getColorForText(item),
                        textAlign: "center",
                        marginRight: (myData[arrCounter]?.question_type == "2") ? W * 0.1 : null,

                    }}>{item}</Text>
                </TouchableOpacity>
            </View >
        )
    }




    return (

        <View >
            <StatusBar backgroundColor={(showFirstModal || showThirdModal || showFourthModal || showFifthModal || showSixthModal || showSeventhModal || showEighthModal || showNinthModal) ? "white" : colors.GREEN} />
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => backHandle()
                } />
                <Appbar.Content style={{
                    alignItems: "center",
                    marginRight: W * 0.125
                }} title={<Text style={{
                    color: "white",
                    fontSize: fontSizes.XL,
                    fontFamily: "Montserrat-SemiBold"
                }}>Profiling</Text>} />
            </Appbar.Header>

            {loader ?
                <Loader />
                :
                <View style={{
                    //justifyContent: "center",
                    height: H,
                    width: W,
                    paddingBottom: H * 0.1,


                }}>
                    <Modal visible={showCustomAnswerModal}
                        transparent={true}>
                        <View
                            style={{
                                height: H,
                                width: W,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0,0,0,0.3)"
                            }}
                        >
                            <View style={{
                                height: H * 0.3,
                                backgroundColor: colors.OFFWHITE,
                                // backgroundColor: "red",
                                width: W * 0.85,
                                alignSelf: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 8,
                                elevation: 8,
                            }}
                            >
                                <Text style={{
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL,
                                    paddingBottom: H * 0.04,
                                }}>
                                    Please specify:
                                </Text>
                                <TextInput
                                    activeUnderlineColor={colors.GREEN}
                                    value={customAnswer}
                                    onChangeText={(t) => { setCustomAnswer(t) }}
                                    maxLength={100}
                                    style={{
                                        height: H * 0.1,
                                        width: W * 0.7,
                                        backgroundColor: "white",
                                        textAlignVertical: "top",
                                    }} />
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: W * 0.6,
                                    alignSelf: "center"
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        handleCustomAnswer()
                                        setShowCustomAnswerModal(false)
                                    }}>
                                        <Text style={{
                                            fontFamily: fontFamily.bold,
                                            color: colors.GREEN,
                                            fontSize: fontSizes.XL,
                                            paddingTop: H * 0.028,
                                        }}>
                                            OKAY
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setShowCustomAnswerModal(false)
                                        setSelectedOption("")
                                    }}
                                    >
                                        <Text style={{
                                            fontFamily: fontFamily.bold,
                                            color: "red",
                                            fontSize: fontSizes.XL,
                                            paddingTop: H * 0.028,
                                        }}>
                                            CANCEL
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>



                    <Modal visible={showFirstModal}>


                        <View style={{
                            // position: "absolute",
                            alignSelf: "center",
                            top: H * 0.3,
                            zIndex: 2,
                        }}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={{
                                //backgroundColor: "red",
                                height: H,
                            }}
                        >


                            <Image source={require('../../assets/icons/image7.png')}
                                style={{
                                    height: H,
                                    width: W,
                                    position: "absolute"
                                }} />
                            <TouchableOpacity
                                onPress={() => {
                                    setShowFirstModal(false)
                                }}
                                style={{
                                    backgroundColor: colors.GREEN,
                                    width: W * 0.9,
                                    height: H * 0.08,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 8,
                                    position: "absolute",
                                    top: H * 0.8
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL
                                }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    < Modal visible={showThirdModal}
                    >
                        <View style={{
                            // position: "absolute",
                            alignSelf: "center",
                            top: H * 0.3,
                            zIndex: 2,

                        }}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={{
                                //backgroundColor: "red",
                                height: H,
                            }}
                        >

                            <Image source={require('../../assets/icons/image1.png')}
                                style={{
                                    height: H,
                                    width: W,
                                    position: "absolute"
                                }} />

                            <TouchableOpacity
                                onPress={() => {
                                    setShowThirdModal(false)
                                }}
                                style={{
                                    backgroundColor: colors.GREEN,
                                    width: W * 0.9,
                                    height: H * 0.08,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 8,
                                    position: "absolute",
                                    top: H * 0.8
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL
                                }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal >
                    <Modal visible={showFourthModal}
                    >
                        <View style={{
                            // position: "absolute",
                            alignSelf: "center",
                            top: H * 0.3,
                            zIndex: 2,
                        }}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={{
                                //backgroundColor: "red",
                                height: H,
                            }}
                        >
                            <Image source={require('../../assets/icons/image3.png')}
                                style={{
                                    height: H,
                                    width: W,
                                    position: "absolute"
                                }} />

                            <TouchableOpacity
                                onPress={() => {
                                    setShowFourthModal(false)
                                }}
                                style={{
                                    backgroundColor: colors.GREEN,
                                    width: W * 0.9,
                                    height: H * 0.08,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 8,
                                    position: "absolute",
                                    top: H * 0.8
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL
                                }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showFifthModal}>

                        <View

                            style={{
                                //backgroundColor: "red",
                                height: H,
                            }}
                        >

                            <View style={{
                                position: "absolute",
                                alignSelf: "center",
                                top: H * 0.04,
                                zIndex: 2,
                            }}>
                                {/* <Logo /> */}
                            </View>
                            <View style={{
                                height: H,
                                width: W,
                                backgroundColor: colors.LIGHT_GREEN
                            }}>

                                <View style={{
                                    backgroundColor: colors.LIGHT_GREEN,
                                    height: H * 0.65,
                                    width: W * 0.95,
                                    alignSelf: "center",
                                    //marginTop: H * 0.1,
                                    borderRadius: 8,
                                    alignItems: "center",
                                    marginTop: H * 0.0
                                    //justifyContent: "center"
                                }}>
                                    <Image source={require('../../assets/icons/image4.png')}
                                        style={{
                                            height: H,
                                            width: W,
                                            marginBottom: H * 0.008,
                                            borderRadius: 8,
                                            marginTop: H * 0,
                                        }} />

                                    <Text
                                        style={{
                                            color: colors.FONT_BLACK,
                                            fontFamily: fontFamily.bold,
                                            width: W * 0.75,
                                            textAlign: "left"
                                        }}>

                                    </Text>

                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowFifthhModal(false)
                                }}
                                style={{
                                    backgroundColor: colors.GREEN,
                                    width: W * 0.9,
                                    height: H * 0.08,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 8,
                                    position: "absolute",
                                    top: H * 0.8
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL
                                }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showEighthModal}
                    >
                        <View style={{
                            position: "absolute",
                            alignSelf: "center",
                            top: H * 0.3,
                            zIndex: 2,
                        }}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={{
                                //backgroundColor: "red",
                                height: H,
                            }} >
                            <Image source={require('../../assets/icons/image5.png')}
                                style={{
                                    height: H,
                                    width: W,
                                    position: "absolute"
                                }} />
                            {/* <Text
                                style={{
                                    color: colors.FONT_BLACK,
                                    fontFamily: "Montserrat-Bold",
                                    fontSize: fontSizes.XXL,
                                    width: W * 0.96,
                                    textAlign: "center",
                                    paddingTop: H * 0.02,
                                    paddingBottom: H * 0.01,
                                    alignSelf: "center",
                                    marginTop: H * 0.46,
                                    lineHeight: H * 0.035
                                }}>
                                Almost done!

                            </Text> */}

                            {/* <Text
                                style={{
                                    color: colors.FONT_BLACK,
                                    fontFamily: fontFamily.bold,
                                    width: W * 0.96,
                                    textAlign: "center",
                                    alignSelf: "center",
                                    fontSize: fontSizes.XL,
                                    lineHeight: H * 0.033,
                                    marginTop: H * 0.03
                                }}>
                                Just a few questions left to find Optimized Nutrition and Functional Fitness Plans
                            </Text> */}
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setShowEighthModal(false)
                            }}
                            style={{
                                backgroundColor: colors.GREEN,
                                width: W * 0.9,
                                height: H * 0.08,
                                alignSelf: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 8,
                                position: "absolute",
                                top: H * 0.8
                            }}>
                            <Text style={{
                                color: "white",
                                fontFamily: fontFamily.bold,
                                fontSize: fontSizes.XL
                            }}>Next</Text>
                        </TouchableOpacity>
                    </Modal>
                    <Modal visible={showNinthModal}>


                        <View style={{
                            // position: "absolute",
                            alignSelf: "center",
                            top: H * 0.3,
                            zIndex: 2,
                        }}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={{
                                //backgroundColor: "red",
                                height: H,
                            }}
                        >
                            <Image source={require('../../assets/icons/image6.png')}
                                style={{
                                    height: H,
                                    width: W,
                                    position: "absolute"
                                }} />
                            {/* <Text
                                style={{
                                    color: colors.FONT_BLACK,
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL,
                                    width: W * 0.96,
                                    textAlign: "center",
                                    paddingTop: H * 0.02,
                                    paddingBottom: H * 0.01,
                                    alignSelf: "center",
                                    marginTop: H * 0.35,
                                    lineHeight: H * 0.035,
                                    paddingHorizontal: W * 0.03
                                }}>
                                Most chronic diseases can be
                                reversed with healthy diet & lifestyle changes.


                            </Text> */}
                            {/*  <LottieView style={{
                               // height: H * 0.08,
                            }}
                                source={require('../../assets/animations/20221109_2308151.mp4.lottie.json')}
                        autoPlay loop />*/}

                            {/* <Text
                                style={{
                                    color: colors.FONT_BLACK,
                                    fontFamily: fontFamily.bold,
                                    width: W * 0.96,
                                    textAlign: "center",
                                    alignSelf: "center",
                                    fontSize: fontSizes.XL,
                                    lineHeight: H * 0.033,
                                    //color: "grey",
                                    paddingVertical: H * 0.02,

                                }}>
                                Your diagnosis is NOT your destiny.
                            </Text> */}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowNinthModal(false)
                                }}
                                style={{
                                    backgroundColor: colors.GREEN,
                                    width: W * 0.9,
                                    height: H * 0.08,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 8,
                                    position: "absolute",
                                    top: H * 0.8
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL
                                }}>Next</Text>
                            </TouchableOpacity>

                        </View>
                    </Modal>


                    <View style={styles.progressBarView}>
                        <Progress progress={(arrCounter == 0) || (arrCounter == 1) ? ((arrCounter + 1) / 30) : ((arrCounter + 1) / myData.length)} />
                    </View>
                    <View style={styles.questionsView}>

                        <Text style={{
                            fontFamily: "Montserrat-Bold",
                            color: colors.FONT_BLACK,
                            fontSize: fontSizes.XL,
                            textAlign: "center"
                        }}>{myData[arrCounter]?.question}</Text>
                        <Text style={{
                            fontFamily: "Montserrat-Bold",
                            color: colors.FONT_BLACK,
                            fontSize: fontSizes.XL,
                            textAlign: "center"
                        }}>{myData[arrCounter]?.question_type == "2" ? "(Select all that apply)" : null}</Text>
                    </View>




                    {
                        myData[arrCounter]?.option?.length == 0 ?

                            <>
                                {myData[arrCounter]?.id == "69" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                // keyboardType="number-pad"
                                                maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else {
                                                        setCrrnt(t)
                                                        setCustomAnswer(t)
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.3,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>Kgs</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}
                                {myData[arrCounter]?.id == "70" ?
                                    <>
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            top: H * 0.18
                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    if (t == " ")
                                                        ShortToast("Blank Spaces Not Allowed", 'error', '')
                                                    else if (t == '0') {
                                                        ShortToast("Height can't be Zero", 'error', '')
                                                    }
                                                    else if ((t > 8) || (t == ".") || (t == ",") || (t == "-") || (t == " ")) {
                                                        ShortToast("Height is not Valid", 'error', '')
                                                    }
                                                    else {
                                                        setFeet(t.toString())
                                                        setCustomAnswer(() => { return ((Number.parseInt(t, 10) * 30.48) + (Number.parseInt(inch, 10) * 2.54)).toString() })
                                                        setHt(() => { return ((Number.parseInt(t, 10) * 30.48) + (Number.parseInt(inch, 10) * 2.54)) })
                                                    }
                                                }}
                                                // onBlur={(t) => { setCustomAnswer(() => { return (Number.parseInt(t, 10) * 30.48) + (Number.parseInt(inch, 10) * 2.54) }) }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.15,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,
                                                marginRight: W * 0.03,
                                            }}>Ft</Text>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                keyboardType="number-pad"
                                                maxLength={2}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    if (t == " ")
                                                        ShortToast("Blank Spaces Not Allowed", 'error', '')
                                                    else if (t > 12) {
                                                        ShortToast("Value in Inch should be less than 12", 'error', '')
                                                    }
                                                    else if ((t.includes(".")) || t.includes(",") || (t.includes("-") || t.includes(" "))) {
                                                        ShortToast("Special Characters are Not Allowed", 'error', '')
                                                    }
                                                    else {
                                                        setInch(t.toString())
                                                        setCustomAnswer(() => { return ((Number.parseInt(feet, 10) * 30.48) + (Number.parseInt(t, 10) * 2.54)).toString() })
                                                        setHt(() => { return ((Number.parseInt(feet, 10) * 30.48) + (Number.parseInt(t, 10) * 2.54)) })
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.15,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>In</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}
                                {myData[arrCounter]?.id == "71" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                //keyboardType="number-pad"
                                                maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else {
                                                        setTrgt(t)
                                                        setCustomAnswer(t)
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.3,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>Kgs</Text>
                                        </View>
                                        {showSecondModal ?
                                            <>
                                                <Text
                                                    style={{
                                                        fontFamily: fontFamily.bold,
                                                        backgroundColor: colors.LIGHT_GREEN,
                                                        paddingVertical: H * 0.03,
                                                        paddingHorizontal: W * 0.05,
                                                        borderRadius: 8,
                                                        top: H * 0.5,
                                                        width: W * 0.85,
                                                        alignSelf: "center",
                                                        position: "absolute",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>{shouldGoBackToTargetWeight ?
                                                        <>
                                                            <Text style={{ fontFamily: fontFamily.bold, color: "red" }}>{`\nRecommended : ${((Math.round(((ht * ht * 18.5) / 10000) * 100) / 100) + 1).toFixed(0)} Kg to ${((Math.round(((ht * ht * 36) / 10000) * 100) / 100) - 1).toFixed(0)} Kg`}</Text> <MaterialIcons name="error-outline" size={16} color="red" style={{
                                                                alignSelf: "center", marginTop: H * 0.01, marginHorizontal: W * 0.06
                                                            }} />
                                                        </>
                                                        :
                                                        null}
                                                    {textToDisplayInModalTwo}

                                                </Text>

                                            </>
                                            : null}
                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}
                                {myData[arrCounter]?.id == "71" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                // keyboardType="number-pad"
                                                maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else {
                                                        setTrgt(t)
                                                        setCustomAnswer(t)
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.3,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>Kgs</Text>
                                        </View>
                                        {showSecondModal ?
                                            <>
                                                <Text
                                                    style={{
                                                        fontFamily: fontFamily.bold,
                                                        backgroundColor: colors.LIGHT_GREEN,
                                                        paddingVertical: H * 0.03,
                                                        paddingHorizontal: W * 0.05,
                                                        borderRadius: 8,
                                                        top: H * 0.5,
                                                        width: W * 0.85,
                                                        alignSelf: "center",
                                                        position: "absolute",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>{shouldGoBackToTargetWeight ?
                                                        <>
                                                            <Text style={{ fontFamily: fontFamily.bold, color: "red" }}>{`\nRecommended : ${((Math.round(((ht * ht * 18.5) / 10000) * 100) / 100) + 1).toFixed(0)} Kg to ${((Math.round(((ht * ht * 36) / 10000) * 100) / 100) - 1).toFixed(0)} Kg`}</Text> <MaterialIcons name="error-outline" size={16} color="red" style={{
                                                                alignSelf: "center", marginTop: H * 0.01, marginHorizontal: W * 0.06
                                                            }} />
                                                        </>
                                                        :
                                                        null}
                                                    {textToDisplayInModalTwo}

                                                </Text>

                                            </>
                                            : null}
                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}





                                {myData[arrCounter]?.id == "65" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                // keyboardType="number-pad"
                                                maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else {
                                                        setAgeForm(t)
                                                        setCustomAnswer(t)
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.3,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>Years</Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}



                                {myData[arrCounter]?.id == "112" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    setWeekMealForm(t)
                                                    setCustomAnswer(t)
                                                    setNoneselected(false)
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    // marginRight: W * 0.04,
                                                }}
                                            />

                                        </View>

                                        {myData[arrCounter]?.none == "true" &&

                                            <TouchableOpacity

                                                onPress={() => handleNonePress()}
                                                style={{
                                                    backgroundColor: noneselected ? colors.GREEN : "white",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    alignSelf: "center",
                                                    width: W * 0.8,
                                                    borderRadius: 8,
                                                    marginTop: H * 0.15
                                                }}>
                                                <Text style={{
                                                    fontSize: fontSizes.XXL,
                                                    color: noneselected ? "white" : "black",
                                                    fontFamily: fontFamily.bold,
                                                    paddingVertical: H * 0.02,
                                                }}>None</Text>
                                            </TouchableOpacity>}




                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.23
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}


                                {myData[arrCounter]?.id == "115" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                //keyboardType="number-pad"
                                                maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {
                                                    setWeight(t)
                                                    setCustomAnswer(t)

                                                }}

                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.3,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }
                                                }

                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>Kgs</Text>
                                        </View>
                                        {showSecondModal ?
                                            <>
                                                <Text
                                                    style={{
                                                        fontFamily: fontFamily.bold,
                                                        backgroundColor: colors.LIGHT_GREEN,
                                                        paddingVertical: H * 0.03,
                                                        paddingHorizontal: W * 0.05,
                                                        borderRadius: 8,
                                                        top: H * 0.5,
                                                        width: W * 0.85,
                                                        alignSelf: "center",
                                                        position: "absolute",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>{shouldGoBackToTargetWeight ?
                                                        <>
                                                            {/* <Text style={{ fontFamily: fontFamily.bold, color: "red" }}>{`\nRecommended : ${((Math.round(((ht * ht * 18.5) / 10000) * 100) / 100) + 1).toFixed(0)} Kg to ${((Math.round(((ht * ht * 36) / 10000) * 100) / 100) - 1).toFixed(0)} Kg`}</Text> <MaterialIcons name="error-outline" size={16} color="red" style={{
                                                                alignSelf: "center", marginTop: H * 0.01, marginHorizontal: W * 0.06
                                                            }} /> */}
                                                        </>
                                                        :
                                                        null}
                                                    { }

                                                </Text>

                                            </>
                                            : null}
                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}


                                {myData[arrCounter]?.id == "116" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                // keyboardType="number-pad"
                                                //  maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {


                                                    if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }
                                                    else {
                                                        setWeight2(t)
                                                        setCustomAnswer(t)
                                                    }


                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.3,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>Kgs</Text>
                                        </View>
                                        {showSecondModal ?
                                            <>
                                                <Text
                                                    style={{
                                                        fontFamily: fontFamily.bold,
                                                        backgroundColor: colors.LIGHT_GREEN,
                                                        paddingVertical: H * 0.03,
                                                        paddingHorizontal: W * 0.05,
                                                        borderRadius: 8,
                                                        top: H * 0.5,
                                                        width: W * 0.85,
                                                        alignSelf: "center",
                                                        position: "absolute",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>{shouldGoBackToTargetWeight ?
                                                        <>
                                                            {/* <Text style={{ fontFamily: fontFamily.bold, color: "red" }}>{`\nRecommended : ${((Math.round(((ht * ht * 18.5) / 10000) * 100) / 100) + 1).toFixed(0)} Kg to ${((Math.round(((ht * ht * 36) / 10000) * 100) / 100) - 1).toFixed(0)} Kg`}</Text> <MaterialIcons name="error-outline" size={16} color="red" style={{
                                                                alignSelf: "center", marginTop: H * 0.01, marginHorizontal: W * 0.06
                                                            }} /> */}
                                                        </>
                                                        :
                                                        null}
                                                    { }

                                                </Text>

                                            </>
                                            : null}
                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}

                                {myData[arrCounter]?.id == "117" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}

                                                value={customAnswer}
                                                onChangeText={(t) => {

                                                    setMealForm2(t)
                                                    setCustomAnswer(t)
                                                    setNoneselected(false)


                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    //  marginRight: W * 0.04,
                                                }}
                                            />

                                        </View>



                                        {myData[arrCounter]?.none == "true" &&

                                            <TouchableOpacity


                                                onPress={
                                                    () =>
                                                        handleNonePress()
                                                }
                                                style={{
                                                    backgroundColor: noneselected ? colors.GREEN : "white",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    alignSelf: "center",
                                                    width: W * 0.8,
                                                    borderRadius: 8,
                                                    marginTop: H * 0.15
                                                }}>
                                                <Text style={{
                                                    fontSize: fontSizes.XXL,
                                                    color: noneselected ? "white" : "black",
                                                    fontFamily: fontFamily.bold,
                                                    paddingVertical: H * 0.02,
                                                }}>None</Text>
                                            </TouchableOpacity>}


                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.2
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}
                                {myData[arrCounter]?.id == "120" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                // keyboardType="number-pad"
                                                // maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {


                                                    setMealForm3(t)
                                                    setCustomAnswer(t)
                                                    setNoneselected(false)


                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    //marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}></Text>
                                        </View>

                                        {myData[arrCounter]?.none == "true" &&

                                            <TouchableOpacity


                                                onPress={
                                                    () =>
                                                        handleNonePress()
                                                }
                                                style={{
                                                    backgroundColor: noneselected ? colors.GREEN : "white",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    alignSelf: "center",
                                                    width: W * 0.8,
                                                    borderRadius: 8,
                                                    marginTop: H * 0.15
                                                }}>
                                                <Text style={{
                                                    fontSize: fontSizes.XXL,
                                                    color: noneselected ? "white" : "black",
                                                    fontFamily: fontFamily.bold,
                                                    paddingVertical: H * 0.02,
                                                }}>None</Text>
                                            </TouchableOpacity>}




                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.2
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}


                                {myData[arrCounter]?.id == "121" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}
                                                //  keyboardType="number-pad"
                                                // maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {

                                                    setMealForm4(t)
                                                    setCustomAnswer(t)
                                                    setNoneselected(false)



                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    //  marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}></Text>
                                        </View>


                                        {myData[arrCounter]?.none == "true" &&

                                            <TouchableOpacity


                                                onPress={
                                                    () =>
                                                        handleNonePress()
                                                }
                                                style={{
                                                    backgroundColor: noneselected ? colors.GREEN : "white",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    alignSelf: "center",
                                                    width: W * 0.8,
                                                    borderRadius: 8,
                                                    marginTop: H * 0.15
                                                }}>
                                                <Text style={{
                                                    fontSize: fontSizes.XXL,
                                                    color: noneselected ? "white" : "black",
                                                    fontFamily: fontFamily.bold,
                                                    paddingVertical: H * 0.02,
                                                }}>None</Text>
                                            </TouchableOpacity>}







                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.2
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}


                                {myData[arrCounter]?.id == "122" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                underlineColor={"white"}

                                                value={customAnswer}
                                                onChangeText={(t) => {

                                                    setMealForm5(t)
                                                    setCustomAnswer(t)
                                                    setNoneselected(false)


                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    //marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}></Text>
                                        </View>


                                        {myData[arrCounter]?.none == "true" &&

                                            <TouchableOpacity


                                                onPress={
                                                    () =>
                                                        handleNonePress()
                                                }
                                                style={{
                                                    backgroundColor: noneselected ? colors.GREEN : "white",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    alignSelf: "center",
                                                    width: W * 0.8,
                                                    borderRadius: 8,
                                                    marginTop: H * 0.15
                                                }}>
                                                <Text style={{
                                                    fontSize: fontSizes.XXL,
                                                    color: noneselected ? "white" : "black",
                                                    fontFamily: fontFamily.bold,
                                                    paddingVertical: H * 0.02,
                                                }}>None</Text>
                                            </TouchableOpacity>}





                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.2
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}



                                {myData[arrCounter]?.id == "130" ?
                                    <>
                                        <View style={{
                                            //backgroundColor: "red",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: W,
                                            justifyContent: "center",
                                            alignSelf: "center",
                                            top: H * 0.1

                                        }}>
                                            <TextInput
                                                activeOutlineColor='white'
                                                activeUnderlineColor={colors.GREEN}
                                                //  underlineColor={"white"}
                                                // keyboardType="number-pad"
                                                //  maxLength={5}
                                                value={customAnswer}
                                                onChangeText={(t) => {

                                                    // if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }
                                                    // else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }
                                                    // else {
                                                    //     setWeight3(t)
                                                    //     setCustomAnswer(t)
                                                    // }
                                                    if (t.length == 0 || t.includes(" ")) {
                                                        ShortToast("Invalid Input", "warning", "")
                                                    }

                                                    else {
                                                        setWeight3(t)
                                                        setCustomAnswer(t)
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.3,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>Kgs</Text>
                                        </View>
                                        {showSecondModal ?
                                            <>
                                                <Text
                                                    style={{
                                                        fontFamily: fontFamily.bold,
                                                        backgroundColor: colors.white,
                                                        paddingVertical: H * 0.03,
                                                        paddingHorizontal: W * 0.05,
                                                        borderRadius: 8,
                                                        top: H * 0.5,
                                                        width: W * 0.85,
                                                        alignSelf: "center",
                                                        position: "absolute",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>{shouldGoBackToTargetWeight ?
                                                        <>
                                                            {/* <Text style={{ fontFamily: fontFamily.bold, color: "red" }}>{`\nRecommended : ${((Math.round(((ht * ht * 18.5) / 10000) * 100) / 100) + 1).toFixed(0)} Kg to ${((Math.round(((ht * ht * 36) / 10000) * 100) / 100) - 1).toFixed(0)} Kg`}</Text> <MaterialIcons name="error-outline" size={16} color="red" style={{
                                                                alignSelf: "center", marginTop: H * 0.01, marginHorizontal: W * 0.06
                                                            }} /> */}
                                                        </>
                                                        :
                                                        null}
                                                    { }

                                                </Text>

                                            </>
                                            : null}



                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={{
                                                backgroundColor: colors.GREEN,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "center",
                                                width: W * 0.85,
                                                borderRadius: 8,
                                                marginTop: H * 0.3
                                            }}>
                                            <Text style={{
                                                fontSize: fontSizes.XXL,
                                                color: "white",
                                                fontFamily: fontFamily.bold,
                                                paddingVertical: H * 0.02,
                                            }}>Next</Text>
                                        </TouchableOpacity>

                                    </>
                                    :
                                    null}


                            </>
                            :
                            <>
                                {
                                    (myData[arrCounter]?.question_type == "2") ?
                                        <>

                                            <View style={{
                                                height: H * 0.6,
                                                W: W * 0.9,
                                                alignSelf: "center",
                                                alignItems: "center"
                                                //top: H * 0.2
                                            }}>
                                                <FlatList
                                                    data={myData[arrCounter]?.option}
                                                    renderItem={renderItem}
                                                    keyExtractor={(index) => `${index}`}
                                                    persistentScrollbar={true}
                                                    showsVerticalScrollIndicator={true}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                onPress={
                                                    () => sendArray()
                                                }
                                                style={{
                                                    backgroundColor: colors.GREEN,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    alignSelf: "center",
                                                    width: W * 0.85,
                                                    borderRadius: 8,
                                                    //marginBottom: H * 0.05
                                                }}>
                                                <Text style={{
                                                    fontSize: fontSizes.XXL,
                                                    color: "white",
                                                    fontFamily: fontFamily.bold,
                                                    paddingVertical: H * 0.02,
                                                }}>Next</Text>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <View style={{
                                            height: H * 0.6,
                                            W: W * 0.9,
                                            alignSelf: "center",
                                            alignItems: "center"
                                        }}>
                                            <FlatList
                                                data={myData[arrCounter]?.option}
                                                renderItem={renderItem}
                                                keyExtractor={(index) => `${index}`}
                                                persistentScrollbar={true}
                                                showsVerticalScrollIndicator={true}
                                            />
                                        </View>
                                }
                            </>



                    }
                    {(myData[arrCounter]?.question_type == "1") ?
                        <TouchableOpacity
                            onPress={() => handleNextPressForOptions()}
                            style={{
                                backgroundColor: colors.GREEN,
                                alignItems: "center",
                                justifyContent: "center",
                                alignSelf: "center",
                                width: W * 0.85,
                                borderRadius: 8,
                            }}>
                            <Text style={{
                                fontSize: fontSizes.XXL,
                                color: "white",
                                fontFamily: fontFamily.bold,
                                paddingVertical: H * 0.02,
                            }}>
                                Next
                            </Text>
                        </TouchableOpacity>
                        :
                        null}
                </View >
            }
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: H * 0.9,
        width: '100%',
        justifyContent: 'space-evenly',
        paddingVertical: '10%'

    },
    progressBarView:
    {
        width: W * 0.8,
        alignSelf: "center",
        marginVertical: H * 0.04,

    },
    questionsView:
    {
        alignItems: 'center',
        paddingHorizontal: W * 0.1,
        paddingVertical: W * 0.05,

    },
    answerView:
    {

    },
    nextButton:
    {
        backgroundColor: colors.GREEN,
        height: H * 0.06,
        justifyContent: 'center',
        borderRadius: 5,
        width: W * 0.75
    },
    textStyle:
    {
        fontFamily: fontFamily.bold,
        textAlign: 'center',
    },
    answerOptionsButtonStyle:
    {

    },
    inputStyle:
    {
        height: 20,
        width: W * 0.7
    },
    appBar:
    {
        backgroundColor: colors.GREEN,
        width: W
    }
})
export default PaidCustomQuestions
