import { TouchableOpacity, View, StyleSheet } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Checkbox, Text } from 'react-native-paper'
import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { getDataFromLocalStorage, removeDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage'
import DataContext from '../../../../context/DataContext'


const GroceryComponent = (props) => {
    const { Ndata } = useContext(DataContext)
    const [checked, setChecked] = React.useState(false);
    useEffect(() => { getCheckStatus() }, [props.Title])

    const [data, setData] = Ndata
    const getUserTasks = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp))
        const result = await PostApiData('get_user_grocery', formdata)

        if (result.status == 200) {
            setData(result)

        }
        else {
            ShortToast(result.message, 'warning', '')
            setData(result)

        }
    }

    const checkItem = async (text) => {
        storeDataInLocalStorage(`${text}`, "1")
    }
    const unCheckItem = async (text) => {
        removeDataFromLocalStorage(`${text}`, "1")
    }

    //
    const getCheckStatus = async () => {
        const temp = await getDataFromLocalStorage(`${props.Title}`)
        if (temp == null) {
            setChecked(false)
        }
        else if (temp == '1') setChecked(true)
    }
    //
    const deleteItem = async () => {
        var formdata = new FormData();
        const temp = await getDataFromLocalStorage('user_id')
        formdata.append("user_id", JSON.parse(temp));
        formdata.append("grocery_id", props.Id);
        const result = await PostApiData('add_user_grocery', formdata)
        if (result.status == '200') {
            console.log("Done")
            removeDataFromLocalStorage(props.Title)
            getUserTasks()
        }
    }
    return (
        <View style={{
            alignItems: "center",
            alignSelf: "center"
        }}>

            <View style={{
                width: W * 0.9,
                justifyContent: "center",
                //paddingHorizontal: W * 0.04,
                // alignItems: "center",
                //marginTop: H * 0.022,
                //backgroundColor: "white",
                borderRadius: 8,
                //paddingVertical: H * 0.03,
                //paddingLeft: W * 0.1,
                //elevation: 2
            }}>
                <View style={{ flexDirection: "row" }}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(prev => {
                                if (prev == true) {
                                    unCheckItem(props.Title)
                                    return false
                                }
                                else if (prev == false) {
                                    checkItem(props.Title)
                                    return true
                                }
                            });

                        }} />
                    <Text style={[styles.text2, { textDecorationLine: checked ? 
                        "line-through" : "none" }]}>{props.Title}</Text>
                    <Text style={{
                        color: "white",
                        fontSize: fontSizes.SM,
                        position: "absolute",
                        top: H * 0.16,
                    }}></Text>
                    <TouchableOpacity onPress={() => { deleteItem() }}
                        style={{ position: "absolute", alignSelf: "center", 
                        left: W * 0.8 ,}}>
                        <AntDesign name="delete" size={20} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View>

        </View >
    )
}
const styles = StyleSheet.create({
    circle:
    {
        height: H * 0.05,
        width: H * 0.05,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: H * 0.025,
        marginRight: W * 0.03,
    },
    button:
    {
        paddingVertical: H * 0.015,
        backgroundColor: colors.GREEN,
        paddingHorizontal: W * 0.02,
        borderRadius: 8,
    },
    text1:
    {
        ...fontFamily.bold,
        //alignSelf: "center",
        marginTop: H * 0.045,
        fontSize: fontSizes.XXL,
        marginLeft: W * 0.055
    },
    text2:
    {
        ...fontFamily.bold,
        alignSelf: "center",
        // marginTop: H * 0.02,
        fontSize: fontSizes.XL,
    },
    addText:

    {
        ...fontFamily.bold,
        alignSelf: "center",
        //marginTop: H * 0.08,
        fontSize: fontSizes.XL,
        color: "white"
    }

})

export default GroceryComponent