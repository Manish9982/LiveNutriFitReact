import 'react-native-gesture-handler'
import React, { useEffect, useContext, useRef } from 'react'
// stackValue 1=> SignIn,  2 => Splash , 3=> BottomTabs
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import Signin from './src/screens/SignIn/Signin';
import RegisterOrSignIn from './src/screens/RegisterOrSignIn/RegisterOrSignIn'
import CreateAccount from './src/screens/CreateAccount/CreateAccount'
import BottomTabs from './src/screens/Dashboard/BottomTabs/BottomTabs'
import SignupWithEmail from './src/screens/SignUp/SignupWithEmail'
import SignupWithPhone from './src/screens/SignUp/SignupWithPhone'
import OnDetailsSubmitScreenOne from './src/screens/Dashboard/BottomTabs/Stats/OnDetailsSubmitScreenOne'
import OnDetailsSubmitScreenTwo from './src/screens/Dashboard/BottomTabs/Stats/OnDetailsSubmitScreenTwo'
import OnDetailsSubmitScreenThree from './src/screens/Dashboard/BottomTabs/Stats/OnDetailsSubmitScreenThree'
import DataState from './src/context/DataState';
import TotalPoints from './src/screens/TotalPoints/TotalPoints';
import BootSplash from './src/screens/BootSplash/BootSplash';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Questions from './src/screens/Questions/Questions';
import { colors, fontSizes, PostApiData, PostApiData2 } from './src/colorSchemes/ColorSchemes';
import { Alert, AppState, LogBox } from "react-native";
import UserProfile from './src/screens/UserProfile/UserProfile';
import EditProfile from './src/screens/EditProfile/EditProfile';


import VerifyOTPAfterRegistrationPhone from './src/screens/VerifyOTP/VerifyOTPAfterRegistrationPhone';
import VerifyOTPAfterRegistrationEmail from './src/screens/VerifyOTP/VerifyOTPAfterRegistrationEmail';
import VerifyOTPAfterSignInEmail from './src/screens/VerifyOTP/VerifyOTPAfterSignInEmail';
import VerifyOTPAfterSignInPhone from './src/screens/VerifyOTP/VerifyOTPAfterSignInPhone';


import WelcomeScreenBeforeBottomTabs from './src/screens/WelcomeScreenBeforeBottomTabs/WelcomeScreenBeforeBottomTabs'
import WelcomeScreenAfterRegistration from './src/screens/WelcomeScreenAfterRegistration/WelcomeScreenAfterRegistration'
import PlanChoosePromptAtStartup from './src/screens/PlanChoosePromptAtStartup/PlanChoosePromptAtStartup';
import SelectPrefferedLanguage from './src/screens/SelectPrefferedLanguage/SelectPrefferedLanguage';
import SliderIntro from './src/screens/SliderIntro/SliderIntro'
import ExploreNow from './src/screens/PlanChoosePromptAtStartup/ExploreNow';
import Blank from './src/screens/Blank/Blank';
import QuestionsCustom from './src/screens/Questions/QuestionsCustom';
import Gratification from './src/screens/Dashboard/BottomTabs/More/Gratification';
import { getFcmToken, NotificationListener, requestUserPermissionAndGetToken } from './src/assets/components/PushNotificationsServices';
import { checkNotificationPermission, onAppBootstrap } from './src/assets/components/NotificationServices';
import ChatImageDisplay from './src/screens/Dashboard/BottomTabs/Coach/ChatImageDisplay';
import messaging, { firebase } from '@react-native-firebase/messaging'
import { getDataFromLocalStorage } from './src/local storage/LocalStorage';
import DataContext from './src/context/DataContext';
import ChatImageWebview from './src/screens/Dashboard/BottomTabs/Coach/ChatImageWebview'
import SigninCorporate from './src/screens/SignIn/SigninCorporate';
import PlanDetailScreen from './src/screens/PlanDetailScreen/PlanDetailScreen';
import PaymentWebview from './src/screens/PaymentWebview/PaymentWebview';


import LNFShopWebView from './src/screens/LNFShopWebView/LNFShopWebView';
import PaidCustomQuestions from './src/screens/PaidCustomQuestions/PaidCustomQuestions';
import CustomerSupport from './src/screens/Dashboard/BottomTabs/More/CustomerSupport';
import Stats from './src/screens/Dashboard/BottomTabs/Stats/Stats';
import ForgetPassword from './src/screens/ForgetPassword/ForgetPassword';
import EditQuestionsCustom from './src/screens/Questions/EditQuestionsCustome';
import PDFURLWebView from './src/screens/PDFURLWebView/PDFURLWebView';
import NotificationWebView from './src/screens/Dashboard/BottomTabs/More/NotificationWebView';
import More from './src/screens/Dashboard/BottomTabs/More/More';
import MoreNavigation from './src/screens/Dashboard/BottomTabs/More/MoreNavigation';
import UpgradePlanOne from './src/screens/Dashboard/BottomTabs/Upgrade/UpgradePlanOne';
import FAQWebView from './src/FAQWebView/FAQWebView';
import ListForMeal from './src/screens/Dashboard/BottomTabs/Plans/ListForMeal';
import LoginScreen from './src/screens/SignIn/LoginScreen';
import StripePaymentWebview from './src/screens/StripePaymentWebview/StripePaymentWebview';
import ChatPdfViewer from './src/screens/ChatPdfViewer';
import StripeFullPaymentWebView from './src/screens/StripeFullPaymentWebView/StripeFullPaymentWebView';
import SubmitSteps from './src/screens/SubmitSteps';
import NewProfiling from './src/screens/Questions/NewProfiling';
import { LocalizationProvider, useChangeLanguage } from './src/utils/LocalizationUtil';
import { NativeModules } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import UpdateNow from './src/screens/UpdateNow';
import Reminder from './src/screens/Dashboard/BottomTabs/More/Reminder';


const BadgeManager = NativeModules.BadgeManager;


const fontConfig = {
  fontFamily: 'Montserrat-Regular',
  fontSize: fontSizes.LAR,
  color: colors.FONT_BLACK
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts({ config: fontConfig }),
};

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();


const App = () => {
  //const appState = useRef(AppState.currentState);
  //const { Nmessages } = useContext(DataContext)
  //const [messages, setMessages] = Nmessages
  //added
  // Function to handle notification click event


  useEffect(() => {
    console.log('Initial useEffect: checkNotificationPermission and requestUserPermissionAndGetToken');
    checkNotificationPermission();
    requestUserPermissionAndGetToken();
    // NotificationListener()
    //Working
    onAppBootstrap()
    getMessageCount()
    //PushNotification.removeAllDeliveredNotifications();
  }, []);


  const updateBadgeCount = (count) => {
    BadgeManager.updateBadgeCount(count);
  };


  const getMessageCount = async () => {
    const temp = await getDataFromLocalStorage('user_id')
    var formdata = new FormData();
    formdata.append("id", JSON.parse(temp));
    const result = await PostApiData('get_all_type_notification_count', formdata)
    console.log("GLOBAL COUNT API ==== >>>", result)
    updateBadgeCount(parseInt(result.count))


    if (result.status == '200') {
      console.log("GLOBAL COUNT API  COUNT==== >>> ==== >>>", parseInt(result.count))
      updateBadgeCount(parseInt(result.count))
    }
  }

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log('AppState Change:', nextAppState);
      if (nextAppState === 'active') {
        console.log('App has come to the foreground!');
        foregroundApi();
      } else if (nextAppState === 'inactive') {
        console.log('App has come to the Inactive!');
        backgroundApi();
      } else if (nextAppState === 'background') {
        console.log('App has come to the Background!');
        backgroundApi();
      }
      // Update the current app state
      AppState.currentState = nextAppState;
    };

    console.log('Adding AppState change listener');
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      console.log('Removing AppState change listener');
      subscription.remove();
    };
  }, []);


  const foregroundApi = async () => {
    var formdata = new FormData()
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    formdata.append('login_time', Date.now())
    const result = await PostApiData2('user_session_activity', formdata)
    console.log("RESULTFORE ", result)
    getMessageCount();
  }
  const backgroundApi = async () => {
    var formdata = new FormData()
    const temp = await getDataFromLocalStorage('user_id')
    formdata.append("user_id", JSON.parse(temp))
    formdata.append('logout_time', Date.now())
    const result = await PostApiData2('user_session_activity', formdata)
    console.log("RESULT BACKGROUND Seesiison", result)
    getMessageCount();
  }




  return (


    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocalizationProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <DataState>
              <Stack.Navigator screenOptions={{
                headerShown: false,
              }}>
                <Stack.Screen name="BootSplash" component={BootSplash} />
                <Stack.Screen name="WelcomeScreenBeforeBottomTabs" component={WelcomeScreenBeforeBottomTabs} />
                <Stack.Screen name="BottomTabs" component={BottomTabs} />
                <Stack.Screen name="Splash" component={RegisterOrSignIn} />
                <Stack.Screen name="Sign In" component={Signin} />
                <Stack.Screen name="Create Account" component={CreateAccount} />
                <Stack.Screen name="SignupPhone" component={SignupWithPhone} />
                <Stack.Screen name="SignupEmail" component={SignupWithEmail} />
                <Stack.Screen name="Questions" component={Questions} />
                <Stack.Screen name="OnDetailsSubmitScreenOne" component={OnDetailsSubmitScreenOne} />
                <Stack.Screen name="OnDetailsSubmitScreenTwo" component={OnDetailsSubmitScreenTwo} />
                <Stack.Screen name="OnDetailsSubmitScreenThree" component={OnDetailsSubmitScreenThree} />
                <Stack.Screen name="Total Points" component={TotalPoints} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
                <Stack.Screen name="editProfile" component={EditProfile} />
                <Stack.Screen name="VerifyOTPAfterRegistrationPhone" component={VerifyOTPAfterRegistrationPhone} />
                <Stack.Screen name="VerifyOTPAfterRegistrationEmail" component={VerifyOTPAfterRegistrationEmail} />
                <Stack.Screen name="VerifyOTPAfterSignInEmail" component={VerifyOTPAfterSignInEmail} />
                <Stack.Screen name="VerifyOTPAfterSignInPhone" component={VerifyOTPAfterSignInPhone} />
                <Stack.Screen name="WelcomeScreenAfterRegistration" component={WelcomeScreenAfterRegistration} />
                <Stack.Screen name="PlanChoosePromptAtStartup" component={PlanChoosePromptAtStartup} />
                <Stack.Screen name="SelectPrefferedLanguage" component={SelectPrefferedLanguage} />
                <Stack.Screen name="SliderIntro" component={SliderIntro} />
                <Stack.Screen name="ExploreNow" component={ExploreNow} />
                <Stack.Screen name="Blank" component={Blank} />
                <Stack.Screen name="QuestionsCustom" component={QuestionsCustom} />
                <Stack.Screen name="Gratification" component={Gratification} />
                <Stack.Screen name="ChatImageDisplay" component={ChatImageDisplay} />
                <Stack.Screen name="ChatImageWebview" component={ChatImageWebview} />
                <Stack.Screen name="SigninCorporate" component={SigninCorporate} />
                <Stack.Screen name="PlanDetailScreen" component={PlanDetailScreen} />
                <Stack.Screen name="PaymentWebview" component={PaymentWebview} />
                <Stack.Screen name="LNFShopWebView" component={LNFShopWebView} />
                <Stack.Screen name="PaidCustomQuestions" component={PaidCustomQuestions} />
                <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
                {/* <Stack.Screen name="Stats" component={Stats} /> */}
                <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                <Stack.Screen name="EditQuestionsCustom" component={EditQuestionsCustom} />
                <Stack.Screen name="PDFURLWebView" component={PDFURLWebView} />
                <Stack.Screen name="NotificationWebView" component={NotificationWebView} />
                <Stack.Screen name="MoreNavigation" component={MoreNavigation} />
                <Stack.Screen name="UpgradePlanOne" component={UpgradePlanOne} />
                <Stack.Screen name="FAQWebView" component={FAQWebView} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="StripePaymentWebview" component={StripePaymentWebview} />
                <Stack.Screen name="StripeFullPaymentWebView" component={StripeFullPaymentWebView} />
                <Stack.Screen name="ChatPdfViewer" component={ChatPdfViewer} />
                <Stack.Screen name="SubmitSteps" component={SubmitSteps} />
                <Stack.Screen name="NewProfiling" component={NewProfiling} />
                <Stack.Screen name="UpdateNow" component={UpdateNow} />
                <Stack.Screen name="Reminder" component={Reminder} />
              </Stack.Navigator>
            </DataState>
          </NavigationContainer>
        </PaperProvider>
      </LocalizationProvider>
    </GestureHandlerRootView>
  )
}




export default App