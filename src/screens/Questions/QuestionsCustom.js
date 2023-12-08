import { StyleSheet, View, TouchableOpacity, FlatList, StatusBar, BackHandler, Modal, Image } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import {  Text, TextInput, Checkbox, } from 'react-native-paper'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage'
import DataContext from '../../context/DataContext'
import Progress from './Progress'
import { Appbar } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import { Animated } from 'react-native'
import Loader from '../../assets/components/Loader'
import { useIsFocused } from '@react-navigation/native'


import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'

const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});



const QuestionsCustom = ({ navigation, route }) => {
    const [langText, setLangText] = useState('')

    const isFocused = useIsFocused()
    useEffect(() => { getLanguge() }, [isFocused])

    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")
        setLangText(lang)
        strings.setLanguage(lang)

        if (lang == "hi") {
            getQuestions("2")
        } else {
            getQuestions("1")
        }

    }


    useEffect(() => {
        // getQuestions()
        retrieveAnswerFirst()
        //animate()
    }, [])




    //useEffect(() => { regStatusUpdate() }, [])
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
    const [weight3, setWeight3] = Nweight3
    const [ht, setHt] = Nht
    const [feet, setFeet] = Nfeet
    const [inch, setInch] = Ninch

    const [arrCounter, setArrCounter] = useState(0)
    const [loader, setLoader] = useState(true)
    const [customAnswer, setCustomAnswer] = useState("")
    const [oldAnswer, setOldAnswer] = useState(null)
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
    const [otherOptionText, setOtherOptionText] = useState("")

    const [weekmealForm, setWeekMealForm] = useState("")
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
    
    const translation = useRef(new Animated.Value(-W / 2)).current;

    const animate = () => {
        Animated.timing(translation, {
            toValue: W,
            duration: 8000,
            useNativeDriver: true,
        }).start();
    }

    const getQuestions = async (language) => {

        const result = await GetApiData(`custom_question?language=${language}`)
        setMyData(result.data)

        setLoader(false)
    }

    const handleNextPressForOptions = async () => {
        const id = myData[arrCounter]?.id;
        const handleSubmission = async (option, nextQuestionOffset = 1) => {
            setLoader(true);
            submitAnswer(option);
            setQuestionNumber(prev => prev + nextQuestionOffset);
            setArrCounter(prev => prev + nextQuestionOffset);
            setLoader(false);
        };
    
        switch (id) {
            case "1":
                setLoader(true);
                submitFirstAnswerAndGetMoreQuestions(selectedOption);
                setQuestionNumber(prev => prev + 1);
                setArrCounter(prev => prev + 1);
                setCustomAnswer("");
                break;
    
            case "64":
            case "63":
            case "72":
            case "74":
            case "78":
            case "83":
            case "88":
            case "93":
            case "92":
            case "84":
            case "129":
            case "67":
            case "123":
            case "125":
            case "127":
            case "131":
            case "133":
            case "130":
                setLoader(true);
                if (id === "88") animate();
                if (id === "67" && selectedOption === "Man") {
                    handleSubmission(selectedOption, 2);
                } else if (id === "93") {
                    setAns(selectedOption);
                    handleSubmission(selectedOption, selectedOption === "No" || selectedOption === "नहीं" ? 1 : 2);
                } else if (id === "92" || id === "84" || id === "129" || id === "130") {
                    const nextOffset = (selectedOption === "Yes" || selectedOption === "हाँ") ? 1 : 2;
                    handleSubmission(selectedOption, nextOffset);
                } else if (id === "127" || id === "131" || id === "133") {
                    handleSubmission(selectedOption, selectedOption === "No" || selectedOption === "नहीं" ? 2 : 1);
                } else {
                    handleSubmission(selectedOption);
                }
                break;
    
            case "123": // Assuming this block doesn't have async operations, hence no 'await'
            case "125":
            case "127":
                setLoader(true);
                setAns4(selectedOption); // Assuming these setAns functions don't have async operations
                submitAnswer(selectedOption);
                setQuestionNumber(prev => prev + 1);
                setArrCounter(prev => prev + 1);
                setLoader(false);
                break;
    
            default:
                setLoader(true);
                submitAnswer(selectedOption);
                setQuestionNumber(prev => prev + 1);
                setArrCounter(prev => prev + 1);
                setCustomAnswer("");
                setLoader(false);
                setFlag2(0);
                break;
        }
    
        setSelectedOption(null);
        setCustomAnswer("");
        retrieveAnswerCurrent(myData[arrCounter + 1]?.id);
    };
    

    const submitFirstAnswerAndGetMoreQuestions = async (item) => {
        setLoader(true)
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        const usertype = await getDataFromLocalStorage('user_type')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("question", myData[arrCounter]?.id);
        formdata.append("answer", item)
        formdata.append("user_type", usertype)


        if (langText == "hi") {
            formdata.append("language", "2")

        } else {
            formdata.append("language", "1")

        }
        const result = await PostApiData('first_answer_submit', formdata)
        setMyData((prev) => [...prev, ...result.data])

        setLoader(false)
    }

    const submitAnswer = async (item) => {
        const formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id');
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("question", myData[arrCounter]?.id);
    
        if (myData[arrCounter]?.id === '71') {
            formdata.append("answer", trgt);
        } else {
            formdata.append("answer", item);
            const result = await PostApiData('Question-Answer', formdata);
            storeDataInLocalStorage("insulin", result?.insulin);
            storeDataInLocalStorage("diabetes", result?.diabetes);
            storeDataInLocalStorage("pregnant", result?.pregnant);
        }
    
        const result = await PostApiData('Question-Answer', formdata);
    };

    const retrieveAnswerFirst = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("question_id", "29")
        const result = await PostApiData('user_question_answer_selected', formdata)
        if (result.status == 200) {
            setOldAnswer(result)
            setSelectedOption(result?.answer[0])
        }
    }
    const retrieveAnswerCurrent = async (id) => {
        setLoader(true)
        if (questionNumber == 1) {
            const temp = await getDataFromLocalStorage('user_id')
            var formdata = new FormData();
            formdata.append("user_id", JSON.parse(temp));
            formdata.append("question_id", id)
            const result = await PostApiData('user_question_answer_selected', formdata)
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
        }
        setLoader(false)
    }

    const handleOptionPress = (item) => {
        if (item.toLowerCase().includes("other") || (item.toLowerCase().includes("अन्य"))) {
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
            else if (myData[arrCounter]?.id == "95") {

                setQuestionNumber(prev => prev - 2)
                setArrCounter(prev => prev - 2)
                setLoader(false)
            }

            else if (myData[arrCounter]?.id == "93") {
                if (ans2 == "No" || selectedOption == "नहीं") {
                    setQuestionNumber(prev => prev - 2)
                    setArrCounter(prev => prev - 2)
                    setLoader(false)
                }
                if (ans2 == "Yes" || selectedOption == "हाँ") {
                    setQuestionNumber(prev => prev - 1)
                    setArrCounter(prev => prev - 1)
                    setLoader(false)
                }

            }
            else if (myData[arrCounter]?.id == "68") {
                if (ans3 == "Man") {
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
            else if (myData[arrCounter]?.id == "124") {
                if (ans4 == "No" || selectedOption == "नहीं") {
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
                if (ans5 == "No" || selectedOption == "नहीं") {
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
                if (ans6 == "No" || selectedOption == "नहीं") {
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
                if (ans7 == "No" || selectedOption == "नहीं") {
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
                if (ans10 == "No" || selectedOption == "नहीं") {
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
                if (ans8 == "No" || selectedOption == "नहीं") {
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
            else if (myData[arrCounter]?.id == "96") {
                if (ans == "No" || selectedOption == "नहीं") {
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
            else if (myData[arrCounter]?.id == "85") {


                if (ans9 == "No" || selectedOption == "नहीं") {
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


                if (ans9 == "No" || selectedOption == "नहीं") {
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
            setLoader(false)
            setArr([])
        }
        else {
            if (myData[arrCounter]?.id == "94") {
                if (ans == "No" || selectedOption == "नहीं") {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", arr);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 2)
                    setArrCounter(prev => prev + 2)
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
                    setLoader(false)
                    setArr([])
                }


            }



            else if (myData[arrCounter]?.id == "105") {
                if (ans == "Yes" || selectedOption == "हाँ") {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", arr);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 2)
                    setArrCounter(prev => prev + 2)
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

        if (result?.status == 200) {
            setOldAnswer(result)
            setOtherOptionText(result?.other)

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
            else if (myData[arrCounter - 1]?.id == "70") {
                setCustomAnswer(result?.answer[0])
                var realFeet = ((result?.answer[0] * 0.393700) / 12);
                var f = Math.floor(realFeet);
                var i = Math.round((realFeet - f) * 12);
                setFeet(JSON.stringify(f))
                setInch(JSON.stringify(i))
                setHt(() => { return ((Number.parseInt(f, 10) * 30.48) + (Number.parseInt(i, 10) * 2.54)) })
            }
            else if (myData[arrCounter - 1]?.id == "71") {
                setCustomAnswer(result?.answer[0])
                setTrgt(result?.answer[0])
            }
            else if (myData[arrCounter - 1]?.id == "84") {
                setCustomAnswer(result?.answer[0])
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
            setLoader(false)
        }
    }


    const handleCustomAnswer = async (t) => {
        const DetermineBmi = () => {
            setFlag2(0)

            var BMI = (crrnt / ((ht * ht) / 10000))
            if (((trgt > (ht * ht * 36) / 10000)) || ((trgt < (ht * ht * 18.5) / 10000))) {
                setTextToDisplayInModalTwo(`${strings.LNFisnotcurrentlydesignedtoreachtheenteredgoalweight} ${((Math.round(((ht * ht * 18.5) / 10000) * 100) / 100) + 1).toFixed(0)} and ${((Math.round(((ht * ht * 36) / 10000) * 100) / 100) - 1).toFixed(0)}. \n${strings.PleaseedityourTargetweighttoContinue}`)
                setshouldGoBackToTargetWeight(true)

            }

            else if (trgt == crrnt) {

                setTextToDisplayInModalTwo("Looks like you're interested in Maintaining weight using LNF. We have ideal plan for you.")
                setshouldGoBackToTargetWeight(false)
                setFlag2(prev => prev + 1)

            }
            else if (Number.parseInt(trgt, 10) < Number.parseInt(crrnt, 10)) {

                setTextToDisplayInModalTwo(strings.LookslikeyouinterestedinlosingweightusingLNF)
                setshouldGoBackToTargetWeight(false)
                setFlag2(prev => prev + 1)
            }
            else if (Number.parseInt(trgt, 10) > Number.parseInt(crrnt, 10)) {

                setTextToDisplayInModalTwo(strings.LookslikeyoureinterestedingainingweightusingLNF)
                setshouldGoBackToTargetWeight(false)
                setFlag2(prev => prev + 1)

            }
        }

        if (otherOptionText == "") {
            if (myData[arrCounter]?.id == "70") {

                if (feet && inch) {
                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)
                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)


                    setLoader(false)
                }
                else ShortToast("Required Field is missing", 'error', '')

            }



            if (myData[arrCounter]?.id == "112") {

                if (t.length !== 0) {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
                else ShortToast("Invalid Input", 'error', '')
            }
            if (myData[arrCounter]?.id == "117") {

                if (t.length !== 0) {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
                else ShortToast("Invalid Input", 'error', '')
            }


            if (myData[arrCounter]?.id == "120") {

                if (t.length !== 0) {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
                else ShortToast("Invalid Input", 'error', '')
            }

            if (myData[arrCounter]?.id == "121") {

                if (t.length !== 0) {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)


                    setLoader(false)
                }
                else ShortToast("Invalid Input", 'error', '')
            }

            if (myData[arrCounter]?.id == "122") {

                if (t.length !== 0) {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)


                    setLoader(false)
                }
                else ShortToast("Invalid Input", 'error', '')
            }

            if (myData[arrCounter]?.id == "65") {

                if (t.length !== 0 && Number.parseInt(t, 10) < 120) {

                    setLoader(true)
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)

                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)


                    setLoader(false)
                }
                else ShortToast("Invalid Input", 'error', '')

            }
            if (myData[arrCounter]?.id == "71") {

                DetermineBmi()

                if (((trgt > (ht * ht * 36) / 10000)) || ((trgt < (ht * ht * 18.5) / 10000))) {

                    setShowSecondModal(true)
                }
                else if (flag2 == 0) {

                    setShowSecondModal(true)
                }
                else {
                    if (trgt) {
                        var formdata = new FormData();
                        const temp = await getDataFromLocalStorage('user_id')
                        formdata.append("question", myData[arrCounter]?.id);
                        formdata.append("answer", customAnswer);
                        formdata.append("user_id", JSON.parse(temp))
                        const result = await PostApiData('Question-Answer', formdata)

                        setCustomAnswer("")
                        setQuestionNumber(prev => prev + 1)
                        setArrCounter(prev => prev + 1)
                        setShowSecondModal(true)
                        setLoader(false)
                    }
                    else ShortToast("Required Field is missing", 'error', '')
                }
            }

            if (myData[arrCounter]?.id == "69") {
                if (crrnt) {
                    var formdata = new FormData();
                    const temp = await getDataFromLocalStorage('user_id')
                    formdata.append("question", myData[arrCounter]?.id);
                    formdata.append("answer", customAnswer);
                    formdata.append("user_id", JSON.parse(temp))
                    const result = await PostApiData('Question-Answer', formdata)
                    setCustomAnswer("")
                    setQuestionNumber(prev => prev + 1)
                    setArrCounter(prev => prev + 1)
                    setLoader(false)
                }
                else ShortToast("Required Field is missing", 'error', '')

            }


            if (customAnswer == "") {
                ShortToast('Please enter your Answer', 'warning', '')
                setSelectedOption("")
            }
        }
        else {
            setLoader(true)
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('user_id')
            formdata.append("question", myData[arrCounter]?.id);
            formdata.append("answer", selectedOption);
            formdata.append("user_id", JSON.parse(temp))
            formdata.append("other", otherOptionText)
            const result = await PostApiData('Question-Answer', formdata)
            myData[arrCounter]?.id == "29" ? submitFirstAnswerAndGetMoreQuestions(selectedOption) : null
            setOtherOptionText("")
            setQuestionNumber(prev => prev + 1)
            setArrCounter(prev => prev + 1)


            setLoader(false)
        }




        retrieveAnswerCurrent(myData[arrCounter + 1]?.id)


    }


    const handleCustomAnswerWeight = async (t) => {
        if (myData[arrCounter]?.id == "115") {

            // DetermineBmi()
            if (weight) {
                var formdata = new FormData();
                const temp = await getDataFromLocalStorage('user_id')
                formdata.append("question", myData[arrCounter]?.id);
                formdata.append("answer", customAnswer);
                formdata.append("user_id", JSON.parse(temp))
                const result = await PostApiData('Question-Answer', formdata)
                setCustomAnswer("")
                setQuestionNumber(prev => prev + 1)
                setArrCounter(prev => prev + 1)
                setLoader(false)
            }
            else ShortToast("Required Field is missing", 'error', '')

        }

        else if (myData[arrCounter]?.id == "116") {

            // DetermineBmi()
            if (weight2) {
                var formdata = new FormData();
                const temp = await getDataFromLocalStorage('user_id')
                formdata.append("question", myData[arrCounter]?.id);
                formdata.append("answer", customAnswer);
                formdata.append("user_id", JSON.parse(temp))
                const result = await PostApiData('Question-Answer', formdata)
                setCustomAnswer("")
                setQuestionNumber(prev => prev + 1)
                setArrCounter(prev => prev + 1)
                setLoader(false)
            }
            else ShortToast("Required Field is missing", 'error', '')

        }

        else if (myData[arrCounter]?.id == "130") {

            // DetermineBmi()
            if (weight3) {
                var formdata = new FormData();
                const temp = await getDataFromLocalStorage('user_id')
                formdata.append("question", myData[arrCounter]?.id);
                formdata.append("answer", customAnswer);
                formdata.append("user_id", JSON.parse(temp))
                const result = await PostApiData('Question-Answer', formdata)
                setCustomAnswer("")
                setQuestionNumber(prev => prev + 1)
                setArrCounter(prev => prev + 1)
                setLoader(false)
            }
            else ShortToast("Required Field is missing", 'error', '')

        }



        else if (customAnswer == "") {
            ShortToast('Please enter your Answer', 'warning', '')
            setSelectedOption("")
        }
        else if (myData[arrCounter]?.id == "29") {
            setLoader(true)
            var formdata = new FormData();
            const temp = await getDataFromLocalStorage('user_id')
            const usertype = await getDataFromLocalStorage('user_type')

            formdata.append("user_id", JSON.parse(temp));
            formdata.append("question", myData[arrCounter]?.id);
            formdata.append("answer", customAnswer)
            formdata.append("user_type", usertype); // chnged from usertype
            // formdata.append("language", "2")

            if (langText == "hi") {
                formdata.append("language", "2")

            } else {
                formdata.append("language", "1")

            }
            // temp2 == "corporate" ? formdata.append("user_type", "2") : "1"


            const result = await PostApiData('first_answer_submit', formdata)

            setMyData((prev) => [...prev, ...result.data])
            setQuestionNumber(prev => prev + 1)
            setArrCounter(prev => prev + 1)

            setLoader(false)
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





    const handleSecondModal = () => {
        if (shouldGoBackToTargetWeight) {
            setShowSecondModal(false)
            setArrCounter(prev => prev - 1)
            setQuestionNumber(prev => prev - 1)
        }
        else {
            setShowSecondModal(false)
        }
    }

    return (

        <View >
            <StatusBar backgroundColor={(showFirstModal || showThirdModal || showFourthModal || showFifthModal || showSixthModal || showSeventhModal || showEighthModal || showNinthModal) ? "white" : colors.GREEN} />
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => backHandle()
                } />
                <Appbar.Content style={styles.appBar2} title={<Text style={styles.appBarText}>{strings.Profiling}</Text>} />
            </Appbar.Header>

            {loader ?
                <Loader />
                :
                <View style={styles.container}>
                    <Modal visible={showCustomAnswerModal}
                        transparent={true}>
                        <View
                            style={styles.secondaryContainer}
                        >
                            <View style={styles.viewModal}
                            >
                                <Text style={{
                                    fontFamily: fontFamily.bold,
                                    fontSize: fontSizes.XL,
                                    paddingBottom: H * 0.04,
                                }}>
                                    {strings.pleasespecif}
                                </Text>
                                <TextInput
                                    activeUnderlineColor={colors.GREEN}
                                    value={otherOptionText}
                                    onChangeText={(t) => { setOtherOptionText(t) }}
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
                                            {strings.Ok}
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
                                            {strings.Cancel}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>



                    <Modal visible={showFirstModal}>


                        <View style={styles.logoView}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={styles.fullHeight}
                        >



                            {langText == "hi" ? <Image source={require('../../assets/icons/image7hi.png')}
                                style={styles.absoluteImageStyle} />

                                :

                                <Image source={require('../../assets/icons/image7.png')}
                                    style={styles.absoluteImageStyle} />}

                            <TouchableOpacity
                                onPress={() => {
                                    setShowFirstModal(false)
                                }}
                                style={styles.nextButton}>
                                <Text style={styles.nextText}>{strings.Next}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    < Modal visible={showThirdModal}
                    >
                        <View style={styles.logoView}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={styles.fullHeight}
                        >

                            {langText == "hi" ? <Image source={require('../../assets/icons/image1hi.png')}
                                style={styles.absoluteImageStyle} />

                                :

                                <Image source={require('../../assets/icons/image1.png')}
                                    style={styles.absoluteImageStyle} />}

                            <TouchableOpacity
                                onPress={() => {
                                    setShowThirdModal(false)
                                }}
                                style={styles.nextButton}>
                                <Text style={styles.nextText}>{strings.Next}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal >
                    <Modal visible={showFourthModal}
                    >
                        <View style={styles.logoView}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={styles.fullHeight}
                        >
                            {langText == "hi" ? <Image source={require('../../assets/icons/image3hi.png')}
                                style={styles.absoluteImageStyle} />

                                :

                                <Image source={require('../../assets/icons/fourthscreen.jpg')}
                                    style={styles.absoluteImageStyle} />}

                            <TouchableOpacity
                                onPress={() => {
                                    setShowFourthModal(false)
                                }}
                                style={styles.nextButton}>
                                <Text style={styles.nextText}>{strings.Next}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={showFifthModal}>

                        <View

                            style={styles.fullHeight}
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
                                    {langText == "hi" ? <Image source={require('../../assets/icons/image4hi.png')}
                                        style={{
                                            height: H,
                                            width: W,
                                            position: "absolute"
                                        }} />

                                        :

                                        <Image source={require('../../assets/icons/fivescreen.png')}
                                            style={styles.absoluteImageStyle} />}

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
                                style={styles.nextButton}>
                                <Text style={styles.nextText}>{strings.Next}</Text>
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

                            style={styles.fullHeight}
                        >
                            {langText == "hi" ? <Image source={require('../../assets/icons/image5hi.png')}
                                style={styles.absoluteImageStyle} />

                                :

                                <Image source={require('../../assets/icons/image5.png')}
                                    style={styles.absoluteImageStyle} />}

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
                                top: H * 0.9
                            }}>
                            <Text style={{
                                color: "white",
                                fontFamily: fontFamily.bold,
                                fontSize: fontSizes.XL
                            }}>{strings.Next}</Text>
                        </TouchableOpacity>
                    </Modal>
                    <Modal visible={showNinthModal}>


                        <View style={styles.logoView}>
                            {/* <Logo /> */}
                        </View>
                        <View

                            style={styles.fullHeight}
                        >
                            <Image source={require('../../assets/icons/image6.png')}
                                style={styles.absoluteImageStyle} />


                            {langText == "hi" ? <Image source={require('../../assets/icons/image6hi.png')}
                                style={styles.absoluteImageStyle} />

                                :

                                <Image source={require('../../assets/icons/image6.png')}
                                    style={styles.absoluteImageStyle} />}

                            <TouchableOpacity
                                onPress={() => {
                                    setShowNinthModal(false)
                                }}
                                style={styles.nextButton}>
                                <Text style={styles.nextText}>{strings.Next}</Text>
                            </TouchableOpacity>

                        </View>
                    </Modal>


                    <View style={styles.progressBarView}>
                        <Progress progress={(arrCounter == 0) || (arrCounter == 1) ? ((arrCounter + 1) / 30) : ((arrCounter + 1) / myData.length)} />
                    </View>
                    <View style={styles.questionsView}>

                        <Text style={styles.questionText}>{myData[arrCounter]?.question}</Text>
                        <Text style={styles.questionText}>{myData[arrCounter]?.question_type == "2" ? "(Select all that apply)" : null}</Text>
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
                                                keyboardType="number-pad"
                                                maxLength={5}
                                                value={crrnt}
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
                                            onPress={() => handleCustomAnswer(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                value={feet}
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
                                                style={styles.answerTextInput}
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
                                                value={inch}
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
                                                style={styles.answerTextInput}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}>In</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                keyboardType="number-pad"
                                                maxLength={5}
                                                value={trgt}
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
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                keyboardType="number-pad"
                                                maxLength={5}
                                                value={ageForm}
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
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                keyboardType="number-pad"
                                                maxLength={5}
                                                value={weekmealForm}
                                                onChangeText={(t) => {



                                                    setWeekMealForm(t)
                                                    setCustomAnswer(t)

                                                    // if (t.length == 0 ) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }

                                                    // else {
                                                    //     setWeekMealForm(t)
                                                    //     setCustomAnswer(t)
                                                    // }


                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text

                                                style={{
                                                    fontFamily: fontFamily.bold,

                                                }}></Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                keyboardType="number-pad"
                                                maxLength={5}
                                                value={weight}
                                                onChangeText={(t) => {
                                                    setWeight(t)
                                                    setCustomAnswer(t)


                                                    // if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }
                                                    // else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }
                                                    // else {
                                                    //     setWeight(t)
                                                    //     setCustomAnswer(t)
                                                    // }
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
                                                () => handleCustomAnswerWeight(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                keyboardType="number-pad"
                                                //  maxLength={5}
                                                value={weight2}
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
                                                () => handleCustomAnswerWeight(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                // keyboardType="number-pad"
                                                //  maxLength={5}
                                                value={mealForm2}
                                                onChangeText={(t) => {


                                                    setMealForm2(t)
                                                    setCustomAnswer(t)

                                                    // if (t.length == 0 || t.includes(" ") ) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }

                                                    // else {
                                                    //     setMealForm2(t)
                                                    //     setCustomAnswer(t)
                                                    // }
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}></Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                value={mealForm3}
                                                onChangeText={(t) => {


                                                    setMealForm3(t)
                                                    setCustomAnswer(t)

                                                    // if (t.length == 0 || t.includes(" ") ) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }

                                                    // else {
                                                    //     setMealForm3(t)
                                                    //     setCustomAnswer(t)
                                                    // }



                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}></Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                value={mealForm4}
                                                onChangeText={(t) => {

                                                    setMealForm4(t)
                                                    setCustomAnswer(t)
                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}></Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                //  keyboardType="number-pad"
                                                // maxLength={5}
                                                value={mealForm5}
                                                onChangeText={(t) => {

                                                    setMealForm5(t)
                                                    setCustomAnswer(t)
                                                    // if (t.length == 0 || t.includes(" ") ) {
                                                    //     ShortToast("Invalid Input", "warning", "")
                                                    // }

                                                    // else {
                                                    //     setMealForm5(t)
                                                    //     setCustomAnswer(t)
                                                    // }




                                                }}
                                                style={{
                                                    backgroundColor: "white",
                                                    width: W * 0.8,
                                                    alignSelf: "center",
                                                    marginRight: W * 0.04,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: fontFamily.bold,

                                            }}></Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={
                                                () => handleCustomAnswer(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                keyboardType="number-pad"
                                                //  maxLength={5}
                                                value={weight3}
                                                onChangeText={(t) => {

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
                                                () => handleCustomAnswerWeight(customAnswer)
                                            }
                                            style={styles.nextButton2}>
                                            <Text style={styles.nextText}>{strings.Next}</Text>
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
                                                height: H * 0.55,
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
                                                    marginBottom: H * 0.02
                                                }}>
                                                <Text style={{
                                                    fontSize: fontSizes.XXL,
                                                    color: "white",
                                                    fontFamily: fontFamily.bold,
                                                    paddingVertical: H * 0.02,
                                                }}>{strings.Next}</Text>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <View style={{
                                            height: H * 0.55,
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
                                marginTop: H * 0.02
                            }}>
                            <Text style={{
                                fontSize: fontSizes.XXL,
                                color: "white",
                                fontFamily: fontFamily.bold,
                                paddingVertical: H * 0.02,
                            }}>
                                {strings.Next}
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
    container:
    {
        //justifyContent: "center",
        height: H,
        width: W,
        paddingBottom: H * 0.1,
    }
    ,
    progressBarView:
    {
        width: W * 0.8,
        alignSelf: "center",
        marginVertical: H * 0.04,

    },
    questionsView:
    {
        alignItems: 'center',
        paddingHorizontal: W * 0.07,
        paddingVertical: W * 0.05,
    },
    answerView:
    {

    },
    nextButton:
    {
        backgroundColor: colors.GREEN,
        width: W * 0.9,
        height: H * 0.08,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        position: "absolute",
        top: H * 0.9
    },
    nextButton2:
    {
        backgroundColor: colors.GREEN,
        width: W * 0.9,
        height: H * 0.08,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        position: "absolute",
        top: H * 0.8
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
    },
    appBar2:
    {
        alignItems: "center",
        marginRight: W * 0.125
    },
    appBarText:
    {
        color: "white",
        fontSize: fontSizes.XL,
        fontFamily: "Montserrat-SemiBold"
    },
    secondaryContainer: {
        height: H,
        width: W,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    viewModal:
    {
        height: H * 0.3,
        backgroundColor: colors.OFFWHITE,
        // backgroundColor: "red",
        width: W * 0.85,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        elevation: 8,
    },
    logoView:
    {
        // position: "absolute",
        alignSelf: "center",
        top: H * 0.3,
        zIndex: 2,
    },
    fullHeight:
    {
        //backgroundColor: "red",
        height: H,
    },
    absoluteImageStyle:
    {
        height: H,
        width: W,
        position: "absolute"
    },
    nextText:
    {
        color: "white",
        fontFamily: fontFamily.bold,
        fontSize: fontSizes.XL
    },
    questionText:
    {
        fontFamily: "Montserrat-Bold",
        color: colors.FONT_BLACK,
        fontSize: fontSizes.XL,
        textAlign: "center"
    },
    answerTextInput:
    {
        backgroundColor: "white",
        width: W * 0.3,
        alignSelf: "center",
        marginRight: W * 0.04,
    }

})
export default QuestionsCustom

