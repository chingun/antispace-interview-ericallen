import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WeatherResponse } from "@/pages/api/weather";

export type WeatherStoreState = {
  temperatureUnits: "imperial" | "metric";
  showFeelsLike: boolean;
  twentyFourHourTime: boolean;
  lastUpdated?: Date;
  weatherData?: WeatherResponse;
  forecasting?: boolean;
};

export type WeatherStoreActions = {
  getWeather: (latitude: number, longitude: number, signal?: AbortSignal) => Promise<WeatherResponse>;
  setTemperatureUnits: (units: "imperial" | "metric") => void;
  setShowFeelsLike: (show: boolean) => void;
  setWeatherData: (data: WeatherResponse) => void;
  setTwentyFourHourTime: (twentyFourHourTime: boolean) => void;
  setForecasting: (forecasting: boolean) => void;
};

export type WeatherStore = WeatherStoreState & WeatherStoreActions;

const initialState: WeatherStoreState = {
  temperatureUnits: "imperial",
  showFeelsLike: true,
  twentyFourHourTime: false,
  forecasting: false,
};

export const useWeatherStore = create(
  persist<WeatherStore>(
    (set, get) => ({
      ...initialState,
      setTemperatureUnits: (units) => set({ temperatureUnits: units }),
      setShowFeelsLike: (show) => set({ showFeelsLike: show }),
      setWeatherData: (data) => set({ weatherData: data, lastUpdated: new Date() }),
      setTwentyFourHourTime: (twentyFourHourTime) => set({ twentyFourHourTime }),
      setForecasting: (forecasting) => set({ forecasting }),
      getWeather: async (latitude, longitude, signal) => {
        const { lastUpdated, temperatureUnits, showFeelsLike, weatherData } = get();
        const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);

        if (lastUpdated && lastUpdated <= oneHourAgo && weatherData) {
          return weatherData;
        } else if (latitude && longitude) {
          try {
            set({ forecasting: true });

            const weatherRequestOptions: RequestInit = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                units: temperatureUnits,
                feelsLike: showFeelsLike,
              }),
            };

            if (signal) {
              weatherRequestOptions.signal = signal;
            }

            const response = await fetch(`/api/weather`, weatherRequestOptions).then(async (response) => {
              if (response.ok) {
                return await response.json();
              }
            });

            set({ weatherData: response, forecasting: false, lastUpdated: new Date() });

            return response;
          } catch (error) {
            console.error(error);

            set({ forecasting: false });

            return {} as WeatherResponse;
          }
        }
      },
    }),
    {
      name: "antispace_weather-widget_weather",
    }
  )
);
