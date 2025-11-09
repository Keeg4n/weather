import { WeatherData } from '@/types';
import { useWeatherStore } from '@/index';
import { useState, useMemo } from 'react';

interface Props {
  cities: WeatherData[];
}

const CityList = ({ cities }: Props) => {
  const { activeCity, setActiveCity, removeCity, settings } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState('');

  const convertTemp = (temp: number) =>
    settings.units === 'imperial' ? Math.round((temp * 9) / 5 + 32) : temp;

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    
    const query = searchQuery.toLowerCase().trim();
    return cities.filter(city => 
      city.name.toLowerCase().includes(query)
    );
  }, [cities, searchQuery]);

  if (cities.length === 0) {
    return (
      <p className="text-center text-blue-200 py-16 text-xl">Города не добавлены</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск города..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {filteredCities.length === 0 ? (
        <p className="text-center text-blue-200 py-8 text-lg">
          {searchQuery ? 'Города не найдены' : 'Города не добавлены'}
        </p>
      ) : (
        filteredCities.map((city) => (
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
  );
};

export default CityList;