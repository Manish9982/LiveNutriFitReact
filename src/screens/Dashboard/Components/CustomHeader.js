import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { Text, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
import { fontSizes } from '../../../colorSchemes/ColorSchemes';

const fontConfig = {

  android: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
      fontSize: fontSizes.MED,

    }

  }
};
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const theme = {
  ...DefaultTheme,
  fonts: configureFonts({config:fontConfig}),
};
const CustomHeader = (props) => {
  const navigation = useNavigation();
  const badgeIcon = <Image source={require('../../../assets/icons/badgec.jpg')}
  style={{ height: 30, aspectRatio: 3 / 4 }} />
  const userIcon = <Image source={require('../../../assets/icons/userc.jpg')}
  style={{ height: 25, aspectRatio: 1 }} />
  const backButton = <Icon name='left' size={25} color='gray' />
  console.log('customheaderprops==>>',props)
  return (
    <KeyboardAwareScrollView>
      <PaperProvider theme={theme}>

        <View style={styles.headerContainer}>

          <View style={{ padding: 1, justifyContent: 'center' }}>
            {props.BackIconNeeded === 'true' ? <TouchableOpacity style={{paddingTop:10}} onPress={()=>{navigation.goBack()}}>
              {backButton}
            </TouchableOpacity>
              : <TouchableOpacity onPress={()=>{navigation.navigate('Total Points')}}>
                {badgeIcon}
              </TouchableOpacity>}

          </View>

          {props.SecondaryHeaderGiven === 'true' ? <View style={styles.textContainer}>



            <Text >{props.HeaderText}</Text>
            <Text style={{ fontFamily: 'Montserrat-RegularSemiBold' }}>{props.SecondaryHeaderText}</Text>

          </View> : <Text style={{ fontFamily: 'Montserrat-RegularSemiBold', marginTop: HEIGHT * 0.003 }}>{props.HeaderText}</Text>}

          <View style={{ padding: 1, justifyContent: 'center', marginTop:15 }}>

            <TouchableOpacity>
              {userIcon}
            </TouchableOpacity>

          </View>

        </View>

      </PaperProvider>
    </KeyboardAwareScrollView >
  )
}



const styles = StyleSheet.create({
  headerContainer:
  {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "white",
    elevation: 5,
    padding: 10
  },
  textContainer:
  {
    textAlign: 'center',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

})
export default CustomHeader;
