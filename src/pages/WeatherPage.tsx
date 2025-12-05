import { ChangeEvent, FormEvent, useState } from "react";
import { WeatherResult } from "../types";

interface GeoResult {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface GeoResponse {
  results?: GeoResult[];
}

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  time: string;
}

interface ForecastResponse {
  current_weather?: CurrentWeather;
}

const WeatherPage: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [status, setStatus] = useState<string>(
    "Введите название города и нажмите «Показать погоду»."
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) {
      return;
    }

    setIsError(false);
    setIsLoading(true);
    setWeather(null);
    setStatus(`Ищу координаты для «${trimmed}»...`);

    try {
      const geoResp = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmed
        )}&count=1&language=ru&format=json`
      );
      if (!geoResp.ok) {
        throw new Error("Ошибка геокодинга.");
      }
      const geoData: GeoResponse = await geoResp.json();
      const location = geoData.results && geoData.results[0];

      if (!location) {
        setStatus("Город не найден.");
        setIsLoading(false);
        return;
      }

      setStatus(
        `Нашла: ${location.name}${
          location.country ? ", " + location.country : ""
        }. Получаю погоду...`
      );

      const forecastResp = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&forecast_days=1&timezone=auto`
      );
      if (!forecastResp.ok) {
        throw new Error("Ошибка прогноза погоды.");
      }
      const forecastData: ForecastResponse = await forecastResp.json();
      const current = forecastData.current_weather;

      if (!current) {
        throw new Error("Нет данных о текущей погоде.");
      }

      const result: WeatherResult = {
        city: location.name,
        country: location.country,
        temperature: current.temperature,
        windSpeed: current.windspeed,
        time: current.time
      };

      setWeather(result);
      setStatus("Погода успешно обновлена.");
    } catch (error: any) {
      console.error(error);
      setIsError(true);
      setStatus(error?.message || "Ошибка при получении погодных данных.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>☁️ Погода</h1>
        <p className="muted">
          Данные предоставляет{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
          .
        </p>
      </header>

      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-field">
            Город
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Например, Moscow или Paris"
            />
          </label>
          <button type="submit" disabled={isLoading || !city.trim()}>
            {isLoading ? "Запрос..." : "Показать погоду"}
          </button>
        </form>

        <div className={`status ${isError ? "status--error" : "status--info"}`}>
          {status}
        </div>

        <div className="result">
          {weather && (
            <article className="card weather-card">
              <h3 className="weather-card__title">
                {weather.city}
                {weather.country ? `, ${weather.country}` : ""}
              </h3>
              <p className="weather-card__meta">
                Температура сейчас:{" "}
                <strong>{weather.temperature.toFixed(1)} °C</strong>
                <br />
                Скорость ветра:{" "}
                <strong>{weather.windSpeed.toFixed(1)} км/ч</strong>
                <br />
                Обновлено: <span>{weather.time}</span>
              </p>
            </article>
          )}
        </div>
      </section>
    </div>
  );
};

export default WeatherPage;
