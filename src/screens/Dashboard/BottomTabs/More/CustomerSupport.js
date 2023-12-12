import { View, StatusBar, Alert, TouchableOpacity } from 'react-native'
import React from 'react'


import { colors, fontFamily, fontSizes, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes'
import { Appbar, Text, TextInput } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { getDataFromLocalStorage } from '../../../../local storage/LocalStorage'
import LinearGradient from 'react-native-linear-gradient'
import { useState } from 'react'
import Loader from '../../../../assets/components/Loader'

import LocalizedStrings from 'react-native-localization';
import hindi from '../../../../hi'
import english from '../../../../en'
import { useIsFocused } from '@react-navigation/native'



//lang chnge
const strings = new LocalizedStrings({
  en: english,
  hi: hindi,
});





const CustomerSupport = ({ navigation }) => {
  const [data, setData] = useState(null)
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [setshowLoader, setShowLoader] = useState("")

  const isFocused = useIsFocused()


  useEffect(() => { getLanguge() }, [isFocused])


  //lng
  const getLanguge = async () => {
    const lang = await getDataFromLocalStorage("lang")

    if (lang == "en") {
      changeLaguagee('en')

    } else {
      changeLaguagee('hi')

    }

  }


  const changeLaguagee = (languageKey) => {
    strings.setLanguage(languageKey)
  }

  useEffect(() => {
    getUserDetails()
  }, [])


  const getUserDetails = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    setShowLoader(true)
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp))
    const result = await PostApiData('userprofile', formdata)
    console.log("jhsdfn", result)

    if (result?.status == "200") {

      setData(result)
      setName(result?.data[0]?.name)

      if (result?.data[0]?.email == "") {
        setEmail(result?.data[0]?.mobile)

      } else {
        setEmail(result?.data[0]?.email)

      }
    }

    else {
      ShortToast(result?.message, 'error', '')
    }
    setShowLoader(false)
  }

  const renderComponent = () => {
    if (data?.data[0]?.email == "") {
      return (
        <View>
          <Text
            style={{
              textAlign: 'center',
              ...fontFamily.bold,
              fontSize: fontSizes.LAR,
              color: 'black',
              marginVertical: H * 0.05,
              marginHorizontal: W * 0.05
            }} >{strings.CustSupportText}</Text>


          <TextInput
            editable={false}
            style={styles.textInput}
            placeholder='Enter Name*'
            activeUnderlineColor={colors.GREEN}
            value={name}
            mode={'flat'}
            underlineColor={"transparent"}
            onChangeText={(text) => { setName(text) }}
          />
          <TextInput
            editable={false}

            style={styles.textInput}
            placeholder='Enter Mobile*'
            activeUnderlineColor={colors.GREEN}
            value={email}
            mode={'flat'}
            underlineColor={"transparent"}
                        onChangeText={(text) => { setEmail(text) }}
          />
          <TextInput
            style={styles.textInput}
            placeholder='Enter Message*'
            activeUnderlineColor={colors.GREEN}
            value={message}
            mode={'flat'}
            underlineColor={"transparent"}
                        onChangeText={(textmessage) => { setMessage(textmessage) }} />

          <TouchableOpacity
            onPress={() => postData()}>
            <LinearGradient



              colors={[colors.GREEN, colors.GREEN3, colors.GREEN3]}
              style={styles.upperContainer}>

              <View

                style={{}}>

                <Text
                  style={styles.greeting}>{}</Text>

              </View>

            </LinearGradient>
          </TouchableOpacity>



        </View>
      )

    } else if (data?.data[0].mobile == "") {
      <View>

        <Text
          style={{
            textAlign: 'center',
            ...fontFamily.bold,
            fontSize: fontSizes.LAR,
            color: 'black',
            marginVertical: H * 0.05,
            marginHorizontal: W * 0.05,
          }} >
          {strings.CustSupportText}</Text>

        <TextInput
          editable={false}

          style={styles.textInput}
          placeholder='Enter Name*'
          value={name}
          mode={'flat'}
          underlineColor={"transparent"}
          onChangeText={(text) => { setName(text) }}
        />

        <TextInput
          editable={false}

          style={styles.textInput}
          placeholder='Enter Email*'
          value={email}
          mode={'flat'}
          underlineColor={"transparent"}
          onChangeText={(textemail) => { setEmail(textemail) }}
        />

        <TextInput
          style={styles.textInput}
          placeholder='Enter Message*'
          value={message}
          mode={'flat'}
          activeUnderlineColor={"silver"}
          underlineColor={"transparent"}
          onChangeText={(textmessage) => { setMessage(textmessage) }}
        />

        <TouchableOpacity onPress={() => {
          postData()

        }}>
          <LinearGradient
            colors={[colors.GREEN, colors.GREEN3, colors.GREEN3]}
            style={styles.upperContainer}>

            <View style={{}}>
              <Text style={styles.greeting}>{strings.Submit}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    }
    else {
      return (
        <View>

          <Text
            style={{
              textAlign: 'center',
              ...fontFamily.bold,
              fontSize: fontSizes.LAR,
              color: 'black',
              marginVertical: H * 0.05,
              marginHorizontal: W * 0.05,
            }} >
            {strings.CustSupportText}</Text>

          <TextInput
            editable={false}

            style={styles.textInput}
            placeholder='Enter Name*'
            activeUnderlineColor={colors.GREEN}
            value={name}
            mode={'flat'}
            underlineColor={"transparent"}
            onChangeText={(text) => { setName(text) }}
          />

          <TextInput
            editable={false}

            style={styles.textInput}
            placeholder='Enter Email*'
            activeUnderlineColor={colors.GREEN}
            value={email}
            mode={'flat'}
            underlineColor={"transparent"}
            onChangeText={(textemail) => { setEmail(textemail) }}
          />

          <TextInput
            style={styles.textInput}
            placeholder='Enter Message*'
            activeUnderlineColor={"silver"}
            underlineColor={"transparent"}
            value={message}
           
            onChangeText={(textmessage) => { setMessage(textmessage) }}
          />

          <TouchableOpacity onPress={() => {
            postData()

          }}>
            <LinearGradient
              colors={[colors.GREEN, colors.GREEN3, colors.GREEN3]}
              style={styles.upperContainer}>

              <View style={{}}>
                <Text style={styles.greeting}>{strings.Submit}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      )
    }
  }

  const postData = async () => {
    setShowLoader(true)
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    formdata.append("name", name)
    formdata.append("emailid", email)
    formdata.append("text", message)
    const result = await PostApiData('add_customer_support', formdata)

    console.log("API data", formdata)


    if (result?.status == "200") {
      Alert.alert("Alert", result.message)
      setMessage("")

    }
    else {
      ShortToast(result?.message, 'error', '')
    }
    setShowLoader(false)
  }


  return (
    setshowLoader
      ?
      <>
        <Loader />
      </>
      :
      <View>
        <View style={{ elevation: 8, zIndex: 1 }}>
          <StatusBar backgroundColor={colors.GREEN} />
          <Appbar.Header style={styles.appBar}>
            <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }}
              onPress={() => { navigation.goBack() }} />
            <Appbar.Content style={{ alignItems: "center", }}
              title={<Text style={{
                color: "white", textAlign: "center", fontSize: fontSizes.XL,
                ...fontFamily.bold
              }}>{strings.CustomerSupport}</Text>} />
          </Appbar.Header>
        </View>

        {renderComponent()}












      </View>
  )
}

const styles = StyleSheet.create({
  appBar:
  {
    backgroundColor: colors.GREEN,
    width: W
  },
  textInput:
  {
    backgroundColor: 'white',
    fontSize: fontSizes.LAR,
    marginHorizontal: W * 0.05,
    marginVertical: H * 0.01,
    fontFamily: 'Montserrat-Medium',
    borderWidth:0.5,
    borderColor:"gray",
    borderRadius:5
  },
  lowerContainer:
  {
    position: 'absolute',
    top: 120,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    height: '100%'
  },
  upperContainer:
  {
    backgroundColor: colors.GREEN,
    marginVertical: H * 0.05,
    marginHorizontal: W * 0.04,
    borderWidth: 1,
    borderRadius: 5

  },
  greeting:
  {
    color: 'black',
    fontSize: fontSizes.XL,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',

  },


})

export default CustomerSupport