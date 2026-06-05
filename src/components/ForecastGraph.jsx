const dayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ForecastGraph({ daily }) {
  if (!daily || daily.length === 0) {
    return null;
  }

  const chartWidth = 470;
  const chartHeight = 140;
  const displayDays = daily.slice(0, 5);
  const maxTemp = Math.max(...displayDays.map((day) => day.max));
  const minTemp = Math.min(...displayDays.map((day) => day.min));
  const tempRange = Math.max(maxTemp - minTemp, 1);

  const points = displayDays.map((day, index) => {
    const x = 55 + (index * (chartWidth / Math.max(displayDays.length - 1, 1)));
    const y = 20 + ((maxTemp - day.max) / tempRange) * chartHeight;
    return {
      x,
      y,
      label: dayFormatter.format(new Date(day.date)),
      temp: day.max,
      rain: day.pop,
    };
  });

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = maxTemp - (tempRange / 4) * index;
    const y = 20 + (chartHeight / 4) * index;
    return {
      value: Math.round(value),
      y,
    };
  });

  return (
    <section className="forecast-graph glass-panel">
      <div className="forecast-graph-header">
        <div>
          <h3>5-day graph prediction</h3>
          <p>Temperature highs and rain chance at a glance for the next five days.</p>
        </div>
        <div className="graph-legend">
          <span className="legend-dot temp" />
          <span>Temperature</span>
          <span className="legend-dot rain" />
          <span>Rain %</span>
        </div>
      </div>

      <div className="forecast-graph-body">
        <svg viewBox="0 0 580 180" className="forecast-chart" role="img" aria-label="Five-day forecast with temperature and rain axes">
          <line x1="40" y1="20" x2="40" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
          <line x1="40" y1="160" x2="525" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

          {yTicks.map((tick) => (
            <g key={tick.value}>
              <line x1="40" y1={tick.y} x2="540" y2={tick.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <text x="28" y={tick.y + 4} className="chart-axis-label">
                {tick.value}°
              </text>
            </g>
          ))}

          <g className="chart-lines">
            <polyline
              points={points.map((point) => `${point.x},${point.y}`).join(' ')}
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {points.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="6" fill="#7dd3fc" />
                <text x={point.x} y={point.y - 14} className="chart-point-label">
                  {point.temp}°
                </text>
              </g>
            ))}
          </g>

          {points.map((point) => (
            <rect
              key={`bar-${point.label}`}
              x={point.x - 12}
              y={160 - clamp(point.rain, 0, 100) * 1.1}
              width="20"
              height={clamp(point.rain, 0, 100) * 1.1}
              rx="6"
              fill="rgba(245, 225, 59, 0.32)"
            />
          ))}

          <g className="chart-x-axis-labels">
            {points.map((point) => (
              <text key={`x-${point.label}`} x={point.x} y="176" className="chart-x-label">
                {point.label}
              </text>
            ))}
          </g>
        </svg>

        <div className="forecast-graph-labels">
          {points.map((point) => (
            <div key={`label-${point.label}`} className="forecast-graph-label">
              <span>{point.label}</span>
              <strong>{point.rain}%</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
