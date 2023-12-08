import { Dimensions, StyleSheet, View, TouchableOpacity, Image, ScrollView, Alert, ToastAndroid, RefreshControl } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import InfoCard from '../../Components/InfoCard'
import { Divider, Text, FAB, Portal, Dialog, Paragraph, Button, Snackbar } from 'react-native-paper';
import HeaderForStats from './HeaderForStats';
import { FlatList } from 'react-native-gesture-handler';
import { colors, fontFamily, fontSizes, GetApiData, H, PostApiData, ShortToast, W } from '../../../../colorSchemes/ColorSchemes';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { getDataFromLocalStorage, storeDataInLocalStorage } from '../../../../local storage/LocalStorage';
import LinearGradient from 'react-native-linear-gradient';
import DataContext from '../../../../context/DataContext';



const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width



const StatsPaidUser = ({ navigation }) => {

  const [data, setData] = useState(null)
  const [showLoader, setShowLoader] = useState(true)
  const [dataForPaidUser, setDataForPaidUser] = useState(null)
  const [isInfoButtonVisible, setIsInfoButtonVisible] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { getDataForFreeUser() }, [])
  //useEffect(() => { getDataForPaidUser() }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    getDataForFreeUser()
    // getDataForPaidUser()
    wait(2000).then(() => setRefreshing(false));
  }, []);


  const { Nvisible, Nheading, NsubHeading, NvisibleSnackOne, NvisibleSnackTwo, NvisibleSnackThree } = useContext(DataContext)
  const [visible, setVisible] = Nvisible
  const [heading, setHeading] = Nheading
  const [subHeading, setSubHeading] = NsubHeading
  const [visibleSnackOne, setVisibleSnackOne] = NvisibleSnackOne
  const [visibleSnackTwo, setVisibleSnackTwo] = NvisibleSnackTwo
  const [visibleSnackThree, setVisibleSnackThree] = NvisibleSnackThree

  const onDismissSnackBarOne = () => setVisibleSnackOne(false);
  const onDismissSnackBarTwo = () => setVisibleSnackTwo(false);
  const onDismissSnackBarThree = () => setVisibleSnackThree(false);

  const getDataForFreeUser = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    const result = await PostApiData('freeuser', formdata)
    setData(result)
    setShowLoader(false)
    storeDataInLocalStorage("stackValue", "3")
    console.log("tempPaid", temp)
  }

  const getDataForPaidUser = async () => {
    var formdata = new FormData();
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    const result = await PostApiData('paiduser', formdata)
    setDataForPaidUser(result)
    console.log(result)
    console.log("tempPaid", temp)


  }


  var myloop = []
  /////////////////////////////////////Power of Seven Cards//////////////////////////////////////////////
  for (let i = 0; i < data?.data?.length; i++) {
    myloop.push(
      <InfoCard
        Location={data?.data[i]?.icon}
        Key={i}
        key={i}
        Text={data?.data[i]?.heading}
        Attributes={data?.data[i]?.attribute}
        FollowNeeded={i === 0 ? true : false}
        Information={data?.data[i]?.information}
        SelectedOption={data?.data[i]?.selected_option}
      />

    );
  }

  const renderItem = ({ item }) => {

    const myLoopTwo = []                                                //values of weigth, Sugar, BP/////////////////////////////////////////
    for (let i = 0; i < item?.attribute?.length - 1; i++) {
      myLoopTwo.push(
        <>

          <View style={{ flex: 1, alignSelf: 'center', }}
            key={i}>
            <Text key={i + 1} style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: fontSizes.XXL, marginBottom: HEIGHT * 0.013, textAlign: 'center'
            }}>{((item.attribute_value.length == 0) || (item.attribute_value[0] == "")) ? "--" : item.attribute_value[i]}</Text>
            <Text key={i + 2} style={{ color: 'silver', fontSize: fontSizes.MED, textAlign: 'center' }}>{item.attribute[i]}</Text>
          </View>
          <Divider key={i + 3}
            style={{ borderWidth: 0.5, borderColor: "silver", height: HEIGHT * 0.09, width: 0.5 }} />

        </>
      )
    }
    /*///Weigth, Sugar, BP////*////////////////////////////////////////////////////////////////////////////////////////////
    return (<View style={styles.cardForMonitoringStats}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <Text style={{ fontFamily: 'Montserrat-SemiBold', marginLeft: WIDTH * 0.02 }}>{item.heading}</Text>
        <View style={{ backgroundColor: '#dee9d1', borderRadius: 12, marginRight: WIDTH * 0.018 }}>
          <Text style={{
            fontSize: fontSizes.MED,
            color: '#a6d37e', textAlign: 'center',
            margin: WIDTH * 0.01, marginHorizontal: WIDTH * 0.018
          }}>{item?.attribute[item?.attribute?.length - 1]}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', }}>

        <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          width: WIDTH * 0.88, flexWrap: 'wrap',
        }}>
          <View style={{ flexDirection: 'row', width: WIDTH * 0.7 }}>
            {myLoopTwo}
          </View>
          <View style={{
            justifyContent: 'center', width: WIDTH * 0.13,
            alignSelf: 'flex-end', alignItems: 'center',
            marginRight: WIDTH * 0.01
          }}>

            <TouchableOpacity
              onPress={() => {
                item.heading == 'Weight' && navigation.navigate("OnDetailsSubmitScreenOne")
                item.heading == 'Sugar' && navigation.navigate("OnDetailsSubmitScreenTwo")
                item.heading == 'Blood Pressure' && navigation.navigate("OnDetailsSubmitScreenThree")
                item.heading == 'Health Index' && navigation.navigate("HealthIndexQuestions")
              }}
              style={styles.nextButton}>
              <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                style={styles.nextButton}>
                <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </View >

    </View>)
  }
  //////////////////////////////////////Pain, BMI, BMR/////////////////////////////
  const renderItemTwo = ({ item }) => {
    console.log('===>>>', item)
    return (<View style={styles.renderItemTwoContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: WIDTH * 0.04 }}>
        <View style={{ width: WIDTH * 0.275 }}>
          <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>{item.heading}</Text>
          <Text style={{ color: 'silver', fontSize: fontSizes.SM }}>{item.sub_heading}</Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <TouchableOpacity style={styles.smallNextButton}
            onPress={() => {
              item.heading == "Pain " && navigation.navigate("PainSubmit")
              item.heading == "Psychology " && navigation.navigate("PsychologySubmit")
              item.heading == "BMI " && navigation.navigate("BMIsubmit")
              item.heading == "BMR " && navigation.navigate("BMRsubmit")
              item.heading == "WHR " && navigation.navigate("WHRsubmit")
              item.heading == "Calories " && navigation.navigate("CaloriesSubmit")

            }}>
            <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
              style={styles.smallNextButton}>
              <AntDesign name="right" size={HEIGHT * 0.024} color='white' />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: fontSizes.XXL, textAlign: 'center' }}>{((item.attribute_value.length == 0) || (item.attribute_value[0] == "")) ? "--" : item.attribute_value[0]}</Text>

    </View >)
  }


  return (
    showLoader ?
      <>
        <View style={styles.loadingContainer}>
          <Image source={require('../../../../assets/icons/Spinner-1s-200px.gif')}
            style={{ height: HEIGHT * 0.15, width: HEIGHT * 0.15 }} />
        </View>
      </>
      :
      <>
        <View>
          <HeaderForStats />
          <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>

              <Dialog.Title style={{ textAlign: 'center' }}>{heading}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{subHeading}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisible(false)}>Got it!</Button>
              </Dialog.Actions>
            </Dialog>
            <Snackbar
              visible={visibleSnackOne}
              onDismiss={onDismissSnackBarOne}
              action={{
                label: 'OK',
                onPress: () => {
                  onDismissSnackBarOne()
                },
              }}>
              It's Okay, Tomorrow Will be Better!
            </Snackbar>
            <Snackbar
              visible={visibleSnackTwo}
              onDismiss={onDismissSnackBarTwo}
              action={{
                label: 'OK',
                onPress: () => {
                  onDismissSnackBarTwo()
                },
              }}>
              Good. But there is still scope for Improvemnet
            </Snackbar>
            <Snackbar
              visible={visibleSnackThree}
              onDismiss={onDismissSnackBarThree}
              action={{
                label: 'OK',
                onPress: () => {
                  onDismissSnackBarThree()
                },
              }}>
              Well Done. Keep it Up!
            </Snackbar>
          </Portal>

          {<FAB
            visible={isInfoButtonVisible}
            icon={require('../../../../assets/icons/electrocardiography.png')}
            color="white"
            //label="Health Index"
            style={styles.fab}
            onPress={() => navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.infomation[0]?.totalpoint })}
            animated={true}
          />}


          <View style={{ height: HEIGHT }}>
            <ScrollView contentContainerStyle={styles.mainContainer}
              onScrollEndDrag={() => { setIsInfoButtonVisible(!isInfoButtonVisible) }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />}
            >

              {myloop}
              {/*********************PAID USER*******************/}
              <View style={[styles.lorem, { height: H * 0.12 }]}>
                <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>Weight</Text>
                <View style={{ flexDirection: "row", marginTop: H * 0.02 }}>

                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.containerRandom}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>{data?.weight[0]?.value == "" ? "--" : data?.weight[0]?.value}</Text>
                      <Text style={[styles.ipsum,]}>Current Weight</Text>
                    </View>
                    <Divider style={styles.dividerStyle} />
                    <View style={styles.containerRandom}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>{data?.weight[1]?.value == "" ? "--" : data?.weight[1]?.value}</Text>
                      <Text style={[styles.ipsum,]}>Target Weight</Text>
                    </View>
                    <Divider style={styles.dividerStyle} />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("OnDetailsSubmitScreenOne")
                    }}
                    style={[styles.nextButton, { left: -H * 0.03 }]}>
                    <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                      style={styles.nextButton}>
                      <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flexDirection: "row", width: W, left: -W * 0.1 }}>
                <View style={[styles.lorem, styles.loremSecondary]}>
                  <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>BMI</Text>
                  <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>
                    <View style={{ justifyContent: "space-evenly", width: W * 0.3, height: H * 0.12 }}>
                      <Text style={[styles.ipsum, { color: "black", fontSize: fontSizes.XL, top: H * 0.01 }]}>{data?.bmi[0]?.value == "" ? "--" : data?.bmi[0]?.value}</Text>
                      <Text style={[styles.ipsum, { fontSize: fontSizes.SM }]}>Body Mass Index</Text>

                    </View>
                    <Divider style={[styles.dividerStyle]} />
                    <TouchableOpacity
                      onPress={() => {
                        ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                      }}
                      style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                      <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                        style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                        <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.lorem, styles.loremSecondary]}>
                  <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>Health Index</Text>
                  <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>

                    <View style={{ justifyContent: "space-evenly", width: W * 0.3, height: H * 0.12 }}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>{data?.healthindex[0]?.value == ("" || null) ? "--" : data?.healthindex[0]?.value}</Text>
                      <Text style={[styles.ipsum, { fontSize: fontSizes.SM }]}>Health Index</Text>

                    </View>
                    <Divider style={[styles.dividerStyle,]} />
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("YourHealthIndexForFreeUser", { "healthIndex": data?.infomation[0]?.totalpoint })
                      }
                      }
                      style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                      <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                        style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                        <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: "row", width: W, left: -W * 0.1 }}>
                <View style={[styles.lorem, styles.loremSecondary]}>
                  <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>BMR</Text>
                  <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>
                    <View style={{ justifyContent: "space-evenly", width: W * 0.3, height: H * 0.12 }}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>{data?.bmr[0]?.value == "" ? "--" : data?.bmr[0]?.value}</Text>
                      <Text style={[styles.ipsum, { fontSize: fontSizes.SM, width: W * 0.4, left: -H * 0.015 }]}>Basal Metabolic Rate</Text>

                    </View>
                    <Divider style={[styles.dividerStyle,]} />
                    <TouchableOpacity
                      onPress={() => {
                        ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                      }}
                      style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                      <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                        style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                        <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.lorem, styles.loremSecondary]}>
                  <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>WHR</Text>
                  <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>
                    <View style={{ justifyContent: "space-evenly", width: W * 0.3, height: H * 0.12 }}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum, { fontSize: fontSizes.SM, width: W * 0.4, left: -H * 0.015 }]}>Waist Hip Ratio</Text>

                    </View>
                    <Divider style={[styles.dividerStyle,]} />
                    <TouchableOpacity
                      onPress={() => {
                       ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                      }}
                      style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                      <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                        style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                        <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", width: W, left: -W * 0.1 }}>
                <View style={[styles.lorem, styles.loremSecondary]}>
                  <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>Pain</Text>
                  <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>
                    <View style={{ justifyContent: "space-evenly", width: W * 0.3, height: H * 0.12 }}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum, { fontSize: fontSizes.SM, width: W * 0.4, left: -H * 0.015 }]}>Pain</Text>

                    </View>
                    <Divider style={[styles.dividerStyle,]} />
                    <TouchableOpacity
                      onPress={() => {
                       ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                      }}
                      style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                      <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                        style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                        <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.lorem, styles.loremSecondary]}>
                  <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>Psychology</Text>
                  <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>
                    <View style={{ justifyContent: "space-evenly", width: W * 0.3, height: H * 0.12 }}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum, { fontSize: fontSizes.SM, width: W * 0.4, left: -H * 0.015 }]}>Psychology</Text>

                    </View>
                    <Divider style={[styles.dividerStyle,]} />
                    <TouchableOpacity
                      onPress={() => {
                       ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                      }}
                      style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                      <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                        style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                        <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ left: -W * 0.1 }}>
                <View style={[styles.lorem, styles.loremSecondary]}>
                  <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>Calories</Text>
                  <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>
                    <View style={{ justifyContent: "space-evenly", width: W * 0.3, height: H * 0.12 }}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum, { fontSize: fontSizes.SM, width: W * 0.4, left: -H * 0.015 }]}>Calories</Text>

                    </View>
                    <Divider style={[styles.dividerStyle,]} />
                    <TouchableOpacity
                      onPress={() => {
                       ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                      }}
                      style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                      <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                        style={[styles.nextButton, { left: W * 0.009, top: -H * 0.006 }]}>
                        <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={[styles.lorem, { height: H * 0.12 }]}>
                <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>Blood Pressure</Text>
                <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>

                  <View style={{ flexDirection: "row" }}>
                    <View style={[styles.containerRandom, { width: W * 0.2 }]}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum,]}>Systolic</Text>
                    </View>
                    <Divider style={styles.dividerStyle} />
                    <View style={[styles.containerRandom, { width: W * 0.2 }]}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum,]}>Diastolic</Text>
                    </View>
                    <Divider style={styles.dividerStyle} />
                    <View style={[styles.containerRandom, { width: W * 0.2 }]}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum,]}>BPM</Text>
                    </View>
                    <Divider style={styles.dividerStyle} />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                     ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                    }}
                    style={[styles.nextButton, { left: -H * 0.03 }]}>
                    <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                      style={styles.nextButton}>
                      <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.lorem, { height: H * 0.12 }]}>
                <Text style={{ color: colors.FONT_BLACK, fontFamily: fontFamily.bold, position: "absolute", left: W * 0.05, top: H * 0.01 }}>Sugar</Text>
                <View style={{ flexDirection: "row", marginTop: H * 0.025 }}>

                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.containerRandom}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum,]}>Fasting</Text>
                    </View>
                    <Divider style={styles.dividerStyle} />
                    <View style={styles.containerRandom}>
                      <Text style={[styles.ipsum, styles.ipsumSecondary]}>--</Text>
                      <Text style={[styles.ipsum,]}>Non Fasting</Text>
                    </View>
                    <Divider style={styles.dividerStyle} />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                     ShortToast("Only for Elite and Pro users. Kindly Upgrade", 'error', '')
                    }}
                    style={[styles.nextButton, { left: -H * 0.03 }]}>
                    <LinearGradient colors={[colors.ORANGE, colors.ORANGE2, colors.ORANGE3]}
                      style={styles.nextButton}>
                      <AntDesign name="right" size={HEIGHT * 0.035} color='white' />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>


              <View style={{ marginTop: HEIGHT * 0.02, alignItems: 'center' }}>
                <FlatList
                  data={dataForPaidUser?.single}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => 'key' + index}
                />
                <FlatList
                  data={dataForPaidUser?.data}
                  renderItem={renderItemTwo}
                  keyExtractor={(item, index) => 'key' + index}
                  numColumns={2} />

              </View>
            </ScrollView>
          </View>
        </View >
      </>

  )
}
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: colors.ORANGE,
    right: W * 0.05,
    bottom: H * 0.18,
    zIndex: 10,
    elevation: 3,
    height: H * 0.08,
    width: H * 0.08,
    justifyContent: "center",
    alignItems: "center",
    // paddingLeft: H * 0.015,
    //opacity: 0.7,

  },
  mainContainer:
  {
    paddingBottom: HEIGHT * 0.18
  },
  headerView:
  {
    width: '100%',
    height: 60,
    elevation: 10,
    backgroundColor: 'white',
    shadowColor: 'black'
  },
  centered:
  {
    alignItems: 'center',
  },
  loadingContainer:
  {
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: 'white',
  },
  cardForMonitoringStats:
  {
    backgroundColor: 'white',
    marginVertical: HEIGHT * 0.01,
    alignSelf: 'center',
    width: WIDTH * 0.9,
    paddingVertical: HEIGHT * 0.012,
    borderRadius: 10,
    elevation: 1,

  },
  renderItemTwoContainer:
  {
    backgroundColor: 'white',
    height: HEIGHT * 0.12,
    width: WIDTH * 0.42,
    borderRadius: 5,
    marginHorizontal: WIDTH * 0.02,
    marginVertical: HEIGHT * 0.01,
    paddingVertical: HEIGHT * 0.01,
    elevation: 1,

  },
  nextButton:
  {
    borderRadius: 10,
    height: HEIGHT * 0.066,
    width: HEIGHT * 0.066,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
    left: W * 0.095,

  },
  smallNextButton:

  {
    borderRadius: 8,
    height: HEIGHT * 0.042,
    width: HEIGHT * 0.042,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT * 0.02,
  },
  lorem:
  {
    height: H * 0.12,
    // flexDirection: "row",
    width: W * 0.9,
    alignSelf: "center",
    backgroundColor: "white",
    justifyContent: "center",
    marginTop: H * 0.04,
    alignItems: "center",
    borderRadius: 15,
    elevation: 3,
    paddingHorizontal: W * 0.045,

  },
  loremSecondary:
  {
    height: H * 0.11,
    alignItems: "center",
    justifyContent: "center",
    width: W * 0.48,
    alignSelf: "flex-start",
    left: H * 0.05,
    marginLeft: W * 0.012,
  },
  ipsum:
  {
    fontFamily: fontFamily.bold,
    color: "silver",
    fontSize: fontSizes.SM,
    textAlign: "center"
  },
  dividerStyle:
  {
    height: H * 0.08,
    width: 1,
    borderWidth: 0.08,
    borderColor: "silver",
    top: H * 0.01
  },
  containerRandom:
  {
    justifyContent: "space-evenly",
    width: W * 0.3,
    height: H * 0.09,
  },
  ipsumSecondary:
  {
    color: "black",
    fontSize: fontSizes.XL
  }
})

export default StatsPaidUser;