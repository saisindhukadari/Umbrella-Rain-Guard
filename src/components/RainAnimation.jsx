export default function RainAnimation({ heavyRain }) {
  const drops = Array.from({ length: 18 });

  return (
    <div className={`rain-animation ${heavyRain ? 'heavy' : ''}`} aria-hidden="true">
      {drops.map((_, index) => (
        <span
          key={index}
          className="rain-drop"
          style={{
            left: `${(index * 5) + 2}%`,
            animationDelay: `${index * 0.12}s`,
            animationDuration: `${0.8 + (index % 4) * 0.12}s`,
          }}
        />
      ))}
      {heavyRain && <span className="lightning" />}
    </div>
  );
}
