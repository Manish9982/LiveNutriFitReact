import { StatusBar, StyleSheet, View, Image, Alert, TouchableOpacity, Modal, } from 'react-native'
import React from 'react'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, validateEmail, W } from '../../colorSchemes/ColorSchemes'
import { Appbar, Divider, TextInput, ActivityIndicator, Text } from 'react-native-paper'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage'
import { useEffect } from 'react'
import { useState } from 'react'
import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import { useIsFocused } from '@react-navigation/native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const PlanDetailScreen = ({ navigation, route }) => {
    console.log("Gaurav========== ", route.params.Price)

    const isFocused = useIsFocused()

    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [coupanvisible, setCoupanVisible] = useState(false)
    const [mobile, setMobile] = useState("")
    const [coupontext, setCouponText] = useState("")
    const [email, setEmail] = useState("")
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState("")
    const [amount, setAmount] = useState(route?.params?.Price)
    const [amountpermonth, setAmountPerMonth] = useState(route?.params?.P_MONTH)
    const [logtype, setLogtype] = useState("")
    const [countryType, setCountryType] = useState("")



    useEffect(() => {
        getPLanDuration()
        console.log("duration= ", route?.params?.Price)
    }, [])


    const getPLanDuration = async () => {
        const PlanDuration = await getDataFromLocalStorage("PlanDuration")
        const country = await getDataFromLocalStorage("country")
        setCountryType(country)
        console.log("country+++++++++++++============= ", country)

    }


    useEffect(() => { getLanguage() }, [isFocused])

    //lng
    const getLanguage = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            strings.setLanguage(lang)
        } else {
            strings.setLanguage(lang)
        }

        setLoader(false)
    }


    const saveValue = async () => {
        setLoader(true)
        const temp = await getDataFromLocalStorage("mobile")

        const userID = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();

        if (mobile.includes("@")) {
            formdata.append("user_id", JSON.parse(userID));
            formdata.append("field", "email")
            formdata.append("value", mobile)

        } else {

            formdata.append("user_id", JSON.parse(userID));
            formdata.append("field", "phone")
            formdata.append("value", mobile)
        }

        console.log("value ==  ", formdata)

        const result = await PostApiData('updateuserpaydata', formdata)

        console.log("result==  ", result)

        if (result.status == '200') {

            navigation.navigate("PaymentWebview",
                { "Value": `${mobile}`, "Amount": `${amount}`, "UserID": `${JSON.parse(userID)}`, "PlanDuration": `${route?.params?.PlanDuration}` })

        } else {
            ShortToast(result.message, 'failure', '')
            // onhandlePress()
        }
        setLoader(false)
    }

    const getDataForUserProfile = async () => {
        setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("id", JSON.parse(temp));
        const result = await PostApiData('userprofile', formdata)
        console.log(result)

        if (result.status == "200") {

            if (result?.data[0].mobile == "") {
                setVisible(true)

            } else if (result?.data[0].email == "") {
                setVisible2(true)

            } else {
                setVisible(false)
                setVisible2(false)
                navigateONWEB()

            }
        }
        setLoader(false)
    }


    const onhandleCoupanPress = async () => {
        setCoupanVisible(false)
        setCouponText("")
        const userd = await getDataFromLocalStorage("user_id")
        const userIDD = JSON.parse(userd)

        if (coupontext == "") {
            Alert.alert("Field can not be empty!")
        } else {
            updateUserType()
        }

    }

    const setCoponAmount = async () => {
        setLoader(true)
        const PlanDuration = await getDataFromLocalStorage("PlanDuration")
        const userd = await getDataFromLocalStorage("user_id")

        if (PlanDuration == "3 Months") {
            var formdata = new FormData();
            formdata.append("amount", route.params.Price);
            formdata.append("coupon_name", coupontext);
            formdata.append("plan_type", 1);
            formdata.append("user_id", userd)

        } else if (PlanDuration == "6 Months") {
            var formdata = new FormData();
            formdata.append("amount", route.params.Price);
            formdata.append("coupon_name", coupontext);
            formdata.append("plan_type", 2);
            formdata.append("user_id", userd)

        } else {
            var formdata = new FormData();
            formdata.append("amount", route.params.Price);
            formdata.append("coupon_name", coupontext);
            formdata.append("plan_type", 3);
            formdata.append("user_id", userd)
        }

        const result = await PostApiData('couponamount', formdata)

        console.log("RESULT======= ", result)

        if (result.status == "200") {
            if (JSON.stringify(result.plan_amount) == "0") {
                storeDataInLocalStorage("paiduserStatus", "PaymentDone")
                Alert.alert('Alert', "Thanks for registering.Please answers the few more questions so that we can provide the best services to you.", [
                    { text: 'OK', onPress: () => { { navigation.navigate("PaidCustomQuestions", { "PlanDuration": `${route?.params?.PlanDuration}` }) } } },]);

            } else {
                setAmount(JSON.stringify(result?.plan_amount))
                setAmountPerMonth(JSON.stringify(result?.amount_per_month))
            }
        }
        setLoader(false)
    }


    const updateUserType = async () => {
        setLoader(true)
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("user_code", coupontext);
        const result = await PostApiData('update_usertype', formdata)
        console.log("reuest == ", formdata)
        if (result.status == "200") {
            setCoponAmount()
        } else {
            Alert.alert("Alert", result?.message)
        }
        setLoader(false)
    }


    const onhandlePress = async (logtypee) => {
        const userd = await getDataFromLocalStorage("user_id")
        const userIDD = JSON.parse(userd)

        console.log("=============", logtypee)

        if (logtypee == "M") {
            if (mobile.length != 10) {
                Alert.alert("Alert", "Enter valid mobile number!")
            } else {
                saveValue()
            }

        } else {
            if (!validateEmail(mobile)) {
                Alert.alert("Alert", "Enter valid email address!")
            } else {
                saveValue()
            }
        }
    }

    const navigateONWEB = async () => {
        const userd = await getDataFromLocalStorage("user_id")
        const userIDD = JSON.parse(userd)
        navigation.navigate("PaymentWebview",
            { "Value": `${mobile}`, "Amount": `${amount}`, "UserID": `${userIDD}`, "PlanDuration": `${route?.params?.PlanDuration}` })
    }

    const toastMobileEmail = async () => {
        // getDataForUserProfile()

        const temp = await getDataFromLocalStorage("mobile")
        const userd = await getDataFromLocalStorage("user_id")
        console.log("ID= ", userd)

        if (amount == "0") {
            navigation.navigate("PaidCustomQuestions", { "PlanDuration": `${route?.params?.PlanDuration}` })
        } else {
            getDataForUserProfile()

        }
    }
    const stripeButtonHandling = async () => {

        const temp = await getDataFromLocalStorage("mobile")
        const userd = await getDataFromLocalStorage("user_id")
        const userIDD = JSON.parse(userd)

        console.log("ID= ", userd)


        if (amount == "0") {
            navigation.navigate("PaidCustomQuestions", { "PlanDuration": `${route?.params?.PlanDuration}` })
        } else {
            navigation.navigate("StripePaymentWebview",
                { "Value": `${mobile}`, "Amount": `${amountpermonth}`, "UserID": `${userIDD}`, "PlanDuration": `${route?.params?.PlanDuration}`, "buttonValue": "Stripe" })

        }

    }
    const stripeFullButtonHandling = async () => {

        const temp = await getDataFromLocalStorage("mobile")
        const userd = await getDataFromLocalStorage("user_id")
        const userIDD = JSON.parse(userd)

        console.log("ID= ", userd)


        if (amount == "0") {
            navigation.navigate("PaidCustomQuestions", { "PlanDuration": `${route?.params?.PlanDuration}` })
        } else {
            navigation.navigate("StripeFullPaymentWebView",
                { "Value": `${mobile}`, "Amount": `${amount}`, "UserID": `${userIDD}`, "PlanDuration": `${route?.params?.PlanDuration}`, "buttonValue": "Stripe" })

        }

    }

    return (
        loader ? <View style={{
            height: H,
            width: W,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <ActivityIndicator size="large"
                color={colors.GREEN} />
        </View>
            :
            <View>
                <StatusBar backgroundColor={colors.GREEN} />
                <Appbar.Header style={{
                    backgroundColor: colors.GREEN,
                    width: W
                }}>
                    <Appbar.BackAction color={colors.GREEN}
                        style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />
                    <Appbar.Content style={{ alignItems: "center", marginRight: W * 0.125 }}
                        title={<Text style={{
                            color: "white",
                            fontSize: fontSizes.XL,
                            ...fontFamily.bold
                        }}>{strings.PaymentGateway}</Text>} />
                </Appbar.Header>
                <Modal
                    visible={visible}
                    transparent={true}>
                    <View style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        height: H,
                        width: W,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>

                        <View style={{
                            paddingVertical: H * 0.02,
                            width: W * 0.9,
                            backgroundColor: "white",
                            borderRadius: 8,
                        }}>

                            <Text style={{
                                alignSelf: 'center', marginBottom: 10,
                                fontFamily: "Montserrat-Medium",
                                fontSize: fontSizes.XL,
                                color: "black", alignSelf: 'center',
                                textAlign: 'center', padding: 5
                            }}>Enter mobile number for sending receipt for payment</Text>


                            {/* <Divider
                            style={{ width: W, borderColor: 'black', borderWidth: 0.02 ,marginTop:H*0.02,
                        }} /> */}


                            <TextInput
                                mode={"outlined"}
                                keyboardType='numeric'
                                maxLength={10}
                                underlineColor='transparent'
                                activeUnderlineColor={"gray"}
                                activeOutlineColor={"gray"}
                                outlineColor={"gray"}
                                placeholder='Enter mobile number'
                                value={mobile}

                                onChangeText={(t) => { setMobile(t) }}

                                style={{
                                    height: H * 0.05,
                                    width: W * 0.8,
                                    alignSelf: "center",
                                    borderRadius: 2,
                                    marginTop: H * 0.02,
                                    fontSize: fontSizes.XL,
                                    fontFamily: 'Montserrat-SemiBold',
                                    backgroundColor: 'white',
                                    // marginTop: H * 0.05,
                                    justifyContent: "center",
                                }}
                            />


                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginBottom: H * 0.02
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setVisible(false)
                                    }}>
                                    <Text style={{
                                        marginTop: H * 0.05,
                                        marginRight: W * 0.05,
                                        fontFamily: 'Montserrat-SemiBold',
                                        alignSelf: "flex-end",
                                        color: "green"
                                    }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity

                                    //onPress={()=>{navigation.navigate("PaymentWebview",{"Value":`${mobile}`})}}>

                                    onPress={() => { onhandlePress("M") }}>

                                    <Text style={{
                                        marginTop: H * 0.05,
                                        marginRight: W * 0.05,
                                        fontFamily: 'Montserrat-SemiBold',
                                        alignSelf: "flex-end",
                                        color: 'blue'
                                    }}>Okay</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>


                <Modal
                    visible={visible2}
                    transparent={true}>
                    <View style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        height: H,
                        width: W,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>


                        <View style={{
                            paddingVertical: H * 0.02,
                            //height: H * 0.4,
                            width: W * 0.9,
                            backgroundColor: "white",
                            borderRadius: 8,
                        }}>

                            <Text style={{
                                alignSelf: 'center', marginBottom: 10,
                                fontFamily: "Montserrat-Medium",
                                fontSize: fontSizes.XL,
                                color: "black", alignSelf: 'center',
                                textAlign: 'center', padding: 5
                            }}>Enter e-mail for sending receipt for payment</Text>


                            <TextInput
                                mode={"outlined"}
                                keyboardType='email-address'
                                //  maxLength={10}
                                underlineColor='transparent'
                                activeUnderlineColor={"gray"}
                                activeOutlineColor={"gray"}
                                outlineColor={"gray"}
                                placeholder='Enter email'
                                value={mobile}

                                onChangeText={(t) => { setMobile(t) }}

                                style={{
                                    height: H * 0.05,
                                    width: W * 0.8,
                                    alignSelf: "center",
                                    borderRadius: 2,
                                    marginTop: H * 0.02,
                                    fontSize: fontSizes.XL,
                                    fontFamily: 'Montserrat-SemiBold',
                                    backgroundColor: 'white',
                                    // marginTop: H * 0.05,
                                    justifyContent: "center",
                                }}
                            />


                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginBottom: H * 0.02
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setVisible2(false)
                                    }}>
                                    <Text style={{
                                        marginTop: H * 0.05,
                                        marginRight: W * 0.05, fontFamily: 'Montserrat-SemiBold',
                                        alignSelf: "flex-end", color: "green"
                                    }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity

                                    onPress={() => { onhandlePress("E") }}

                                >
                                    <Text style={{
                                        marginTop: H * 0.05,
                                        marginRight: W * 0.05,
                                        fontFamily: 'Montserrat-SemiBold',
                                        alignSelf: "flex-end",
                                        color: 'blue'
                                    }}>Okay</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>


                {/* coupan modal */}
                <Modal
                    visible={coupanvisible}
                    transparent={true}>
                    <View style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        height: H,
                        width: W,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>

                        <View style={{
                            paddingVertical: H * 0.02,
                            //height: H * 0.4,
                            width: W * 0.9,
                            backgroundColor: "white",
                            borderRadius: 8,
                        }}>

                            <Text style={{
                                alignSelf: 'center', marginBottom: 10,
                                fontFamily: "Montserrat-Medium",
                                fontSize: fontSizes.XL,
                                color: "black", alignSelf: 'center',
                                textAlign: 'center', padding: 5
                            }}>Enter Coupon Code</Text>


                            {/* <Divider
                            style={{ width: W, borderColor: 'black', borderWidth: 0.02 ,marginTop:H*0.02,
                        }} /> */}



                            <TextInput
                                mode={"outlined"}
                                //keyboardType='email-address'
                                //  maxLength={10}
                                underlineColor='transparent'
                                activeUnderlineColor={"gray"}
                                activeOutlineColor={"gray"}
                                outlineColor={"gray"}
                                placeholder='Enter Coupon Code'
                                value={coupontext}

                                onChangeText={(t) => { setCouponText(t) }}

                                style={{
                                    height: H * 0.05,
                                    width: W * 0.8,
                                    alignSelf: "center",
                                    borderRadius: 2,
                                    marginTop: H * 0.02,
                                    fontSize: fontSizes.XL,
                                    fontFamily: 'Montserrat-SemiBold',
                                    backgroundColor: 'white',
                                    // marginTop: H * 0.05,
                                    justifyContent: "center",
                                }}
                            />


                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginBottom: H * 0.02
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setCoupanVisible(false)
                                        setCouponText("")
                                    }}>
                                    <Text style={{
                                        marginTop: H * 0.05,
                                        marginRight: W * 0.05, fontFamily: 'Montserrat-SemiBold',
                                        alignSelf: "flex-end", color: "green"
                                    }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    // onPress={() => {
                                    //     //setVisible(false)
                                    // }}

                                    onPress={() => { onhandleCoupanPress() }} >
                                    <Text style={{
                                        marginTop: H * 0.05,
                                        marginRight: W * 0.05, fontFamily: 'Montserrat-SemiBold',
                                        alignSelf: "flex-end", color: 'blue'
                                    }}>Okay</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>




                <Text style={{
                    fontFamily: "Montserrat-Medium",
                    fontSize: fontSizes.greeting,
                    marginVertical: H * 0.05, marginTop: H * 0.1,
                    alignSelf: 'center', textAlign: 'center', color: 'black'
                }}>{route?.params?.PlanDuration}{`\n`}{strings.BasicSubscription}</Text>

                {/* <View style={{
                    flexDirection: 'row',
                    marginTop: H * 0.05, justifyContent: 'space-evenly'
                }}>

                    <Text style={{
                        fontFamily: "Montserrat-medium",
                        fontSize: fontSizes.XL, marginVertical: H * 0.05,
                        alignSelf: 'center', color: 'black'
                    }}>{strings.SubscriptionAmount} (Rs.)</Text>

                    <Text style={{
                        fontFamily: "Montserrat-medium",
                        fontSize: fontSizes.XL, marginVertical: H * 0.05,
                        alignSelf: 'center', color: 'black'
                    }}> {amount}</Text>

                </View> */}


                <TouchableOpacity
                    onPress={() => {
                        setCoupanVisible(true)
                    }}>
                    <Text style={{
                        ...fontFamily.bold,
                        fontSize: fontSizes.XL,
                        marginTop: H * 0.05,
                        alignSelf: 'center',
                        textAlign: 'center',
                        color: 'green'
                    }}>{strings.HaveACouponCode}</Text>
                </TouchableOpacity>



                {
                    countryType == "India" 
                    
                    ?

                        <>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: H * 0.2,
                                justifyContent: 'space-evenly'
                            }}>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                }}>For Monthly Installments (Rs.):- </Text>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                    alignSelf: 'center', color: 'black'
                                }}> {amountpermonth}</Text>

                            </View>

                            <TouchableOpacity

                                onPress={() => { stripeButtonHandling() }}

                                style={{
                                    flexDirection: 'row',
                                    borderColor: 'blue',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    backgroundColor: 'white',
                                    elevation: 5,
                                    padding: 10,
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: H * 0.03,
                                    marginTop: H * 0.01

                                }}>


                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.XL,
                                    // marginRight: W * 0.1,
                                    alignSelf: 'center',
                                    color: "blue",
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    marginLeft: W * 0.23
                                }}>{strings.BuyWith}</Text>

                                <Image
                                    source={require('../../assets/icons/stripe.png')}
                                    style={{
                                        height: H * 0.035,
                                        marginLeft: H * 0.01,
                                        width: H * 0.07,
                                        alignSelf: "center",
                                    }} />
                            </TouchableOpacity>



                            <View style={{
                                flexDirection: 'row',
                                marginTop: H * 0.05,
                                justifyContent: 'space-evenly'
                            }}>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                }}>For Full Payment (Rs.):- </Text>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                    alignSelf: 'center', color: 'black'
                                }}> {amount}</Text>

                            </View>

                            <TouchableOpacity
                                onPress={() => { toastMobileEmail() }}
                                style={{
                                    flexDirection: 'row',
                                    borderColor: 'green',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    backgroundColor: 'white',
                                    elevation: 5,
                                    padding: 10,
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: H * 0.03,
                                    marginTop: H * 0.01


                                }}>


                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.XL,
                                    // marginRight: W * 0.1,
                                    alignSelf: 'center',
                                    color: "#85bb65",
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    marginLeft: W * 0.23
                                }}>{strings.BuyWith}</Text>

                                <Image
                                    source={require('../../assets/icons/payulogo.png')}
                                    style={{
                                        height: H * 0.035,
                                        marginLeft: H * 0.01,
                                        width: H * 0.07,
                                        alignSelf: "center",
                                    }} />
                            </TouchableOpacity>

                        </>




                        :



                        <>


                            <View style={{
                                flexDirection: 'row',
                                marginTop: H * 0.2,
                                justifyContent: 'space-evenly', 
                            }}>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                }}>For Monthly Installments:- </Text>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                    alignSelf: 'center', color: 'black'
                                }}>$ {amountpermonth}</Text>

                            </View>

                            <TouchableOpacity

                                onPress={() => { stripeButtonHandling() }}

                                style={{
                                    flexDirection: 'row',
                                    borderColor: 'blue',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    backgroundColor: 'white',
                                    elevation: 5,
                                    padding: 10,
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: H * 0.03,
                                    marginTop: H * 0.01

                                }}>


                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.XL,
                                    // marginRight: W * 0.1,
                                    alignSelf: 'center',
                                    color: "blue",
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    marginLeft: W * 0.23
                                }}>{strings.BuyWith}</Text>

                                <Image
                                    source={require('../../assets/icons/stripe.png')}
                                    style={{
                                        height: H * 0.035,
                                        marginLeft: H * 0.01,
                                        width: H * 0.07,
                                        alignSelf: "center",
                                    }} />
                            </TouchableOpacity>





                            <View style={{
                                flexDirection: 'row',
                                marginTop: H * 0.05,
                                justifyContent: 'space-evenly'
                            }}>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                }}>For Full payments:- </Text>

                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.LAR,
                                    alignSelf: 'center', color: 'black'
                                }}>$ {amount}</Text>

                            </View>

                            <TouchableOpacity

                                onPress={() => { stripeFullButtonHandling() }}

                                style={{
                                    flexDirection: 'row',
                                    borderColor: 'blue',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    backgroundColor: 'white',
                                    elevation: 5,
                                    padding: 10,
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: H * 0.03,
                                    marginTop: H * 0.01

                                }}>


                                <Text style={{
                                    ...fontFamily.bold,
                                    fontSize: fontSizes.XL,
                                    // marginRight: W * 0.1,
                                    alignSelf: 'center',
                                    color: "blue",
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    marginLeft: W * 0.23
                                }}>{strings.BuyWith}</Text>

                                <Image
                                    source={require('../../assets/icons/stripe.png')}
                                    style={{
                                        height: H * 0.035,
                                        marginLeft: H * 0.01,
                                        width: H * 0.07,
                                        alignSelf: "center",
                                    }} />
                            </TouchableOpacity>



                        </>
                }








                {/* <View style={{
                    flexDirection: 'row',
                    marginTop: H * 0.08, justifyContent: 'space-evenly'
                }}>

                    <Text style={{
                        ...fontFamily.bold,
                        fontSize: fontSizes.LAR,
                    }}>For Full Payment (Rs.)-: </Text>

                    <Text style={{
                        ...fontFamily.bold,
                        fontSize: fontSizes.LAR,
                        alignSelf: 'center', color: 'black'
                    }}>{amount}</Text>

                </View>





                <TouchableOpacity

                    onPress={() => { toastMobileEmail() }}

                    style={{
                        flexDirection: 'row',
                        borderColor: 'green',
                        borderRadius: 5,
                        borderWidth: 1,
                        backgroundColor: 'white',
                        elevation: 5,
                        padding: 10,
                        textAlign: 'center',
                        alignItems: 'center',
                        marginHorizontal: H * 0.03,
                        marginTop: H * 0.01


                    }}>


                    <Text style={{
                        ...fontFamily.bold,
                        fontSize: fontSizes.XL,
                        // marginRight: W * 0.1,
                        alignSelf: 'center',
                        color: "#85bb65",
                        textAlign: 'center',
                        justifyContent: 'center',
                        marginLeft: W * 0.23
                    }}>{strings.BuyWith}</Text>

                    <Image
                        source={require('../../assets/icons/payulogo.png')}
                        style={{
                            height: H * 0.035,
                            marginLeft: H * 0.01,
                            width: H * 0.07,
                            alignSelf: "center",
                        }} />
                </TouchableOpacity>
 */}

















            </View>
    )
}

const styles = StyleSheet.create({})
export default PlanDetailScreen