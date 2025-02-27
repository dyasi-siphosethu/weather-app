import axios from "axios";
import { apikey } from "@/constants";
import { ForecastParams, LocationParams, LocationSearchResults, WeatherForecast } from "@/constants/types";

const forecastEndpoint = (params: ForecastParams): string =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;

const locationsEndpoint = (params: LocationParams): string =>
  `https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${params.cityName}`;

const apiCall = async <T>(endpoint: string): Promise<T | null> => {
  try {
    const { data } = await axios.get<T>(endpoint);
    return data;
  } catch (err) {
    console.error('Error fetching data:', err);
    return null;
  }
};

export const fetchWeatherForecast = (params: ForecastParams): Promise<WeatherForecast | null> =>
  apiCall<WeatherForecast>(forecastEndpoint(params));

export const fetchLocations = (params: LocationParams): Promise<LocationSearchResults | null> =>
  apiCall<LocationSearchResults>(locationsEndpoint(params));
