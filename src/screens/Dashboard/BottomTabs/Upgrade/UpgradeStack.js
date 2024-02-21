import { StyleSheet, TouchableOpacity, View, Dimensions, Image, StatusBar, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { ActivityIndicator, Appbar, Button, Dialog, Divider, Portal, Text, TextInput } from 'react-native-paper'
import HeaderForUpgradeStack from './HeaderForUpgradeStack'
import DoubleTapBackButtonToCloseApp from '../../../../assets/components/DoubleTapBackButtonToCloseApp'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'
import { useIsFocused } from '@react-navigation/native'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import Loader from '../../../../assets/components/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocales } from '../../../../utils/LocalizationUtil'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const UpgradeStack = ({ navigation }) => {
    const isFocused = useIsFocused()


    const strings = useLocales()

    useEffect(() => {
        getDataFromApi()
        getLanguage()
    }, [isFocused])

    // useEffect(() => {
    //     getDataForUserProfile()
    // }, [])


    useEffect(() => {
        removeValue()
    }, [])

    const removeValue = async () => {
        try {
            await AsyncStorage.removeItem('upgradepopup')
        } catch (e) {
            // remove error
        }

        console.log('Done.')
    }


    //lng
    const getLanguage = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            
        } else {
            
        }


    }

    const [dataFromApi, setDataFromApi] = useState(null)
    const [loader, setLoader] = useState(false)
    const [visible, setVisible] = useState(false)
    const [code, setCode] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [userprofiledata, setUserProfiledata] = useState("")


    const toastUserType = async () => {
        const temp = await getDataFromLocalStorage("user_type")
        console.log("tem id= ", temp)
        if (JSON.parse(temp) == "1") {

            navigation.navigate("UpgradePlanOne")

        } else {


            Alert.alert("Alert", strings.AsyouareaPaidUseryoucannotupgradeplan)
        }
    }



    const getDataFromApi = async () => {
        // setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        const result = await GetApiData(`upgrate_plan?user_id=${JSON.parse(temp)}`)
        console.log("url == ", `upgrate_plan?user_id=${temp}`)
        setDataFromApi(result)
        setLoader(true)
    }


    const getDataForUserProfile = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("id", JSON.parse(temp));
        const result = await PostApiData('userprofile', formdata)
        setUserProfiledata(result)
        setLoader(false)
    }

    const submitCallRequest = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("mobile", userprofiledata?.data[0].mobile)
        console.log("Gauravvvvvv  ==", formdata)
        const result = await PostApiData('call_schedule_message', formdata)
        console.log(result)

        if (result.status == '200') {
            ShortToast(result.message, 'success', "")
        }
        else {
            ShortToast(result.message, "error", "")
        }
    }


    const hideDialog = () => setVisible(false);

    const submitUpgradeCode = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("user_code", code)
        const result = await PostApiData('update_usertype', formdata)
        console.log(result)
        if (result.status == '200') {
            ShortToast("Congratulations! You're An Elite User Now")
            storeDataInLocalStorage("userType", "paid") // 3
        }
        else {
            ShortToast(result.message, "error", "")
        }
    }


    const checkIcon = <Icon name='checkcircle' size={20} color='#4aaf4e' />

    const startIcon = <Icon name='star' size={15} color='orange' />

    return (
        loader ? <View style={styles.mainContainer}>
            <View>
                <StatusBar backgroundColor={colors.GREEN} />
                <Appbar.Header style={{
                    backgroundColor: colors.GREEN,
                    width: W
                }}>
                    {/* <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} /> */}
                    <Appbar.Content style={{
                        alignItems: "center",
                        //marginRight: W * 0.125
                    }} title={<Text style={{ color: "white", fontSize: fontSizes.XL, ...fontFamily.bold }}>{strings.UpgradePlan}</Text>} />
                </Appbar.Header>
            </View>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Text style={{
                        alignSelf: "center",
                        ...fontFamily.bold,
                        marginVertical: H * 0.04
                    }}>Enter Your Upgrade Code x:</Text>
                    <TextInput
                        value={code}
                        onChangeText={(t) => {
                            setCode(t)
                        }}
                        style={{
                            width: "95%",
                            alignSelf: "center",
                            backgroundColor: colors.OFFWHITE
                        }} />
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setCode("")
                            setVisible(false)
                        }}>Cancel</Button>
                        <Button onPress={() => submitUpgradeCode()}>{strings.Ok}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={{ marginVertical: HEIGHT * 0.02 }}>

                {/* <Text style={[styles.textConditions, { fontSize: fontSizes.MED, }]}>Choose Your Plan</Text> */}
                <Text style={[styles.textConditions, { fontSize: fontSizes.MED, }]}>{strings.ChooseYourPlan}</Text>
                {/* <Text style={[styles.textConditions,]}>By this upgrade, you will get all features</Text> */}
                <Text style={[styles.textConditions,]}>{strings.Bythisupgradeyouwillgetallfeatures}</Text>
                <View style={styles.conditionsContainer}>
                    {checkIcon}
                    {/* <Text style={styles.textConditions}>Unlock the Coaches</Text> */}
                    <Text style={styles.textConditions}>{strings.UnlocktheCoaches}</Text>
                </View>
                <View style={styles.conditionsContainer}>
                    {checkIcon}
                    {/* <Text style={styles.textConditions}>Unlock over 100+ medal and Exercise plans</Text> */}
                    <Text style={styles.textConditions}>{strings.Unlockover100mealandexerciseplans}</Text>
                </View>
                <View style={styles.conditionsContainer}>
                    {checkIcon}
                    {/* <Text style={styles.textConditions}>Monitor your health</Text> */}
                    <Text style={styles.textConditions}>{strings.Monitoryourhealth}</Text>
                </View>
                <View style={styles.conditionsContainer}>
                    {checkIcon}
                    {/* <Text style={styles.textConditions}>First Consultation free</Text> */}
                    <Text style={styles.textConditions}>{strings.FirstConsultationfree}</Text>
                </View>
                <View style={styles.conditionsContainer}>
                    {checkIcon}
                    {/* <Text style={styles.textConditions}>Unlimited chat with coach</Text> */}
                    <Text style={styles.textConditions}>{strings.Unlimitedchatwithcoach}</Text>
                </View>
                <View style={styles.conditionsContainer}>
                    {checkIcon}
                    {/* <Text style={styles.textConditions}>1 Consultation Calls per month</Text> */}
                    <Text style={styles.textConditions}>{strings.ConsultationCallspermonth}</Text>
                </View>
                <View style={styles.conditionsContainer}>
                    {checkIcon}


                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: fontSizes.MED,
                            color: 'black', marginLeft: H * 0.02,
                        }}>{strings.Redeem} {startIcon} {strings.pointstobookextraconsultation}</Text>

                        {/* Redeem {startIcon} points to book extra consultation or buy on LNF shop */}


                    </View>


                </View>


            </View>

            {/* <TouchableOpacity

                onPress={() => submitCallRequest()}>

                <Text style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: fontSizes.LAR,
                    color: 'black',
                    marginLeft: H * 0.02,
                    textAlign: 'center',
                    color: colors.GREEN,
                    marginTop: H * 0.03

                }}> {strings.callmsg}</Text>
            </TouchableOpacity> */}



            <View style={styles.buttonPackagesDisplayContainer}>

                <TouchableOpacity style={styles.buttonPackages} ///////// First Button

                    // onPress={() => { navigation.navigate("UpgradePlanOne") }}>  // modified to comment
                    onPress={() => { toastUserType() }}>



                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Image style={{ height: HEIGHT * 0.055, aspectRatio: 1, marginRight: WIDTH * 0.06 }}
                                source={{ uri: dataFromApi?.data[0].icon }} />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: WIDTH * 0.35, }}>
                            <Text style={[styles.textInPackageButtons, { fontFamily: 'Montserrat-SemiBold' }]}>{dataFromApi?.data[0].Plan_name}</Text>

                            {/* <Text
                            numberOfLines={2} 
                            
                            style={[styles.textInPackageButtons, { fontSize: fontSizes.SM, }]}>
                                {dataFromApi?.data[0].Sub_Heading}</Text> */}
                        </View>
                        <View style={{ marginLeft: WIDTH * 0.03 }}>
                            <Divider style={{ borderColor: 'silver', borderWidth: 0.1, width: 1, height: '100%' }} />
                        </View>
                        <View>
                            <Divider />
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: WIDTH * 0.1 }}>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.SM }]}>{dataFromApi?.data[0].duration}</Text>
                            <Text style={[styles.textInPackageButtons, {
                                fontSize: fontSizes.MED,
                                color: colors.GREEN,
                                fontFamily: 'Montserrat-SemiBold'
                            }]}>Rs. {dataFromApi?.data[0].Amount}</Text>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.MED, }]}>view more</Text>
                        </View>
                    </View>

                </TouchableOpacity>
                {/* <TouchableOpacity

                    style={styles.buttonPackages} /////////Second Button
                    onPress={() => { navigation.navigate("UpgradePlanTwo") }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', 
                        alignItems: 'flex-start' }}>
                            <Image style={{ height: HEIGHT * 0.055, aspectRatio: 1, marginRight: WIDTH * 0.06 }}
                                source={{ uri: dataFromApi?.data[1].icon }} />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: WIDTH * 0.35 }}>
                            <Text style={[styles.textInPackageButtons, { fontFamily: 'Montserrat-SemiBold' }]}>{dataFromApi?.data[1].Plan_name}</Text>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.SM, }]}>{dataFromApi?.data[1].Sub_Heading}</Text>
                        </View>
                        <View style={{ marginLeft: WIDTH * 0.03 }}>
                            <Divider style={{ borderColor: 'silver', borderWidth: 0.1, width: 1, height: '100%' }} />
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: WIDTH * 0.1 }}>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.SM }]}>{dataFromApi?.data[1].duration}</Text>
                            <Text style={[styles.textInPackageButtons, {
                                fontSize: fontSizes.MED,
                                color: colors.GREEN, fontFamily: 'Montserrat-SemiBold'
                            }]}>Rs. {dataFromApi?.data[1].Amount}</Text>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.MED, }]}>view more</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setVisible(true) }}
                    style={styles.buttonPackages}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Image style={{ height: HEIGHT * 0.055, aspectRatio: 1, marginRight: WIDTH * 0.06 }}
                                source={{ uri: dataFromApi?.data[2].icon }} />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: WIDTH * 0.35 }}>
                            <Text style={[styles.textInPackageButtons, { fontFamily: 'Montserrat-SemiBold' }]}>{dataFromApi?.data[2].Plan_name}</Text>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.SM, }]}>{dataFromApi?.data[2].Sub_Heading}</Text>
                        </View>
                        <View style={{ marginLeft: WIDTH * 0.03 }}>
                            <Divider style={{ borderColor: 'silver', borderWidth: 0.1, width: 1, height: '100%' }} />
                        </View>
                        <View>
                            <Divider />
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: WIDTH * 0.1 }}>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.SM }]}>{dataFromApi?.data[2].duration}</Text>
                            <Text style={[styles.textInPackageButtons, {
                                fontSize: fontSizes.MED,
                                color: colors.GREEN, fontFamily: 'Montserrat-SemiBold'
                            }]}>Rs. {dataFromApi?.data[2].Amount}</Text>
                            <Text style={[styles.textInPackageButtons, { fontSize: fontSizes.MED, }]}>view more</Text>
                        </View>
                    </View>
                </TouchableOpacity> */}
            </View>

        </View> :
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: HEIGHT, width: WIDTH
            }}>
                <ActivityIndicator size="large"
                    color={colors.GREEN} />
            </View>

    )
}
const styles = StyleSheet.create({
    appBar:
    {
        backgroundColor: colors.GREEN,
        width: W
    },
    mainContainer:
    {
        height: HEIGHT,
        width: WIDTH,

    },
    conditionsContainer:
    {
        flexDirection: 'row',
        marginHorizontal: WIDTH * 0.05,
        marginVertical: HEIGHT * 0.01
    },
    buttonPackages:
    {
        height: HEIGHT * 0.12,
        elevation: 1,
        width: '90%',
        justifyContent: 'center',
        borderRadius: 7,
        marginVertical: HEIGHT * 0.01,
        backgroundColor: 'white',
        padding: 15,

    },
    buttonPackagesDisplayContainer:
    {
        alignItems: "center", marginTop: H * 0.02
    },
    textInPackageButtons:
    {
        textAlign: 'left',
        fontFamily: 'Montserrat-Regular'

    },
    textConditions:
    {

        fontFamily: 'Montserrat-SemiBold',
        fontSize: fontSizes.MED,
        color: 'black',
        marginHorizontal: WIDTH * 0.04,
        marginVertical: HEIGHT * 0.004

    },
    headerContainer:
    {

    },
})

export default UpgradeStack
