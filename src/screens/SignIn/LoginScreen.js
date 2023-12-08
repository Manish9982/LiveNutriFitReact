import { StyleSheet, TouchableOpacity, View, Dimensions, Modal, ImageBackground, StatusBar, } from 'react-native'
import { TextInput, Text, configureFonts, DefaultTheme, Provider as PaperProvider, ActivityIndicator, Divider } from 'react-native-paper';
import { fontSizes, colors, H, W, ShortToast, fontFamily } from '../../colorSchemes/ColorSchemes'
import React, { useState, useContext, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';






const LoginScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    useEffect(() => { getLanguge() }, [isFocused])
    
    const [email, setEmail] = useState("")



    return (


        <View style={{
            width: '100%',
            padding: 15,
            height: '100%',
            alignItems: 'center',
        }}>




            <ImageBackground source={require('../../assets/icons/pexels-lorilee-e-1309753.jpg')}
                style={{ height: H, width: W, opacity: 0.12, }} />





            <View style={{
                height: H,
                width: W,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute"
            }}>




                <View style={{
                    width: W * 0.95,
                    backgroundColor: "white",
                    borderRadius: 5,
                    elevation: 10
                }}>



                    <Text style={{
                        fontSize: fontSizes.XXL,
                        fontFamily: fontFamily.bold,
                        alignSelf: 'center',
                        marginVertical: H * 0.03
                    }}>Welcome to BabySits</Text>

                    <Divider style={{
                        marginHorizontal: W * 0.02,
                        color: "black",
                    }}></Divider>


                    <View style={{
                        marginHorizontal: W * 0.05,
                    }}>
                        <Text style={{
                            padding: 5,
                            fontSize: fontSizes.XL,
                            fontFamily: fontFamily.bold,
                            marginTop: 10,

                            alignItems: 'flex-start'

                        }}>Login or Sign up</Text>


                        <TextInput style={{
                            backgroundColor: 'white',
                            fontSize: fontSizes.LAR,
                            height: 50,
                            marginTop: H * 0.03,
                            padding: 1,

                        }}
                            placeholder="Enter Email"
                            mode="outlined"

                            activeUnderlineColor={colors.GREEN}
                            value={email}
                            onChangeText={(text) => { setEmail(text) }}
                        />


                        <View style={{ alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => {
                            }}
                                style={{
                                    backgroundColor: "#1e81b0",
                                    height: 52,
                                    width: "100%",
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                    marginVertical: H * 0.03,
                                }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: fontSizes.LAR,
                                    fontFamily: fontFamily.bold,
                                }}>Continue</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>



            </View>







            {/* { <Logo />} */}



        </View>

    )

}

const styles = StyleSheet.create({

    mainContainer:
    {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    upperContainer:
    {
        backgroundColor: colors.GREEN,
        height: '30%',
    },
    lowerContainer:
    {
        position: 'absolute',
        top: 120,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        height: '100%'
    },

    button:
    {
        backgroundColor: "#1e81b0",
        height: 52,
        width: "100%",
        justifyContent: 'center',
        borderRadius: 40,



    },
    tncText:
    {
        fontSize: fontSizes.LAR,
        padding: 10,
        paddingLeft: 0,
        color: colors.ORANGE,
        marginVertical: 20
    },
    textUniversal:
    {
        fontSize: fontSizes.LAR,
        padding: 10,
        paddingRight: 0,
        marginVertical: 20
    },
    textAgree:
    {
        textAlign: 'center',
        color: 'white',
        fontSize: fontSizes.LAR,
        fontFamily: fontFamily.bold,
        backgroundColor: "#1e81b0"
    },
    greeting:
    {
        color: 'white',
        fontSize: fontSizes.greeting,
        padding: 10,
        fontFamily: 'Montserrat-Regular',

    },
    welcomeText:
    {
        color: 'white',
        paddingTop: 0,
        paddingLeft: 10,
        fontSize: fontSizes.XXXL

    },
    text2:
    {
        fontSize: fontSizes.LAR,
        padding: 10,
        paddingLeft: 0,
        color: colors.GREEN,
        marginVertical: 20
    },
    text3:
    {
        color: colors.FONT_BLACK,
        padding: 10,
        fontFamily: fontFamily.bold

    },

    text:
    {
        padding: 10,
        fontSize: fontSizes.XXXL,
    },
    textContainerForAlignment:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: "4%"
    },
    textInput:
    {
        backgroundColor: 'white',
        fontSize: fontSizes.LAR,
        height: 40,
        marginTop: H * 0.03,
        padding: 1,
    }
})
export default LoginScreen;
