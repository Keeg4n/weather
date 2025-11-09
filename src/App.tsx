import {
  WeatherCard,
  CityList,
  SettingsModal,
  AddCityInput,
  useWeatherStore,
  useWeatherLogic,
} from '@/index';

export default function App() {
  const {
    currentWeather,
    activeCity,
    savedCities,
    isLoading,
    showSettings,
  } = useWeatherStore();
  const { getCurrentLocation } = useWeatherLogic();

  const displayData = activeCity || currentWeather;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">Метео Прогноз</h1>
          <p className="text-xl text-blue-100">Погода в реальном времени</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isLoading ? (
              <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-20 flex flex-col items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent"></div>
                <p className="mt-6 text-2xl">Загрузка...</p>
              </div>
            ) : displayData ? (
              <>
                <WeatherCard city={displayData} />
                <button
                  onClick={getCurrentLocation}
                  className="w-full bg-white/20 hover:bg-white/30 px-8 py-5 rounded-2xl text-xl font-medium transition"
                >
                  Моя локация
                </button>
              </>
            ) : null}

            <AddCityInput />
          </div>

          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 min-h-96">
              <h3 className="text-3xl font-bold mb-6">Сохранённые города</h3>
              <CityList cities={savedCities} />
            </div>
          </div>
        </div>

        {showSettings && <SettingsModal />}
      </div>
    </div>
  );
}