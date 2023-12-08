import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UpgradeStack from './UpgradeStack'
import UpgradePlanOne from './UpgradePlanOne'
import UpgradePlanTwo from './UpgradePlanTwo'
import UpgradePlanThree from './UpgradePlanThree'
import { createStackNavigator } from '@react-navigation/stack'

const Upgrade = () => {
  const Stack = createStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UpgradePlanOne" component={UpgradePlanOne} />
      <Stack.Screen name="UpgradeStack" component={UpgradeStack} />
      <Stack.Screen name="UpgradePlanTwo" component={UpgradePlanTwo} />
      <Stack.Screen name="UpgradePlanThree" component={UpgradePlanThree} />
    </Stack.Navigator>
  )
}
export default Upgrade
