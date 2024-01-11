import { View, Image, StatusBar, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { H, W, colors, fontSizes, PostApiData, fontFamily } from '../../colorSchemes/ColorSchemes'
import { Text } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import LinearGradient from 'react-native-linear-gradient'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import Logo from '../Dashboard/Components/Logo'

import { useIsFocused } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'


//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});


export default function WelcomeScreenAfterRegistration({ navigation }) {
    const [langText, setLangText] = useState("")
    const isFocused = useIsFocused()
    
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
    strings.setLanguage(languageKey)
  }



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

                {langText == "en"?<ImageBackground source={require('../../assets/icons/letsgo.png')}
                    style={{ height: H , width: W, zIndex: 0, position: 'absolute' }} />:
                    <ImageBackground source={require('../../assets/icons/letsgohi.png')}
                    style={{ height: H , width: W, zIndex: 0, position: 'absolute' }} />}
                 {/* <ImageBackground source={require('../../assets/icons/letsgohi.png')}
                    style={{ height: H , width: W, zIndex: 0, position: 'absolute' }} /> */}
            </View>
            <View style={{
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                height: H / 2,
                paddingHorizontal: W * 0.08,
                paddingTop: H * 0.28
            }}>
                {/* <Text style={{
                    ...fontFamily.bold,
                    fontSize: H * 0.043,
                    marginBottom: H * 0.0,
                    marginTop: H * 0.12,
                    top: H * 0.034,
                }}>Let's get started

                </Text> */}
                {/* <Text style={{
                    fontSize: H * 0.022,
                    marginTop: H * 0.02,
                    top: H * 0.05,
                    textAlign: "center",
                    ...fontFamily.bold,
                    lineHeight: H * 0.03
                }}> Make real
                    change in your health from the inside out.</Text> */}
            </View>



            <View>
                <TouchableOpacity onPress={() => handleGo()}
                    style={{}}>
                    <LinearGradient colors={[colors.GREEN, '#cded9a']}
                        style={{ marginTop: H * 0.3, backgroundColor: colors.GREEN,
                             height: H * 0.12, width: H * 0.12, borderRadius: H * 0.12 / 2,
                              alignSelf: 'center', 
                        justifyContent: 'center', alignItems: 'center' }}>
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