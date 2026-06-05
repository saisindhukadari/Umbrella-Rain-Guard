export default function UmbrellaAdvice({ advice }) {
  return (
    <section className={`umbrella-advice glass-panel advice-${advice.status}`}>
      <div className="umbrella-advice-inner">
        <div className="advice-emoji">{advice.emoji}</div>
        <div>
          <h2>{advice.label}</h2>
          <p>{advice.message}</p>
        </div>
      </div>
    </section>
  );
}
