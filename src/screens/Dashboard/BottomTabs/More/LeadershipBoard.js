import { StyleSheet, View, Image, Dimensions, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text } from 'react-native-paper'
import { colors, fontSizes, GetApiData, H } from '../../../../colorSchemes/ColorSchemes'
import { FlatList } from 'react-native-gesture-handler'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'



//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});



const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const date = new Date()

const LeadershipBoard = () => {

    const isFocused = useIsFocused()

    useEffect(() => { getDataFromApi() }, [])

    useEffect(() => { getLanguge() }, [isFocused])


    //lng
    const getLanguge = async () => {
      const lang = await getDataFromLocalStorage("lang")
  
      if (lang == "en") {
        changeLaguagee('en')
  
      } else {
        changeLaguagee('hi')
  
      }
  
    }
  
  
    const changeLaguagee = (languageKey) => {
      strings.setLanguage(languageKey)
    }

    const [selectedId, setSelectedId] = useState(null)
    const [loader, setLoader] = useState(true)
    const [myData, setMyData] = useState(null)
    const [textColor, setTextColor] = useState('white')
    const [textColor2, setTextColor2] = useState('black')
    const [buttonBgColor, setButtonBgColor] = useState(colors.GREEN)
    const [buttonBgColor2, setButtonBgColor2] = useState('white')

    ///sorting array function


    ///

    const handleOnPress1 = () => {
        setButtonBgColor(colors.GREEN)
        setButtonBgColor2('white')
        setTextColor('white')
        setTextColor2('black')
        getDataFromApi()
        // setMealMenuIsVisible(true)
    }
    const handleOnPress2 = () => {
        setButtonBgColor('white')
        setButtonBgColor2(colors.GREEN)
        setTextColor('black')
        setTextColor2('white')
        getDataFromApi2()
        // setMealMenuIsVisible(false)
    }
    ///////////////////////////Card Component Start//////////////////
    const Card = (props) => {
        const cardPressed = (id) => {
            setSelectedId(id)

        }


        return (
            <>
                <TouchableOpacity onPress={() => cardPressed(props.id)}
                    style={[styles.cardContainer, { backgroundColor: props.id == selectedId ? colors.GREEN : 'white' }]}>
                    <View style={styles.containerOne}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', color: props.id == selectedId ? 'white' : 'black' }}>{props.id}</Text>
                    </View>
                    <View style={styles.containerTwo}>
                        <Image source={{ uri: props.image }}
                            style={styles.imageContainer} />
                    </View>
                    <View style={styles.containerThree}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', color: props.id == selectedId ? 'white' : 'black' }}>{props.name}</Text>
                    </View>
                    <View style={styles.containerFour}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', color: props.id == selectedId ? 'white' : 'black' }}>{props.points} Pts</Text>
                    </View>
                </TouchableOpacity>
            </>
        )
    }
    /////////////////////////////////Card Component End//////////////////////////////////////////
    const getDataFromApi = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        const userType = await getDataFromLocalStorage('user_type')
        console.log("type== ", userType)

        if(userType=="5"){  // modified 1 to 5
            const result = await GetApiData(`leadershipboard?user_id=${JSON.parse(temp) }`)
            // result?.data?.sort(function (a, b) {
            //     var keyA = a?.total_point,
            //         keyB = b?.total_point;
            //     // Compare the 2 dates
            //     if (keyA < keyB) return -1;
            //     if (keyA > keyB) return 1;
            //     return 0;
            // });
       // modified to comment
            setMyData(result)
            console.log(result)
            setLoader(false)

        }else{
            const result = await GetApiData(`leadershipboard?user_id=${JSON.parse(temp) }&user_type=${JSON.parse(userType) }`)  // modified 3 from string usertype
            // result?.data?.sort(function (a, b) {
            //     var keyA = a?.total_point,
            //         keyB = b?.total_point;
            //     // Compare the 2 dates
            //     if (keyA < keyB) return -1;
            //     if (keyA > keyB) return 1;
            //     return 0;
            // });
    
            setMyData(result)
            console.log(result)
            setLoader(false)
        }


      
    }
    const getDataFromApi2 = async () => {
        const userID = await getDataFromLocalStorage('user_id')
        const userType = await getDataFromLocalStorage('user_type')
        setLoader(true)

        if(userType=="1"){    //same as above api
            const temp = date.getMonth() + 1
            const result = await GetApiData(`leadershipboard?month=${temp}&user_id=${JSON.parse(userID)}`)
            console.log(result)
            // result?.data?.sort(function (a, b) {
            //     var keyA = a?.total_point,
            //         keyB = b?.total_point;
            //     // Compare the 2 dates
            //     if (keyA < keyB) return -1;
            //     if (keyA > keyB) return 1;
            //     return 0;
            // });
            setMyData(result)
            setLoader(false)
            
        }else{
            const temp = date.getMonth() + 1
            const result = await GetApiData(`leadershipboard?month=${temp}&user_id=${JSON.parse(userID)}&user_type=${JSON.parse(userType) }`)
            console.log(result)
            // result?.data?.sort(function (a, b) {
            //     var keyA = a?.total_point,
            //         keyB = b?.total_point;
            //     // Compare the 2 dates
            //     if (keyA < keyB) return -1;
            //     if (keyA > keyB) return 1;
            //     return 0;
            // });
            setMyData(result)
            setLoader(false)
        }

     
    }

    const renderItem = ({ item, index }) => {
        console.log(JSON.stringify(item?.profile_pic))
        return (
            <>
                <Card name={item.user_name}
                    points={item.total_point}
                    id={index + 1}
                    image={item.profile_pic}
                />
            </>
        )
    }

    return (
        loader ?
            <View style={{ justifyContent: 'center', alignItems: 'center', 
            height: HEIGHT, width: WIDTH }}>
                <ActivityIndicator size="large"
                    color={colors.GREEN} />
            </View>

            :
            <View>

                <HeaderForSubmissionScreens Title={strings.leadershipboard} />

                <StatusBar backgroundColor={colors.GREEN} />
                <View style={styles.upperContainer}>

                    <Image source={{ uri: myData?.data[2]?.profile_pic }}
                        style={[styles.imageContainerTwo, { marginHorizontal: WIDTH * 0.05 }]} />

                    <Image source={{ uri: myData?.data[0]?.profile_pic }}
                        style={[styles.imageContainerTwo, styles.alternateImageContainerTwo]} />

                    <Image source={{ uri: myData?.data[1]?.profile_pic }}
                        style={[styles.imageContainerTwo, { marginHorizontal: WIDTH * 0.05 }]} />

                    <Image source={require('../../../../assets/icons/decoration.png')}
                        style={styles.imageContainerThree} />
                </View>
                <View style={styles.ButtonDisplayContainer}>
                    <TouchableOpacity onPress={() => { handleOnPress1() }} style={[styles.mealButton, { backgroundColor: buttonBgColor }]}>
                        <Text style={[styles.textStyle, { color: textColor }]}>{strings.AllTime}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { handleOnPress2() }} style={[styles.excerciseButton, { backgroundColor: buttonBgColor2 }]}>
                        <Text style={[styles.textStyle, { color: textColor2 }]}>{strings.ThisMonth}</Text>
                    </TouchableOpacity>

                </View>
                {/* ------------------------------------ Absolute position ------------------------------ */}
                <Image source={require('../../../../assets/icons/medal.png')}
                    style={[styles.imageContainerFour, { position: 'absolute', top: HEIGHT * 0.28, left: WIDTH * 0.085 }]} />
                <Image source={require('../../../../assets/icons/gold-medal.png')}
                    style={[styles.imageContainerFour, { position: 'absolute', top: HEIGHT * 0.31, left: WIDTH * 0.438 }]} />
                <Image source={require('../../../../assets/icons/medalTwo.png')}
                    style={[styles.imageContainerFour, { position: 'absolute', top: HEIGHT * 0.28, left: WIDTH * 0.79 }]} />

                {/*************************Apply Loop Here************************/}
                <View style={{ height: HEIGHT, paddingBottom: H * 0.59, }}>
                    <FlatList
                        data={myData?.data}
                        renderItem={renderItem}
                        keyExtractor={myData?.user_id}
                    />
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    imageContainer:
    {
        height: HEIGHT * 0.05,
        width: HEIGHT * 0.05,
        borderRadius: (HEIGHT * 0.05) / 2
    },
    cardContainer:
    {
        paddingVertical: HEIGHT * 0.016,
        width: WIDTH * 0.9,
        alignSelf: 'center',
        borderRadius: 8,
        marginVertical: HEIGHT * 0.01,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        paddingHorizontal: WIDTH * 0.05,
        alignItems: 'center'

    },
    containerOne:
    {
        width: WIDTH * 0.05
    },
    containerTwo:
    {
        width: WIDTH * 0.22
    },
    containerThree:
    {
        width: WIDTH * 0.38
    },
    containerFour:
    {
        width: WIDTH * 0.15
    },
    upperContainer:
    {
        backgroundColor: colors.GREEN,
        height: HEIGHT * 0.38,
        width: WIDTH,
        marginBottom: HEIGHT * 0.02,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageContainerTwo:
    {
        height: HEIGHT * 0.1,
        width: HEIGHT * 0.1,
        borderRadius: (HEIGHT * 0.1) / 2,
        borderColor: 'white',
        borderWidth: 2,
        backgroundColor: 'white'
    },
    imageContainerThree:
    {
        height: HEIGHT * 0.25,
        width: HEIGHT * 0.25,
        position: 'absolute',
        zIndex: 0
    },
    alternateImageContainerTwo:
    {
        height: HEIGHT * 0.15,
        width: HEIGHT * 0.15,
        borderRadius: (HEIGHT * 0.15) / 2,
        marginHorizontal: WIDTH * 0.05,
        zIndex: 1,
        backgroundColor: 'white'

    },
    imageContainerFour:
    {

        width: HEIGHT * 0.06,
        height: HEIGHT * 0.06,
    },
    ButtonDisplayContainer:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        height: HEIGHT * 0.05,
        marginVertical: HEIGHT * 0.02,
        width: WIDTH,
        alignItems: "center"
    },
    mealButton:
    {
        height: HEIGHT * 0.06,
        width: WIDTH * 0.35,
        borderRadius: 6,
        marginHorizontal: WIDTH * 0.05,
        elevation: 2,
    },
    excerciseButton:
    {
        height: HEIGHT * 0.06,
        width: WIDTH * 0.35,
        borderRadius: 6,
        elevation: 2,
    },
    textStyle:
    {
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSizes.MED,
        height: '100%'
    },


})
export default LeadershipBoard
