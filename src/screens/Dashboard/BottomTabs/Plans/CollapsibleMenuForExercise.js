import { StyleSheet, TouchableOpacity, View, Image, Dimensions, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon2 from 'react-native-vector-icons/dist/FontAwesome';
import { colors, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes';
import { Text } from 'react-native-paper';
import ListForExercise from './ListForExercise';
import ListForMeal from './ListForMeal';
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage';


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const CollapsibleMenuForExercise = (props) => {

    useEffect(() => { setFollowText(props.Follow) }, [props.Follow])

    const [followText, setFollowText] = useState(true)


    const FollowUnfollow = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("category", props.Exercise);
        formdata.append("status", followText ? "0" : "1")
        const result = await PostApiData('followunfollowexercise', formdata)
        if (result.status == '200') {
            ShortToast(result.message, 'success', '')
            setFollowText(!followText)
        }
        else {
            ShortToast(result.message, 'success', '')
        }
    }

    const renderItem = ({ item }) => {

        return (
            <ListForExercise
                FoodName={item.heading}
                Serving={item.workout_intensity}
                Description={item.desc}
                Liked={item.like}
                Category={item.workout_category}
                Id={item.id}
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
                        marginVertical: HEIGHT * 0.005,
                        marginBottom:HEIGHT*0.01,
                        marginHorizontal: WIDTH * 0.09
                    }}>
                        <View style={{ marginTop: HEIGHT * 0.00, 
                            marginHorizontal: -10 }}>
                            {inputIconHere()}
                        </View>
                        <View style={{ marginLeft: WIDTH * 0.08 }}>

                            <Text style={{
                                fontFamily: 'Montserrat-SemiBold',
                                color: 'white', fontSize: fontSizes.MED, 
                                marginHorizontal: WIDTH * 0.0,
                                 marginTop: HEIGHT * 0.003,
                                width: WIDTH * 0.2
                            }}>{props.Exercise}</Text>
                        </View>
                    </View>
                    <View style={styles.secondaryContainerHeader}>
                        {/* <TouchableOpacity onPress={() => {

                            FollowUnfollow()

                        }}
                            style={styles.followButton}>
                            <Text style={{
                                color: 'white', fontSize: fontSizes.MED
                            }}>{followText ?
                                <>
                                    Unfollow
                                </>
                                :
                                <>
                                    Follow
                                </>
                                }</Text>
                            </TouchableOpacity>*/}
                        {/* <TouchableOpacity onPress={() => { ShortToast('Please upgrade to Paid user to Edit your plan.', 'warning', '') }}>
                            <Icon name='pencil' size={18} color='white' />
                        </TouchableOpacity>*/}
                    </View>
                </View>
            </View>
            {

                <>
                    <FlatList
                        data={props.List}
                        renderItem={renderItem}
                        keyExtractor={({ item, index }) => { `${index}` }}
                        listKey={"exerciseList2"}
                    />
                </>

            }


        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        backgroundColor: colors.GREEN,
        width: W * 0.95,
        borderRadius: 15,
        elevation: 3,
        marginTop: HEIGHT * 0.02
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
        paddingTop: HEIGHT * 0.01,

    },

    containerHeader:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.GREEN,
        backgroundColor: 'red'
    },
    secondaryContainerHeader:
    {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: WIDTH * 0.375,
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
export default CollapsibleMenuForExercise





