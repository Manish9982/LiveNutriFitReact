import { StyleSheet, View, TouchableOpacity, Dimensions, FlatList, Image, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Text } from 'react-native-paper'
import { colors, fontSizes, H, PostApiData, W } from '../../../../colorSchemes/ColorSchemes'
import { white } from 'react-native-paper/lib/typescript/styles/colors'
import HeaderForUpgrade from './HeaderForUpgrade'


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const UpgradePlanTwo = ({navigation}) => {
  useEffect(() => { getDataFromApi() }, [])
  const [myData, setMyData] = useState(null)

  const getDataFromApi = async () => {
    var formdata = new FormData();
    formdata.append("plan_type", "2");
    const result = await PostApiData('upgrate_plan_detail', formdata)
    setMyData(result)
  }

  const renderItem = ({ item, index }) => {
    return (<View style={styles.cardContainer}>

      <View style={{
        flexDirection: 'row', justifyContent: 'space-between',
        width: WIDTH * 0.4, paddingHorizontal: WIDTH * 0.03, alignItems: 'center'
      }}>
        <Image source={{ uri: item.icon }}
          style={{ height: HEIGHT * 0.024, aspectRatio: 1 }} />
        <Text>{item.duration}</Text>
        <Text> </Text>
      </View>

      <Text style={{ fontSize: fontSizes.MED, color: 'silver' }}>{item.description}</Text>
      <Text>Rs. {item.amount}</Text>
      <TouchableOpacity style={styles.selectButton}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Select</Text>
      </TouchableOpacity>
    </View>)
  }
  return (
    <View>
      <StatusBar backgroundColor={colors.GREEN} />
      <Appbar.Header style={{
        backgroundColor: colors.GREEN,
        width: W
      }}>
        <Appbar.BackAction color={colors.GREEN} style={{ backgroundColor: "white" }} onPress={() => { navigation.goBack() }} />
        <Appbar.Content style={{ alignItems: "center", marginRight: W * 0.125 }} title={<Text style={{
          color: "white",
          fontSize: fontSizes.XL,
          fontFamily: "Montserrat-SemiBold"
        }}>Pro Plan</Text>} />
      </Appbar.Header>
      <View style={{ height: HEIGHT, width: WIDTH, paddingVertical: HEIGHT * 0.05, alignItems: 'center' }}>
        <FlatList
          data={myData?.data}
          renderItem={renderItem}
          keyExtractor={item => item.duration}
          numColumns={2}
        />

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer:
  {
    height: HEIGHT * 0.25,
    width: WIDTH * 0.44,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: HEIGHT * 0.008,
    marginHorizontal: WIDTH * 0.03,
    marginVertical: HEIGHT * 0.02,
    borderRadius: 4,
    elevation: 5
  },
  selectButton:
  {
    backgroundColor: colors.GREEN,
    width: WIDTH * 0.35,
    height: HEIGHT * 0.05,
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 5,
  }
})
export default UpgradePlanTwo
