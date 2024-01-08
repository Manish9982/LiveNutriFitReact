import { Dimensions, StyleSheet, TouchableOpacity, View, Image, RefreshControl, StatusBar, FlatList, Modal, PermissionsAndroid } from 'react-native'
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
import { Text } from 'react-native-paper'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import DataContext from '../../context/DataContext'
import Loader from '../../assets/components/Loader'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { useIsFocused } from '@react-navigation/native'



//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const myIcon = <Image source={require('../../assets/icons/reward.jpg')}
    style={{ height: 20, width: 20, borderRadius: 10 }} />
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

    useEffect(() => {
        getTotalPoints()
        requestCameraPermission()
    }, [])

    useEffect(() => { getLanguge() }, [isFocused])

    //lng
    const getLanguge = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(lang)
        // setLoader(false)

    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getTotalPoints()
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const requestCameraPermission = async () => {
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
        //  getLanguge()
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
    const showChildren = () => {
        return (
            <TouchableOpacity onPress={() => { setCamVisible(true) }}>
                <View style={{ padding: 0 }}>
                    <Image source={{ uri: dataFromApi?.profile }}
                        style={{ height: 55, width: 55, borderRadius: 25 }} />
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


                    <View style={styles.detailsContainer}>
                        <View style={{ alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={65}
                                width={2}
                                fill={(dataFromApi?.data?.[0]?.total_pont / 21) * 100}
                                tintColor={colors.GREEN}
                                backgroundColor="white"
                                children={() => showChildren()} />
                            <Text style={{ fontFamily: 'Montserrat-Regular' }}>{dataFromApi?.user_name}</Text>
                        </View>
                        {myIcon}
                        <View>
                            <Text style={{
                                fontFamily: 'Montserrat-SemiBold',
                                color: 'black',
                                fontSize: fontSizes.XXL,
                                marginLeft: WIDTH * 0.07
                            }}>{dataFromApi?.total_point}</Text>
                            <Text style={{
                                fontFamily: 'Montserrat-Regular',
                                color: 'black', fontSize: fontSizes.LAR
                            }}>{strings.TotalPoints}</Text>
                        </View>
                        {/* {<TouchableOpacity
                            onPress={() => { ShortToast('Feature will be available soon..', 'warning', '') }}
                            style={styles.redeemPointsButton}>
                            <Text style={{
                                fontFamily: 'Montserrat-Regular', color: 'white',
                                textAlign: 'center', fontSize: fontSizes.MED
                            }}>{strings.RedeemPoints}</Text>
                        </TouchableOpacity>} */}


                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            fontFamily: 'Montserrat-Regular',
                            fontSize: fontSizes.LAR,
                            color: 'black',
                            marginLeft: WIDTH * 0.03,
                            marginVertical: HEIGHT * 0.03
                        }}>{strings.PointslastsyncedonToday}, {(date.getHours()).toString().padStart(2, 0)}:{(date.getMinutes()).toString().padStart(2, 0)}</Text>
                        <TouchableOpacity onPress={() => { getTotalPoints() }}
                            style={{ position: 'absolute', top: HEIGHT * 0.025, left: WIDTH * 0.88 }}>
                            <Icon name='reload1' size={20} color='#676c73' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.secondaryMidContainer}>
                        <Text style={{ fontFamily: 'Montserrat-Regular', color: 'black', fontSize: fontSizes.LAR }}>{monthName} {(date.getFullYear())}</Text>
                        {/*  <TouchableOpacity style={{ flexDirection: 'row' }}>

                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSizes.LAR, marginLeft: WIDTH * 0.4 }}>Monthly </Text>
                        <Icon name='right' size={15} color='#bcc1c6' />
                </TouchableOpacity>*/}
                    </View>
                    {/* <View style={styles.totalPoints}>
                    <View style={{ flexDirection: 'row', }}>
                        {myIcon}
                        <Text style={{ fontFamily: 'Montserrat-Regular', paddingLeft: WIDTH * 0.03, color: 'black' }}>{dataFromApi?.data?.[0]?.total_pont}</Text>
                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSizes.LAR, paddingTop: WIDTH * 0.014, paddingLeft: WIDTH * 0.01, color: "silver" }}>/21</Text>
                    </View>
                    <Text style={{ fontFamily: 'Montserrat-Regular', color: 'black', marginLeft: WIDTH * 0.4, fontSize: fontSizes.LAR }}>{dataFromApi?.data?.[0].date}</Text>
                    <Icon name='downcircleo' size={25} color='#dfe5eb' />
                </View>
                <View>
                    <View style={styles.displayActivity}>
                        <Icon name='check' size={25} color='#b2de72' />
                        <Text style={styles.textActivity}>Meal Plan</Text>
                    </View>
                    <View style={styles.displayActivity}>
                        <Icon name='check' size={25} color='#b2de72' />
                        <Text style={styles.textActivity}>Excercise</Text>
                    </View>
                    <View style={styles.displayActivity}>
                        <Icon name='check' size={25} color='#b2de72' />
                        <Text style={styles.textActivity}>Sleep</Text>
                    </View>
                    <View style={styles.displayActivity}>
                        <Icon name='check' size={25} color='#b2de72' />
                        <Text style={styles.textActivity}>Hydration</Text>
                    </View>
                    <View style={styles.displayActivity}>
                        <Icon name='check' size={25} color='#b2de72' />
                        <Text style={styles.textActivity}>Mood</Text>
                    </View>
                    <View style={styles.displayActivity}>
                        <Icon name='check' size={25} color='#b2de72' />
                        <Text style={styles.textActivity}>Fasting</Text>
                    </View>
                    <View style={styles.displayActivity}>
                        <Icon name='check' size={25} color='#b2de72' />
                        <Text style={styles.textActivity}>Monitoring</Text>
                    </View>
                </View>
                */}
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
                    <View style={{
                        height: H * 0.5,

                    }}>
                        <FlatList data={dataFromApi?.data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${index}`} />
                    </View>
                    <Text style={{
                        ...fontFamily.bold,
                        alignSelf: "center",
                        fontSize: fontSizes.SM,
                        marginTop: H * 0.02,
                    }}> {myIcon2} {strings.totalpointstext}</Text>
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
        paddingHorizontal: WIDTH * 0.05,
        paddingVertical: WIDTH * 0.01
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
        backgroundColor: '#eaedf2',
        width: WIDTH,
        height: HEIGHT * 0.2,
        marginTop: HEIGHT * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    secondaryMidContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: WIDTH * 0.03,
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
        paddingHorizontal: WIDTH * 0.05,
        justifyContent: 'space-between',
        // marginHorizontal:WIDTH*0.03,
        backgroundColor: '#f3f7fa',
        padding: HEIGHT * 0.01,
        width: WIDTH,
        marginTop: HEIGHT * 0.05
    }
})
export default TotalPoints
