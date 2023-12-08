import React from 'react';
import { StyleSheet, Dimensions, View, Linking } from 'react-native';
import Pdf from 'react-native-pdf';
import { H, W, colors } from '../colorSchemes/ColorSchemes';
import HeaderForSubmissionScreens from './Dashboard/BottomTabs/Stats/HeaderForSubmissionScreens';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';
import WebView from 'react-native-webview';
import { TouchableOpacity } from 'react-native-gesture-handler';


const ChatPdfViewer = ({ route }) => {
    console.log("URL === ", route?.params?.url)
    return (

        <>


            <View style={{
                flex: 1,
            }}>
                <HeaderForSubmissionScreens Title="PDF Viewer" />

                <FAB
                    onPress={() => {
                        Linking.openURL(route?.params?.url)
                    }}


                    icon="download"
                    style={styles.fabbutton}
                />



                <WebView
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    setBuiltInZoomControls={false}
                    bounces={false}
                    decelerationRate="normal"

                    //source={{ uri: `http://docs.google.com/gview?embedded=true&url=${route?.params?.url}` }}

                    source={{ uri: `http://docs.google.com/gview?embedded=true&url=${route?.params?.url}` }}


                    style={{ height: H, width: W, }} />



            </View>



        </>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    fabbutton: {
        height: 60,
        width: 60,
        alignSelf: 'flex-end',
        position: 'absolute',
        backgroundColor: colors.GREEN,
        bottom: 40,
        zIndex: 100,
        right: 10


    }

});


export default ChatPdfViewer
