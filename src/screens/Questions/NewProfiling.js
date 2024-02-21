import { View, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, Platform } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Appbar, Checkbox, TextInput, Text } from 'react-native-paper'
import { PostApiData, W, colors, fontSizes, H, fontFamily, ShortToast, cmToFeetAndInches, convertTimestampToYYYYMMDD, formatDate } from '../../colorSchemes/ColorSchemes'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import Loader from '../../assets/components/Loader'
import DateTimePicker from '@react-native-community/datetimepicker';
import InputModalBox from '../../assets/components/InputModalBox'
import { useLocales } from '../../utils/LocalizationUtil'


function getTimestamp10YearsAgo() {
    // Get the current date
    const currentDate = new Date();

    // Subtract 10 years from the current date
    const tenYearsAgo = new Date(currentDate);
    tenYearsAgo.setFullYear(currentDate.getFullYear() - 10);

    // Return the timestamp in milliseconds
    return tenYearsAgo.getTime();
}

const NewProfiling = ({ navigation }) => {

    const [myData, setMyData] = useState([])
    const [arrCounter, setArrCounter] = useState(1)
    const [answer, setAnswer] = useState(null)
    // const [arr, setArr] = useState([])
    const [loader, setLoader] = useState(true)
    const [feet, setFeet] = useState("")
    const [inch, setInch] = useState("")
    const [showCalendar, setShowCalendar] = useState(false)
    const [otherOptionText, setOtherOptionText] = useState("")
    const [selectedDate, setSelectedDate] = useState(new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate()));
    const [selectItem, setSelectItem] = useState([])

    const strings = useLocales()

    useEffect(() => {
        getQuestions()
    }, [arrCounter])


    const handleDateChange = useCallback((event, newDate) => {
        if (Platform.OS == "android") {
            setShowCalendar(false)
        }
        setAnswer(convertTimestampToYYYYMMDD(newDate))
        setSelectedDate(newDate)


    }, [])


    const getQuestions = async () => {
        try {
            setLoader(true);

            const temp = await getDataFromLocalStorage('user_id');
            const formdata = new FormData();
            formdata.append("user_id", JSON.parse(temp));
            formdata.append("step", arrCounter);

            const result = await PostApiData('Question/new_profiling', formdata);


            console.log("Result ", result)
            if (result?.status == "200") {
                setMyData(result);

                if (result?.redirect) {
                    navigation.navigate("WelcomeScreenBeforeBottomTabs")
                    // ShortToast("Your profiling has been submitted successfully, ", "success", "")
                }

                if (result?.data?.question_id === "70") {
                    if (result?.data?.answer[0]) {
                        const { feet, inches } = cmToFeetAndInches(result?.data?.answer[0]);
                        setFeet(feet.toString());
                        setInch(inches.toString());
                        setAnswer(result?.data?.answer[0])
                    } else {
                        setFeet("");
                        setInch("");
                    }

                } else {
                    console.log("2")
                    if (result?.data?.question_type == "2") {
                        setAnswer(result?.data?.answer)
                    } else {
                        console.log("3")
                        if (result?.data?.answer[0]) {
                            console.log("4")
                            setAnswer(result?.data?.answer[0]);
                        } else {
                            console.log("5")
                            setAnswer("")

                        }
                    }
                }

            }

        } catch (error) {
            // Handle errors as needed
            console.error("Error in getQuestions:", error);

        } finally {
            setLoader(false);
        }
    };

    const handleOptionPress = (item) => {
        setAnswer(item)
    }
    const handleOptionPress2 = (item) => {
        if (answer?.includes(item)) {
            setAnswer(answer?.filter(option => option !== item))
        }
        else {
            setAnswer(prev => [...prev, item])
        }
    }

    const nextButtonClicked = async () => {

        console.log("ANS==== ", answer)
        if (answer == "" || answer == null) {
            if (myData?.data?.question_type == "3" || myData?.data?.question_type == "4") {
                ShortToast("Invalid input", "warning", "")
            } else {
                ShortToast("Plesae select an option", "warning", "")
            }
        }
        else {
            if (myData?.data?.question_id == "70" && isNaN(answer)) {
                ShortToast("Invalid input", "warning", "")
            } else {
                setLoader(true)
                console.log("condition==== ", "ok")
                var formdata = new FormData();
                const temp = await getDataFromLocalStorage('user_id')
                formdata.append("user_id", JSON.parse(temp));
                formdata.append("question", myData?.data?.question_id);
                {
                    otherOptionText == ""
                        ?
                        formdata.append("answer", answer)
                        :
                        formdata.append("answer", otherOptionText)
                }

                const result = await PostApiData('Question-Answer', formdata)

                if (result?.status == "200") {
                    setArrCounter(prev => prev + 1)
                    setAnswer(null)
                } else {

                }
            }
        }
    }

    const backHandle = () => {
        if (arrCounter == 1) {
            navigation.navigate("WelcomeScreenAfterRegistration")
        }
        setLoader(true)

        setArrCounter(prev => prev - 1)
    }

    const handleDOB = () => {
        setShowCalendar(prev => !prev)
    }

    const returnViewFromQuestionType = (type) => {
        if (type === "1" || type === "2") {
            return (
                <View style={styles.flatlist}>
                    <FlatList
                        data={myData?.data?.option}
                        renderItem={type === "1" ? renderItem : renderItemType2}
                        keyExtractor={(item, index) => `${index}`} // Use a unique key
                        persistentScrollbar={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            );
        } else if (type === "3") {
            return (
                <View style={styles.inputContainer}>
                    {/* <TextInput
                        activeOutlineColor='white'
                        activeUnderlineColor={colors.GREEN}
                        underlineColor={"white"}
                        keyboardType="number-pad"
                        maxLength={5}
                        value={answer}
                        onChangeText={(t) => {
                            if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                ShortToast("Invalid Input", "warning", "")
                            }
                            else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                ShortToast("Invalid Input", "warning", "")
                            }
                            else {

                                setAnswer(t)
                            }
                        }}
                        style={styles.textinput}
                    /> */}
                    <InputModalBox
                        width={100}
                        value={answer}
                        keyboardType={'numeric'}
                        maxLength={3}
                        onChangeText={(t) => {
                            if (t.length == 1 && (t == "-" || t == " " || t == "." || t == ",")) {
                                ShortToast("Invalid Input", "warning", "")
                            }
                            else if (t.includes("-") || t.includes(",") || t.includes(".") || t.includes(" ") || t > 650) {
                                ShortToast("Invalid Input", "warning", "")
                            }
                            else {

                                setAnswer(t)
                            }
                        }}
                    />
                </View>
            )

        } else if (type === "4") {
            switch (myData?.data?.question_id) {
                case "70":
                    return (
                        <View style={{}}>
                            <View style={
                                styles.targetweightlayout
                            }>
                                {/* <TextInput
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
                                            setAnswer(() => { return ((Number.parseInt(t, 10) * 30.48) + (Number.parseInt(inch, 10) * 2.54)).toString() })
                                        }
                                    }}
                                    style={styles.feet}
                                /> */}
                                <InputModalBox
                                    width={60}
                                    value={feet}
                                    keyboardType={'numeric'}
                                    maxLength={1}
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
                                            setAnswer(() => { return ((Number.parseInt(t, 10) * 30.48) + (Number.parseInt(inch, 10) * 2.54)).toString() })
                                        }
                                    }}
                                />
                                <Text style={{
                                    ...fontFamily.bold,
                                    marginRight: W * 0.03,
                                }}>{strings.Feet}</Text>
                                {/* <TextInput
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
                                            setAnswer(() => { return ((Number.parseInt(feet, 10) * 30.48) + (Number.parseInt(t, 10) * 2.54)).toString() })

                                        }
                                    }}
                                    style={styles.feet}
                                /> */}
                                <InputModalBox
                                    width={60}
                                    value={inch}
                                    maxLength={2}
                                    keyboardType={"numeric"}
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
                                            setAnswer(() => { return ((Number.parseInt(feet, 10) * 30.48) + (Number.parseInt(t, 10) * 2.54)).toString() })

                                        }
                                    }}
                                />
                                <Text style={{
                                    ...fontFamily.bold,

                                }}>{strings.Inch}</Text>
                            </View>
                        </View>
                    );
                case "65":
                    return (
                        <>

                            < View
                                onPress={handleDOB}
                                style={styles.datePickerContainer} >

                                {/* <Text style={styles.textdatestyle}>{answer == "" ? "Enter DOB" : formatDate(answer)}</Text> */}
                                <Text style={styles.textdatestyle}>Enter DOB:</Text>
                                {
                                    Platform.OS == "android"
                                    &&
                                    <TouchableOpacity
                                        style={[styles.timetext,]}
                                        onPress={() => setShowCalendar(prev => !prev)}>
                                        <Text style={[]}>{formatDate(selectedDate)}</Text>
                                    </TouchableOpacity>
                                }
                                {


                                    Platform.OS == 'android'
                                        ?
                                        showCalendar
                                        &&
                                        <DateTimePicker
                                            maximumDate={new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate())}
                                            style={styles.datePicker}
                                            value={selectedDate}
                                            mode="date"
                                            onChange={(a, t) => handleDateChange(a, t)}
                                        />
                                        :
                                        <DateTimePicker
                                            maximumDate={new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate())}
                                            style={styles.datePicker}
                                            value={selectedDate}
                                            mode="date"
                                            onChange={(a, t) => handleDateChange(a, t)}
                                        />

                                }

                            </View >
                        </>

                    )
            }
        }
    };


    const renderItem = ({ item }) => {
        return (

            <TouchableOpacity
                style={[styles.optionlayout, {
                    backgroundColor: answer == item?.default ? colors.GREEN : "white"
                }]}
                onPress={() => {
                    handleOptionPress(item?.default)
                }}>

                <Text style={[styles.optionText,
                { color: answer == item?.default ? "white" : "black" }]}>{item?.text}</Text>
            </TouchableOpacity>
        )
    }
    const renderItemType2 = ({ item }) => {

        return (

            <TouchableOpacity
                style={[styles.optionlayout, { backgroundColor: answer?.includes(item?.default) ? colors.GREEN : "white" }]}
                onPress={() => {
                    handleOptionPress2(item?.default)
                }}>
                <View style={{

                    marginLeft: W * 0.1,
                }}>
                    <Checkbox.Android
                        status={answer?.includes(item?.default) ? 'checked' : 'unchecked'}
                        color={"white"} />
                </View>
                <Text style={[styles.optionText2,
                { color: answer?.includes(item?.default) ? "white" : "black" }]}>{item?.text}</Text>
            </TouchableOpacity>
        )
    }

    return (

        <View>

            {
                loader
                    ?
                    <Loader />
                    :
                    <>
                        <Appbar.Header style={styles.appBar}>
                            <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }}
                                onPress={() => backHandle()
                                } />
                            <Appbar.Content style={styles.headerBar} title={
                                <Text style={styles.headerText}>{strings.Profiling}</Text>} />
                        </Appbar.Header>

                        <Text style={styles.title}>{myData?.data?.title}</Text>
                        <Text style={styles.question}>{myData?.data?.question}</Text>


                        <Modal visible={answer == "Other health goals"}
                            transparent={true}>
                            <View
                                style={styles.overlay}
                            >
                                <View style={styles.popUp}
                                >
                                    <Text style={styles.pleaseSpecifyText}>
                                        Please Specify
                                    </Text>
                                    <TextInput
                                        activeUnderlineColor={colors.GREEN}
                                        value={otherOptionText}
                                        onChangeText={(t) => { setOtherOptionText(t) }}
                                        maxLength={100}
                                        style={styles.textinputlayout} />
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: W * 0.6,
                                        alignSelf: "center"
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                nextButtonClicked()
                                            }}>
                                            <Text style={styles.okay}>
                                                Okay
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setAnswer("")

                                        }}
                                        >
                                            <Text style={[styles.okay, { color: 'red' }]}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        {returnViewFromQuestionType(myData?.data?.question_type)}

                        <TouchableOpacity
                            onPress={() => {
                                nextButtonClicked()
                            }}
                            style={styles.nextbutton}>
                            <Text style={styles.nextText}>{strings.Next}</Text>
                        </TouchableOpacity>
                    </>
            }
        </View>
    )
}

const styles = StyleSheet.create(({
    appBar:
    {
        backgroundColor: colors.GREEN,
        width: W
    },

    title:
    {
        color: "black",
        fontSize: fontSizes.XXL,
        alignSelf: 'center',
        marginTop: 40,
        ...fontFamily.bold
    },

    question: {
        color: "black",
        fontSize: fontSizes.XL,
        alignSelf: 'center',
        marginTop: 40,
        ...fontFamily.bold
    },
    flatlist: {
        height: H * 0.55,
        W: W * 0.9,
        alignSelf: "center",
        alignItems: "center",
        top: H * 0.02,
    },

    nextbutton: {
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
    nextText: {
        color: "white",
        ...fontFamily.bold,
        fontSize: fontSizes.XL
    },
    optionText: {
        width: W * 0.65,
        fontFamily: "Montserrat-Medium",
        textAlign: "center",
        fontSize: fontSizes.XL
    },

    optionlayout: {
        borderRadius: 8,
        margin: 10,
        width: W * 0.85,
        borderColor: "lightgray",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        flexDirection: "row",
        paddingVertical: H * 0.025,
        paddingHorizontal: W * 0.0
    },

    optionText2: {
        width: W * 0.65,
        fontFamily: "Montserrat-Medium",
        fontSize: fontSizes.XL, marginLeft: 10
    },


    textinput: {
        backgroundColor: 'white',
        fontSize: fontSizes.XL,
        fontFamily: "Montserrat-Medium",
        width: W * 0.5,
        alignSelf: 'center',
        marginVertical: W * 0.1,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                height: H * 0.07
            }
        })

    },



    textinputlayout: {
        flexDirection: "row",
        alignItems: "center",
        width: W * 0.7,
        borderWidth: 1,
        borderColor: "grey",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 20,
        borderRadius: 8,
        ...Platform.select({
            ios: {
                height: H * 0.07
            }
        })
    },

    textStyle: {
        width: W * 0.7,
        height: H * 0.065,
        borderWidth: 1,
        borderColor: "grey",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 20,
        borderRadius: 8
    },

    textinputlayou2: {
        flexDirection: "row",
        alignItems: "center",
        width: W * 0.7,
        borderWidth: 1,
        borderColor: "grey",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 20,
        borderRadius: 8,
        ...Platform.select({
            ios: {
                height: H * 0.07
            }
        })

    },


    targetweightlayout: {

        flexDirection: "row",
        alignItems: "center",
        width: W,
        justifyContent: "center",
        marginTop: H * 0.05
    },


    feet: {
        backgroundColor: "white",
        width: W * 0.15,
        alignSelf: "center",
        marginRight: W * 0.04,
        fontSize: fontSizes.XL,
        ...Platform.select({
            ios: {
                height: H * 0.07
            }
        })
    },
    headerText:
    {
        color: "white",
        fontSize: fontSizes.XXL,
        ...fontFamily.bold,
        alignSelf: 'center',
        ...Platform.select({
            ios: {
                left: '10%'
            }
        })

    },
    headerBar:
    {
        alignItems: "center",
        marginRight: W * 0.125
    },
    textdatestyle: {
        fontSize: fontSizes.XL,
        textAlign: 'center',
        color: "black",
        ...fontFamily.bold

    },
    inputContainer: {
        marginTop: '10%'
    },
    okay:
    {
        ...fontFamily.bold,
        color: colors.GREEN,
        fontSize: fontSizes.XL,
        paddingTop: H * 0.028,
    },
    overlay:
    {
        height: H,
        width: W,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    popUp:
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
    pleaseSpecifyText:
    {
        ...fontFamily.bold,
        fontSize: fontSizes.XL,
        paddingBottom: H * 0.04,
    },
    datePickerContainer:
    {
        flexDirection: 'row',
        //backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: H * 0.11
    },
    timetext: {
        borderColor: colors.LIGHT_SILVER,
        backgroundColor: colors.LIGHT_SILVER,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: W * 0.03,
        textAlign: 'center',
        alignItems: 'center',
        padding: 10,
        alignSelf: 'flex-start'
    },
}))

export default NewProfiling
