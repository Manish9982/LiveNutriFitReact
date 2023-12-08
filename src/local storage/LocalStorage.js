import AsyncStorage from "@react-native-async-storage/async-storage"


export const storeDataAuth = async (value) => {
  try {
    await AsyncStorage.setItem('Auth', value)
  } catch (e) {
    console.log('Async Storage Auth Value error =>', e)
  }
}
export const storeDataInLocalStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log('Async Storage Value error =>', e)
  }
}

export const getDataFromLocalStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch (e) {
    console.log('Async Storage Value error =>', e)
  }
}
export const removeDataFromLocalStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    console.log(e)
  }
}


