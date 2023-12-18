import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Change to your desired icon library
import { colors } from '../../colorSchemes/ColorSchemes';

const CustomAccordion = ({ title, question, options, onSelectionChange, answers }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(answers);

    useEffect(() => {
        onSelectionChange(selectedOptions);
    }, [selectedOptions, onSelectionChange]);

    const toggleAccordion = () => {
        setExpanded(!expanded);
    };

    const toggleOption = (option) => {
        const isSelected = selectedOptions.includes(option);
        if (isSelected) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

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
                    {/* <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{question}</Text> */}
                    {/* <FlatList
                        data={options}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => toggleOption(item)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                    <Icon
                                        color={selectedOptions.includes(item) ? colors.GREEN : colors.BLACK}
                                        name={selectedOptions.includes(item) ? 'check-square-o' : 'square-o'}
                                        size={20}
                                    />
                                    <Text style={{ marginLeft: 10 }}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    /> */}
                    {
                        options?.map((item, index) => {
                            return (
                                <TouchableOpacity 
                                ke={index}
                                onPress={() => toggleOption(item)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                        <Icon
                                            color={selectedOptions.includes(item) ? colors.GREEN : colors.BLACK}
                                            name={selectedOptions.includes(item) ? 'check-square-o' : 'square-o'}
                                            size={20}
                                        />
                                        <Text style={{ marginLeft: 10 }}>{item}</Text>
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
