import { FlatList, Image, Modal, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { Dialog, Divider, Portal, RadioButton, Text } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
//import { convertTimeStampToDate } from '../Schemes/Utils'
import { Colors } from '../Schemes/Colors'
import { colors, fontFamily, fontSizes } from '../../../../../colorSchemes/ColorSchemes'

const ReminderHoursDropDown = ({ label, onPressInputCustomView, iconName, value, isDate = false, customIconSource, options, visible, onPressOption, hasKey = true, editable = true }) => {

    const theme =
    {
        colors: {
            onSurfaceVariant: '#000000'
        }
    }


    const returnDate = (t) => {
        // return (
        //     convertTimeStampToDate(t)
        // )
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                <TouchableOpacity
                    onPress={() => onPressOption(hasKey ? item?.name : item)}
                    style={[styles.horizontalContainer, styles.options]}>
                    <RadioButton
                        theme={theme}
                        color={'#000000'}
                        value={hasKey ? item?.name : item}
                        status={value === (hasKey ? item?.name : item) ? 'checked' : 'unchecked'}
                        onPress={() => onPressOption(hasKey ? item?.name : item)}
                    />
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={4}
                        style={styles.fonts2}
                    >{hasKey ? item?.name : item}</Text>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <>
            {/* <Text style={styles.fonts3}>{label}</Text> */}
            <TouchableOpacity
                disabled={!editable}
                onPress={onPressInputCustomView}
                style={styles.container}>
                <Portal>
                    <Dialog
                        style={styles.dialog}
                        visible={visible}
                        >
                        <Dialog.Content>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={options}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => `_key${index}`}
                            />
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                {
                    customIconSource
                    &&
                    <Image source={customIconSource}
                        style={styles.iconStyle}
                    />}

                <Text
                    adjustsFontSizeToFit
                    numberOfLines={2}
                    style={styles.fonts}>{((isDate ? returnDate(value) : value) || label)}</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        // width: '20%',
        alignSelf: 'flex-end',
        // marginTop: 6,
        margin: 10,
        padding: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    fonts:
    {
        fontFamily: 'Montserrat-SemiBold',
        backgroundColor: '#e1e3e6',
        // padding: WIDTH * 0.01,
        borderRadius: 5,
        padding: 5,
        fontSize: fontSizes.MED


    },
    fonts2:
    {
        width: '85%',
        color: '#000000',
        fontFamily:fontFamily.bold
    },
    iconStyle:
    {
        height: 23,
        width: 23,
        tintColor: 'gray',
        resizeMode: 'contain'
    },
    horizontalContainer:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    options:
    {
        width: '90%',
        margin: 10,
       // backgroundColor: colors.BAD_COLOR,
        borderRadius: 8,
      //  padding: 10
    },
    divider:
    {
        height: 1,
    },
    dialog:
    {
        backgroundColor: '#ffffff',
    },
    fonts3:
    {
        margin: 10,
        marginBottom: 0
    }
})

export default ReminderHoursDropDown