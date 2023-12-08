import { NavigationHelpersContext } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { H, W } from '../../colorSchemes/ColorSchemes';
import { storeDataInLocalStorage } from '../../local storage/LocalStorage';
import RNRestart from 'react-native-restart'

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);

const WalkthroughClone = (props) => {
    useEffect(() => { props?.start() }, [])
    return (
        <View style={styles.container}>

            {<Image
                source={require('../../assets/icons/ImageDemo.jpg')}
                style={styles.profilePhoto}
            />}
            <CopilotStep text='Hey! This Screen keeps a record of "Power of 7" on a regular basis!' order={1} name="openApp">
                <WalkthroughableText style={styles.title}>

                </WalkthroughableText>
            </CopilotStep>
            <View style={styles.middleView}>
                <CopilotStep text="Choose From One of these Options According to your Progress today" order={2} name="secondText">
                    <WalkthroughableText style={styles.title2}>

                    </WalkthroughableText>
                </CopilotStep>

            </View>
            <View style={styles.row}>
                <CopilotStep text="Then Press the Button here to Track your Weekly Progress" order={3} name="thirdText">
                    <WalkthroughableText style={styles.title3}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.row}>
                <CopilotStep text="Keep a record whether you were able to follow your Meal Plan" order={4} name="thirText">
                    <WalkthroughableText style={styles.title4}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.row}>
                <CopilotStep text="This keeps a record of your workout routine" order={5} name="thiText">
                    <WalkthroughableText style={styles.title5}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.row}>
                <CopilotStep text="This keeps a record of your Sleeping Pattern" order={6} name="thText">
                    <WalkthroughableText style={styles.title6}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.row}>
                <CopilotStep text="This keeps a track of your Hydration." order={7} name="thirdTe">
                    <WalkthroughableText style={styles.title7}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.row}>
                <CopilotStep text="Keep a track of your Mood               " order={8} name="thirdTex">
                    <WalkthroughableText style={styles.title8}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.row}>
                <CopilotStep text="Keep a track of Fasting                " order={9} name="hirdText">
                    <WalkthroughableText style={styles.title9}>

                    </WalkthroughableText>
                </CopilotStep>
            </View>
            <View style={styles.row}>
                <CopilotStep text="Keep a track of your Monitoring             " order={10} name="hirdTex">
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

    },
    title2:
    {
        backgroundColor: "transparent",
        height: H * 0.075,
        width: H * 0.36,
        position: "absolute",
        top: -H * 0.65,
        right: - H * 0.15,
        borderRadius: 10
    },
    title3:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.06,
        width: H * 0.06,
        top: -H * 0.645,
        left: H * 0.151,
    },
    title4:
    {
        backgroundColor: "transparent",
        position: "absolute",
        height: H * 0.1,
        width: H * 0.44,
        top: -H * 0.8,
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

// export default copilot({
//     animated: true,
//     androidStatusBarVisible: false,

// })(WalkthroughClone);

export default WalkthroughClone