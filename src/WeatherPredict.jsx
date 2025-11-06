import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  SETTINGS: 'weather_app_settings_v2',
  CITIES: 'weather_app_cities_v2'
};

const WeatherApp = () => {
  const API_KEY = 'c48e254628fd4de7920194613250511';
  const BASE_URL = 'https://api.weatherapi.com/v1';

  const [currentWeather, setCurrentWeather] = useState(null);
  const [savedCities, setSavedCities] = useState([]);
  const [activeCity, setActiveCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState({
    showHumidity: true,
    showFeelsLike: true,
    showPressure: true,
    showWind: true,
    showUV: false,
    showVisibility: false,
    units: 'metric'
  });

  // Загрузка из localStorage при старте
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const savedCities = localStorage.getItem(STORAGE_KEYS.CITIES);

      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedCities) {
        const cities = JSON.parse(savedCities);
        setSavedCities(cities);
        if (cities.length > 0) setActiveCity(cities[0]);
      }
    } catch (e) {
      console.error('Ошибка localStorage:', e);
    }

    getCurrentLocationWeather();
  }, []);

  // Функция сохранения городов в localStorage
  const saveCitiesToStorage = (cities) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(cities));
      console.log('Городы сохранены:', cities);
    } catch (e) {
      console.error('Ошибка сохранения городов:', e);
    }
  };

  // Функция сохранения настроек в localStorage
  const saveSettingsToStorage = (newSettings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      console.log('Настройки сохранены:', newSettings);
    } catch (e) {
      console.error('Ошибка сохранения настроек:', e);
    }
  };

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      fetchWeatherByCity('Moscow');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const weather = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        setCurrentWeather(weather);
        setActiveCity(weather);
        setIsLoading(false);
      },
      () => {
        setError('Геолокация отключена');
        fetchWeatherByCity('Moscow');
        setIsLoading(false);
      }
    );
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    const res = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no&lang=ru`);
    const data = await res.json();
    return formatWeatherData(data);
  };

  const fetchWeatherByCity = async (cityName) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${cityName}&aqi=no&lang=ru`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const formatted = formatWeatherData(data);
      setActiveCity(formatted);
      setIsLoading(false);
      return formatted;
    } catch {
      setError('Город не найден');
      setIsLoading(false);
      return null;
    }
  };

  const formatWeatherData = (data) => ({
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
    description: data.current.condition.text,
    icon: data.current.condition.icon,
    wind: data.current.wind_kph,
    wind_dir: data.current.wind_dir,
    uv: data.current.uv,
    visibility: data.current.vis_km,
    last_updated: data.current.last_updated,
  });

  const addCity = async (cityName) => {
    if (!cityName.trim()) {
      setError('Введите название города');
      return;
    }

    const data = await fetchWeatherByCity(cityName);
    if (!data) return;

    if (savedCities.some(c => c.id === data.id)) {
      setError('Этот город уже добавлен');
      return;
    }

    const updatedCities = [...savedCities, data];
    setSavedCities(updatedCities);
    saveCitiesToStorage(updatedCities); // Сохраняем сразу при добавлении
    setSearchQuery('');
    setError('');
  };

  const removeCity = (id) => {
    const filtered = savedCities.filter(c => c.id !== id);
    setSavedCities(filtered);
    saveCitiesToStorage(filtered); // Сохраняем сразу при удалении
    
    if (activeCity?.id === id) {
      setActiveCity(filtered[0] || currentWeather || null);
    }
  };

  // Обновляем настройки с сохранением
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings); // Сохраняем сразу при изменении
  };

  const convertTemp = (temp) => {
    return settings.units === 'imperial'
      ? Math.round((temp * 9 / 5) + 32)
      : temp;
  };

  const getWeatherIcon = (url) => url.startsWith('//') ? `https:${url}` : url;

  const displayData = activeCity || currentWeather;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">Метео Прогноз</h1>
          <p className="text-xl text-blue-100">Погода в реальном времени</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная панель */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
              {isLoading ? (
                <div className="flex flex-col items-center py-20">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent"></div>
                  <p className="mt-6 text-2xl">Загрузка...</p>
                </div>
              ) : displayData ? (
                <>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-4xl font-bold">{displayData.name}</h2>
                      <p className="text-2xl opacity-90">{displayData.country}</p>
                      <p className="text-xl capitalize mt-2 opacity-80">{displayData.description}</p>
                    </div>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="text-5xl hover:scale-110 transition"
                    >
                      ⚙️
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-8">
                      <img src={getWeatherIcon(displayData.icon)} alt="" className="w-36 h-36" />
                      <div className="text-9xl font-bold">
                        {convertTemp(displayData.temp)}°
                      </div>
                    </div>
                    <button
                      onClick={getCurrentLocationWeather}
                      className="bg-white/20 hover:bg-white/30 px-8 py-5 rounded-2xl text-xl font-medium transition"
                    >
                      📍 Мое местоположение
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {settings.showFeelsLike && (
                      <div className="bg-white/10 rounded-2xl p-6 text-center">
                        <div className="text-lg opacity-80">Ощущается</div>
                        <div className="text-4xl font-bold">{convertTemp(displayData.feels_like)}°</div>
                      </div>
                    )}
                    {settings.showHumidity && (
                      <div className="bg-white/10 rounded-2xl p-6 text-center">
                        <div className="text-lg opacity-80">Влажность</div>
                        <div className="text-4xl font-bold">{displayData.humidity}%</div>
                      </div>
                    )}
                    {settings.showWind && (
                      <div className="bg-white/10 rounded-2xl p-6 text-center">
                        <div className="text-lg opacity-80">Ветер</div>
                        <div className="text-4xl font-bold">{displayData.wind} км/ч</div>
                      </div>
                    )}
                    {settings.showPressure && (
                      <div className="bg-white/10 rounded-2xl p-6 text-center">
                        <div className="text-lg opacity-80">Давление</div>
                        <div className="text-4xl font-bold">{displayData.pressure} мбар</div>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            {/* Добавление города */}
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCity(searchQuery)}
                  placeholder="Добавить город..."
                  className="flex-1 bg-white/20 border border-white/40 rounded-2xl px-6 py-5 placeholder-blue-200 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
                />
                <button
                  onClick={() => addCity(searchQuery)}
                  className="bg-green-500 hover:bg-green-600 px-10 py-5 rounded-2xl font-bold text-xl transition"
                >
                  Добавить
                </button>
              </div>
              {error && <p className="text-red-300 text-center mt-4 text-lg">{error}</p>}
            </div>
          </div>

          {/* Сайдбар */}
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 min-h-96">
              <h3 className="text-3xl font-bold mb-6">Сохранённые города</h3>
              <div className="space-y-4">
                {savedCities.length === 0 ? (
                  <p className="text-center text-blue-200 py-16 text-xl">Города не добавлены</p>
                ) : (
                  savedCities.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => setActiveCity(city)}
                      className={`bg-white/10 rounded-2xl p-6 cursor-pointer transition-all hover:bg-white/20 ${
                        activeCity?.id === city.id ? 'ring-4 ring-white/70 shadow-2xl' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold">{city.name}</div>
                          <div className="text-lg opacity-90">
                            {convertTemp(city.temp)}° • {city.description}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCity(city.id);
                          }}
                          className="text-red-300 hover:text-red-100 text-4xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно настроек */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4">
            <div className="bg-white text-gray-900 rounded-3xl p-10 max-w-lg w-full shadow-3xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-4xl font-bold">Настройки</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-5xl hover:scale-110 transition"
                >
                  ×
                </button>
              </div>

              <div className="space-y-8">
                <label className="flex items-center justify-between text-xl">
                  <span>Фаренгейты</span>
                  <button
                    onClick={() => updateSettings({
                      ...settings,
                      units: settings.units === 'metric' ? 'imperial' : 'metric'
                    })}
                    className={`w-20 h-10 rounded-full relative transition ${
                      settings.units === 'imperial' ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 bg-white rounded-full absolute top-1 transition ${
                        settings.units === 'imperial' ? 'left-11' : 'left-1'
                      }`}
                    />
                  </button>
                </label>

                {[
                  { key: 'showFeelsLike', label: 'Ощущается как' },
                  { key: 'showHumidity', label: 'Влажность' },
                  { key: 'showWind', label: 'Ветер' },
                  { key: 'showPressure', label: 'Давление' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between text-xl">
                    <span>{label}</span>
                    <button
                      onClick={() => updateSettings({ ...settings, [key]: !settings[key] })}
                      className={`w-20 h-10 rounded-full relative transition ${
                        settings[key] ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 bg-white rounded-full absolute top-1 transition ${
                          settings[key] ? 'left-11' : 'left-1'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-2xl font-bold text-2xl mt-12 transition"
              >
                Сохранить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;