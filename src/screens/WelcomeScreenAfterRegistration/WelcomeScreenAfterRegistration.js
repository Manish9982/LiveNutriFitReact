import { View, Image, StatusBar, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { H, W, colors, fontSizes, PostApiData, fontFamily, Constants } from '../../colorSchemes/ColorSchemes'
import { Text } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import LinearGradient from 'react-native-linear-gradient'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import Logo from '../Dashboard/Components/Logo'

import { useIsFocused } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { useLocales } from '../../utils/LocalizationUtil'


export default function WelcomeScreenAfterRegistration({ navigation }) {
    const [langText, setLangText] = useState("")
    const isFocused = useIsFocused()
    const strings = useLocales()

    useEffect(() => { getLanguage() }, [isFocused])

    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")
        setLangText(lang)

        console.log("sigup=============", lang)

        if (lang == "en") {
            changeLanguage('en')

        } else {
            changeLanguage('hi')
        }

    }


    const changeLanguage = (languageKey) => {

    }


    console.log('`${Constants.BASE_URL}${strings.letsGo_Image}`', `${Constants.BASE_URL}${strings.letsGo_Image}`)
    const handleGo = () => {
        //navigation.navigate("QuestionsCustom") // chnge 
        navigation.navigate("NewProfiling")
    }
    return (
        <View style={{ height: H, width: W, backgroundColor: "white" }}>
            <StatusBar backgroundColor={colors.GREEN} />
            <View style={{ zIndex: 0 }}>
                <View style={{
                    // position: "absolute",
                    alignSelf: "center",
                    top: H * 0.2,
                    zIndex: 2,
                }}>
                    {/* <Logo /> */}
                </View>

                <ImageBackground source={{ uri: `${Constants.BASE_URL}panel/${strings.letsGo_Image}` }}
                    style={{ height: H, width: W, zIndex: 0, position: 'absolute' }} />

            </View>
            <View style={{
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                height: H / 2,
                paddingHorizontal: W * 0.08,
                paddingTop: H * 0.28
            }}>

            </View>
            <View>
                <TouchableOpacity onPress={() => handleGo()}
                    style={{}}>
                    <LinearGradient colors={[colors.GREEN, '#cded9a']}
                        style={{
                            marginTop: H * 0.3, backgroundColor: colors.GREEN,
                            height: H * 0.12, width: H * 0.12, borderRadius: H * 0.12 / 2,
                            alignSelf: 'center',
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                        <AntDesign name="arrowright" size={35} style={{ color: "white", }} />
                    </LinearGradient>
                    <Text style={{
                        textAlign: "center",
                        color: colors.FONT_BLACK,
                        // textDecorationLine: "underline",
                        ...fontFamily.bold,
                        marginTop: H * 0.01
                    }}
                    >{strings.letsGo}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}