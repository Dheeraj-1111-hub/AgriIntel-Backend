import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY;

// ============================================
// CLEAN LOCATION (IMPORTANT FIX)
// ============================================
const normalizeLocation = (location) => {
  if (!location) return "Chennai";

  // "Chennai,India" → "Chennai"
  return location.split(",")[0].trim();
};

// ============================================
// FALLBACK WEATHER (SAFE DEFAULTS)
// ============================================
const getFallbackWeather = (location) => {
  const mockWeatherData = {
    Chennai: { temperature: 30, humidity: 70, condition: "Clouds" },
    Delhi: { temperature: 28, humidity: 65, condition: "Partly Cloudy" },
    Mumbai: { temperature: 32, humidity: 78, condition: "Humid" },
    Bangalore: { temperature: 25, humidity: 60, condition: "Clear" },
    Punjab: { temperature: 22, humidity: 55, condition: "Clear" },
    Default: { temperature: 26, humidity: 60, condition: "Moderate" }
  };

  const weather = mockWeatherData[location] || mockWeatherData["Default"];

  return {
    temperature: weather.temperature,
    humidity: weather.humidity,
    condition: weather.condition,
    location: location,
    source: "fallback"
  };
};

// ============================================
// MAIN WEATHER FUNCTION
// ============================================
export const getWeather = async (location) => {
  try {
    const cleanLocation = normalizeLocation(location);

    // ❌ If no API key → fallback immediately
    if (!API_KEY) {
      console.warn("⚠️ No API key, using fallback weather");
      return getFallbackWeather(cleanLocation);
    }

    // ✅ Call OpenWeather API
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: cleanLocation,
          appid: API_KEY,
          units: "metric"
        },
        timeout: 5000
      }
    );

    const data = response.data;

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      location: data.name,
      source: "api"
    };

  } catch (error) {
    console.warn(
      "⚠️ Weather API failed, using fallback:",
      error.response?.data || error.message
    );

    return getFallbackWeather(normalizeLocation(location));
  }
};