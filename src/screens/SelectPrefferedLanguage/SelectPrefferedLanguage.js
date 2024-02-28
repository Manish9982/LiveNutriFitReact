import { View, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, FlatList, StatusBar, Image, ToastAndroid, ActivityIndicator, Alert } from 'react-native'
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
import { useChangeLanguage } from '../../utils/LocalizationUtil'

const SelectPrefferedLanguage = ({ navigation }) => {
    const isFocused = useIsFocused()
    const changeLanguage = useChangeLanguage();

    const handleChangeLanguage = async (newLanguage) => {
        await storeDataInLocalStorage('language_new', newLanguage)
        await changeLanguage(newLanguage);
    };

    useEffect(() => {
        if (isFocused) {
            getData()
        }
    }, [isFocused])

    const [data, setData] = useState(null)
    const [showLoader, setShowLoader] = useState(true)
    const { Nlanguage } = useContext(DataContext)
    const [language, setLanguage] = Nlanguage

    const getData = async () => {
        const result = await GetApiData('languagelist')
        setData(result)
        console.log('languagelist', result)
        setData(result)
        setShowLoader(false)
    }

    const handleNext = async (code, active, title, body) => {
        if (active) {
            setLanguage(code)
            handleChangeLanguage(code)
            navigation.replace("SliderIntro")  // modified to comment
        }
        else {
            Alert.alert(title, body)
        }
    }

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => { handleNext(item?.code, item?.active, item?.msg_title, item?.msg_body) }}
                style={[styles.languageButton, {
                    backgroundColor: item?.active ? colors.GREEN : colors.DARK_GRAY
                }]}>
                <Text style={{
                    color: "white",
                    ...fontFamily.bold,
                }}>{item.lang_name}</Text>
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
                <Text style={styles.text2}>Please Select The Language That You Prefer</Text>
                <View style={styles.buttonView}>
                    {data?.data?.map((item, index) => renderItem(item, index))}
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        zIndex: 50,
        justifyContent: 'center'
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
    },
    languageButton:
    {
        borderRadius: 8,
        alignItems: "center",
        marginTop: H * 0.028,
        padding: 15,
        margin: 8,
        minWidth: 100
    }
})

export default SelectPrefferedLanguage