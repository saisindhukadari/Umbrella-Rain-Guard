export function getUmbrellaAdvice(rainProbability) {
  const probability = Number(rainProbability ?? 0);

  if (probability >= 60) {
    return {
      emoji: '☔',
      label: 'Carry Umbrella',
      message: 'Heavy rain chance ahead — stay dry and keep your umbrella close.',
      status: 'high',
    };
  }

  if (probability >= 30) {
    return {
      emoji: '🤔',
      label: 'Maybe Carry Umbrella',
      message: 'There is a moderate chance of rain. A compact umbrella is a smart choice.',
      status: 'medium',
    };
  }

  return {
    emoji: '🌤️',
    label: 'No Umbrella Needed',
    message: 'Low rain chance today. Enjoy the sunshine with light layers.',
    status: 'low',
  };
}

export function getThemeByWeather(weatherMain = '', rainProbability = 0) {
  const normalized = weatherMain.toLowerCase();
  const chance = Number(rainProbability ?? 0);

  if (chance >= 50 || /(rain|drizzle|thunderstorm)/i.test(normalized)) {
    return {
      themeClass: 'weather-rainy',
      headline: 'Rainy Forecast',
      subheading: 'Rainy skies call for umbrella-ready style.',
    };
  }

  if (/cloud/i.test(normalized)) {
    return {
      themeClass: 'weather-cloudy',
      headline: 'Cloudy Vibes',
      subheading: 'Clouds are moving in, but the day still feels calm.',
    };
  }

  return {
    themeClass: 'weather-sunny',
    headline: 'Sunny Skies',
    subheading: 'A bright, warm day with clear outlooks.',
  };
}
