import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error storing city name:', error);
    }
};

export const saveCityNames = async (cityNames: string[]) => {
  try {
    await AsyncStorage.setItem('cityNames', JSON.stringify(cityNames));
    console.log('City names saved successfully!');
  } catch (error) {
    console.error('Error storing city names:', error);
  }
};

export const getData = async (key: string): Promise<any | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error retrieving city name:', error);
        return null;
    }
};

export const getCityNames = async () => {
  try {
    const savedCityNames = await AsyncStorage.getItem('cityNames');
    if (savedCityNames !== null) {
      return JSON.parse(savedCityNames);
    } else {
      console.log('No city names found');
      return [];
    }
  } catch (error) {
    console.error('Error retrieving city names:', error);
    return [];
  }
};

export const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
