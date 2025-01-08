import type { Forecast as ForecastType } from "@/pages/api/weather";

import Weather from "@/components/Weather";
import { useWeatherStore } from "@/state/use-weather-store";

export interface ForecastProps {
  forecast: ForecastType[];
}

export default function Forecast({ forecast = [] }: ForecastProps): React.ReactElement {
  const { twentyFourHourTime } = useWeatherStore();

  const formatHour = (date: Date): string => {
    const hours = new Date(date).getHours();

    if (twentyFourHourTime) {
      return hours.toString().padStart(2, "0");
    } else {
      const suffix = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;

      return `${formattedHours}${suffix}`;
    }
  };

  const renderForecastItems = () => {
    return forecast.slice(0, 9).map((forecastItem, index) => {
      return (
        <li key={forecastItem?.timestamp.toString() ?? index} className="flex flex-col items-center w-[12.5%]">
          <Weather weatherCode={forecastItem.weatherCode} type="symbol" />
          <span className="text-neutral-500 text-sm">{formatHour(forecastItem.timestamp)}</span>
        </li>
      );
    });
  };

  return <ol className="flex flex-row w-full">{renderForecastItems()}</ol>;
}
