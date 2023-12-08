import { NavigationHelpersContext, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fontSizes, H, W } from '../../colorSchemes/ColorSchemes';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../local storage/LocalStorage';
import RNRestart from 'react-native-restart'

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import LocalizedStrings from 'react-native-localization';
import hindi from '../../hi'
import english from '../../en'
import Loader from '../../assets/components/Loader';

//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);

const WalkthroughMeal = (props) => {
    const [loader, setLoader] = useState(true)

    const isFocused = useIsFocused()
    useEffect(() => { getLanguge() }, [isFocused])
    useEffect(() => { props?.start() }, [])

    useEffect(() => {
        props.copilotEvents.on("stop", () => {
            props.navigation.goBack()
        });

        //  


        return () => {
            props.copilotEvents.off("stop");
        }
    }, [])

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


    return (
        

        loader
      ?
      <Loader />
      :
        <View style={styles.container}>


                

            {<Image
                source={require('../../assets/icons/ImageDemo2.jpg')}
                style={styles.profilePhoto}
            />}

            <View style={styles.row}>
                <CopilotStep text={strings.mealmsg1} order={1} name="thirText">
                    <WalkthroughableText style={styles.title4}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.middleView}>
                {/* <CopilotStep text={<Text>{"Choose from one of these options according to your progress today\n\n"}{strings.mealmsg2} {"->"} {strings.mealmsg3} "<Image source={require('../../assets/icons/switch.png')} style={{ height: 15, width: 15 }} />"{strings.mealmsg4} {"meal\n\n"}Loved your meal? Let us know by clicking on "<AntDesign name="like1" size={fontSizes.XL} color={"grey"} />" and we will repeat that meal for a week.</Text>} order={2} name="secondText">
                    <WalkthroughableText style={styles.title2}> */}

                <CopilotStep text={strings.msg2} order={2} name="secondText">
                    <WalkthroughableText style={styles.title2}>

                    </WalkthroughableText>
                </CopilotStep>

            </View>
            <View style={styles.row}>
                {/* <CopilotStep text="Then Press the Button here to Track your Weekly Progress" order={3} name="thirdText">
                    <WalkthroughableText style={styles.title3}> */}

                <CopilotStep text={strings.msg3} order={3} name="thirdText">
                    <WalkthroughableText style={styles.title3}>

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
        backgroundColor: "white",
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
        color:"black"


    },
    title2:
    {
        backgroundColor: "transparent",
        height: H * 0.075,
        width: H * 0.36,
        position: "absolute",
        top: H * 0.05,
        right: - H * 0.15,
        borderRadius: 10,
        color:"black"
    },
    title3:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.06,
        width: H * 0.06,
        top: H * 0.06,
        left: H * 0.151,
        color:"black"

    },
    title4:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.1,
        width: H * 0.44,
        top: H * 0.02,
        left: - H * 0.22,
    },
    title5:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.1,
        width: H * 0.44,
        top: -H * 0.68,
        left: - H * 0.22,
    },
    title6:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.57,
        left: - H * 0.22,
    },
    title7:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.45,
        left: - H * 0.22,
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
    },
    title10:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.11,
        width: H * 0.44,
        top: -H * 0.1,
        left: - H * 0.22,
    },
})

export default WalkthroughMeal
// export default copilot({
//     animated: true,
//     androidStatusBarVisible: false,

// })(WalkthroughMeal);