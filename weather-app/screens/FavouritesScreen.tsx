import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getCityNames } from "@/utils/asyncStorage";
import { fetchWeatherForecast } from "@/api/weather";
import { ForecastParams, WeatherForecast } from "../constants/types"; // Adjust as needed
import { weatherImages } from "@/constants";
import { theme } from "@/theme/theme-style";
type FavouritesScreenProps = {
    navigation: any;
  };

const FavouritesScreen: React.FC<FavouritesScreenProps> = ({ navigation }: any) => {
  const [cityNames, setCityNames] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCitySelect = (cityName: string) => {
    navigation.navigate('HomeScreen', {
      selectedCity: cityName,
    });
  };

  // Fetch stored city names
  const fetchMyCities = async (): Promise<void> => {
    const savedCities = await getCityNames();
    setCityNames(savedCities);
  };

  useEffect(() => {
    fetchMyCities();
  }, []);

  // Fetch weather data for all cities
  useEffect(() => {
    if (cityNames.length === 0) return;

    const fetchAllWeather = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          cityNames.map(async (city) => {
            const params: ForecastParams = { cityName: city, days: 1 };
            return await fetchWeatherForecast(params);
          })
        );

        setWeatherData(results.filter((data) => data !== null) as WeatherForecast[]);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWeather();
  }, [cityNames]);

  const getWeatherImage = (condition: string | undefined): any => {
      return weatherImages[condition as keyof typeof weatherImages] || weatherImages['other'];
    };

  return (
    <View className="flex-1">
        <Image blurRadius={50} source={require('../assets/images/ocean.jpg')} className="absolute h-full w-full" resizeMode="cover"/>
      <Text className="text-white text-3xl font-bold px-6 pt-12">Weather</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
            className="px-4 pt-12"
          data={weatherData}
          keyExtractor={(item) => item.location.name}
          renderItem={({ item }) => (
            <View className="bg-gray-500 rounded-xl p-4 mb-3" style={{ backgroundColor: theme.bgWhite(0.15) }}>
                <TouchableOpacity onPress={() => handleCitySelect(item.location.name)} className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">{item.location.name}</Text>
                        <Text className="text-gray-300">{item.current.condition.text}</Text>
                        <Text className="text-white text-3xl font-bold">{item.current.temp_c}°</Text>
                    </View>
                    <Image
                        source={getWeatherImage(item.current.condition.text)}
                        className="h-11 w-11 ml-4"
                    />
                </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavouritesScreen;
