import { View, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, FlatList, StatusBar, Image, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { colors, fontFamily, fontSizes, GetApiData, H, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import { Text } from 'react-native-paper'
//import { Rect, Mask, LinearGradient, Svg, Defs, Stop, Use, Text } from 'react-native-svg'
import { RadioButton } from 'react-native-paper'
import { storeDataInLocalStorage } from '../../local storage/LocalStorage'
import LinearGradient from 'react-native-linear-gradient'
import Loader from '../../assets/components/Loader'
import Logo from '../Dashboard/Components/Logo'
import DataContext from '../../context/DataContext'
import { useIsFocused } from '@react-navigation/native'


const SelectPrefferedLanguage = ({ navigation }) => {
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            getData() 
        }
    }, [isFocused])

    const [data, setData] = useState(null)
    const [language, setLanguage] = useState("1")
    const [showLoader, setShowLoader] = useState(true)


    const { Nlanguagee } = useContext(DataContext)

    const [languagee, setLanguagee] = Nlanguagee



    const getData = async () => {
        const result = await GetApiData('languagelist')
        setData(result)
        setShowLoader(false)
        console.log(result)
    }

    const handleNext = async (n) => {



        if (n == '2') {
            // ShortToast("Hindi content will be available soon..", 'warning', '')
            setLanguagee("hi")
            storeDataInLocalStorage('lang', "hi")
          //  navigation.replace("SliderIntro")  // modified to comment

        } else if (n == "1") {
            setLanguagee("en")

            storeDataInLocalStorage('lang', "en")
            navigation.replace("SliderIntro")
        }
        else {
            setLanguagee("en")
            storeDataInLocalStorage('lang', "en")
            navigation.replace("SliderIntro")
        }
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => { handleNext(item.id) }}
                style={{
                    backgroundColor: colors.GREEN,
                    borderRadius: 8,
                    width: W * 0.4,
                    alignItems: "center",
                    marginTop: H * 0.028,
                }}>
                <View style={{
                    alignItems: "center",
                    marginHorizontal: W * 0.03
                }}>
                    {/*<RadioButton value={item.id}
                  status={language == item.id ? "checked" : "unchecked"}
                    color={colors.GREEN}
         onPress={() => { setLanguage(item.id) }} />*/}
                    <Text style={{
                        color: "white",
                        marginVertical: H * 0.03,
                        ...fontFamily.bold,
                        fontSize: fontSizes.XL
                    }}>{item.lang_name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        showLoader ?
            <Loader />
            :
            <SafeAreaView style={styles.mainContainer}>
                <StatusBar backgroundColor={colors.GREEN} />
                <View style={{ height: H, width: W, position: "absolute" }}>
                    <LinearGradient
                        style={{ height: H, width: W, }}
                        colors={[colors.GREEN, "white", "white",]}>

                    </LinearGradient>
                </View>
                <Text style={[styles.text2, { marginBottom: H * 0.04, fontSize: fontSizes.XXXL }]}>Welcome To</Text>


                <Logo />

                <Text style={styles.text2}>Please Select The Language That You Prefer </Text>
                <View style={styles.buttonView}>
                    <FlatList
                        data={data?.data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    //numColumns={2}
                    />
                </View>


                {/*  <TouchableOpacity onPress={() => { handleNext() }}
                    style={styles.nextButton}>
                    <Text style={{ color: "white", ...fontFamily.bold, fontSize: fontSizes.XL }}>
                        Next
                    </Text>
    </TouchableOpacity>*/}
            </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: H,
        width: W,
        // justifyContent: "center",
        // paddingVertical: H * 0.3,
        alignItems: "center",
        backgroundColor: "white",
    },
    text:
    {
        color: "white"
    },
    buttonView:
    {
        alignItems: "center",
        //backgroundColor: "red",
        //height: H * 0.2,
        zIndex: 50
    },
    button:
    {
        backgroundColor: colors.GREEN,
        width: W * 0.35,
        height: H * 0.07,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginVertical: H * 0.03,
        marginHorizontal: W * 0.05,
        zIndex: 100,
    },
    text2:
    {
        color: colors.FONT_BLACK,
        marginBottom: H * 0.027,
        marginTop: H * 0.12,
        ...fontFamily.bold,
        fontSize: fontSizes.XXXL,
        width: W * 0.9,
        textAlign: "center"
    },
    image:
    {
        height: H * 0.12,
        aspectRatio: 33 / 9,
        marginTop: H * 0.0,
    },
    nextButton:
    {
        height: H * 0.08,
        width: W * 0.8,
        alignSelf: "center",
        backgroundColor: colors.GREEN,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    logoText:
    {
        color: colors.FONT_BLACK,
        ...fontFamily.bold,
        width: W * 0.9,
        fontSize: fontSizes.MED,
        marginTop: H * 0.01,
    },
    textSet:
    {
        ...fontFamily.bold,
        marginBottom: H * 0.04,
        lineHeight: H * 0.04
    }
})

export default SelectPrefferedLanguage