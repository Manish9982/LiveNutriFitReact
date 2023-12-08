import { NavigationHelpersContext, useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontSizes, H, W } from '../../colorSchemes/ColorSchemes';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage';
import RNRestart from 'react-native-restart'
import DataContext from '../../context/DataContext';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { useState } from 'react';


import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});



const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);

const Walkthrough = (props) => {

    const isFocused = useIsFocused()
    const [loader, setLoader] = useState(false)


    const { NisInfoButtonVisible } = React.useContext(DataContext)
    const [isInfoButtonVisible, setIsInfoButtonVisible] = NisInfoButtonVisible

    useEffect(() => {
        props?.start()
        setIsInfoButtonVisible(false)
        // getLanguge()
    }, [])

    useEffect(() => {
        getLanguge()
    }, [isFocused])


    //lng
    const getLanguge = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")

        if (lang == "en") {
            strings.setLanguage(lang)
        } else {
            strings.setLanguage(lang)

        }
        setLoader(false)
    }



    useEffect(() => {
        props.copilotEvents.on("stop", () => {
            props.navigation.goBack()
        });

        return () => {
            props.copilotEvents.off("stop");
        }
    }, [])



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


            <View style={styles.container}>
                {<Image
                    source={require('../../assets/icons/ImageDemo2.jpg')}
                    style={styles.profilePhoto}
                />}
                <CopilotStep text={strings.msg1} order={1} name="openApp">
                    <WalkthroughableText style={styles.title}>

                    </WalkthroughableText>
                </CopilotStep>
                <View style={styles.middleView}>
                    <CopilotStep text={strings.msg2} order={2} name="secondText">
                        <WalkthroughableText style={styles.title2}>

                        </WalkthroughableText>
                    </CopilotStep>

                </View>
                <View style={styles.row}>
                    <CopilotStep text={strings.msg3} order={3} name="thirdText">
                        <WalkthroughableText style={styles.title3}>

                        </WalkthroughableText>
                    </CopilotStep>
                </View>
                <View style={styles.row}>
                    {/* <CopilotStep text={<Text>{"Plan ahead and keep track of what and when you're eating.\n\n"}You can go to Plans {"->"} Meal Plan and then tap on "<Image source={require('../../assets/icons/switch.png')} style={{ height: 15, width: 15 }} />" icon to replace the {"meal\n\n"}Loved your meal? Let us know by clicking on "<AntDesign name="like1" size={fontSizes.XL} color={"grey"} />" and we will repeat that meal for a week.</Text>} order={4} name="thirText"> */}
                    <CopilotStep text={<Text style={{colors:"black"}}>{strings.mealmsg1}{"\n\n"}{strings.mealmsg2} {"->"} {strings.mealmsg3}  <Image source={require('../../assets/icons/shuffel.png')} style={{ height: 15, width: 15 , tintColor:"green"}} /> {strings.mealmsg4} {"\n\n"}{strings.mealmsg5}  <AntDesign name="sync" size={fontSizes.XL} color={"green"} />  {strings.mealmsg6}</Text>} order={4} name="thirText">
                        <WalkthroughableText style={styles.title4}>

                        </WalkthroughableText>
                    </CopilotStep>
                </View>
                <View style={styles.row}>

                    <CopilotStep text={<Text>{strings.excercisemsg1}{"\n\n"}{strings.excercisemsg2} {"->"} {strings.excercisemsg3}  <Image source={require('../../assets/icons/shuffel.png')} style={{ height: 15, width: 15,tintColor:"green" }} />  {strings.excercisemsg4} </Text>} order={5} name="thiText">
                        <WalkthroughableText style={styles.title5}>

                        </WalkthroughableText>
                    </CopilotStep>
                </View>
                <View style={styles.row}>
                    <CopilotStep text={strings.sleep} order={6} name="thText">
                        <WalkthroughableText style={styles.title6}>

                        </WalkthroughableText>
                    </CopilotStep>
                </View>
                <View style={styles.row}>
                    <CopilotStep text={strings.hydration} order={7} name="thirdTe">
                        <WalkthroughableText style={styles.title7}>

                        </WalkthroughableText>
                    </CopilotStep>
                </View>
                <View style={styles.row}>
                    <CopilotStep text={strings.fasting} order={8} name="thirdTex">
                        <WalkthroughableText style={styles.title8}>

                        </WalkthroughableText>
                    </CopilotStep>
                </View>
                <View style={styles.row}>
                    <CopilotStep text={strings.Mood} order={9} name="hirdText">
                        <WalkthroughableText style={styles.title9}>
                        </WalkthroughableText>
                    </CopilotStep>
                </View>
                <View style={styles.row}>
                    <CopilotStep text={strings.Observing} order={10} name="hirdTex">
                        <WalkthroughableText style={styles.title10}>
                        </WalkthroughableText>
                    </CopilotStep>
                </View>
            </View>
    )
};

const styles = StyleSheet.create({
    container:
    {
        height: H,
        width: W,
        alignItems: "center",
        backgroundColor: "transparent",
        paddingTop: H * 0.05
    },
    profilePhoto:
    {
        height: H / 1.2,
        width: H / 2.29,
        position: "absolute",
        zIndex: 0,
        borderRadius: 10,
        marginTop: H * 0.02,

    },
    title:
    {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: H / 1.25,
        width: H / 2.29,
        marginTop: H * 0.025,
        colors:"black"

    },
    title2:
    {
        backgroundColor: "transparent",
        height: H * 0.075,
        width: H * 0.36,
        position: "absolute",
        top: -H * 0.77,
        right: - H * 0.15,
        borderRadius: 10,
        colors:"black"

    },
    title3:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.06,
        width: H * 0.06,
        top: -H * 0.765,
        left: H * 0.151,
        color:"black"

    },
    title4:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.1,
        width: H * 0.44,
        top: -H * 0.8,
        left: - H * 0.22,
        color:"black"

    },
    title5:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.1,
        width: H * 0.44,
        top: -H * 0.68,
        left: - H * 0.22,
        color:"black"

    },
    title6:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.57,
        left: - H * 0.22,
        color:"black"

    },
    title7:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.45,
        left: - H * 0.22,
        color:"black"

    },
    title8:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.335,
        left: - H * 0.22,
    },
    title9:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.22,
        left: - H * 0.22,
        color:"black"

    },
    title10:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.1,
        left: - H * 0.22,
        color:"black"

    },
})


// export default copilot({
//     animated: true,
//     androidStatusBarVisible: false,
// })(Walkthrough);

export default Walkthrough