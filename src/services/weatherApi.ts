import { BASE_URL, API_KEY } from '@/constants';
import { RawWeatherData, WeatherData } from '@/types';

const formatWeather = (data: RawWeatherData): WeatherData => ({
  id: `${data.location.lat}-${data.location.lon}`,
  name: data.location.name,
  country: data.location.country,
  region: data.location.region,
  lat: data.location.lat,
  lon: data.location.lon,
  temp: Math.round(data.current.temp_c),
  feels_like: Math.round(data.current.feelslike_c),
  humidity: data.current.humidity,
  pressure: data.current.pressure_mb,
  wind: data.current.wind_kph,
  wind_dir: data.current.wind_dir,
  uv: data.current.uv,
  visibility: data.current.vis_km,
  description: data.current.condition.text,
  icon: data.current.condition.icon.startsWith('//')
    ? `https:${data.current.condition.icon}`
    : data.current.condition.icon,
  last_updated: data.current.last_updated,
});

export const weatherApi = {
  getByCity: async (city: string): Promise<WeatherData | null> => {
    try {
      const res = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no&lang=ru`);
      if (!res.ok) return null;
      const data: RawWeatherData = await res.json();
      return formatWeather(data);
    } catch {
      return null;
    }
  },

  getByCoords: async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
      const res = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no&lang=ru`);
      if (!res.ok) return null;
      const data: RawWeatherData = await res.json();
      return formatWeather(data);
    } catch {
      return null;
    }
  },
};