import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef, useContext } from 'react'
import { TextInput } from 'react-native-paper'
import { colors } from '../../colorSchemes/ColorSchemes'
import DataContext from '../../context/DataContext'

const OTPinputComponent = () => {
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [text3, setText3] = useState('')
    const [text4, setText4] = useState('')

    const firstTextInput = useRef()
    const secondTextInput = useRef()
    const thirdTextInput = useRef()
    const fourthTextInput = useRef()
    const { Notp } = useContext(DataContext)
    const [otp, setOtp] = Notp;
    return (
        <View style={styles.mainContainer}>

            <View style={styles.otpBox}>
                <TextInput mode='flat'
                    style={{ backgroundColor: '#e0e0de', height:45, width:45, borderRadius:5 }}
                    ref={firstTextInput}
                    underlineColor='transparent'
                    activeUnderlineColor={colors.GREEN}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={text1}
                    onChangeText={(text) => {
                        setText1(text)
                        secondTextInput.current.focus()
                    }
                    }
                    onFocus={() => { firstTextInput.current.clear() }}

                />
            </View>
            <View style={styles.otpBox}>
                <TextInput mode='flat'
                   style={{ backgroundColor: '#e0e0de', height:45, width:45, borderRadius:5 }}
                    ref={secondTextInput}
                    underlineColor='transparent'
                    activeUnderlineColor={colors.GREEN}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={text2}
                    onChangeText={(text) => {
                        setText2(text)
                        thirdTextInput.current.focus()
                    }
                    }
                    onFocus={() => { secondTextInput.current.clear() }} />
            </View>
            <View style={styles.otpBox}>
                <TextInput mode='flat'
                    style={{ backgroundColor: '#e0e0de', height:45, width:45, borderRadius:5 }}
                    ref={thirdTextInput}
                    underlineColor='transparent'
                    activeUnderlineColor={colors.GREEN}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={text3}
                    onChangeText={(text) => {
                        setText3(text)
                        fourthTextInput.current.focus()
                    }
                    }
                    onFocus={() => { thirdTextInput.current.clear() }} />
            </View>
            <View style={styles.otpBox}>
                <TextInput mode='flat'
                     style={{ backgroundColor: '#e0e0de', height:45, width:45, borderRadius:5 }}
                    ref={fourthTextInput}
                    underlineColor='transparent'
                    activeUnderlineColor={colors.GREEN}
                    maxLength={1}
                    keyboardType='number-pad'
                    value={text4}
                    onChangeText={(text) => {
                        setText4(text)
                        setOtp(`${text1}${text2}${text3}${text}`)
                        console.log('otp--->', otp)
                    }
                    }
                    onFocus={() => { fourthTextInput.current.clear() }} />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:
    {
        backgroundColor: "white",
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    otpBox:
    {
        height: 4,
        width: 40,
        margin: 5,
    },
})
export default OTPinputComponent
