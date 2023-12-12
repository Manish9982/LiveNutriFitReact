import { View, FlatList } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import CollapsibleMenuForMeal from './CollapsibleMenuForMeal'
import { colors, fontFamily, fontSizes, H, W } from '../../../../colorSchemes/ColorSchemes'


const WeekViewMeals = (props) => {

    const renderItem = ({ item }) => {
        return (
            <View>
                <CollapsibleMenuForMeal
                    meal={item.meal_name}
                    dataOfMeal={item?.data_of_meal}
                    FoodType={item?.food_type}
                    Icon="2"
                    Date ={props.date}
                />
            </View>
        )
    }
    return (
        <View style={{
            backgroundColor: "#ffffff",
            borderRadius: 5,
            justifyContent: "center",
           // marginVertical: H * 0.01,
            paddingHorizontal: W * 0.03,
            paddingBottom: H * 0.03,
            borderColor: "#ffffff",
            borderWidth: 1.5 

        }}>
            <Text style={{
                ...fontFamily.bold,
                fontSize: fontSizes.XXL,
                marginTop: H * 0.01
            }}>{props.day}, {(props.date).replace(",", " ")} </Text>

            
            <FlatList
                data={props?.meals}
                renderItem={renderItem}
                listKey={(item, index) => `_key${index.toString()}`}
                keyExtractor={(item, index) => `_key${index.toString()}`}
            />
        </View>
    )
}

export default WeekViewMeals