import { useEffect } from "react";

import Temperature from "@/components/Temperature";
import Forecast from "@/components/Forecast";
import Weather from "@/components/Weather";

import { useWeatherStore } from "@/state/use-weather-store";
import { useLocationStore } from "@/state/use-location-store";

export default function WeatherDisplay() {
  const { locationName, latitude, longitude } = useLocationStore();
  const { showFeelsLike, temperatureUnits, weatherData, getWeather } = useWeatherStore();

  useEffect(() => {
    const weatherAbortController = new AbortController();

    if (latitude && longitude) {
      getWeather(latitude, longitude, weatherAbortController.signal);
    }

    return () => {
      weatherAbortController.abort();
    };
  }, [latitude, longitude, temperatureUnits, showFeelsLike, locationName]);

  return (
    <>
      <main className="flex flex-row items-start w-full font-[family-name:var(--font-inter)]">
        <div className="flex flex-row items-center">
          <h5 className="sr-only">Current Weather</h5>
          <div className="border-r-gray-600 border-r-solid border-r-[1px] pr-2 mr-2 text-5xl font-extralight">
            <span className="sr-only">Temperature: </span>
            <Temperature
              value={showFeelsLike ? weatherData?.current.temperature.feelsLike : weatherData?.current.temperature.value}
              unit={temperatureUnits === "imperial" ? "F" : "C"}
            />
          </div>
          <div className="flex flex-col align-middle justify-center">
            <div className="text-xl font-medium leading-none">
              <Weather type="description" weatherCode={weatherData?.current.weatherCode} />
            </div>
            <ul className="flex flex-row text-neutral-500 text-xl font-medium">
              <li className="mr-2 leading-none">
                <span aria-hidden>H</span>
                <span className="sr-only">Today's High</span>:{" "}
                <Temperature
                  value={showFeelsLike ? weatherData?.high.feelsLike : weatherData?.high.value}
                  unit={temperatureUnits === "imperial" ? "F" : "C"}
                />
              </li>
              <li className="leading-none">
                <span aria-hidden>L</span>
                <span className="sr-only">Today's Low</span>:{" "}
                <Temperature
                  value={showFeelsLike ? weatherData?.low.feelsLike : weatherData?.low.value}
                  unit={temperatureUnits === "imperial" ? "F" : "C"}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="ml-auto">
          <h3 className="uppercase text-5xl font-extralight">{locationName}</h3>
        </div>
      </main>
      <hr className="w-1/5 mx-auto mt-10 mb-10 border-neutral-500" />
      <footer className="flex flex-row items-center w-full align-middle justify-center mb-5">
        <Forecast forecast={weatherData?.forecast ?? []} />
      </footer>
    </>
  );
}
