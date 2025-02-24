import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save last searched city name
export const storeData = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error storing value:', error);
    }
};

// Function to save a list of city names
export const saveCityNames = async (cityNames: string[]) => {
  try {
    await AsyncStorage.setItem('cityNames', JSON.stringify(cityNames));
    console.log('City names saved successfully!');
  } catch (error) {
    console.error('Error saving city names:', error);
  }
};

// Function to retrieve the last searched city name
export const getData = async (key: string): Promise<any | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error retrieving value:', error);
        return null;
    }
};

  // Function to retrieve the list of city names
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

// Function to clear AsyncStorage
export const clearStorage = async () => {
    try {
      await AsyncStorage.clear(); // Clears all data in AsyncStorage
      console.log('AsyncStorage cleared successfully');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
