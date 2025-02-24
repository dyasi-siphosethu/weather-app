import React from 'react';
import { DailyStatsProps } from './DailyStats.types';
import { View, Image, Text } from 'react-native';

export const DailyStats = ({current, weather}: DailyStatsProps): JSX.Element => {
    return (
        <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
                <Image source={require('../../assets/icons/wind.png')} className="h-6 w-6" />
                <Text className="text-white text-base pl-2"> {current?.wind_kph}km </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
                <Image source={require('../../assets/icons/rainy.png')} className="h-6 w-6"/>
                <Text className="text-white text-base pl-2">{current?.humidity}%</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
                <Image source={require('../../assets/icons/sunset.png')} className="h-6 w-6" />
                <Text className="text-white text-base pl-2">{weather?.forecast.forecastday[0]?.astro?.sunrise}</Text>
            </View>
        </View>           
    );
}