import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Localization from 'react-native-localization';

const LocalizationContext = createContext();

const defaultLanguage = 'en';

export const LocalizationProvider = ({ children }) => {
  const [locales, setLocales] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        var formdata = new FormData()
        formdata.append('code', currentLanguage)
        var requestOptions = {
          method: 'POST',
          //headers: myHeaders,
          body: formdata,
          redirect: 'follow'
        };
        //const response = await fetch(`https://example.com/api/localization/${currentLanguage}`);
        const response = await fetch(`https://uat.livenutrifit.com/panel/getlanguage_title`, requestOptions);
        const json = await response.json();
        const currentLocales = new Localization({ [currentLanguage]: json });
        setLocales(currentLocales);
      } catch (error) {
        //Alert.alert('Error loading language');
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, [currentLanguage]);

  const changeLanguage = async (newLanguage) => {
    setCurrentLanguage(newLanguage);
  };

  if (!locales) {
    // You might want to render a loading indicator here
    return null;
  }

  return (
    <LocalizationContext.Provider value={{ locales, changeLanguage }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocales = () => {
  const { locales } = useContext(LocalizationContext);

  if (!locales) {
    console.error('Locales not initialized. Make sure to wrap your app with LocalizationProvider.');
  }

  return locales;
};

export const useChangeLanguage = () => {
  const { changeLanguage } = useContext(LocalizationContext);

  if (!changeLanguage) {
    console.error('Change language function not available. Make sure to wrap your app with LocalizationProvider.');
  }

  return changeLanguage;
};
