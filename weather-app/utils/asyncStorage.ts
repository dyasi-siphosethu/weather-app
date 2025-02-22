import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value); // Ensure data is stored as a string
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error storing value:', error);
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
