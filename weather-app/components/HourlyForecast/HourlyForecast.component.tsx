import React from "react";
import { HourlyForecastProps } from "./HourlyForecast.types";
import { View, Text, ScrollView, Image } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import { theme } from "@/theme/theme-style";
import { getWeatherImage } from "@/constants";

export const HourlyForecast = ({weather}: HourlyForecastProps): JSX.Element => {
    const today = new Date().toISOString().split("T")[0];
    const currentHour = new Date().getHours();

    const todayForecast = weather?.forecast?.forecastday.find(day => day.date === today);
    const todayHours = todayForecast?.hour.filter(hourly => {
      const forecastHour = new Date(hourly.time).getHours();
      return forecastHour >= currentHour;
    }) || [];

    const tomorrowForecast = weather?.forecast?.forecastday.find(day => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return day.date === tomorrow.toISOString().split("T")[0];
    });

      const remainingHoursNeeded = 24 - todayHours.length; 
      const tomorrowHours = tomorrowForecast?.hour.slice(0, remainingHoursNeeded) || [];
      const full24Hours = [...todayHours, ...tomorrowHours];

    return (
        <View className="mb-2 space-y-3">
        <View className="flex-row items-center mx-5 space-x-2 pb-2">
          <CalendarDaysIcon size="22" color="white" />
          <Text className="text-white text-base font-semibold pl-2">Hourly Forecast</Text>
        </View>
        
        <ScrollView
          horizontal
          contentContainerStyle={{ paddingHorizontal: 15 }}
          showsHorizontalScrollIndicator={false}
        >
          {full24Hours.map((hourly, index) => {
                const hourTime = new Date(hourly.time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });

              return (
                <View
                  key={index}
                  className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                  style={{ backgroundColor: theme.bgWhite(0.15) }}
                >
                  <Image
                    source={getWeatherImage(hourly.condition.text)}
                    className="h-11 w-11"
                  />
                  <Text className="text-white">{hourTime}</Text>
                  <Text className="text-white text-xl font-semibold">
                    {hourly.temp_c}°C
                  </Text>
                </View>
              );
            })}
        </ScrollView>
      </View>

    );
};