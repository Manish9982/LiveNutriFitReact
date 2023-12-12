import { View, StyleSheet, TouchableOpacity, ToastAndroid, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { H, W, colors, GetApiData, fontSizes, PostApiData, ShortToast, fontFamily } from '../../../../colorSchemes/ColorSchemes'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Appbar, Text } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LinearGradient from 'react-native-linear-gradient'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { Circle } from 'react-native-svg'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'


const HealthIndexQuestions = ({ navigation }) => {
    useEffect(() => { getDataFromApi() }, [])
    const [myData, setMyData] = useState(null)
    const [question, setQuestion] = useState(0)
    const [loader, setLoader] = useState(true)
    const [selectedItem, setSelectedItem] = useState('')
    const [score, setScore] = useState(0)
    const [weightage, setWeightage] = useState(0)
    const [diff, setDiff] = useState(0)
    const [pointArr, setPointArr] = useState([])


    const submitScore = async (num) => {
        const temp = await getDataFromLocalStorage("user_id")
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("totalpoint", num)
        const result = await PostApiData('totalhealthindexvalue', formdata)
        console.log("healthIndex= " , result)
        ShortToast("Health Index has been submitted successfully", 'success', '')
    }


    const handleNext = () => {
        if (selectedItem == '') {
            ShortToast("Please Select an option", 'error', '')
        }
        else {
            setQuestion(prevValue => {

                if (prevValue == myData?.data?.length - 1) {
                    pointArr.push(weightage * Number.parseInt((myData?.data[question]?.value), 10))
                    setWeightage(0)
                    navigation.navigate("BootSplash")
                    submitScore(sumOfElementsOfArray(pointArr))
                    return myData?.data?.length - 1
                }

                else {
                    
                    setSelectedItem('')
                    pointArr.push(weightage * Number.parseInt((myData?.data[question]?.value), 10))
                    setWeightage(0)
                    return prevValue + 1
                }
            })
        }

    }

    const sumOfElementsOfArray = (arr) => {
        var sum = 0
        for (let i = 0; i < arr.length; i++) {
            sum = arr[i] + sum
        }
        return sum;
    }

    const getDataFromApi = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        const result = await PostApiData('gethealthindex',formdata)
        setMyData(result)
        setLoader(false)


    }
    const renderItem = ({ item, index }) => {
        if (item !== "") {
            return (
                <TouchableOpacity
                    style={{}}
                    onPress={() => {
                        setSelectedItem(item)
                        setWeightage(index + 1)
                    }}>
                    <LinearGradient colors={selectedItem == item ? [colors.GREEN, colors.GREEN2] : ["white", "white"]}
                        style={styles.optionsButton}>

                        <Text style={[styles.text, { color: selectedItem == item ? "white" : colors.FONT_BLACK }]}>{item}</Text>
                    </LinearGradient>
                </TouchableOpacity >
            )
        }
    }
    console.log('score', sumOfElementsOfArray(pointArr))
    return (
        loader ?
            <View style={{ alignItems: "center", justifyContent: 'center', height: H, width: W, }}>
                <ActivityIndicator size="large"
                    color={colors.GREEN} />
            </View>

            :
            <>
                <View>
                    <View>
                        <Text style={{
                            color: "white",
                            position: "absolute",
                            top: H * 0.14,
                            left: W * 0.4,
                            zIndex: 11,
                            fontSize: fontSizes.XXL,
                            ...fontFamily.bold,
                            textDecorationLine: "underline"
                        }}>{sumOfElementsOfArray(pointArr) == 0 ? null : `Score : ${sumOfElementsOfArray(pointArr)}`}</Text>
                    </View>
                    <View style={styles.nextButtonView}>
                        <TouchableOpacity style={{ height: H * 0.1, marginTop: H * 0.2 }}
                            onPress={() => { handleNext() }}>
                            <LinearGradient colors={[colors.GREEN, colors.GREEN2]}
                                style={[styles.optionsButton]}>
                                <Text style={[styles.text, { color: 'white' }]}>Next</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: "absolute", zIndex: 5,
                     left: W * 0.17, top: H * 0.1, height: H * 0.2 }}>
                        <AnimatedCircularProgress
                            fillLineCap="round"
                            lineCap="round"
                            arcSweepAngle={200}
                            rotation={-100}
                            size={W * 0.65}
                            width={15}
                            fill={(question / (myData.data.length - 1)) * 100}
                            tintColor={colors.ORANGE}
                            backgroundColor={"white"}
                            renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="7" fill={colors.MEDAL_GOLD} />} />
                    </View>
                    <View style={{ zIndex: 6 }}>
                        <StatusBar backgroundColor={colors.GREEN} />
                        <Appbar.Header style={styles.appBar}>
                            <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => {
                                setQuestion((prevValue) => {
                                    if (prevValue == 0)
                                        return navigation.goBack()
                                    else return (prevValue - 1)
                                })
                                pointArr.pop()
                            }} />
                            <Appbar.Content style={{ alignItems: "center", marginRight: W * 0.125 }} title={<Text style={{ color: "white", fontSize: fontSizes.XL, ...fontFamily.bold }}>Health Index</Text>} />
                        </Appbar.Header>
                    </View>

                </View>
                <View style={styles.backGround}>
                    <LinearGradient colors={[colors.GREEN, colors.GREEN2]}
                        style={styles.backGround}></LinearGradient>
                </View>

                <View style={styles.questionStyle}>

                    <Text style={styles.questionText}>{myData?.data[question]?.question}</Text>
                </View>

                <View style={styles.optionsList}>
                    <FlatList data={myData?.data[question].option}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>


            </>

    )
}
const styles = StyleSheet.create({
    backGround:
    {
        position: "absolute",
        backgroundColor: colors.GREEN,
        height: H * 0.34,

         zIndex: -10,
        width: W,
    },
    appBar:
    {
        backgroundColor: colors.GREEN
    },
    questionStyle:
    {
        alignItems: "center",
        height: H * 0.3,

    },
    optionsButton:
    {
        width: W * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: H * 0.02,
        backgroundColor: "white",
        marginTop: H * 0.01,
        height: H * 0.066,
    },
    text:
    {
        //paddingVertical: H * 0.022,
        ...fontFamily.bold
    },
    questionText:
    {
        ...fontFamily.bold,
        fontSize: fontSizes.XL,
        color: "white",
        paddingTop: H * 0.15,
        width: W * 0.5,
        textAlign: "center"

        // paddingBottom: H * 0.04,
    },
    nextButtonView:
    {

        position: "absolute",
        //zIndex: 10,
        width: W,
        alignItems: "center",
        top: H * 0.58,

        height: H * 0.1

    },
    optionsList:
    {
        // marginTop: H * 0.3,
        height: H * 0.4,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100
    }
})
export default HealthIndexQuestions