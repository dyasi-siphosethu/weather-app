import { getWeatherImage } from '@/constants';
import { DailyForecastProps } from './DailyForecast.types';
import { theme } from '@/theme/theme-style';
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';

export const DailyForecast = ({weather}: DailyForecastProps): JSX.Element => {

    return (
        <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2 pb-2">
                <CalendarDaysIcon size="22" color="white"/>
                <Text className="text-white text-base font-semibold pl-2"> Daily forecast</Text>
              </View>
              <ScrollView 
                horizontal 
                contentContainerStyle={{paddingHorizontal: 15}} 
                showsHorizontalScrollIndicator={false}
              >
                {
                  weather?.forecast?.forecastday?.map((item, index) => {
                    const date = new Date(item.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

                    return(
                      <View
                        key={index}
                        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                        style={{backgroundColor: theme.bgWhite(0.15)}}
                      >
                        <Image source={getWeatherImage(item?.day?.condition?.text)}
                          className="h-11 w-11" />
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white text-xl font-semibold">
                          {item?.day?.avgtemp_c}&deg;
                        </Text>
                      </View>
                    )
                  })
                }
              </ScrollView>
            </View>

    );
}