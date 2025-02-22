// Type Definitions
export type ForecastParams = {
    cityName: string;
    days: number;
  };
  
  export type LocationParams = {
    cityName: string;
  };
  
  export type Location = {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
  }
  
  export type WeatherForecast = {
    location: Location;
    current: {
      temp_c: number;
      condition: {
        text: string;
        icon: string;
      };
      humidity: number;
      wind_kph: number;
    };
    forecast: {
      forecastday: Array<{
        date: string;
        day: {
          maxtemp_c: number;
          mintemp_c: number;
          avgtemp_c: number;
          condition: {
            text: string;
            icon: string;
          };
        };
        astro: {
          sunrise: string;
          sunset: string;
          moonrise: string;
          moonset: string;
          moon_phase: string;
          moon_illumination: number;
          is_moon_up: number;
          is_sun_up: number;
        };
      }>;
    };
  };

  export type LocationSearchResults = Array<Location>;
  