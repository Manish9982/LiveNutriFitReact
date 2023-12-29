import React from 'react';
import { Alert, SafeAreaView, StatusBar } from 'react-native'
import { Appbar, Text, TextInput } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { colors, fontSizes, H, W, fontFamily } from '../../colorSchemes/ColorSchemes';

import { useEffect } from 'react';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage';

import base64 from 'react-native-base64'
import { useState } from 'react';


const PaymentWebview = ({ navigation, route }) => {

    const [userId, setUserId] = useState("")

    useEffect(() => {
        toastMobileEmail()
    }, [])

    useEffect(() => {
        getPLanDuration()
        console.log("duration= ", route?.params?.PlanDuration)
        console.log("buttonValue= ", route?.params?.buttonValue)
    }, [])


    const getPLanDuration = async () => {
        const PlanDuration = await getDataFromLocalStorage("PlanDuration")
    }

    const toastMobileEmail = async () => {
        const userd = await getDataFromLocalStorage("user_id")
        setUserId(userd)
        encodeBase64(userd)
        AmountencodeBase64(route.params.Amount)

    }



    const encodeBase64 = (input) => {
        base64.encode(input);
        console.log("IDBASE= ", base64.encode(input))
    }


    const AmountencodeBase64 = (Amount) => {
        base64.encode(Amount);
        console.log("AMOUNTBASE= ", base64.encode(Amount))
    }


    return (
        <SafeAreaView style={{
            height: H,
            width: W,
        }}>
            <StatusBar backgroundColor={colors.GREEN} />
            <Appbar.Header style={{
                backgroundColor: colors.GREEN,
                width: W
            }}>
                <Appbar.BackAction color={colors.GREEN}
                    style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />


                <Appbar.Content style={{
                    alignItems: "center",
                    marginRight: W * 0.125
                }}
                    title={<Text style={{
                        color: "white",
                        fontSize: fontSizes.XL,
                        ...fontFamily.bold
                    }}>PayU Payment </Text>} />
            </Appbar.Header>


            <WebView
                startInLoadingState={true}

                onNavigationStateChange={(info) => {
                    if (info?.url?.includes(`${Constants.BASE_URL}fail`)) {

                        navigation.navigate("BottomTabs")

                    } else if (info?.url?.includes(`${Constants.BASE_URL}success`)) {

                        storeDataInLocalStorage("paiduserStatus", "PaymentDone")

                        Alert.alert('Payment successfull', 'Your payment has been done sucessfully , please answer some questions to become paid user!', [

                            { text: 'OKAY', onPress: () => { { navigation.navigate("PaidCustomQuestions", { "PlanDuration": `${route?.params?.PlanDuration}` }) } } },]);


                    } else {

                    }
                    console.log("PAyURL == ", info)
                }}


                source={{ uri: `${Constants.BASE_URL}user-payuser/${base64.encode(route.params.UserID)}/${base64.encode(route.params.Amount)}` }}
            />


        </SafeAreaView>
    );
}

export default PaymentWebview