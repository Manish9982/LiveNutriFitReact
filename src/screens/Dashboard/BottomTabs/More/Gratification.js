import { StyleSheet, View, FlatList, TouchableOpacity, StatusBar, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Divider, Text, TextInput } from 'react-native-paper'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'

import { useIsFocused } from '@react-navigation/native';


const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const Gratification = ({ navigation }) => {
    const isFocused = useIsFocused()

    useEffect(() => { getUserTasks() }, [])

    useEffect(() => { getLanguge() }, [isFocused])


    const getLanguge = async () => {
        setLoader(true)
        const lang = await getDataFromLocalStorage("lang")
        strings.setLanguage(lang)
        setLoader(false)

    }

    const [data, setData] = useState(null)
    const [visible, setVisible] = useState(false)
    const [text, setText] = useState("")
    const [loader, setLoader] = useState(true)

    const getUserTasks = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp))
        const result = await PostApiData('get_user_mood', formdata)
        console.log(result)
        if (result.status == 200) {
            setData(result)
            setLoader(false)
        }
        else {
            ShortToast(result.message, 'warning', '')
        }
    }

    const addGoal = async () => {
        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("user_id", JSON.parse(temp))
        formdata.append("text", text)
        const result = await PostApiData('add_user_mood', formdata)
        console.log(result)
        if (result.status == 200) {
            getUserTasks()
            setText("")
        }
    }

    const renderItem = ({ item, index }) => {
        const throwColor = () => {
            if (index == '0') {
                return '#4bb1f8'
            }
            else if (index == '1') {
                return '#53db89'
            }
            else if (index == '2') {
                return '#f98a4b'
            }
            else if (index == '3') {
                return '#ff5e5e'
            }
            else if (index == '4') {
                return '#787878'
            }
        }

        return (
            <View style={{
                borderRadius: 8,
                borderWidth: 1.1,
                borderColor: "white",
                width: W * 0.95,
                alignSelf: "center",
                marginTop: H * 0.02,
                backgroundColor: throwColor(),
                elevation: 2,
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: W * 0.04,
                    alignItems: "center",
                    marginTop: H * 0.03,
                }}>
                    <Text style={styles.text2}>{item?.title}</Text>
                    <Text style={{
                        color: "white",
                        top: H * 0.02,
                        fontSize: fontSizes.SM
                    }}></Text>
                </View>
                <Divider style={{
                    marginTop: H * 0.02,
                }} />
            </View >
        )
    }

    return (
        <View style={{}}>

            <StatusBar backgroundColor={colors.GREEN} />
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />
                <Appbar.Content style={{ alignItems: "center", marginRight: W * 0.125 }}
                    title={<Text style={{ color: "white", fontSize: fontSizes.XL, ...fontFamily.bold }}>{strings.Gratification}</Text>} />
            </Appbar.Header>

            <View style={{
                height: H,
                width: W,
                // backgroundColor: colors.ORANGE,
                paddingBottom: H * 0.1
            }}>
                <View style={{
                    width: W * 0.95,
                    alignSelf: "center",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "black",
                    marginTop: H * 0.05,
                    paddingVertical: H * 0.02,
                }}>
                    <Text style={styles.text1}>{strings.Gratefull}</Text>
                </View>
                <View style={{
                    height: H * 0.6,
                }}>
                    <FlatList
                        data={data?.data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        borderWidth: 3,
                        borderColor: colors.GREEN,
                        width: W * 0.4,
                        height: H * 0.08,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center"
                    }}
                    onPress={() => { setVisible(true) }}>
                    <Text style={styles.addText}><AntDesign name="pluscircleo" color={colors.GREEN} size={fontSizes.XXL} />  {strings.Add}</Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={visible}>
                    <View style={{
                        height: H,
                        width: W,
                        backgroundColor: "rgba(0,0,0,0.2)"
                    }}>
                        <View style={{
                            height: H * 0.5,
                            backgroundColor: "white",
                            width: W * 0.9,
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            marginTop: H * 0.25,
                            borderRadius: 10,
                        }}>

                            <Text style={{
                                ...fontFamily.bold
                            }}>{strings.EnterGratification}:</Text>
                            <TextInput
                                placeholder={strings.EnterGratification}
                                value={text}
                                onChangeText={(t) => { setText(t) }}
                                activeUnderlineColor={colors.GREEN}
                                underlineColor="transparent"
                                maxLength={25}
                                style={{
                                    height: H * 0.1,
                                    backgroundColor: colors.OFFWHITE,
                                    width: W * 0.82,
                                    alignSelf: "center",
                                    marginTop: H * 0.05,
                                    fontSize: fontSizes.MED,
                                    borderRadius: 10,
                                    fontSize: fontSizes.LAR

                                }} />
                            <View style={{ flexDirection: "row", width: W, justifyContent: "space-evenly", marginTop: H * 0.05, }}>
                                <TouchableOpacity style={styles.button}
                                    onPress={() => {
                                        setVisible(false)
                                        addGoal()
                                    }}>
                                    <Text style={{ color: "white" }}>{strings.Submit}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, { backgroundColor: colors.OFFWHITE }]}
                                    onPress={() => { setVisible(false) }}>
                                    <Text>{strings.Cancel}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>
                {/*visible ?
                    <>
                        <TextInput
                            placeholder={"Enter something that you're Grateful for"}
                            value={text}
                            onChangeText={(t) => { setText(t) }}
                            activeUnderlineColor={colors.GREEN}
                            style={{
                                fontSize: fontSizes.MED,
                                height: H * 0.08,
                                backgroundColor: "white",
                                width: W * 0.95,
                                alignSelf: "center",
                                marginTop: H * 0.05,

                            }} />
                        <View style={{ flexDirection: "row", width: W, justifyContent: "space-evenly", marginTop: H * 0.05, }}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => {
                                    setVisible(false)
                                    addGoal()
                                }}>
                                <Text style={{ color: "white" }}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { backgroundColor: colors.OFFWHITE }]}
                                onPress={() => { setVisible(false) }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    <>
                    </>
                            */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    appBar:
    {
        backgroundColor: colors.GREEN,
        width: W
    },
    button:
    {
        paddingVertical: H * 0.015,
        backgroundColor: colors.GREEN,
        paddingHorizontal: W * 0.02,
        borderRadius: 8,
    },
    text1:
    {
        //color: "white",
        //...fontFamily.bold,
        alignSelf: "center",
        //marginTop: H * 0.1,
        // marginBottom: H * 0.04,
        fontSize: fontSizes.XXXL,
    },
    text2:
    {
        ...fontFamily.bold,
        alignSelf: "center",
        // marginTop: H * 0.02,
        fontSize: fontSizes.XL,
        color: "white"
    },
    addText:

    {
        ...fontFamily.bold,
        alignSelf: "center",
        // marginTop: H * 0.08,
        fontSize: fontSizes.XL,
        color: colors.GREEN
    }

})
export default Gratification
