import AsyncStorage from '@react-native-async-storage/async-storage';


const getValue = async (key) => {
        try {
          const jsonValue = await AsyncStorage.getItem(key)
          let result = jsonValue != null ? JSON.parse(jsonValue) : null
          return result
        } catch(e) {
          console.log(e)
        }
}


const setValue = async (value, key) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch(e) {
            console.log(e)
        }
        console.log('set')
}

const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch(e) {
    console.log(e)
  }

  console.log('removed')
}
      
export {getValue, setValue, removeValue}