"use client";

import { useEffect, useState, useRef } from "react";

import { RiSettings5Fill } from "react-icons/ri";
import { WiThermometer } from "react-icons/wi";

import WeatherSettings from "@/components/WeatherWidget/settings";
import Temperature from "@/components/Temperature";
import Weather from "@/components/Weather";
import Forecast from "@/components/Forecast";

import { useLocationStore } from "@/state/use-location-store";
import { useWeatherStore } from "@/state/use-weather-store";

const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);

export default function WeatherWidget(): React.ReactElement {
  const { locationName, latitude, longitude } = useLocationStore();
  const { weatherLocation, setWeatherLocation, temperatureUnits, showFeelsLike, weatherData, setWeatherData, lastUpdated } =
    useWeatherStore();

  // TODO: add loading state
  const [forecasting, setForecasting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(!locationName);

  const onSettingsClick = (): void => {
    setShowSettings((previousValue) => !previousValue);
  };

  // borrowed from: https://bholmes.dev/blog/a-shiny-on-hover-effect-that-follows-your-mouse-css/
  function mouseMoveEvent(e: MouseEvent): void {
    if (containerRef.current) {
      const { x, y } = containerRef.current.getBoundingClientRect();
      containerRef.current.style.setProperty("--x", `${e.clientX - x}`);
      containerRef.current.style.setProperty("--y", `${e.clientY - y}`);
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", mouseMoveEvent);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", mouseMoveEvent);
      }
    };
  }, [containerRef.current]);

  // set min-height for widget so switching to settings doesn't resize height
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      // HACK: some of the padding gets lost when loading the weather forecast
      // TODO: find a better way to handle this
      container.style.height = `${container.scrollHeight + 10}px`;
    }
  }, [weatherData?.forecast.length]);

  useEffect(() => {
    const weatherAbortController = new AbortController();

    if (!lastUpdated || locationName !== weatherLocation || oneHourAgo > lastUpdated) {
      if (latitude && longitude) {
        // fetch weather data
        setForecasting(true);

        fetch(`/api/weather`, {
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
          signal: weatherAbortController.signal,
        })
          .then(async (response) => {
            if (response.ok) {
              return await response.json();
            }
          })
          .then((data) => {
            setWeatherData(data);

            if (locationName) {
              setWeatherLocation(locationName);
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setForecasting(false);
          });
      }
    }

    return () => {
      weatherAbortController.abort();
    };
  }, [latitude, longitude, temperatureUnits, showFeelsLike, lastUpdated, locationName, weatherLocation]);

  return (
    <section ref={containerRef} className="widget-container w-full">
      <div className="widget flex flex-col items-start w-full h-full">
        <header className="flex flex-row w-full mb-5">
          <h4 className="uppercase font-[family-name:var(--font-exo-2)] font-semibold text-xl tracking-wider">
            Weather{showSettings && " Settings"}
          </h4>
          <button className="ml-auto" onClick={onSettingsClick}>
            {showSettings ? (
              <WiThermometer className="hover:text-white text-slate-400 transition-all" size="25px" />
            ) : (
              <RiSettings5Fill className="hover:text-white text-slate-400 transition-all" size="25px" />
            )}
          </button>
        </header>
        {showSettings ? (
          <WeatherSettings />
        ) : (
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
        )}
      </div>
    </section>
  );
}
