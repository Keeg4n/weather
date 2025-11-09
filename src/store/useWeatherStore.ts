import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';
import { WeatherData, Settings } from '@/types';

interface WeatherState {
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

const defaultSettings: Settings = {
  showHumidity: true,
  showFeelsLike: true,
  showPressure: true,
  showWind: true,
  showUV: false,
  showVisibility: false,
  units: 'metric',
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentWeather: null,
      savedCities: [],
      activeCity: null,
      searchQuery: '',
      isLoading: false,
      error: '',
      showSettings: false,
      settings: defaultSettings,

      setCurrentWeather: (weather) => set({ currentWeather: weather }),
      setSavedCities: (cities) => set({ savedCities: cities }),
      setActiveCity: (city) => set({ activeCity: city }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setShowSettings: (show) => set({ showSettings: show }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addCity: (city) => {
        const { savedCities } = get();
        if (savedCities.some((c) => c.id === city.id)) return;
        const updated = [...savedCities, city];
        set({ savedCities: updated, searchQuery: '', error: '' });
      },

      removeCity: (id) => {
        const { savedCities, activeCity, currentWeather } = get();
        const filtered = savedCities.filter((c) => c.id !== id);
        set({
          savedCities: filtered,
          activeCity:
            activeCity?.id === id
              ? filtered[0] || currentWeather || null
              : activeCity,
        });
      },
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      partialize: (state) => ({
        settings: state.settings,
        savedCities: state.savedCities,
      }),
    }
  )
);