
import { useState } from "react";
import DataContext from "./DataContext";

import React from 'react'



const DataState = (props) => {

    const [signup_type, setSignup_type] = useState('')
    const [mobile, setMobile] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [otp, setOtp] = useState('')
    const [questionNumber, setQuestionNumber] = useState(1)
    const [num, setNum] = useState(0)
    const [disable, setDisable] = useState(true)
    const [visible, setVisible] = useState(false)
    const [heading, setHeading] = useState("")
    const [subHeading, setSubHeading] = useState("")
    const [visibleSnackOne, setVisibleSnackOne] = useState(false)
    const [visibleSnackTwo, setVisibleSnackTwo] = useState(false)
    const [visibleSnackThree, setVisibleSnackThree] = useState(false)
    const [isInfoButtonVisible, setIsInfoButtonVisible] = useState(true)
    const [globalBmi, setGlobalBmi] = useState(null)
    const [crrnt, setCrrnt] = useState()
    const [trgt, setTrgt] = useState()
    const [ht, setHt] = useState()
    const [feet, setFeet] = useState()
    const [inch, setInch] = useState()
    const [visibleMood, setVisibleMood] = useState(false)
    const [visibleMoodGood, setVisibleMoodGood] = useState(false)
    const [visibleMood2, setVisibleMood2] = useState(false)
    const [myMeals, setMyMeals] = useState(null)
    const [data, setData] = useState(null)
    const [myExercise, setMyExercise] = useState(null)
    const [messages, setMessages] = useState([])
    const [count, setCount] = useState(null)
    const [weight, setWeight] = useState()
    const [weight2, setWeight2] = useState()
    const [weight3, setWeight3] = useState()
    const [secondaryLoader, setSecondaryLoader] = useState(false)
    const [language, setLanguage] = useState()


    return (
        < DataContext.Provider value={{
            NsignupType: [signup_type, setSignup_type],
            Nmobile: [mobile, setMobile],
            NcountryCode: [countryCode, setCountryCode],
            Notp: [otp, setOtp],
            NquestionNumber: [questionNumber, setQuestionNumber],
            Nnum: [num, setNum],
            Ndisable: [disable, setDisable],
            Nvisible: [visible, setVisible],
            Nheading: [heading, setHeading],
            NsubHeading: [subHeading, setSubHeading],
            NvisibleSnackOne: [visibleSnackOne, setVisibleSnackOne],
            NvisibleSnackTwo: [visibleSnackTwo, setVisibleSnackTwo],
            NvisibleSnackThree: [visibleSnackThree, setVisibleSnackThree],
            NisInfoButtonVisible: [isInfoButtonVisible, setIsInfoButtonVisible],
            NglobalBmi: [globalBmi, setGlobalBmi],
            Ncrrnt: [crrnt, setCrrnt],
            Ntrgt: [trgt, setTrgt],
            Nht: [ht, setHt],
            Nfeet: [feet, setFeet],
            Ninch: [inch, setInch],
            NvisibleMood: [visibleMood, setVisibleMood],
            NvisibleMoodGood: [visibleMoodGood, setVisibleMoodGood],
            NvisibleMood2: [visibleMood2, setVisibleMood2],
            NmyMeals: [myMeals, setMyMeals],
            Ndata: [data, setData],
            NmyExercise: [myExercise, setMyExercise],
            Nmessages: [messages, setMessages],
            Ncount: [count, setCount],
            Nweight: [weight, setWeight],
            Nweight2: [weight2, setWeight2],
            Nweight3: [weight3, setWeight3],
            Nlanguage: [language, setLanguage],
            NsecondaryLoader: [secondaryLoader, setSecondaryLoader],
        }}>

            {props.children}
        </DataContext.Provider>
    )
}
export default DataState;
