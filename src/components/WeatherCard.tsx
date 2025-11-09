import { WeatherData } from '@/types';
import { useWeatherStore } from '@/index';

interface Props {
  city: WeatherData;
}

const WeatherCard = ({ city }: Props) => {
  const { settings, setActiveCity, setShowSettings } = useWeatherStore();
  const convertTemp = (temp: number) =>
    settings.units === 'imperial' ? Math.round((temp * 9) / 5 + 32) : temp;

  return (
    <div
      onClick={() => setActiveCity(city)}
      className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-bold">{city.name}</h2>
          <p className="text-2xl opacity-90">{city.country}</p>
          <p className="text-xl capitalize mt-2 opacity-80">{city.description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(true);
          }}
          className="text-5xl cursor-pointer hover:scale-110 transition"
        >
          ⚙️
        </button>
      </div>

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-8">
          <img src={city.icon} alt="" className="w-36 h-36" />
          <div className="text-9xl font-bold">{convertTemp(city.temp)}°</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {settings.showFeelsLike && (
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-lg opacity-80">Ощущается</div>
            <div className="text-4xl font-bold">{convertTemp(city.feels_like)}°</div>
          </div>
        )}
        {settings.showHumidity && (
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-lg opacity-80">Влажность</div>
            <div className="text-4xl font-bold">{city.humidity}%</div>
          </div>
        )}
        {settings.showWind && (
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-lg opacity-80">Ветер</div>
            <div className="text-4xl font-bold">{city.wind} км/ч</div>
          </div>
        )}
        {settings.showPressure && (
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-lg opacity-80">Давление</div>
            <div className="text-4xl font-bold">{city.pressure} мбар</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;