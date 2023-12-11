import { StyleSheet, View, TouchableOpacity, Dimensions, FlatList, Image, StatusBar, Alert } from 'react-native'
import React, { useEffect, useState, } from 'react'
import { Appbar, Text, ActivityIndicator, Divider } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, W } from '../../../../colorSchemes/ColorSchemes'
import { white } from 'react-native-paper/lib/typescript/styles/colors'
import HeaderForUpgrade from './HeaderForUpgrade'
import { useIsFocused } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'


import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ScrollView } from 'react-native-gesture-handler'




//lang chnge
const strings = new LocalizedStrings({
    en: english,
    hi: hindi,
});


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const UpgradePlanOne = ({ navigation, route }) => {
    const [loader, setLoader] = useState(false)
    const [countryType, setCountryType] = useState("")

    const isFocused = useIsFocused()

    useEffect(() => {

        getLanguge()

    }, [isFocused])


    //lng
    const getLanguge = async () => {
        const lang = await getDataFromLocalStorage("lang")
        if (lang == "en") {
            changeLaguagee('en')

        } else {
            changeLaguagee('hi')

        }

    }


    const changeLaguagee = (languageKey) => {
        strings.setLanguage(languageKey)
    }

    useEffect(() => {

        getDataFromApi()
    }, [isFocused])


    const [myData, setMyData] = useState(null)

    const getDataFromApi = async () => {
        setLoader(true)
        const country = await getDataFromLocalStorage("country")
        setCountryType(country)
        console.log("COMEFROM+++++++++++++++++++= ", country)


        const temp = await getDataFromLocalStorage('user_id')
        var formdata = new FormData();
        formdata.append("plan_type", "1");
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("country", country);
        const result = await PostApiData('upgrate_plan_detail', formdata)
        console.log("Plans  ", result)
        setMyData(result)
        setLoader(false)
    }


    const toastUserType = async (duration, amount, currentPlan, p_permoth) => {

        const temp = await getDataFromLocalStorage("user_type")
        // setSetUserType(temp)
        if (JSON.parse(temp) == "3") {

            Alert.alert("Alert", `You can't upgrade because you have already activated ${currentPlan} plan`)


        } else if (JSON.parse(temp) == "2") {
            Alert.alert("Alert", `As you are corporate user , you can not upgrade plan`)


        } else {
            navigation.navigate("PlanDetailScreen",
                { "PlanDuration": `${duration}`, "Price": `${amount}`, "P_MONTH": `${p_permoth}` })

        }
    }


    const renderItem = ({ item, index }) => {


        if (item.current_plan == "3 Months") {
            return (

                countryType == "India" ?


                    item.cutprice == "" ?

                        <TouchableOpacity

                            style={styles.cardContainerSelected}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item?.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item?.discount_type}</Text>

                                </View>




                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>


                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            marginLeft: W * 0.1,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>₹</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        </TouchableOpacity>


                        :

                        <TouchableOpacity

                            style={styles.cardContainerSelected}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>


                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>



                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <Text style={{
                                        color: 'gray',
                                        marginLeft: W * 0.018,
                                        //marginRight: W * 0.015,
                                        fontSize: fontSizes.SM,
                                        marginBottom: 3,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"

                                    }}>₹</Text>
                                    <Text style={{
                                        color: 'gray',
                                        marginRight: W * 0.015,
                                        fontSize: fontSizes.MED,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.cutprice}</Text>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>₹</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </TouchableOpacity>



                    :




                    item.cutprice == "" ?

                        <TouchableOpacity

                            style={styles.cardContainerSelected}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item?.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item?.discount_type}</Text>

                                </View>




                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>


                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            marginLeft: W * 0.1,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>$</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        </TouchableOpacity>


                        :

                        <TouchableOpacity

                            style={styles.cardContainerSelected}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>


                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>



                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <Text style={{
                                        color: 'gray',
                                        marginLeft: W * 0.018,
                                        //marginRight: W * 0.015,
                                        fontSize: fontSizes.SM,
                                        marginBottom: 3,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"

                                    }}>$</Text>
                                    <Text style={{
                                        color: 'gray',
                                        marginRight: W * 0.015,
                                        fontSize: fontSizes.MED,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.cutprice}</Text>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>$</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </TouchableOpacity>





            )



        } else if (item.current_plan == "6 Months") {
            return (


                countryType == "India" ? item.cutprice == "" ?

                    <TouchableOpacity

                        style={styles.cardContainerSelected}>

                        <View
                            style={{
                                width: W * 0.45,
                                padding: 10,
                            }}>
                            <Text style={{
                                fontFamily: "Montserrat-SemiBold",
                                color: "black",
                                marginLeft: W * 0.01,
                                fontSize: fontSizes.LAR,
                            }}>{item.duration}</Text>

                            <View style={{
                                flexDirection: 'row',
                                // justifyContent:'center',
                                //alignItems:'center'
                                marginLeft: W * 0.015,
                            }}>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,

                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount}</Text>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,
                                    // marginLeft: W * 0.01,
                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount_type}</Text>

                            </View>




                        </View>

                        <View style={{
                            justifyContent: "center",
                            alignItems: 'flex-end',
                            // alignContent:'center'

                        }}>


                            <Text style={{
                                color: 'gray',
                                //marginEnd: W * 0.02,
                                color: "green",
                                fontSize: fontSizes.SM,
                                fontFamily: "Montserrat-Medium"
                            }}>{item.plan_tag}</Text>


                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: 'row'

                            }}>

                                <TouchableOpacity

                                    style={{
                                        //padding: 5,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.LAR,
                                        marginBottom: 5,
                                        marginLeft: W * 0.1,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>₹</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        marginLeft: W * 0.005,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.XXXL,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.permonth}</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity

                        style={styles.cardContainerSelected}>

                        <View
                            style={{
                                width: W * 0.45,
                                padding: 10,
                            }}>
                            <Text style={{
                                fontFamily: "Montserrat-SemiBold",
                                color: "black",
                                marginLeft: W * 0.01,
                                fontSize: fontSizes.LAR,
                            }}>{item.duration}</Text>

                            <View style={{
                                flexDirection: 'row',
                                // justifyContent:'center',
                                //alignItems:'center'
                                marginLeft: W * 0.015,
                            }}>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,

                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount}</Text>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,
                                    // marginLeft: W * 0.01,
                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount_type}</Text>

                            </View>


                        </View>

                        <View style={{
                            justifyContent: "center",
                            alignItems: 'flex-end',
                            // alignContent:'center'

                        }}>


                            <Text style={{
                                color: 'gray',
                                //marginEnd: W * 0.02,
                                color: "green",
                                fontSize: fontSizes.SM,
                                fontFamily: "Montserrat-Medium"
                            }}>{item.plan_tag}</Text>



                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: 'row'

                            }}>

                                <Text style={{
                                    color: 'gray',
                                    marginLeft: W * 0.018,
                                    //marginRight: W * 0.015,
                                    fontSize: fontSizes.SM,
                                    marginBottom: 3,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: "red",
                                    fontFamily: "Montserrat-SemiBold"

                                }}>₹</Text>
                                <Text style={{
                                    color: 'gray',
                                    marginRight: W * 0.015,
                                    fontSize: fontSizes.MED,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: "red",
                                    fontFamily: "Montserrat-SemiBold"
                                }}>{item.cutprice}</Text>

                                <TouchableOpacity

                                    style={{
                                        //padding: 5,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.LAR,
                                        marginBottom: 5,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>₹</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        marginLeft: W * 0.005,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.XXL,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.permonth}</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </TouchableOpacity>

                    :

                    item.cutprice == "" ?

                        <TouchableOpacity

                            style={styles.cardContainerSelected}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>




                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>


                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            marginLeft: W * 0.1,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>₹</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity

                            style={styles.cardContainerSelected}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>


                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>



                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <Text style={{
                                        color: 'gray',
                                        marginLeft: W * 0.018,
                                        //marginRight: W * 0.015,
                                        fontSize: fontSizes.SM,
                                        marginBottom: 3,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"

                                    }}>₹</Text>
                                    <Text style={{
                                        color: 'gray',
                                        marginRight: W * 0.015,
                                        fontSize: fontSizes.MED,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.cutprice}</Text>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>$</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </TouchableOpacity>


            )

        } else if (item.current_plan == "12 Months") {


            return (


                item.cutprice == "" ?

                    <TouchableOpacity

                        style={styles.cardContainerSelected}>

                        <View
                            style={{
                                width: W * 0.45,
                                padding: 10,
                            }}>
                            <Text style={{
                                fontFamily: "Montserrat-SemiBold",
                                color: "black",
                                marginLeft: W * 0.01,
                                fontSize: fontSizes.LAR,
                            }}>{item.duration}</Text>

                            <View style={{
                                flexDirection: 'row',
                                // justifyContent:'center',
                                //alignItems:'center'
                                marginLeft: W * 0.015,
                            }}>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,

                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount}</Text>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,
                                    // marginLeft: W * 0.01,
                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount_type}</Text>

                            </View>




                        </View>

                        <View style={{
                            justifyContent: "center",
                            alignItems: 'flex-end',
                            // alignContent:'center'

                        }}>


                            <Text style={{
                                color: 'gray',
                                //marginEnd: W * 0.02,
                                color: "green",
                                fontSize: fontSizes.SM,
                                fontFamily: "Montserrat-Medium"
                            }}>{item.plan_tag}</Text>


                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: 'row'

                            }}>

                                <TouchableOpacity

                                    style={{
                                        //padding: 5,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.LAR,
                                        marginBottom: 5,
                                        marginLeft: W * 0.1,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>$</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        marginLeft: W * 0.005,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.XXXL,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.permonth}</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </TouchableOpacity>


                    :

                    <TouchableOpacity

                        style={styles.cardContainerSelected}>

                        <View
                            style={{
                                width: W * 0.45,
                                padding: 10,
                            }}>
                            <Text style={{
                                fontFamily: "Montserrat-SemiBold",
                                color: "black",
                                marginLeft: W * 0.01,
                                fontSize: fontSizes.LAR,
                            }}>{item.duration}</Text>

                            <View style={{
                                flexDirection: 'row',
                                // justifyContent:'center',
                                //alignItems:'center'
                                marginLeft: W * 0.015,
                            }}>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,

                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount}</Text>
                                <Text style={{
                                    fontSize: fontSizes.SM,
                                    marginTop: H * 0.005,
                                    //  marginLeft: W * 0.01,
                                    color: "red",
                                    fontFamily: fontFamily.bold
                                }}>{item.discount_type}</Text>

                            </View>


                        </View>

                        <View style={{
                            justifyContent: "center",
                            alignItems: 'flex-end',
                            // alignContent:'center'

                        }}>


                            <Text style={{
                                color: 'gray',
                                //marginEnd: W * 0.02,
                                color: "green",
                                fontSize: fontSizes.SM,
                                fontFamily: "Montserrat-Medium"
                            }}>{item.plan_tag}</Text>



                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: 'row'

                            }}>

                                <Text style={{
                                    color: 'gray',
                                    marginLeft: W * 0.018,
                                    //marginRight: W * 0.015,
                                    fontSize: fontSizes.SM,
                                    marginBottom: 3,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: "red",
                                    fontFamily: "Montserrat-SemiBold"

                                }}>$</Text>
                                <Text style={{
                                    color: 'gray',
                                    marginRight: W * 0.015,
                                    fontSize: fontSizes.MED,
                                    textDecorationLine: 'line-through',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: "red",
                                    fontFamily: "Montserrat-SemiBold"
                                }}>{item.cutprice}</Text>

                                <TouchableOpacity

                                    style={{
                                        //padding: 5,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.LAR,
                                        marginBottom: 5,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>₹</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        marginLeft: W * 0.005,
                                        colors: 'black'
                                    }}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: fontSizes.XXL,
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.permonth}</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </TouchableOpacity>
            )



        } else {

            return (

                countryType == "India" ?

                    item.cutprice == "" ?

                        <TouchableOpacity
                            onPress={() => {
                                toastUserType(item?.duration, item?.amount, item?.current_plan, item?.p_permoth)
                                storeDataInLocalStorage("PlanDuration", item.duration)
                            }}
                            style={styles.cardContainer}>
                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>




                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>


                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 15,
                                            marginLeft: W * 0.1,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>₹</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            marginBottom: 10,

                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        </TouchableOpacity>


                        :



                        <TouchableOpacity
                            onPress={() => {
                                toastUserType(item?.duration, item?.amount, item?.current_plan, item?.p_permoth)
                                storeDataInLocalStorage("PlanDuration", item.duration)
                            }}
                            style={styles.cardContainer}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>


                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",

                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>



                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <Text style={{
                                        color: 'gray',
                                        marginLeft: W * 0.018,
                                        //marginRight: W * 0.015,
                                        fontSize: fontSizes.SM,
                                        marginBottom: 3,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"

                                    }}>₹</Text>
                                    <Text style={{
                                        color: 'gray',
                                        marginRight: W * 0.015,
                                        fontSize: fontSizes.MED,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.cutprice}</Text>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black',

                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>₹</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black',

                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>






                            </View>
                        </TouchableOpacity>




                    :





                    item.cutprice == "" ?

                        <TouchableOpacity
                            onPress={() => {
                                toastUserType(item?.duration, item?.amount, item?.current_plan, item?.p_permoth)
                                storeDataInLocalStorage("PlanDuration", item.duration)
                            }}
                            style={styles.cardContainer}>


                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>




                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",
                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>


                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black'
                                        }}>


                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 15,
                                            marginLeft: W * 0.1,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>$</Text>


                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black'
                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            marginBottom: 10,

                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        </TouchableOpacity>


                        :

                        <TouchableOpacity
                            onPress={() => {
                                toastUserType(item?.duration, item?.amount, item?.current_plan, item?.p_permoth)
                                storeDataInLocalStorage("PlanDuration", item.duration)
                            }}
                            style={styles.cardContainer}>

                            <View
                                style={{
                                    width: W * 0.45,
                                    padding: 10,
                                }}>
                                <Text style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    color: "black",
                                    marginLeft: W * 0.01,
                                    fontSize: fontSizes.LAR,
                                }}>{item.duration}</Text>

                                <View style={{
                                    flexDirection: 'row',
                                    // justifyContent:'center',
                                    //alignItems:'center'
                                    marginLeft: W * 0.015,
                                }}>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,

                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount}</Text>
                                    <Text style={{
                                        fontSize: fontSizes.SM,
                                        marginTop: H * 0.005,
                                        // marginLeft: W * 0.01,
                                        color: "red",
                                        fontFamily: fontFamily.bold
                                    }}>{item.discount_type}</Text>

                                </View>


                            </View>

                            <View style={{
                                justifyContent: "center",
                                alignItems: 'flex-end',
                                // alignContent:'center'

                            }}>


                                <Text style={{
                                    color: 'gray',
                                    //marginEnd: W * 0.02,
                                    color: "green",

                                    fontSize: fontSizes.SM,
                                    fontFamily: "Montserrat-Medium"
                                }}>{item.plan_tag}</Text>



                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: 'row'

                                }}>

                                    <Text style={{
                                        color: 'gray',
                                        marginLeft: W * 0.018,
                                        //marginRight: W * 0.015,
                                        fontSize: fontSizes.SM,
                                        marginBottom: 3,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"

                                    }}>$</Text>
                                    <Text style={{
                                        color: 'gray',
                                        marginRight: W * 0.015,
                                        fontSize: fontSizes.MED,
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                        textDecorationColor: "red",
                                        fontFamily: "Montserrat-SemiBold"
                                    }}>{item.cutprice}</Text>

                                    <TouchableOpacity

                                        style={{
                                            //padding: 5,
                                            colors: 'black',

                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.LAR,
                                            marginBottom: 5,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>$</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            marginLeft: W * 0.005,
                                            colors: 'black',

                                        }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: fontSizes.XXXL,
                                            fontFamily: "Montserrat-SemiBold"
                                        }}>{item.permonth}</Text>
                                    </TouchableOpacity>

                                </View>






                            </View>
                        </TouchableOpacity>





            )
        }
    }


    const checkIcon = <Icon name='checkcircle' size={25} color='#4aaf4e' />

    const startIcon = <Icon2 name='star-circle' size={15} color='orange' />

    return (
        loader ?
            <View style={{
                height: H,
                width: W,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <ActivityIndicator size="large"
                    color={colors.GREEN} />
            </View>
            :
            <View style={{ backgroundColor: 'white' }}>
                <StatusBar backgroundColor={colors.GREEN} />

                {
                    route?.params?.comeFrom == "NOTEXPLOREMORE" ?

                        <View>

                            <Appbar.Header style={{
                                backgroundColor: colors.GREEN,
                                width: W
                            }}>
                                <Appbar.BackAction color={colors.GREEN}
                                    style={{ backgroundColor: "white" }}
                                    onPress={() => { navigation.goBack() }} />
                                <Appbar.Content style={{
                                    alignItems: "center",
                                    //marginRight: W * 0.15
                                }} title={<Text style={{
                                    color: "white",
                                    fontSize: fontSizes.XXL,
                                    fontFamily: "Montserrat-SemiBold"
                                }}>{strings.ElitePlan}</Text>} />
                            </Appbar.Header>


                            <TouchableOpacity

                                onPress={() => {
                                    navigation.navigate("BottomTabs")
                                }}

                                style={{
                                    //height: H * 0.027,
                                    // width: W * 0.2,
                                    position: 'absolute',
                                    left: W * 0.85,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    top: H * 0.035,
                                }}>
                                <Text style={{
                                    color: 'white',
                                    textAlign: "center",
                                    fontSize: fontSizes.MED,
                                    fontFamily: "Montserrat-Bold"
                                }}>SKIP</Text>
                            </TouchableOpacity>

                        </View>
                        :
                        <Appbar.Header style={{
                            backgroundColor: colors.GREEN,
                            width: W,
                        }}>
                            <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }}
                                onPress={() => { navigation.goBack() }} />
                            <Appbar.Content style={{
                                // alignItems: "center",
                                //marginRight: W * 0.125
                            }}
                            title={<Text style={{
                                color: "white",
                                fontSize: fontSizes.XXL,
                                fontFamily: "Montserrat-SemiBold"
                            }}>{strings.ElitePlan}</Text>}
                            >
                            </Appbar.Content>
                        </Appbar.Header>
                }








                <ScrollView>
                    <View style={{ marginVertical: HEIGHT * 0.02, }}>

                        {/* <Text style={[styles.textConditions, { fontSize: fontSizes.MED, }]}>Choose Your Plan</Text> */}
                        <Text style={[styles.textChoosePlan, { fontSize: fontSizes.LAR, }]}>{strings.ChooseYourPlan}</Text>
                        {/* <Text style={[styles.textConditions,]}>By this upgrade, you will get all features</Text> */}
                        <Text style={[styles.textupgradePlan,]}>{strings.Bythisupgradeyouwillgetallfeatures}</Text>
                        <View style={styles.conditionsContainer}>
                            {checkIcon}
                            {/* <Text style={styles.textConditions}>Unlock the Coaches</Text> */}
                            <Text style={styles.textConditions}>{strings.UnlocktheCoaches}</Text>
                        </View>
                        <View style={styles.conditionsContainer}>
                            {checkIcon}
                            {/* <Text style={styles.textConditions}>Unlock over 100+ medal and excercise plans</Text> */}
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
                                    fontSize: fontSizes.LAR,
                                    color: 'black', marginLeft: H * 0.02,
                                }}>{strings.Redeem}  <Image source={require('../../../../assets/icons/star.png')}
                                    style={{
                                        height: HEIGHT * 0.023,
                                        width: HEIGHT * 0.023,
                                        //  aspectRatio: 1,
                                    }} /> {strings.pointstobookextraconsultation}</Text>

                                {/* Redeem {startIcon} points to book extra consultation or buy on LNF shop */}


                            </View>


                        </View>


                    </View>

                    <View style={{
                        height: HEIGHT * 0.55,
                        width: WIDTH,
                        // paddingVertical: HEIGHT * 0.05,
                        alignItems: 'center'
                    }}>
                        <FlatList
                            data={myData?.data}
                            renderItem={renderItem}
                            keyExtractor={item => item.duration}
                        // numColumns={2}
                        />

                    </View>
                </ScrollView>



            </View>


    )

}


const styles = StyleSheet.create({
    cardContainerSelected:
    {
        width: WIDTH * 0.9,
        flexDirection: 'row',
        elevation: 3,
        // backgroundColor: "#f8f0e3",
        backgroundColor: "#fffaed",
        borderRadius: 8,
        borderWidth: 0.7,
        borderColor: "green",
        padding: 10,
        margin: 10,
    },
    cardContainer:
    {
        width: WIDTH * 0.9,
        flexDirection: 'row',
        elevation: 1,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderWidth: 0.7,
        borderColor: "gray",
        padding: 10,
        margin: 10,
    },
    selectButton:
    {
        backgroundColor: colors.GREEN,
        width: WIDTH * 0.25,
        height: HEIGHT * 0.05,
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 1,
        alignSelf: 'center',
        marginLeft: W * 0.02,
    },
    conditionsContainer:
    {
        flexDirection: 'row',
        marginHorizontal: WIDTH * 0.05,
        marginVertical: HEIGHT * 0.01,
        marginTop: H * 0.01,
    },
    textConditions:
    {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: fontSizes.LAR,
        color: 'black',
        marginHorizontal: WIDTH * 0.04,
        marginVertical: HEIGHT * 0.004,
        // marginBottom:H*0.01

    },
    textChoosePlan:
    {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: fontSizes.LAR,
        color: 'black',
        marginHorizontal: WIDTH * 0.02,
        marginVertical: HEIGHT * 0.004,
        marginTop: H * 0.01

    },
    textupgradePlan:
    {
        fontFamily: 'Montserrat-Regular',
        fontSize: fontSizes.LAR,
        color: 'gray',
        marginHorizontal: WIDTH * 0.035,
        marginVertical: HEIGHT * 0.004,
        marginTop: H * 0.01,
        marginBottom: H * 0.02

    },
})
export default UpgradePlanOne
