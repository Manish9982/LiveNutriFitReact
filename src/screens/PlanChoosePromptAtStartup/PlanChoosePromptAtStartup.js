import { View, StyleSheet, Image, TouchableOpacity, Alert, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, fontSizes, H, W, fontFamily, ShortToast, PostApiData } from '../../colorSchemes/ColorSchemes'
import DataContext from '../../context/DataContext'
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage'
import RNRestart from 'react-native-restart'
import { months } from 'moment/moment'

import { useIsFocused } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import Loader from '../../assets/components/Loader'


//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});




export default function PlanChoosePromptAtStartup({ navigation }) {
    const isFocused = useIsFocused()
    // useEffect(() => { getLanguge() }, [isFocused])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])


    const [visible, setVisible] = useState(false)
    const [code, setCode] = useState("")
    const [showLoader, setShowLoader] = useState(false)

    const [duration, setDuration] = useState("3 months")
    useEffect(() => {
        getLanguge()
    }, [])




    //lng
    const getLanguge = async () => {
        setShowLoader(true)
        const lang = await getDataFromLocalStorage("lang")
        const userType = await getDataFromLocalStorage("user_type")
        strings.setLanguage(lang)

        if(JSON.parse(userType == "2")){
            storeDataInLocalStorage('stackValue', "3")

        }else{
            storeDataInLocalStorage('stackValue', "6")
        }

        setShowLoader(false)

    }


    //const first = useContext(DataContext)
    const nav = useNavigation()


    const getValues = async () => {
        const insulin = await getDataFromLocalStorage("insulin")
        const pregnant = await getDataFromLocalStorage("pregnant")
        const diabetes = await getDataFromLocalStorage("diabetes")

        const userType = await getDataFromLocalStorage("user_type")
        console.log("userType===== ", userType)

        if (JSON.parse(userType == "2")) {

            await storeDataInLocalStorage('stackValue', "3")
            RNRestart.Restart()


        } else if (JSON.parse(userType == "1")) {

            if (pregnant == "Yes") {
                Alert.alert('', strings.AsyouarePregnant, [
                    //{ text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "SKIP" }) } } },]);  //  go to paymnet screen

            } else if (insulin == "Yes" && diabetes == "Yes") {

                Alert.alert('', strings.Diabetes, [
                    //    { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen

                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "SKIP" }) } } },]);  //  go to paymnet screen
            } else if (insulin == "Yes") {
                Alert.alert('', strings.Insulin, [
                    //   { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "SKIP" }) } } },]);  //  go to paymnet screen
            } else {

                await storeDataInLocalStorage('stackValue', "3")
                RNRestart.Restart()

            }
            // navigation.navigate("UpgradePlanOne", { "comeFrom": "NOTSKIP"}) }



        } else {
            if (pregnant == "Yes") {
                Alert.alert('', strings, AsyouarePregnant, [
                    // { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "SKIP" }) } } },]);  //  go to paymnet screen

            } else if (insulin == "Yes" && diabetes == "Yes") {
                Alert.alert('', strings.Diabetes, [
                    //  { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "SKIP" }) } } },]);  //  go to paymnet screen

            } else if (insulin == "Yes") {
                Alert.alert('', strings.Insulin, [
                    //  { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "SKIP" }) } } },]);  //  go to paymnet screen

            } else {
                //navigation.navigate("UpgradePlanOne", { "comeFrom": "NOTSKIP"}) 


                storeDataInLocalStorage('stackValue', "3")
                RNRestart.Restart()

            }
        }


    }



    const getValuesExplore = async () => {
        const insulin = await getDataFromLocalStorage("insulin")
        const pregnant = await getDataFromLocalStorage("pregnant")
        const diabetes = await getDataFromLocalStorage("diabetes")
        const userType = await getDataFromLocalStorage("user_type")

        if (JSON.parse(userType == "2")) {
            await storeDataInLocalStorage('stackValue', "3")
            RNRestart.Restart()

        } else if (JSON.parse(userType == "1")) {
            storeDataInLocalStorage('stackValue', "6")
            if (pregnant == "Yes") {
                Alert.alert('Alert', strings.AsyouarePregnant, [
                    //  { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "EXPLOREMORE" }) } } },]);  //  go to paymnet screen

            } else if (insulin == "Yes" && diabetes == "Yes") {

                Alert.alert('Alert', strings.Diabetes, [
                    //   { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "EXPLOREMORE" }) } } },]);  //  go to paymnet screen

            } else if (insulin == "Yes") {
                Alert.alert('Alert', strings.Insulin, [
                    //  { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "EXPLOREMORE" }) } } },]);  //  go to paymnet screen

            } else {
                storeDataInLocalStorage('stackValue', "6")
                // RNRestart.Restart()
                navigation.navigate("UpgradePlanOne", { "comeFrom": "NOTEXPLOREMORE" });  //  go to paymnet screen

                // navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` })
            }


        } else {
            storeDataInLocalStorage('stackValue', "6")

            if (pregnant == "Yes") {
                Alert.alert('Alert', strings.AsyouarePregnant, [
                    //  { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "EXPLOREMORE" }) } } },]);  //  go to paymnet screen

            } else if (insulin == "Yes" && diabetes == "Yes") {

                Alert.alert('Alert', strings.Diabetes, [
                    //   { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "EXPLOREMORE" }) } } },]);  //  go to paymnet screen

            } else if (insulin == "Yes") {
                Alert.alert('Alert', strings.Insulin, [
                    // { text: 'OK', onPress: () => { { navigation.navigate("PlanDetailScreen", { "PlanDuration": `${duration}`, "Price": `${10500}` }) } } },]);  //  go to paymnet screen
                    { text: 'OK', onPress: () => { { navigation.navigate("UpgradePlanOne", { "comeFrom": "EXPLOREMORE" }) } } },]);  //  go to paymnet screen

            } else {

                navigation.navigate("UpgradePlanOne", { "comeFrom": "NOTEXPLOREMORE" });  //  go to paymnet screen

                storeDataInLocalStorage('stackValue', "6")
                //RNRestart.Restart()

            }
        }


    }


    const submitUpgradeCode = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("user_code", code)
        const result = await PostApiData('update_usertype', formdata)
        console.log(result)
        if (result.status == '200') {
            storeDataInLocalStorage('stackValue', "3")
            ShortToast("Congratulations! You're An Elite User Now")
            storeDataInLocalStorage("userType", "paid") // 3
            RNRestart.Restart()
        }
        else {
            ShortToast(result.message, "error", "")
        }
    }
    const hideDialog = () => {
        setVisible(false)
    }
    return (

        showLoader ?
        <Loader />
        
        :
        <View style={styles.mainContainer}>
            <Text style={[styles.absoluteText, { top: H * 0.33, zIndex: 1, }]}>{strings.SmartDiet}</Text>
            <Text style={[styles.absoluteText, {
                top: H * 0.37, zIndex: 1,
                fontSize: fontSizes.LAR
            }]}>{strings.Starts}</Text>
            <Text style={styles.text2}>{strings.RecommendedPlansforyou}</Text>
            <Text style={styles.text3}>{strings.Basedonyourfitnessgoals}</Text>
            <View style={styles.card}>
                <TouchableOpacity onPress={() => {
                    // storeDataInLocalStorage('stackValue', "3")
                    // RNRestart.Restart()
                    setVisible(true)

                    getValuesExplore()
                }}>
                    <Image source={require('../../assets/icons/plans-bg.jpg')}
                        style={styles.cardImage} />
                    <Text style={[styles.textPerks, {
                        marginVertical: H * 0.025,
                        fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.XXL
                    }]}>{strings.OurAI}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={require('../../assets/icons/list.png')}
                            style={styles.iconStyle} />
                        <Text style={styles.textPerks}>{strings.CustomizableDietPlan}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={require('../../assets/icons/coach2.png')}
                            style={styles.iconStyle} />
                        <Text style={styles.textPerks}>{strings.CustomizableReminders}</Text></View>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={require('../../assets/icons/diet2.png')}
                            style={styles.iconStyle} />
                        <Text style={styles.textPerks}>{strings.YourCoachAssistantNutritionist}</Text></View>
                    <LinearGradient end={{ x: 0, y: 0 }}
                        start={{ x: 1, y: 0 }}
                        colors={[colors.GREEN, colors.GREEN3]}
                        style={styles.exploreButton}>
                        <View style={{}}>
                            <Text style={styles.textExplore}>{strings.ExploreSmart}</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
                <View>
                </View>
            </View >
            <Portal>
                {/* <Dialog visible={visible} onDismiss={hideDialog}>
                    <Text style={{
                        alignSelf: "center",
                        fontFamily: fontFamily.bold,
                        marginVertical: H * 0.04
                    }}>Enter Your Upgrade Code Here:</Text>
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
                        <Button onPress={() => submitUpgradeCode()}>Ok</Button>
                    </Dialog.Actions>
                </Dialog> */}
            </Portal>


            <TouchableOpacity

                onPress={() => {
                    // navigation.replace("Walkthrough")

                    getValues()

                    // storeDataInLocalStorage('stackValue', "3")
                    // RNRestart.Restart()
                }}>

                <Text style={{
                    marginRight: W * 0.07,
                    marginTop: H * 0.05,
                    alignSelf: "flex-end",
                    color: colors.FONT_BLACK,
                    fontFamily: fontFamily.bold
                }}>{strings.Skipfornow} {'>>'}</Text>

            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        height: H,
        width: W,
    },
    card:
    {
        // height: H * 0.4,
        width: W * 0.85,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 2,
        alignSelf: 'center',
        // alignItems: 'center',
    },
    cardImage:
    {
        height: H * 0.2,
        width: W * 0.85,
        opacity: 0.8,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,

        //marginVertical: H * 0.01,
    },
    exploreButton:
    {
        height: H * 0.08,
        backgroundColor: colors.GREEN,
        width: W * 0.85,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginTop: H * 0.05,
        justifyContent: 'center',
    },
    absoluteText:
    {
        position: "absolute",
        color: "white",
        fontSize: fontSizes.XXXL,
        left: W * 0.12,
        textShadowColor: "black",
        textShadowRadius: 10,
        fontFamily: "Montserrat-SemiBold"
    },
    textExplore:
    {
        color: "white",
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
        fontSize: fontSizes.XL
    },
    textPerks:
    {
        color: colors.FONT_BLACK,
        // backgroundColor: 'red',
        textAlign: 'left',
        marginLeft: W * 0.04,
        marginVertical: H * 0.01,
        fontSize: fontSizes.LAR
    },
    iconStyle:
    {
        height: H * 0.025,
        width: H * 0.025,
        marginLeft: W * 0.04,
        marginTop: H * 0.01,
    },
    text2:
    {
        fontFamily: "Montserrat-SemiBold",
        fontSize: fontSizes.XXXL,
        color: "black",
        marginTop: H * 0.1,
        marginLeft: W * 0.08,
    },
    text3:
    {
        fontSize: fontSizes.XXL,
        color: "black",
        marginTop: H * 0.02,
        marginLeft: W * 0.08,
        marginBottom: H * 0.04
    },
})