const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function buildIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Weather API error");
  }

  return data;
}

export async function fetchWeatherByCity(city) {
  const trimmed = city.trim();

  if (!API_KEY) throw new Error("Missing API key");
  if (!trimmed) throw new Error("Enter city name");

  // CURRENT WEATHER (FREE)
  const currentUrl = `${BASE_URL}/weather?q=${trimmed}&units=metric&appid=${API_KEY}`;
  const current = await fetchJson(currentUrl);

  // FORECAST (FREE 5 DAY / 3 HOUR)
  const forecastUrl = `${BASE_URL}/forecast?q=${trimmed}&units=metric&appid=${API_KEY}`;
  const forecast = await fetchJson(forecastUrl);

  const dailyMap = {};

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        min: item.main.temp_min,
        max: item.main.temp_max,
        pop: item.pop,
        icon: item.weather[0].icon,
        description: item.weather[0].main,
      };
    } else {
      dailyMap[date].min = Math.min(dailyMap[date].min, item.main.temp_min);
      dailyMap[date].max = Math.max(dailyMap[date].max, item.main.temp_max);
      dailyMap[date].pop = Math.max(dailyMap[date].pop, item.pop);
    }
  });

  const daily = Object.values(dailyMap)
    .slice(0, 5)
    .map((d) => ({
      ...d,
      min: Math.round(d.min),
      max: Math.round(d.max),
      pop: Math.round((d.pop ?? 0) * 100),
    }));

  const currentWeather = {
    city: current.name,
    country: current.sys.country,
    temperature: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    humidity: current.main.humidity,
    windSpeed: Math.round(current.wind.speed),
    weatherMain: current.weather[0].main,
    weatherDescription: current.weather[0].description,
    iconUrl: buildIconUrl(current.weather[0].icon),
  };

  return {
    current: currentWeather,
    rainProbability: daily[0]?.pop ?? 0,
    daily,
  };
}