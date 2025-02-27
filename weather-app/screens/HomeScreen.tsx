import { fetchLocations, fetchWeatherForecast } from "@/api/weather";
import { weatherImages } from "@/constants";
import { ForecastParams, LocationParams, WeatherForecast, Location } from "@/constants/types";
import { theme } from "@/theme/theme-style";
import { getCityNames, getData, saveCityNames, storeData } from "@/utils/asyncStorage";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { View, Image, SafeAreaView, TouchableOpacity, Text, TextInput } from "react-native";
import { MagnifyingGlassIcon, MapPinIcon, HeartIcon as HeartIconOutline } from "react-native-heroicons/outline";
import { HeartIcon as HeartIconFilled } from "react-native-heroicons/solid";
import * as Progress from 'react-native-progress';
import '../global.css';
import { DailyForecast } from "@/components/DailyForecast/DailyForecast.component";
import { HourlyForecast } from "@/components/HourlyForecast/HourlyForecast.component";
import { DailyStats } from "@/components/DailyStats/DailyStats.component";

export default function HomeScreen({ navigation, route }: any){
  const [showSearch, toggleSearch] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [cityNames, setCityNames] = useState<string[]>([]);

  const { selectedCity } = route.params || {};

  const handleLocation = (loc: Location): void => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    let cities = cityNames.includes(loc?.name);
    setIsHeartFilled(cities);
    
    const params: ForecastParams = {
      cityName: loc.name,
      days: 7
    };

    fetchWeatherForecast(params).then((data) => {
      if (data) {
        setWeather(data);
        setLoading(false);
        storeData('city', loc.name);
      }
    });
  };

  const current = weather?.current;
  const location = weather?.location;

  useEffect(() => {
    if (selectedCity) {
      setLoading(true);
      const params: ForecastParams = {
        cityName: selectedCity,
        days: 7,
      };
      fetchWeatherForecast(params).then((data) => {
        setWeather(data);
        setLoading(false);
        storeData('city', selectedCity);
      });
    } else {
      fetchMyWeatherData();
    }
  }, [selectedCity]);

  const handleSearch = (value: string): void => {
    if (value.length > 2) {
      const params: LocationParams = { cityName: value };
      
      fetchLocations(params).then((data: Location[] | null) => {
        if (data) setLocations(data);
        toggleSearch(!showSearch);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
    fetchMyCities();
  }, []);

  useEffect(() => {
    if (location?.name) {
      setIsHeartFilled(cityNames.includes(location.name));
    }
  }, [cityNames, location]); 

  const fetchMyWeatherData = async (): Promise<void> => {
    let myCity = await getData('city');
    if(!myCity){
        myCity = 'Cape Town';
    }
    fetchWeatherForecast({
      cityName: myCity,
      days: 7
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const fetchMyCities = async (): Promise<void> => {
    const savedCities = await getCityNames();
    setCityNames(savedCities);

    if (location?.name && savedCities.includes(location.name)) {
        setIsHeartFilled(true);
    } else {
        setIsHeartFilled(false);
    }
  }
    const handleTextDebounce = useCallback(
        debounce((text) => handleSearch(text), 1200),
        [handleSearch]
      );

  const getWeatherImage = (condition: string | undefined): any => {
    return weatherImages[condition as keyof typeof weatherImages] || weatherImages['other'];
  };

  const handleHeartClick = () => {
    
    if(location?.name != undefined){
      let cities = cityNames.includes(location?.name);

      if(!cities){
        cityNames.push(location?.name);
        saveCityNames(cityNames);
        setIsHeartFilled(true);
      }
    }
    setIsHeartFilled(true);
  };

  return (
    <View className="flex-1 relative">
      <Image blurRadius={50} source={require('../assets/images/ocean.jpg')} className="absolute h-full w-full" />
      {
        loading ? (
          <View className="flex-1 flex-row justify-center items-center">
            <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2"/>
          </View>
        ) : (
          <SafeAreaView className="flex flex-1">
            <View className="p-2 flex-row justify-between items-center">
                <TouchableOpacity 
                    style={{ backgroundColor: theme.bgWhite(0) }}
                    className="p-4 mt-2"
                    onPress={() => navigation.navigate("FavouritesScreen")}
                >
                    <Text className="text-white text-center text-xl">Go to Favourites</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleHeartClick()}
                    style={{ backgroundColor: theme.bgWhite(0) }}
                    className="rounded-full p-5 m-1"
                >
                    {
                        isHeartFilled ? <HeartIconFilled color="#8b0000"/> : <HeartIconOutline color="#8b0000"/>
                    }
                </TouchableOpacity>
            </View>
            {/*search section*/}
            <View style={{height: '7%'}} className="mx-4 relative z-50">
              <View className="flex-row justify-end items-center rounded-full" style={{backgroundColor: theme.bgWhite(0.2)}}>
              <TextInput 
                      onChangeText={handleTextDebounce}
                      placeholder="Search city"
                      placeholderTextColor={'lightgray'}
                      className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                    />
                <TouchableOpacity 
                  onPress={() => toggleSearch(!showSearch)}
                  style={{backgroundColor: theme.bgWhite(0.3)}}
                  className="rounded-full p-3 m-1"
                >
                  <MagnifyingGlassIcon size="25" color="white"/>
                </TouchableOpacity>
              </View>
              {
                locations.length > 0 && showSearch ? (
                  <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                    {
                      locations.map((loc: Location, index) => {
                        const showBorder = index + 1 !== locations.length;
                        const borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                        return (
                          <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}
                          >
                            <MapPinIcon size="20" color="gray" />
                            <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                          </TouchableOpacity>
                        );
                      })
                    }
                  </View>
                ) : null
              }
            </View>

            <View className="mx-4 flex justify-around flex-1 mb-2">
              <Text className="text-white text-center text-3xl font-bold">
                {location?.name}, 
                <Text className="text-lg font-semibold text-gray-300">
                  {location?.country}
                </Text>
              </Text>

              <View className="flex-row justify-center">
                <Image source={getWeatherImage(current?.condition?.text)} className="w-40 h-40" />
              </View>
              <View className="space-y-1">
                <Text className="text-center font-bold text-white text-5xl ml-5">
                  {current?.temp_c}&deg;
                </Text>
                <Text className="text-center text-white text-xl tracking-widest">
                  {current?.condition.text}
                </Text>
              </View>

              <DailyStats current={current} weather={weather}/>
            </View>

            <HourlyForecast weather={weather}/>

            <DailyForecast weather={weather}/>
          </SafeAreaView>
        )
      }
    </View>
  );
      
}