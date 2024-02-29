import { StyleSheet, TouchableOpacity, View, Image, Dimensions, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome';
import { colors, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes';
import { Text } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import ListForMeal from './ListForMeal';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const factor = HEIGHT / WIDTH

const CollapsibleMenuForMeal = (props) => {
    useEffect(() => { setFollowText(props.Follow) }, [props.Follow])
    const [followText, setFollowText] = useState(true)
    const [workoutCategory, setWorkoutCategory] = useState(true)

    const renderItem2 = ({ item }) => {
        return (
            <ListForMeal
                FoodName={item.food_name}
                Serving={item.serving}
                Description={item.description}
                Liked={item.liked}
                Category={props.meal}
                CategoryDefault={props.mealDefault}
                Id={item.id}
                OnRepeat={item.repeat}
                Image={item.images}
                Date = {props.Date}
                DateDefault={props.DateDefault}
            />
        )

    }


    const inputIconHere = () => {
        if (props.Icon === '1') {
            return <Icon2 name='circle' size={20} color='#98d9a6' />
        }
        else if (props.Icon === '2') {
            return <Icon2 name='circle' size={20} color='#e3d847' />
        }
        else if (props.Icon === '3') {
            return <Icon2 name='circle-thin' size={20} color='#97daa5' />
        }
    }

    return (
        <View style={styles.mainContainer}>

            <View style={styles.collapsedIsFalseContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: colors.GREEN,
                        marginVertical: HEIGHT * 0.01,
                        marginHorizontal: WIDTH * 0.095
                    }}>
                        <View style={{
                            marginTop: HEIGHT * 0.00,
                            marginHorizontal: -15
                        }}>
                            {inputIconHere()}
                        </View>

                        <View style={{ marginLeft: WIDTH * 0.06}}>

                            <Text style={{
                                fontFamily: 'Montserrat-SemiBold',
                                color: 'white',
                                fontSize: fontSizes.SM,
                                marginTop: HEIGHT * 0.005,
                                width: WIDTH * 0.19
                            }}>{props?.meal}</Text>
                        </View>
                    </View>
                    <View style={styles.secondaryContainerHeader}>


                        <Text style={{
                            color: 'white',
                            fontFamily: 'Montserrat-SemiBold', 
                            fontSize: fontSizes.SM,
                            marginTop:HEIGHT*0.005

                        }}
                        >{props.FoodType}</Text>

                        {/* <Image source={require('../../../../assets/icons/veg_icon.png')}
                            style={{
                                height: H * 0.032,
                                width: H * 0.032,
                                resizeMode: "center",
                                tintColor: props.FoodType == "Vegetarian" ? "green" : "red"
                            }} />  */}


                    </View>
                </View>



                {/* <>
                    <FlatList
                        data={props.List}
                        renderItem={renderItem2}
                        keyExtractor={({ item, index }) => { `${index}` }}
                        listKey={(item, index) => { `${index}` }}
                    />
                </> */}
                {<>
                    <FlatList
                        data={props?.dataOfMeal}
                        renderItem={renderItem2}
                        listKey={(item, index) => `_key${index.toString()}`}
                        keyExtractor={(item, index) => `_key${index.toString()}`}
                    />
                </>}



            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        backgroundColor: colors.GREEN,
        width: W * 0.9,
        borderRadius: 15,
        elevation: 3,
        marginTop: HEIGHT * 0.02,
        paddingBottom: H * 0.01,
        
    },

    collapsedContainer:
    {
        alignItems: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,

    },
    collapsedIsTrueContainer:
    {
        borderRadius: 8,
        height: HEIGHT * 0.12,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    collapsedIsFalseContainer:
    {
        backgroundColor: colors.GREEN,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingTop: HEIGHT * 0.00,

    },

    containerHeader:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.GREEN,
    },
    secondaryContainerHeader:
    {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: WIDTH * 0.43,
        alignItems: 'center',
        backgroundColor: colors.GREEN,
        marginVertical: HEIGHT * 0.01,
    },
    mealContainer:
    {
        height: HEIGHT * 0.08,
        width: W * 0.78,
        backgroundColor: 'white',
        margin: H * 0.012,
        borderRadius: 8,
        alignSelf: "center",
        justifyContent: 'center',
    },
    calCount:
    {
        position: 'absolute',
        left: 0.5 * WIDTH,
        top: 0.02 * HEIGHT,
    },
    textCalCount:
    {
        paddingLeft: WIDTH * 0.1,
        color: '#b7b7b7',
        fontSize: fontSizes.MED,
        fontFamily: 'Montserrat-SemiBold'

    },
    followButton:
    {
        height: HEIGHT * 0.042,
        width: WIDTH * 0.166,
        backgroundColor: colors.ORANGE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: WIDTH * 0.03
    }
})
export default CollapsibleMenuForMeal





