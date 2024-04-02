import { View, ActivityIndicator, Alert } from 'react-native'
import { useState, useEffect } from 'react';
import { Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import { GetApiData, H, PostApiData, W, colors } from '../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import Pdf from 'react-native-pdf'
import { useIsFocused } from '@react-navigation/native';
import { useLocales } from '../../utils/LocalizationUtil'
import { getDataFromLocalStorage } from '../../local storage/LocalStorage';





const PDFURLWebView = ({ route }) => {
    const strings = useLocales()
    const isFocused = useIsFocused()
  
    const [loader, setLoader] = useState(false)
    const [pdfURL, setPdfURL] = useState("")
    const [data, setData] = useState("")



    useEffect(() => {
        hideunHide()
    }, [isFocused])



    const hideunHide = async () => {
        const UserId = await getDataFromLocalStorage('user_id')
        var formdata = new FormData()
        formdata.append('user_id', JSON.parse(UserId))
        const result = await PostApiData('hideunhide', formdata)
        console.log("RESULT URL = " , result)
        if (result.status == 200) {
            setData(result)
        } else {
            ShortToast(result.message, 'error', '')

        }
        setLoader(false)
    }
  
    // const hideunHide = async () => {
    //   // const UserId = await getDataFromLocalStorage('user_id')
    //     //console.log("UserId == ", UserId)

    //     setLoader(true)
    //     const result = await GetApiData('hideunhide')
    //     if (result.status == 200) {
    //         setData(result)
    //         console.log("URL == ", `http://docs.google.com/gview?embedded=true&url=${result.pdf_url}`)
    //     } else {
    //         ShortToast(result?.message, 'error', '')
    //     }
    //     setLoader(false)
    // }
    console.log("AANCHAL ", `URI: http://docs.google.com/gview?embedded=true&url=${data.pdf_url}`);

    return (
        loader
            ?
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
            <View style={{
                flex: 1,
                //alignItems: 'center',
                //justifyContent: 'space-between',
            }}>
                <HeaderForSubmissionScreens Title={strings.LowGIFruitsandVegatables} />
                <WebView
                    startInLoadingState={true}
                    scalesPageToFit={false}
                    setBuiltInZoomControls={false}
                    source={{ uri: `http://docs.google.com/gview?embedded=true&url=${data.pdf_url}` }}
                    style={{ flex: 1 }} />
            </View>
    )
}

export default PDFURLWebView