export default function WeatherCard({ current, rainProbability, weatherMood }) {
  return (
    <section className="weather-card glass-panel">
      <div className="weather-card-header">
        <div>
          <p className="weather-label">Current weather</p>
          <h1>{current.city}, {current.country}</h1>
          <p className="weather-mood">{weatherMood}</p>
        </div>
        <img
          src={current.iconUrl}
          alt={current.weatherDescription}
          className="weather-icon"
          loading="lazy"
        />
      </div>

      <div className="weather-card-content">
        <div className="temperature-block">
          <span className="temperature-value">{current.temperature}°C</span>
          <span className="temperature-feels">Feels like {current.feelsLike}°</span>
        </div>

        <div className="weather-details-grid">
          <div>
            <span>Humidity</span>
            <strong>{current.humidity}%</strong>
          </div>
          <div>
            <span>Wind</span>
            <strong>{current.windSpeed} km/h</strong>
          </div>
          <div>
            <span>Rain chance</span>
            <strong>{rainProbability}%</strong>
          </div>
          <div>
            <span>Condition</span>
            <strong>{current.weatherDescription}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
