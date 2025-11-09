import { useEffect, useCallback } from 'react';
import { useWeatherStore } from '@/index';
import { weatherApi } from '@/index';
import { DEFAULT_CITY } from '@/constants';

export const useWeatherLogic = () => {
  const {
    setCurrentWeather,
    setActiveCity,
    setIsLoading,
    setError,
    savedCities,
  } = useWeatherStore();

  const fetchByCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setError('');
    const data = await weatherApi.getByCity(city);
    setIsLoading(false);
    if (!data) {
      setError('Город не найден');
      return null;
    }
    return data;
  }, [setIsLoading, setError]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      fetchByCity(DEFAULT_CITY);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const weather = await weatherApi.getByCoords(pos.coords.latitude, pos.coords.longitude);
        if (weather) {
          setCurrentWeather(weather);
          setActiveCity(weather);
        }
        setIsLoading(false);
      },
      () => {
        setError('Геолокация отключена');
        fetchByCity(DEFAULT_CITY);
        setIsLoading(false);
      }
    );
  }, [fetchByCity, setIsLoading, setError, setCurrentWeather, setActiveCity]);

  const addCity = useCallback(async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Введите название города');
      return;
    }
    const data = await fetchByCity(cityName);
    if (data) useWeatherStore.getState().addCity(data);
  }, [fetchByCity, setError]);

  useEffect(() => {
    const loadPersisted = () => {
      if (savedCities.length > 0) {
        setActiveCity(savedCities[0]);
      }
    };
    loadPersisted();
    getCurrentLocation();
  }, [savedCities, setActiveCity, getCurrentLocation]);

  return {
    addCity,
    getCurrentLocation,
    fetchByCity,
  };
};