import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WeatherResponse } from "@/pages/api/weather";

export type WeatherStoreState = {
  weatherLocation: string;
  temperatureUnits: "imperial" | "metric";
  showFeelsLike: boolean;
  twentyFourHourTime: boolean;
  lastUpdated?: Date;
  weatherData?: WeatherResponse;
};

export type WeatherStoreActions = {
  setWeatherLocation: (location: string) => void;
  setTemperatureUnits: (units: "imperial" | "metric") => void;
  setShowFeelsLike: (show: boolean) => void;
  setWeatherData: (data: WeatherResponse) => void;
  setTwentyFourHourTime: (twentyFourHourTime: boolean) => void;
};

export type WeatherStore = WeatherStoreState & WeatherStoreActions;

const initialState: WeatherStoreState = {
  weatherLocation: "San Francisco",
  temperatureUnits: "imperial",
  showFeelsLike: true,
  twentyFourHourTime: false,
};

export const useWeatherStore = create(
  persist<WeatherStore>(
    (set, get) => ({
      ...initialState,
      setWeatherLocation: (location) => set({ weatherLocation: location }),
      setTemperatureUnits: (units) => set({ temperatureUnits: units }),
      setShowFeelsLike: (show) => set({ showFeelsLike: show }),
      setWeatherData: (data) => set({ weatherData: data, lastUpdated: new Date() }),
      setTwentyFourHourTime: (twentyFourHourTime) => set({ twentyFourHourTime }),
    }),
    {
      name: "antispace_weather-widget_weather",
    }
  )
);
