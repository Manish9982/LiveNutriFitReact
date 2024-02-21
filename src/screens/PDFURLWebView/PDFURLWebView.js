import { View, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react';
import { Text } from 'react-native-paper'
import WebView from 'react-native-webview'
import { GetApiData, H, W, colors } from '../../colorSchemes/ColorSchemes'
import HeaderForSubmissionScreens from '../Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens'
import Pdf from 'react-native-pdf'
import { useIsFocused } from '@react-navigation/native';
import { useLocales } from '../../utils/LocalizationUtil';





const PDFURLWebView = ({ route }) => {
    const isFocused = useIsFocused()
    const strings = useLocales()
    const [loader, setLoader] = useState(false)
    const [pdfURL, setPdfURL] = useState("")
    const [data, setData] = useState("")



    useEffect(() => {
        hideunHide()
    }, [isFocused])


    const hideunHide = async () => {
        setLoader(true)
        const result = await GetApiData('hideunhide')
        if (result.status == 200) {
            setData(result)
            console.log("URL == ", `http://docs.google.com/gview?embedded=true&url=${result.pdf_url}`)
        } else {
            ShortToast(result?.message, 'error', '')
        }
        setLoader(false)
    }

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