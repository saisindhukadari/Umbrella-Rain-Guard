import { useEffect, useState } from 'react'
import { fetchWeatherByCity } from './services/weatherApi'
import { getThemeByWeather, getUmbrellaAdvice } from './utils/umbrellaLogic'
import WeatherCard from './components/WeatherCard'
import UmbrellaAdvice from './components/UmbrellaAdvice'
import Forecast from './components/Forecast'
import ForecastGraph from './components/ForecastGraph'
import RainAnimation from './components/RainAnimation'
import './App.css'

const DEFAULT_CITY = 'Chennai'

const adviceQuotes = {
  high: 'Rain gives the best lessons in preparation. Keep your umbrella close and enjoy the fresh air.',
  medium: 'A light possibility of rain means a little planning goes a long way. Carry a compact umbrella just in case.',
  low: 'Clear skies are the perfect chance to step outside and enjoy the day without a worry.',
};

const heroQuotes = [
  '“When the sky opens, confidence is my shelter.”',
  '“Every rain drop is an invitation to move forward stronger.”',
  '“I walk through the storm with calm, because the umbrella is my promise of dry days ahead.”',
];

function App() {
  const [city, setCity] = useState(DEFAULT_CITY)
  const [query, setQuery] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 🔥 Load weather function
  const loadWeather = async (searchCity) => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchWeatherByCity(searchCity)
      setWeatherData(data)
      setCity(data.current?.city || DEFAULT_CITY)
    } catch (fetchError) {
      console.error('FULL ERROR:', fetchError)
      setError(fetchError.message || 'Unable to load weather data')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 Load default city on first render
  useEffect(() => {
    loadWeather(DEFAULT_CITY)
  }, [])

  // 🔥 Search submit handler
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!query.trim()) return

    loadWeather(query)
    setQuery('')
  }

  // 🔥 Theme logic (safe fallback)
  const theme = getThemeByWeather(
    weatherData?.current?.weatherMain || '',
    weatherData?.rainProbability || 0
  )

  // 🔥 Umbrella logic
  const umbrellaAdvice = getUmbrellaAdvice(
    weatherData?.rainProbability || 0
  )

  // 🔥 Rain animation condition
  const hasRainAnimation =
    (weatherData?.rainProbability || 0) >= 30 ||
    /rain|drizzle|thunderstorm/i.test(
      weatherData?.current?.weatherMain || ''
    )

  return (
    <div className={`app-shell ${theme.themeClass || ''}`}>
      <div className="page-glow" />

      <div className="app-content">

        {/* HEADER */}
        <header className="hero-panel glass-panel">
          <div className="hero-copy">
            <h1>Umbrella Rain Guard</h1>
            <p>{theme.subheading || 'Search a city to get live weather updates'}</p>

            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city (e.g. Chennai, Mumbai)"
              />
              <button type="submit">Search</button>
            </form>

            <div className="hero-quote">
              <p>{heroQuotes[Math.floor(Math.random() * heroQuotes.length)]}</p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-emoji" aria-hidden="true">☔</div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="dashboard-grid">

          <div className="main-panel">

            {/* WEATHER CARD */}
            {weatherData ? (
              <WeatherCard
                current={weatherData.current}
                rainProbability={weatherData.rainProbability}
                weatherMood={weatherData.current.weatherDescription}
              />
            ) : (
              <div className="empty-state">
                {error
                  ? 'Unable to load weather data. Check API key or city name.'
                  : 'Search for a city to see weather updates.'}
              </div>
            )}

            {/* UMBRELLA ADVICE */}
            <UmbrellaAdvice advice={umbrellaAdvice} quote={adviceQuotes[umbrellaAdvice.status]} />
            <ForecastGraph daily={weatherData?.daily || []} />

          </div>

          <div className="sidebar-panel">
            <Forecast daily={weatherData?.daily || []} />
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading-overlay glass-panel">
            <div className="spinner" />
            <p>Loading weather...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-banner glass-panel">
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        )}

      </div>

      {/* RAIN EFFECT */}
      {hasRainAnimation && (
        <RainAnimation heavyRain={(weatherData?.rainProbability || 0) >= 60} />
      )}
    </div>
  )
}

export default App