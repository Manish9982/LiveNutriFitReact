import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import HeaderForSubmissionScreens from '../Stats/HeaderForSubmissionScreens'
import { H, W } from '../../../../colorSchemes/ColorSchemes'


const ChatImageDisplay = ({ route, navigation }) => {
    console.log("====>", route.params.icon)
    console.log("====>", route.params.base)
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { navigation.navigate("ChatImageWebview", { "link": `${route.params.base}${item}` }) }}
                style={{
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 8,
                    marginVertical: H * 0.01,
                    width: W * 0.98,
                    alignSelf: "center"
                }}>
                <Image source={{ uri: `${route.params.base}${item}` }}
                    style={{
                        height: H * 0.35,
                        resizeMode: "center"
                    }} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ height: H, width: W }}>
            <HeaderForSubmissionScreens Title="Coach" />
            <FlatList
                data={route.params.icon}
                renderItem={renderItem}
                keyExtractor={({ item, index }) => `${index}`}
            />

        </View>
    )
}

const styles = StyleSheet.create({})
export default ChatImageDisplay
