import { StyleSheet, TouchableOpacity, View, Image, Dimensions, Modal, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome';
import { colors, Constants, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes';
import { Text } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';
import { color } from 'react-native-reanimated';
import DataContext from '../../../../context/DataContext';
import { useNavigation } from '@react-navigation/native';
//import Loader from '../../../../assets/components/Loader';
import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width


const ListForMeal = (props) => {
    const { NmyMeals } = useContext(DataContext)
    const navigation = useNavigation()
    useEffect(() => { "propsMEAL+++++", props, setLikedMeal(props.Liked) }, [props.Liked])
    const [myMeals, setMyMeals] = NmyMeals
    const [likedMeal, setLikedMeal] = useState(true)
    const [visibleReplaceMeal, setVisibleReplaceMeal] = useState(true)
    const [expand, setExpand] = useState(false)
    const [visibleMood, setVisibleMood] = useState(false)
    const [visibleModalForRepeat, setVisibleModalForRepeat] = useState(false)

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        getLanguge()
    }, [])




    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(lang)

    }


    const sendLike = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("category", props.Category);
        formdata.append("id", props.Id);
        formdata.append("status", "1")
        formdata.append("repeat", "0")
        const result = await PostApiData('followunfollowsinglemeal', formdata)
        if (result.status == '200') {
            setVisibleModalForRepeat(true)
            // ShortToast(result.message, 'success', '')
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
        formdata.append("repeat", "0")
        const result1 = await PostApiData('followunfollowsinglemeal', formdata)
        console.log("FOLLOW UNFOLLOW", result1)

        if (result1.status == '200') {
            var formdata2 = new FormData();
            formdata2.append("user_id", JSON.parse(temp));
            const result = await PostApiData('get_meal_list', formdata2)
            setMyMeals(result)

            ShortToast(result1.message, 'success', '')
        }
        else {
            ShortToast(result1.message, 'warning', '')
        }
    }

    const handlingReplaceMeal = async () => {
        setVisibleMood(true)
        const userTypee = await getDataFromLocalStorage('user_type')
        // if (JSON.parse(userTypee) == "1") {
        //     setVisibleMood(false)

        //     Alert.alert(
        //         'Alert!',
        //         strings.upgradeplanmsg,
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

    const replaceThisMeal = async () => {
        setLoader(true)

        var formdata = new FormData();

        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("category", props.Category);
        formdata.append("id", props.Id);
        formdata.append("mdate", props.Date);


        const resultreplace = await PostApiData('DashboardApi/replacemeal', formdata)

        if (resultreplace.status == 200) {
            // setLoader(true)


            var formdata2 = new FormData();

            formdata2.append("user_id", JSON.parse(temp));

            const result = await PostApiData('get_meal_list', formdata2)

            console.log(result)

            setMyMeals(result)

            ShortToast(resultreplace.message, 'success', '')
        }

        else {
            ShortToast(resultreplace.message, 'error', '')
        }
        setLoader(false)
    }
    const repeatThisMeal = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("category", props.Category);
        formdata.append("id", props.Id);
        formdata.append("status", "1")
        formdata.append("repeat", "1")

        const result1 = await PostApiData('followunfollowsinglemeal', formdata)
        if (result1.status == '200') {

            var formdata2 = new FormData();
            formdata2.append("user_id", JSON.parse(temp));
            const result = await PostApiData('get_meal_list', formdata2)
            console.log(result)
            if (result.status == '200') {
                setMyMeals(result)
                ShortToast(result1.message, 'success', '')

            }
            else {

                ShortToast(result.message, 'error', '')
            }
        }
        else {
            ShortToast(result1.message, 'warning', '')
        }
    }


    return (
        <View >
            {
                loader ?
                    <View style={{
                        height: H * 0.2,
                        width: W * 0.898,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        //marginHorizontal:W*0.2
                    }}>
                        <ActivityIndicator
                            size="large"
                            color={"green"} />
                    </View>
                    :



                    <Collapsible collapsed={false}>
                        <View style={[
                            styles.mealContainer, { marginTop: 0 }
                        ]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Modal visible={visibleModalForRepeat}
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
                                            backgroundColor: colors.OFFWHITE,
                                            width: W * 0.9,
                                            alignSelf: "center",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: 8,
                                            elevation: 8,
                                            paddingVertical: H * 0.05
                                        }}
                                        >
                                            <View style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                paddingBottom: H * 0.02,
                                            }}>
                                                <Text style={{
                                                    ...fontFamily.bold,
                                                    fontSize: fontSizes.XXL,
                                                    color: colors.GREEN,
                                                    paddingRight: W * 0.02
                                                }}>
                                                </Text>

                                            </View>
                                            <Text style={{
                                                color: colors.GREEN,
                                                ...fontFamily.bold,
                                                bottom: H * 0.04,

                                            }}>{props.FoodName}
                                            </Text>
                                            <Text style={{
                                                ...fontFamily.bold,
                                                paddingHorizontal: W * 0.025,
                                                lineHeight: H * 0.03,
                                            }}>
                                                {"We noticed that you like this meal, Want to repeat it for next 7 days?\n"} </Text>
                                            <>
                                                <View style={{
                                                    flexDirection: "row",
                                                    width: W * 0.5,
                                                    alignSelf: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                    <TouchableOpacity onPress={() => {
                                                        repeatThisMeal()
                                                        setVisibleModalForRepeat(false)
                                                    }}>
                                                        <Text style={{
                                                            ...fontFamily.bold,
                                                            color: colors.GREEN,
                                                            fontSize: fontSizes.XL,
                                                            paddingTop: H * 0.028,
                                                        }}>
                                                            YES
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {
                                                        setVisibleModalForRepeat(false)

                                                    }}>
                                                        <Text style={{
                                                            ...fontFamily.bold,
                                                            color: "red",
                                                            fontSize: fontSizes.XL,
                                                            paddingTop: H * 0.028,
                                                        }}>
                                                            NO
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>



                                        </View>
                                    </View>
                                </Modal>
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
                                            backgroundColor: colors.OFFWHITE,
                                            width: W * 0.9,
                                            alignSelf: "center",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: 8,
                                            elevation: 8,
                                            paddingVertical: H * 0.05,
                                        }}
                                        >
                                            <View style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                paddingBottom: H * 0.03,
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
                                                lineHeight: H * 0.03,
                                                marginTop: H * 0.01
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
                                                    marginTop: H * 0.02,
                                                    justifyContent: "space-between"
                                                }}>
                                                    <TouchableOpacity onPress={() => {
                                                        setVisibleMood(false)
                                                        replaceThisMeal()
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
                                {/* <Image source={{ uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg' }} */}

                                <Image source={{ uri: `${Constants.BASE_URL}csvfile/${props.Image} ` }}

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
                                    <Text
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: 'Montserrat-SemiBold',
                                            color: 'gray',
                                            fontSize: fontSizes.SM,
                                            width: W * 0.35
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
                                        (likedMeal == true)
                                            ?
                                            <TouchableOpacity onPress={() => {
                                                sendDislike()
                                                //ShortToast(strings.Ok, 'warning', '')

                                                //ShortToast("No Worries. you can always replace the meal you don't like", 'success', '')
                                            }}>
                                                <AntDesign name="sync" size={fontSizes.XXL} color="green" />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => {
                                                    sendLike()
                                                    //ShortToast(strings.FeatureComingSoon, 'warning', '')
                                                }}>
                                                <AntDesign name="sync" size={fontSizes.XXL} color={"grey"} />
                                            </TouchableOpacity>
                                    }


                                </View>




                                <View style={{
                                    position: "absolute",
                                    left: W * 0.78,

                                }}>
                                    {
                                        props.OnRepeat

                                            ?
                                            <View style={{
                                                backgroundColor: colors.MEDAL_GOLD,
                                                position: "absolute",
                                                top: -H * 0.025,
                                                width: W * 0.19,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                alignSelf: "center",
                                                borderRadius: 8,
                                                left: -W * 0.14,
                                                paddingHorizontal: W * 0.015,
                                                marginTop: H * 0.003

                                            }}>
                                                <Text style={{
                                                    fontSize: fontSizes.EXTRASM,
                                                    color: "black",
                                                    ...fontFamily.bold
                                                }}>REPEATED</Text>
                                            </View>
                                            :
                                            <>
                                            </>
                                    }


                                    <TouchableOpacity onPress={() => {

                                        handlingReplaceMeal()
                                        // setVisibleMood(true)
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
                                            }}>Meal Name: </Text>

                                            <Text style={{
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
                                            }}>Serving: </Text>

                                            <Text style={{
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
        paddingTop: H * 0.015,
        paddingBottom: H * 0.012,
        width: W * 0.87,
        backgroundColor: 'white',
        margin: H * 0.01,
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
export default ListForMeal
