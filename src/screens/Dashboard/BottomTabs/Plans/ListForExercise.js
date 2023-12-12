import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ActivityIndicator, Modal, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome';
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes';
import { Text } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';
import DataContext from '../../../../context/DataContext';

import { useNavigation } from '@react-navigation/native';

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
import LocalizedStrings from 'react-native-localization';
    import hindi from '../../../../hi'
    import english from '../../../../en'
    const strings = new LocalizedStrings({
        en: english,
        hi: hindi,
    });

const ListForExercise = (props) => {
    useEffect(() => { console.log("props" ,props), setLikedExercise(props.Liked) }, [props.Liked])
    const { NmyExcercise } = useContext(DataContext)
    const navigation = useNavigation()

    const [likedExercise, setLikedExercise] = useState(true)
    const [expand, setExpand] = useState(false)
    const [visibleMood, setVisibleMood] = useState(false)
    const [myExcercise, setMyExcercise] = NmyExcercise
    const [loader, setLoader] = useState(false)
    

    useEffect(() => {
        getLanguge()
    }, [])
    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(lang)
        console.log("currentLanguage", lang)
    }



    const replaceThisExercise = async () => {
        setLoader(true)
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("category", props.Category);
        formdata.append("id", props.Id);
        const resultExercise = await PostApiData('replaceexercise', formdata)
        if (resultExercise.status == 200) {
            var formdata2 = new FormData();
            formdata2.append("user_id", JSON.parse(temp));
            const result = await PostApiData('get_userexcersie_list', formdata2)
            if (result.status == '200') {
                setMyExcercise(result)
                ShortToast(resultExercise.message, 'success', '')
            }
            else {

                ShortToast(result.message, 'error', '')
            }
        }
        else {
            ShortToast(resultExercise.message, 'error', '')
        }
        setLoader(false)
    }


    const handlingReplaceMeal = async () => {
        setVisibleMood(true)
        const userTypee = await getDataFromLocalStorage('user_type')
        // if (JSON.parse(userTypee) == "2") {
        //     setVisibleMood(false)
        //     Alert.alert(
        //         'Alert!',
        //        strings.upgradeplanmsg ,
        //         [
        //             {
        //                 text: strings.Cancel,
        //                 onPress: () => console.log("Cancel Pressed"),
        //                 style: "cancel"
        //             },
        //             { text: strings.Ok, onPress: () => { navigation.navigate("Upgrade") } }
        //         ],
        //         { cancelable: false }
        //     );
        // } else {
        //     setVisibleMood(true)

        // }

    }


    const sendLike = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("category", props.Category);
        formdata.append("id", props.Id);
        formdata.append("status", "1")
        const result = await PostApiData('followunfollowsingleexercise', formdata)
        if (result.status == '200') {
            ShortToast(result.message, 'success', '')
            setLikedExercise(true)
        }
        else {
            ShortToast(result.message, 'warning', '')
        }
    }
    const sendDislike = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("category", props.Category);
        formdata.append("id", props.Id);
        formdata.append("status", "0")
        const result = await PostApiData('followunfollowsingleexercise', formdata)
        if (result.status == '200') {
            ShortToast(result.message, 'success', '')
            setLikedExercise(false)
        }
        else {
            ShortToast(result.message, 'warning', '')
        }
    }



    return (
        <View>


            {
                loader ?
                    <View style={{
                        height: H * 0.2,
                        // width: W ,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        marginHorizontal: W * 0.03
                    }}>
                        <ActivityIndicator
                            size="large"
                            color={"green"} />
                    </View> :

                    <Collapsible collapsed={false}>
                        <View style={[
                            styles.mealContainer, { marginTop: 0 }
                            // { backgroundColor: "red", height: H * 0.05, margin: H * 0.01 }
                        ]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Modal visible={visibleMood}
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
                                            height: H * 0.25,
                                            backgroundColor: colors.OFFWHITE,
                                            // backgroundColor: "red",
                                            width: W * 0.9,
                                            alignSelf: "center",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: 8,
                                            elevation: 8,
                                        }}
                                        >
                                            <View style={{
                                                flexDirection: "row", alignItems: "center",
                                                paddingBottom: H * 0.02,
                                            }}>
                                                <Text style={{
                                                    ...fontFamily.bold,
                                                    fontSize: fontSizes.XXL,
                                                    color: "black",
                                                    paddingRight: W * 0.02
                                                }}>
                                                  {strings.replacemeal}
                                                </Text>

                                            </View>
                                            <Text style={{
                                                ...fontFamily.bold,
                                                paddingHorizontal: W * 0.025,
                                                lineHeight: H * 0.03
                                            }}>
                                                {strings.replacemsg} <Text style={{
                                                    color: colors.GREEN,
                                                    ...fontFamily.bold
                                                }}>{props.FoodName}</Text>
                                            </Text>


                                            <>
                                                <View style={{
                                                    flexDirection: "row",
                                                    width: W * 0.5,
                                                    alignSelf: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                    <TouchableOpacity onPress={() => {
                                                        replaceThisExercise()
                                                        setVisibleMood(false)
                                                    }}>
                                                        <Text style={{
                                                            ...fontFamily.bold,
                                                            color: colors.GREEN,
                                                            fontSize: fontSizes.XL,
                                                            paddingTop: H * 0.028,
                                                        }}>
                                                            {strings.yes}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {
                                                        setVisibleMood(false)

                                                    }}>
                                                        <Text style={{
                                                            ...fontFamily.bold,
                                                            color: "red",
                                                            fontSize: fontSizes.XL,
                                                            paddingTop: H * 0.028,
                                                        }}>
                                                            {strings.no}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>



                                        </View>
                                    </View>
                                </Modal>
                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2964/2964546.png' }}
                                    style={{
                                        height: H * 0.055,
                                        width: H * 0.055,
                                        marginHorizontal: WIDTH * 0.035,
                                        borderRadius: 5
                                    }} />
                                <View>
                                    <Text
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'Montserrat-SemiBold',
                                            fontSize: fontSizes.MED,
                                            color: 'black',
                                            width: W * 0.4,

                                        }}>{props.FoodName}</Text>
                                    <Text style={{
                                        fontFamily: 'Montserrat-SemiBold',
                                        color: 'gray',
                                        fontSize: fontSizes.MED
                                    }}>{props.Serving}</Text>
                                </View>
                                <View style={{
                                    position: "absolute",
                                    left: W * 0.61
                                }}>
                                    <Text style={{
                                        fontFamily: 'Montserrat-SemiBold',
                                        color: '#b7b7b7',
                                        fontSize: fontSizes.SM,
                                    }}>
                                        {
                                            expand
                                                ?
                                                <TouchableOpacity onPress={() => { setExpand(!expand) }}>
                                                    <AntDesign name="downcircleo" size={20} color="grey" />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => { setExpand(!expand) }}>
                                                    <AntDesign name="upcircleo" size={20} color="grey" />
                                                </TouchableOpacity>

                                        }
                                    </Text>
                                </View>
                                <View style={{
                                    position: "absolute",
                                    left: W * 0.7
                                }}>
                                    {
                                        (likedExercise == true)
                                            ?
                                            <TouchableOpacity onPress={() => {
                                                  //sendDislike()

                                               ShortToast(strings.FeatureComingSoon, 'warning', '')

                                                //ShortToast("No Worries. you can always replace the meal you don't like", 'success', '')
                                            }}>
                                                <AntDesign name="sync" size={fontSizes.XXL} color="green" />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => {
                                                    // setLikedExercise(!likedExercise)4
                                                     // sendLike()

                                                    ShortToast(strings.FeatureComingSoon, 'warning', '')

                                                    //ShortToast('Liked!', 'success', '')
                                                }}>
                                                <AntDesign name="sync" size={fontSizes.XXL} color={"grey"} />
                                            </TouchableOpacity>
                                    }


                                </View>
                                <View style={{
                                    position: "absolute",
                                    left: W * 0.78
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        //setVisibleMood(true)
                                        handlingReplaceMeal()
                                    }}>
                                        <>
                                            <Image source={require('../../../../assets/icons/shuffel.png')}
                                                style={{
                                                    height: H * 0.03,
                                                    width: H * 0.03,
                                                    tintColor: "green"

                                                }} />
                                        </>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.calCount}>
                                <Text style={styles.textCalCount}>{props.Calories1} </Text>
                            </View>
                            {
                                !expand
                                    ?
                                    <>
                                        <View>
                                            <Text style={{
                                                fontSize: fontSizes.LAR,
                                                paddingTop: H * 0.01,
                                                marginLeft: W * 0.038,
                                                ...fontFamily.bold,
                                                textDecorationLine: "underline"
                                            }}>Description: </Text><Text style={{
                                                fontSize: fontSizes.LAR,
                                                textDecorationLine: "none",
                                                marginLeft: W * 0.038,
                                            }}>{props.FoodName}</Text>
                                            <Text style={{
                                                fontSize: fontSizes.LAR,
                                                paddingTop: H * 0.01,
                                                marginLeft: W * 0.038,
                                                ...fontFamily.bold,
                                                textDecorationLine: "underline"
                                            }}>Intensity: </Text><Text style={{
                                                fontSize: fontSizes.LAR,
                                                textDecorationLine: "none",
                                                marginLeft: W * 0.038,
                                            }}>{props.Serving}</Text>
                                        </View>
                                    </>
                                    :
                                    <>
                                    </>
                            }

                        </View>
                    </Collapsible >

            }
        </View >
    )
}

const styles = StyleSheet.create({
    mealContainer:
    {
        paddingTop: H * 0.02,
        paddingBottom: H * 0.02,
        width: W * 0.88,
        backgroundColor: 'white',
        margin: H * 0.012,
        borderRadius: 8,
        alignSelf: "center",
        justifyContent: 'center',
    },
    calCount:
    {
        position: 'absolute',
        left: 0.5 * WIDTH,
        top: 0.02 * HEIGHT,
    },
    textCalCount:
    {
        paddingLeft: WIDTH * 0.1,
        color: '#b7b7b7',
        fontSize: fontSizes.MED,
        fontFamily: 'Montserrat-SemiBold'

    },
})
export default ListForExercise
