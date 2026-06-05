const dayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

function getForecastTheme(description = '') {
  const normalized = description.toLowerCase();

  if (/(rain|drizzle|thunderstorm)/.test(normalized)) return 'rainy';
  if (/cloud/.test(normalized)) return 'cloudy';
  if (/clear/.test(normalized)) return 'sunny';

  return 'neutral';
}

export default function Forecast({ daily }) {
  return (
    <section className="forecast-panel glass-panel">
      <div className="forecast-header">
        <div>
          <h3>5-day outlook</h3>
          <p>Forecast prediction with clear daily trends and rain probability.</p>
        </div>
      </div>

      <div className="forecast-grid">
        {daily.length > 0 ? (
          daily.slice(0, 5).map((day) => {
            const theme = getForecastTheme(day.description);
            return (
              <article
                key={day.date}
                className={`forecast-item forecast-${theme}`}
              >
                <div className="forecast-day-group">
                  <span className="forecast-day">
                    {dayFormatter.format(new Date(day.date))}
                  </span>
                  <span className="forecast-date">
                    {dateFormatter.format(new Date(day.date))}
                  </span>
                </div>

                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  width="72"
                  height="72"
                />

                <span className="forecast-description">{day.description}</span>

                <strong>{day.max}° / {day.min}°</strong>
                <span>{day.pop}% rain probability</span>
              </article>
            );
          })
        ) : (
          <div className="forecast-empty">No forecast available yet.</div>
        )}
      </div>
    </section>
  );
}
