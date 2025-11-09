export interface RawWeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    wind_dir: string;
    uv: number;
    vis_km: number;
    condition: { text: string; icon: string };
    last_updated: string;
  };
}

export interface WeatherData {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind: number;
  wind_dir: string;
  uv: number;
  visibility: number;
  description: string;
  icon: string;
  last_updated: string;
}

export interface Settings {
  showHumidity: boolean;
  showFeelsLike: boolean;
  showPressure: boolean;
  showWind: boolean;
  showUV: boolean;
  showVisibility: boolean;
  units: 'metric' | 'imperial';
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  savedCities: WeatherData[];
  activeCity: WeatherData | null;
  searchQuery: string;
  isLoading: boolean;
  error: string;
  showSettings: boolean;
  settings: Settings;

  setCurrentWeather: (weather: WeatherData | null) => void;
  setSavedCities: (cities: WeatherData[]) => void;
  setActiveCity: (city: WeatherData | null) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setShowSettings: (show: boolean) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addCity: (city: WeatherData) => void;
  removeCity: (id: string) => void;
}