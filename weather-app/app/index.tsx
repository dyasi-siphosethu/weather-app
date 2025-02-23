import { Text, View, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Button, ActivityIndicator } from "react-native";
import '../global.css';
import { StatusBar } from 'expo-status-bar';
import { theme } from "@/theme/theme-style";

import { CalendarDaysIcon, MagnifyingGlassIcon, HeartIcon as HeartIconOutline} from 'react-native-heroicons/outline';
import { MapPinIcon, HeartIcon as HeartIconFilled } from 'react-native-heroicons/solid';
import { useCallback, useEffect, useState } from "react";
import { debounce } from 'lodash'
import { fetchLocations, fetchWeatherForecast} from "@/api/weather";
import { weatherImages } from "@/constants";
import * as Progress from 'react-native-progress';
import { getCityNames, getData, saveCityNames, storeData } from "@/utils/asyncStorage";
import { WeatherForecast, ForecastParams, LocationParams, Location } from "@/constants/types";

export default function Index() {
  // State declarations with types
  const [showSearch, toggleSearch] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [cityNames, setCityNames] = useState<string[]>([]);

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

    fetchWeatherForecast(params).then((data: WeatherForecast | null) => {
      if (data) {
        setWeather(data);
        setLoading(false);
        storeData('city', loc.name);
      }
    });
  };

  const current = weather?.current;
  const location = weather?.location;

  const handleSearch = (value: string): void => {
    if (value.length > 2) {
      const params: LocationParams = { cityName: value };
      
      fetchLocations(params).then((data: Location[] | null) => {
        if (data) setLocations(data);
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
    let cityName = '';

    cityName = myCity;

    fetchWeatherForecast({
      cityName,
      days: 7
    }).then(data => {
      setWeather(data);
      console.log(weather?.location.name);
      setLoading(false);
    });
  };

  const fetchMyCities = async (): Promise<void> => {
    const savedCities = await getCityNames();
  setCityNames(savedCities);

  // Check if current city is in saved cities and update heart state
  if (location?.name && savedCities.includes(location.name)) {
    setIsHeartFilled(true);
  } else {
    setIsHeartFilled(false);
  }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);



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
        console.log(cityNames);
      }
    }
    setIsHeartFilled(true);
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image blurRadius={70} source={require('../assets/images/bg.png')} className="absolute h-full w-full" />
      {
        loading ? (
          <View className="flex-1 flex-row justify-center items-center">
            <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2"/>
          </View>
        ) : (
          <SafeAreaView className="flex flex-1">
            {/*search section*/}
            <View style={{height: '7%'}} className="mx-4 relative z-50">
              <View className="flex-row justify-end items-center rounded-full" style={{backgroundColor: showSearch ? theme.bgWhite(0.2): 'transparent'}}>
                {
                  showSearch ? (
                    <TextInput 
                      onChangeText={handleTextDebounce}
                      placeholder="Search city"
                      placeholderTextColor={'lightgray'}
                      className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                    />
                  ) : null
                }
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

            <View className="flex-row justify-end items-center">
              <TouchableOpacity
                onPress={() => handleHeartClick()} // Toggle heart fill state on click
                style={{ backgroundColor: theme.bgWhite(0) }}
                className="rounded-full p-5 m-1"
              >
                {
                  isHeartFilled ? <HeartIconFilled/> : <HeartIconOutline/>
                }
              </TouchableOpacity>
            </View>

            {/*forecast area */}
            <View className="mx-4 flex justify-around flex-1 mb-2">
              {/*location */}
              <Text className="text-white text-center text-2xl font-bold">
                {location?.name}, 
                <Text className="text-lg font-semibold text-gray-300">
                  {location?.country}
                </Text>
              </Text>

              {/*weather image */}
              <View className="flex-row justify-center">
                <Image source={getWeatherImage(current?.condition?.text)} className="w-52 h-52" />
              </View>
              {/* degree celsius */}
              <View className="space-y-2">
                <Text className="text-center font-bold text-white text-6xl ml-5">
                  {current?.temp_c}&deg;
                </Text>
                <Text className="text-center text-white text-xl tracking-widest">
                  {current?.condition.text}
                </Text>
              </View>

              {/* other stats */}
              <View className="flex-row justify-between mx-4">
                <View className="flex-row space-x-2 items-center">
                  <Image source={require('../assets/icons/wind.png')} className="h-6 w-6" />
                  <Text className="text-white font-semibold text-base">
                    {current?.wind_kph}km
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image source={require('../assets/icons/wind.png')} className="h-6 w-6"/>
                  <Text className="text-white font-semibold text-base">
                    {current?.humidity}%
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image source={require('../assets/icons/wind.png')} className="h-6 w-6" />
                  <Text className="text-white font-semibold text-base">
                    {weather?.forecast.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>
            </View>

            {/*hourly forecasts */}
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size="22" color="white" />
                <Text className="text-white text-base">Hourly Forecast</Text>
              </View>
              
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
              >
                {(() => {
                  const today = new Date().toISOString().split("T")[0];
                  const currentHour = new Date().getHours();
                  
                  // Get today's forecast
                  const todayForecast = weather?.forecast?.forecastday.find(day => day.date === today);
                  const todayHours = todayForecast?.hour.filter(hourly => {
                    const forecastHour = new Date(hourly.time).getHours();
                    return forecastHour >= currentHour;
                  }) || [];

                  // Get tomorrow's forecast (if available)
                  const tomorrowForecast = weather?.forecast?.forecastday.find(day => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return day.date === tomorrow.toISOString().split("T")[0];
                  });

                  const remainingHoursNeeded = 24 - todayHours.length; // Fill up to 24 hours
                  const tomorrowHours = tomorrowForecast?.hour.slice(0, remainingHoursNeeded) || [];

                  // Combine today's remaining hours + tomorrow's initial hours
                  const full24Hours = [...todayHours, ...tomorrowHours];

                  return full24Hours.map((hourly, index) => {
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
                  });
                })()}
              </ScrollView>
            </View>

            {/*forecast for next days */}
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size="22" color="white"/>
                <Text className="text-white text-base"> Daily forecast</Text>
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
          </SafeAreaView>
        )
      }
    </View>
  );
}
