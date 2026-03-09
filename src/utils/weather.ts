export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: number;
    description: string;
    icon: string;
  }>;
  updatedAt?: string;
}

export async function getTrackWeather(slug: string): Promise<WeatherData | null> {
  try {
    // Fetch the centrally cached weather data
    const response = await fetch('/weather-data.json');
    if (!response.ok) return null;

    const allWeatherData = await response.json();
    return allWeatherData[slug] || null;
  } catch (error) {
    console.error('Failed to load local weather data:', error);
    return null;
  }
}
