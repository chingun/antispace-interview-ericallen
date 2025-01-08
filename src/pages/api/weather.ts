// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { fetchWeatherApi } from "openmeteo";

export type WeatherRequest = {
  latitude?: number;
  longitude?: number;
  units?: string;
  feelsLike?: boolean;
};

export type Temperature = {
  value: number;
  feelsLike?: number;
};

export type Forecast = {
  timestamp: Date;
  temperature: Temperature;
  weatherCode: number;
};

export type WeatherResponse = {
  current: Forecast;
  high: Temperature;
  low: Temperature;
  forecast: Forecast[];
};

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export default async function handler(req: NextApiRequest, res: NextApiResponse<WeatherResponse | { error: string }>) {
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");

  const { latitude, longitude, units = "imperial", feelsLike = true }: WeatherRequest = req.body;

  if (!latitude && !longitude) {
    res.status(400).json({ error: "Latitude and longitude are required" });
  } else {
    const parameters: Record<string, any> = {
      latitude,
      longitude,
      current: ["temperature_2m", "weather_code"],
      hourly: ["temperature_2m", "weather_code"],
      daily: ["temperature_2m_max", "temperature_2m_min"],
      forecast_hours: 12,
    };

    if (feelsLike) {
      parameters.current.push("apparent_temperature");
      parameters.hourly.push("apparent_temperature");
      parameters.daily.push("apparent_temperature_max");
      parameters.daily.push("apparent_temperature_min");
    }

    if (units === "imperial") {
      parameters.temperature_unit = "fahrenheit";
      parameters.wind_speed_unit = "mph";
      parameters.precipitation_unit = "inch";
    }

    try {
      const responses = await fetchWeatherApi(weatherUrl.toString(), parameters);

      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();

      const current = response.current()!;
      const hourly = response.hourly()!;

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const weatherData: WeatherResponse = {
        current: {
          timestamp: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature: {
            value: current.variables(0)!.value(),
          },
          weatherCode: current.variables(1)!.value(),
        },
        high: {
          value: response.daily()!.variables(0)!.valuesArray()![0],
        },
        low: {
          value: response.daily()!.variables(1)!.valuesArray()![0],
        },
        forecast: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t, i) => {
          const forecast: Forecast = {
            timestamp: new Date((t + utcOffsetSeconds) * 1000),
            temperature: {
              value: hourly.variables(0)!.valuesArray()![i],
            },
            weatherCode: hourly.variables(1)!.valuesArray()![i],
          };

          if (feelsLike) {
            forecast.temperature.feelsLike = hourly.variables(2)!.valuesArray()![i];
          }

          return forecast;
        }),
      };

      if (feelsLike) {
        weatherData.current.temperature.feelsLike = current.variables(2)!.value();
        weatherData.high.feelsLike = response.daily()!.variables(2)!.valuesArray()![0];
        weatherData.low.feelsLike = response.daily()!.variables(3)!.valuesArray()![0];
      }

      res.status(200).json(weatherData);
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "An error occurred while fetching the weather" });
    }
  }
}
