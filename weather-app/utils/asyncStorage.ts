import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value); // Ensure data is stored as a string
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error storing value:', error);
    }
};

// Function to save a list of city names
export const saveCityNames = async (cityNames: string[]) => {
  try {
    // Convert the list to a JSON string
    await AsyncStorage.setItem('cityNames', JSON.stringify(cityNames));
    console.log('City names saved successfully!');
  } catch (error) {
    console.error('Error saving city names:', error);
  }
};


export const getData = async (key: string): Promise<any | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null; // Parse if not null
    } catch (error) {
        console.error('Error retrieving value:', error);
        return null; // Return null on failure
    }
};

  // Function to retrieve the list of city names
export const getCityNames = async () => {
  try {
    // Get the saved list and parse it back to an array
    const savedCityNames = await AsyncStorage.getItem('cityNames');
    if (savedCityNames !== null) {
      return JSON.parse(savedCityNames);
    } else {
      console.log('No city names found');
      return []; // Return an empty array if no city names are saved
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
