import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '@/screens/HomeScreen';
import FavouritesScreen from '@/screens/FavouritesScreen';

type RootStackParamList = {
    HomeScreen: undefined;
    FavouritesScreen: undefined;
  };

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => (
    <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="HomeScreen" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="FavouritesScreen" component={FavouritesScreen} />
    </Stack.Navigator>
);

export default App;
