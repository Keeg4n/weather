import { useWeatherStore } from '@/index';
import { useWeatherLogic } from '@/index';

const AddCityInput = () => {
  const { searchQuery, setSearchQuery, error } = useWeatherStore();
  const { addCity } = useWeatherLogic();

  const handleAdd = () => {
    addCity(searchQuery);
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6">
      <div className="flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Добавить город..."
          className="flex-1 bg-white/20 border border-white/40 rounded-2xl px-6 py-5 placeholder-blue-200 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 px-10 py-5 rounded-2xl font-bold text-xl transition"
        >
          Добавить
        </button>
      </div>
      {error && <p className="text-red-300 text-center mt-4 text-lg">{error}</p>}
    </div>
  );
};

export default AddCityInput;