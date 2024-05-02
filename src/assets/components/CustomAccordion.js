import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Change to your desired icon library
import { colors } from '../../colorSchemes/ColorSchemes';

const CustomAccordion = ({ title, question, options, onSelectionChange, answers, defaultExpand = false, singleOption = false }) => {
    const [expanded, setExpanded] = useState(defaultExpand);
    const [selectedOptions, setSelectedOptions] = useState(answers);

    useEffect(() => {
        onSelectionChange(selectedOptions);
    }, [selectedOptions, onSelectionChange]);
    const toggleAccordion = () => {
        setExpanded(!expanded);
    };

    const throwColor = (arr) => {
        if (singleOption) {
            if (selectedOptions?.some(item => item.default == arr.default)) {
                return colors.GREEN
            }
            else {
                return colors.BLACK
            }
        }
        else {
            if (selectedOptions?.some(item => item.default == arr.default)) {
                return colors.GREEN
            }
            else {
                return colors.BLACK
            }
        }
    }
    const throwIcon = (arr) => {
        if (singleOption) {
            if (selectedOptions?.some(item => item.default == arr.default)) {
                return 'check-square-o'
            }
            else {
                return 'square-o'
            }
        }
        else {
            if (selectedOptions?.some(item => item.default == arr.default)) {
                return 'check-square-o'
            }
            else {
                return 'square-o'
            }
        }
    }

    const toggleOption = (option) => {
        if (singleOption) {
            setSelectedOptions([option])
        }
        else {
            setSelectedOptions(prevOptions => {
                const isSelected = prevOptions?.some(item => item.default === option.default);
                if (isSelected) {
                    return prevOptions?.filter(item => item.default !== option.default);
                } else {
                    return [...prevOptions, option];
                }
            });
        }

    };

    console.log('SelectedOption ==>>>>', answers)
    return (
        <View>
            <TouchableOpacity style={[styles.accordionBg, {
                borderBottomWidth: expanded ? 1 : 0,
                borderBottomLeftRadius: expanded ? 0 : 8,
                borderBottomRightRadius: expanded ? 0 : 8,
            }]}
                onPress={toggleAccordion}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.textBold}>{title}</Text>
                    <View style={styles.accordionIconBg}>
                        <Icon name={expanded ? 'angle-up' : 'angle-down'} size={20} color={colors.GREEN} />
                    </View>
                </View>
            </TouchableOpacity>
            {expanded && (
                <View style={[styles.optionContainer,]}>
                    {
                        options?.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => toggleOption(item)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                        <Icon
                                            color={throwColor(item)}
                                            name={throwIcon(item)}
                                            size={20}
                                        />
                                        <Text style={{ marginLeft: 10 }}>{item?.text}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    accordionIconBg:
    {
        //backgroundColor: colors.DARK_GRAY,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: 25,
        borderRadius: 25 / 2,
        marginLeft: 10,
        borderColor: colors.DARK_GRAY,
        borderWidth: 1,
    },
    accordionBg:
    {
        width: '95%',
        borderColor: colors.GREEN,
        backgroundColor: "white",
        padding: 10,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    optionContainer:
    {
        width: '95%',
        backgroundColor: "#fff",
        padding: 10,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    textBold:
    {
        fontFamily: 'Montserrat-SemiBold',
        width: '90%',
    }
})

export default CustomAccordion;
