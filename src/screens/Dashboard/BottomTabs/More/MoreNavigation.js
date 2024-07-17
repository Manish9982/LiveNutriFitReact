import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import More from './More'
import Reminder from './Reminder'
import LeadershipBoard from './LeadershipBoard'
import ReminderExercise from './ReminderExercise'
import ReminderFood from './ReminderFood'
import ReminderMedicine from './ReminderMedicine'
import ReminderWater from './ReminderWater'
import ReminderWeight from './ReminderWeight'
import Progress from './Progress'
import Goal from './Goal'
import ChatWithMe from './ChatWithMe'
import CustomerSupport from './CustomerSupport'
import MedicalInformation from './MedicalInformation'
import ChangeYourCoach from './ChangeYourCoach'
import Vitamins from './Vitamins'
import Aspirin from './Aspirin'
import Darco from './Darco'
import Omeprazole from './Omeprazole'
import TermsAndConditions from './TermsAndConditions'
import GroceryList from './GroceryList'
import NotificationWebView from './NotificationWebView'




const MoreNavigation = ({ navigation, route }) => {
    useEffect(() => {
        console.log('route.params---->', route.params)
    }, [])

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName='MoreNav' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="MoreNav" component={More} />
            <Stack.Screen name="LeadershipBoard" component={LeadershipBoard} />
            <Stack.Screen name="ReminderExercise" component={ReminderExercise} />
            <Stack.Screen name="ReminderFood" component={ReminderFood} />
            <Stack.Screen name="ReminderMedicine" component={ReminderMedicine} />
            <Stack.Screen name="ReminderWater" component={ReminderWater} />
            <Stack.Screen name="ReminderWeight" component={ReminderWeight} />
            <Stack.Screen name="Progress" component={Progress} />
            <Stack.Screen name="Goal" component={Goal} />
            <Stack.Screen name="ChatWithMe" component={ChatWithMe} />
            <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
            <Stack.Screen name="MedicalInformation" component={MedicalInformation} />
            <Stack.Screen name="ChangeYourCoach" component={ChangeYourCoach} />
            <Stack.Screen name="Vitamins" component={Vitamins} />
            <Stack.Screen name="Aspirin" component={Aspirin} />
            <Stack.Screen name="Darco" component={Darco} />
            <Stack.Screen name="Omeprazole" component={Omeprazole} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
            <Stack.Screen name="GroceryList" component={GroceryList} />
            <Stack.Screen name="NotificationWebView" component={NotificationWebView} />
        </Stack.Navigator>
    )
}

export default MoreNavigation





