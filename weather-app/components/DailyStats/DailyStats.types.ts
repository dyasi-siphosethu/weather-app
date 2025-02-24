import { WeatherCondition } from "@/constants/types";
import { WeatherForecast } from "@/constants/types";

export interface DailyStatsProps {
    current: {
        temp_c: number;
        condition: WeatherCondition;
        humidity: number;
        wind_kph: number;
      } | undefined;
    weather: WeatherForecast | null;
  }