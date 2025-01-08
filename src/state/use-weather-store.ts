import { create } from "zustand";

export type WeatherStoreState = {
  temperatureUnits: "imperial" | "metric";
  showFeelsLike: boolean;
};

export type WeatherStoreActions = {
  setTemperatureUnits: (units: "imperial" | "metric") => void;
  setShowFeelsLike: (show: boolean) => void;
};

export type WeatherStore = WeatherStoreState & WeatherStoreActions;

const initialState: WeatherStoreState = {
  temperatureUnits: "imperial",
  showFeelsLike: true,
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  ...initialState,
  setTemperatureUnits: (units) => set({ temperatureUnits: units }),
  setShowFeelsLike: (show) => set({ showFeelsLike: show }),
}));
