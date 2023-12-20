import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Stats from './Stats';
import SubmitExcercise from './SubmitExcercise';
import SubmitFasting from './SubmitFasting';
import SubmitMealPlan from './SubmitMealPlan';
import SubmitSleep from './SubmitSleep';
import SubmitHydration from './SubmitHydration';
import SubmitMood from './SubmitMood';
import SubmitMonitoring from './SubmitMonitoring';
import PainSubmit from './PainSubmit';
import PsychologySubmit from './PsychologySubmit';
import BMIsubmit from './BMIsubmit';
import BMRsubmit from './BMRsubmit';
import WHRsubmit from './WHRsubmit';
import CaloriesSubmit from './CaloriesSubmit';
import HealthIndexQuestions from './HealthIndexQuestions';
import LoadDataForDates from './LoadDataForDates';
import YourHealthIndexForFreeUser from './YourHealthIndexForFreeUser';
import SetCurrentAndTargetWeight from './SetCurrentAndTargetWeight';
import WHRSubmitMedium from './WHRSubmitMedium';
import BlogWebView from './BlogWebView';
import PsychologyQuestions from './PsychologyQuestions';
import Reports from './Reports';
import ReportsWebView from './ReportsWebView';


const StatsNav = ({ navigation }) => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Stats" component={Stats} />
            <Stack.Screen name="SubmitMealPlan" component={SubmitMealPlan} />
            <Stack.Screen name="SubmitExcercise" component={SubmitExcercise} />
            <Stack.Screen name="SubmitSleep" component={SubmitSleep} />
            <Stack.Screen name="SubmitHydration" component={SubmitHydration} />
            <Stack.Screen name="SubmitMood" component={SubmitMood} />
            <Stack.Screen name="SubmitFasting" component={SubmitFasting} />
            <Stack.Screen name="SubmitMonitoring" component={SubmitMonitoring} />
            <Stack.Screen name="PainSubmit" component={PainSubmit} />
            <Stack.Screen name="PsychologySubmit" component={PsychologySubmit} />
            <Stack.Screen name="BMIsubmit" component={BMIsubmit} />
            <Stack.Screen name="BMRsubmit" component={BMRsubmit} />
            <Stack.Screen name="WHRsubmit" component={WHRsubmit} />
            <Stack.Screen name="CaloriesSubmit" component={CaloriesSubmit} />
            <Stack.Screen name="HealthIndexQuestions" component={HealthIndexQuestions} />
            <Stack.Screen name="LoadDataForDates" component={LoadDataForDates} />
            <Stack.Screen name="YourHealthIndexForFreeUser" component={YourHealthIndexForFreeUser} />
            <Stack.Screen name="SetCurrentAndTargetWeight" component={SetCurrentAndTargetWeight} />
            <Stack.Screen name="WHRSubmitMedium" component={WHRSubmitMedium} />
            <Stack.Screen name="BlogWebView" component={BlogWebView} />
            <Stack.Screen name="PsychologyQuestions" component={PsychologyQuestions} />
            <Stack.Screen name="Reports" component={Reports} />
            <Stack.Screen name="ReportsWebView" component={ReportsWebView} />
        </Stack.Navigator>
    )
}

export default StatsNav





