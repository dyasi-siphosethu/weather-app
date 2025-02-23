import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from 'react-native';
import HomeScreen from '@/screens/HomeScreen';
import FavouritesScreen from '@/screens/FavouritesScreen';

type RootStackParamList = {
    HomeScreen: undefined;
    FavouritesScreen: undefined; // Ensure this matches the screen name
  };

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => (
    <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="HomeScreen" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="FavouritesScreen" component={FavouritesScreen} />
    </Stack.Navigator>
);

export default App;
