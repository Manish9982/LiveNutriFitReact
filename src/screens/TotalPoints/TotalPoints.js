import { Dimensions, StyleSheet, TouchableOpacity, View, Image, RefreshControl, StatusBar, FlatList, Modal, PermissionsAndroid, Platform } from 'react-native'
import React, { useEffect, useContext } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../colorSchemes/ColorSchemes'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import CustomHeader from '../Dashboard/Components/CustomHeader'
import HeaderForTotalPoints from './HeaderForTotalPoints'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import moment from 'moment'
import Card from './Card'
import { ProgressBar, Text } from 'react-native-paper'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import DataContext from '../../context/DataContext'
import Loader from '../../assets/components/Loader'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { useIsFocused } from '@react-navigation/native'
import { ColorProperties } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { useLocales } from '../../utils/LocalizationUtil'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const myIcon = <Image source={require('../../assets/icons/goldcoin.png')}
    style={{ height: 50, width: 50, borderRadius: 10, marginHorizontal: 5 }} />
const myIcon2 = <Image source={require('../../assets/icons/reward.jpg')}
    style={{ height: 15, width: 15, borderRadius: 7.5 }} />

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const TotalPoints = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [camVisible, setCamVisible] = React.useState(false)
    const [dataFromApi, setDataFromApi] = React.useState(null);
    const [loader, setLoader] = React.useState(true)
    const { NisInfoButtonVisible } = useContext(DataContext)
    const [isInfoButtonVisible, setIsInfoButtonVisible] = NisInfoButtonVisible

    const isFocused = useIsFocused()
    const strings = useLocales()
    const rotation = useSharedValue(0);

    useEffect(() => {
        //rotate()
        getTotalPoints()
        requestCameraPermission()
    }, [])

    useEffect(() => { getLanguage() }, [isFocused])

    //lng
    const getLanguage = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")
        
        // setLoader(false)

    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getTotalPoints()
        wait(2000).then(() => setRefreshing(false));
    }, []);

    // const rotate = () => {
    //     rotation.value = withRepeat(
    //         withTiming
    //             (360, { duration: 4000, easing: Easing?.linear }),
    //         -1,
    //         true
    //     );
    // };


    const requestCameraPermission = async () => {
        if(Platform.OS == 'android')
        {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "LiveNutriFit App Camera Permission",
                        message:
                            "LiveNutriFit App needs access to your camera " +
                            "so you can take awesome pictures.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the camera");
                } else {
                    console.log("Camera permission denied");
                }
            } catch (err) {
                ShortToast(err, "error", "");
            }
        }   
    }
    const launchCam = async () => {
        { /* const cameraOptions = await launchCamera((res) => console.log("peter----", res))
        setImage(cameraOptions)
        console.log(cameraOptions)
    uploadPhoto()*/}
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "LiveNutriFit App Camera Permission",
                    message:
                        "LiveNutriFit App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                launchCamera(
                    {
                        includeBase64: false,
                        mediaType: 'photo',
                        quality: 0.5,
                    },
                    async (response) => {
                        if (response.didCancel) {
                            console.log('User cancelled image picker');
                        } else if (response.error) {
                            console.log('ImagePicker Error: ', response.error);
                        } else {
                            await uploadPhoto(response)
                        }
                    },
                )
            } else {
                ShortToast("Camera permission denied", "error", '');
            }
        } catch (err) {
            ShortToast(err, "error", "");
        }

    }
    const launchGallery = async () => {
        launchImageLibrary(
            {
                includeBase64: false,
                mediaType: 'photo',
                quality: 0.8,
            },
            async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    await uploadPhoto(response)
                }
            },
        )
    }

    const uploadPhoto = async (pic) => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("profile", {
            uri: pic?.assets?.[0]?.uri,
            type: pic?.assets?.[0]?.type,
            name: pic?.assets?.[0]?.fileName,
        });
        const result = await PostApiData('update_profile_image', formdata)
        console.log("result======>", result)
        ShortToast(result.message, "success", "")
        getTotalPoints()
        setCamVisible(false)
    }
    const getTotalPoints = async () => {
        setLoader(true)
        //  getLanguage()
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        const result = await PostApiData('get_total_point', formdata)
        setDataFromApi(result)
        //setDataFromApi(DATA)
        console.log('get_total_point', result)
        setIsInfoButtonVisible(false)
        setLoader(false)
    }
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ perspective: 200 }, { rotateY: `${rotation.value}deg` }],
        };
    });

    const showChildren = () => {
        return (
            <TouchableOpacity onPress={() => { setCamVisible(true) }}>
                <View style={{ padding: 0 }}>
                    <Image source={{ uri: dataFromApi?.profile }}
                        style={{ height: 75, width: 75, borderRadius: 80 / 2, borderWidth: 0.5, borderColor: colors.GREEN_DARK_TRANSPARENT }} />
                </View>
            </TouchableOpacity>
        )
    }

    const date = new Date()
    var monthNum = date.getMonth();
    var monthName = moment.months(monthNum);

    const renderItem = ({ item, index }) => {
        return (
            <Card
                maxPoints={item?.max_points}
                points={item?.total_pont}
                date={item?.date}
                cardData={item?.child}
            />)
    }
    return (
        loader
            ?
            <Loader />
            :
            <View>
                <StatusBar
                    backgroundColor={colors.GREEN} />
                <HeaderForSubmissionScreens Title={strings.TotalPoints} />
                <View contentContainerstyle={styles.mainContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh} />
                    } >
                    {/* {<TouchableOpacity
                            onPress={() => { ShortToast('Feature will be available soon..', 'warning', '') }}
                            style={styles.redeemPointsButton}>
                            <Text style={{
                                fontFamily: 'Montserrat-Regular', color: 'white',
                                textAlign: 'center', fontSize: fontSizes.MED
                            }}>{strings.RedeemPoints}</Text>
                        </TouchableOpacity>} */}
                    <Modal
                        visible={camVisible}
                        transparent={true}
                    >
                        <View style={{
                            height: H,
                            width: W,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'

                        }}>
                            <View style={{
                                backgroundColor: colors.OFFWHITE,
                                borderRadius: 4,
                                height: H * 0.32,
                                width: W * 0.85,
                                justifyContent: "center",
                                elevation: 8
                            }}>
                                <Text style={{
                                    ...fontFamily.bold,
                                    top: -H * 0.06,
                                    left: W * 0.05,
                                    fontSize: fontSizes.XXL
                                }}>Choose</Text>
                                <View style={{
                                    flexDirection: "row",
                                    backgroundColor: colors.OFFWHITE,
                                    borderRadius: 4,
                                    justifyContent: "center",
                                }}>
                                    <TouchableOpacity onPress={() => { launchCam() }}>
                                        <View style={{
                                            alignItems: "center",
                                            marginHorizontal: W * 0.1,
                                            marginVertical: H * 0.01,
                                        }}>
                                            <AntDesign name="camera" size={50} color={"silver"} />
                                            <Text style={{
                                                ...fontFamily.bold,
                                                fontSize: fontSizes.MED
                                            }}>Camera</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { launchGallery() }}>
                                        <View style={{
                                            alignItems: "center",
                                            marginHorizontal: W * 0.1,
                                            marginVertical: H * 0.01,
                                        }}>
                                            <AntDesign name="picture" size={50} color={"silver"} />
                                            <Text style={{
                                                ...fontFamily.bold,
                                                fontSize: fontSizes.MED
                                            }}>Gallery</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => setCamVisible(false)}
                                >
                                    <Text style={{
                                        textAlign: "right",
                                        ...fontFamily.bold,
                                        color: "red",
                                        top: H * 0.055,
                                        left: -W * 0.06
                                    }}>CANCEL</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.detailsContainer}>
                        {/* Primary Container Profile Info */}
                        <View style={{ flexDirection: 'row', }} >
                            {/* Profile Pic + Name Container */}
                            <View style={styles.profilePicAndName}>
                                {/* Profile Pic and Name */}
                                <AnimatedCircularProgress
                                    size={90}
                                    width={6}
                                    fill={((Number.parseInt(dataFromApi?.total_point, 10) / Number.parseInt(dataFromApi?.status_point, 10)) * 100)}
                                    tintColor={colors.GREEN}
                                    backgroundColor="white"
                                    children={() => showChildren()} />
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontWeight: '500', fontSize: fontSizes.XL }}>{dataFromApi?.user_name}</Text>
                            </View>
                            {/* Points Info + Progress Bar Container */}
                            <View style={styles.pointsInfoContainer}>
                                {/* Points Info + Animation */}
                                <View style={styles.pointsInfoAndAnimation}>
                                    <Text>{strings.TotalPoints}</Text>
                                    <View style={styles.horizontalContainer}>
                                        <LottieView
                                            style={{
                                                height: 35,
                                                width: 35,
                                                //backgroundColor:'red'
                                            }}
                                            source={require('../../assets/animations/reward_points.json')}
                                            autoPlay loop />
                                        <Text style={styles.textPoints}>{dataFromApi?.total_point}</Text>
                                    </View>
                                </View>
                                {/* Progress Bar */}
                                <View>
                                    <ProgressBar
                                        style={styles.progressBar}
                                        color={colors.GREEN}
                                        progress={(Number.parseInt(dataFromApi?.total_point, 10) / Number.parseInt(dataFromApi?.status_point, 10)) || 0}
                                    />
                                </View>
                            </View>
                        </View>
                        {/* Primary Container Rewards Offer Status Info */}
                        <View style={styles.rewardsOfferStatusInfo}>
                            {/* Container Eligible for discount info */}
                            <View >
                                <Text style={styles.pointsInfo}>{dataFromApi?.current_user_status}</Text>
                                <Text style={styles.neededPointsInfo}>{dataFromApi?.next_user_status}</Text>
                            </View>
                            {/* Status Info and Estimated time to reach */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Image source={{ uri: dataFromApi?.status_image }}
                                        style={styles.statusImage}
                                    />
                                </View>
                                <View>
                                    <Text>
                                        <Text style={styles.rewardsFonts}>{dataFromApi?.reward_offer}%</Text>
                                        <Text style={[styles.rewardsFonts, { fontSize: fontSizes.SM }]}>{strings.Offer}</Text>
                                    </Text>
                                    <Text>{strings.Rewards}</Text>
                                </View>
                                <View style={styles.numberOfDays}>
                                    <Text style={styles.numberOfDaysText}>{Number.parseInt(dataFromApi?.reward_days, 10)}</Text>
                                    <Text style={styles.daysText}>{strings.Days}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Points Last Synced View */}
                    <View style={styles.lastSyncedContainer}>
                        <Text style={{
                            fontFamily: 'Montserrat-Regular',
                            fontSize: fontSizes.LAR,
                            color: 'black',
                        }}>{strings.PointslastsyncedonToday}, {(date.getHours()).toString().padStart(2, 0)}:{(date.getMinutes()).toString().padStart(2, 0)}</Text>
                        <TouchableOpacity onPress={() => { getTotalPoints() }}
                            style={{}}>
                            <Icon name='reload1' size={20} color='#676c73' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.secondaryMidContainer}>
                        {/* <Text style={{ fontFamily: 'Montserrat-Regular', color: 'black', fontSize: fontSizes.LAR }}>{monthName} {(date.getFullYear())}</Text> */}
                        {/*  <TouchableOpacity style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSizes.LAR, marginLeft: WIDTH * 0.4 }}>Monthly </Text>
                        <Icon name='right' size={15} color='#bcc1c6' />
                </TouchableOpacity>*/}
                    </View>
                    <View style={styles.cardList}>
                        <FlatList data={dataFromApi?.data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${index}`} />
                    </View>
                    {/* <Text style={{
                        ...fontFamily.bold,
                        alignSelf: "center",
                        fontSize: fontSizes.SM,
                        marginTop: H * 0.02,
                    }}> {myIcon2} {strings.totalpointstext}</Text> */}
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        width: WIDTH,
        backgroundColor: 'white',
    },
    displayActivity:
    {
        flexDirection: 'row',
        // paddingHorizontal: WIDTH * 0.05,
        // paddingVertical: WIDTH * 0.01
    },
    textActivity:
    {
        fontFamily: 'Montserrat-Regular',
        marginHorizontal: WIDTH * 0.04,
        fontSize: fontSizes.LAR,
        color: colors.FONT_BLACK
    },
    detailsContainer:
    {
        // //backgroundColor: '#eaedf2',
        // backgroundColor: colors.DARK_GRAY,
        // margin: 10,
        // //alignItems: 'center',
        // justifyContent: 'space-evenly',
        // paddingHorizontal: 15,
        // paddingVertical: 10,
        // borderRadius: 15,
        // //flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
    },
    secondaryMidContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: WIDTH * 0.03,
    },
    redeemPointsButton:
    {
        height: HEIGHT * 0.05,
        width: WIDTH * 0.3,
        backgroundColor: colors.GREEN,
        justifyContent: 'center',
        borderRadius: 8,
    },
    totalPoints:
    {
        flexDirection: 'row',
        // paddingHorizontal: WIDTH * 0.05,
        justifyContent: 'space-between',
        // marginHorizontal:WIDTH*0.03,
        backgroundColor: '#f3f7fa',
        // padding: HEIGHT * 0.01,
        width: WIDTH,
        marginTop: HEIGHT * 0.05
    },
    progressBar:
    {
        borderRadius: 8,
        height: 10,
        //width: W * 0.7,
        alignSelf: 'center'
    },
    pointsInfo:
    {
        fontSize: 12,
        //alignSelf: 'center',
        fontWeight: '600',
        marginBottom: 10,
    },
    neededPointsInfo:
    {
        fontSize: 12,
        marginBottom: 10,
        //alignSelf: 'center'
    },
    pointsInfoContainer:
    {
        alignSelf: 'stretch',
        flex: 1,
        padding: 15,
        //backgroundColor:'purple'
    },
    totalPointsEarned:
    {
        fontSize: 12,
        top: -20
    },
    pointsInfoAndAnimation:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profilePicAndName:
    {
        alignSelf: 'flex-start',
        alignItems: 'center',
        //backgroundColor:'green'
    },
    horizontalContainer:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textPoints:
    {
        fontWeight: Platform.OS == 'android' ? null : '700',
        fontFamily: 'Montserrat-Bold',
        fontSize: fontSizes.XXXL
    },
    rewardsOfferStatusInfo:
    {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        borderRadius: 8,
        elevation: 6,
        marginVertical: 4,
        padding: 15,
    },
    rewardsFonts:
    {
        color: colors.REWARDS_TEXT,
        fontSize: fontSizes.XXXL,
        fontWeight: Platform.OS == 'android' ? null : '700',
        fontFamily: 'Montserrat-Bold'
    },
    numberOfDays:
    {
        backgroundColor: colors.GREEN_TRANSPARENT,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        aspectRatio: 1,
    },
    numberOfDaysText:
    {
        color: colors.GREEN_DARK_TRANSPARENT,
        fontWeight: Platform.OS == 'android' ? null : '700',
        fontFamily: 'Montserrat-Bold',
        fontSize: fontSizes.XXXL
    },
    daysText:
    {

    },
    statusImage:
    {
        height: H * 0.09,
        aspectRatio: 1,
    },
    lastSyncedContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingVertical: 8,
        backgroundColor: '#fff'
    },
    cardList:
    {
        height: H * 0.38,
        //backgroundColor: colors.GREEN_TRANSPARENT,
        padding: 5,
        //margin: 5,
        marginBottom: 0,
        borderRadius: 8,
        //borderColor: colors.GREEN_DARK_TRANSPARENT,
        //borderWidth: 0.5,
    }
})
export default TotalPoints
