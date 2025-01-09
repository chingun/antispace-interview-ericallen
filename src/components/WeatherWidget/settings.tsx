import { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";

import { useLocationStore } from "@/state/use-location-store";
import { useWeatherStore } from "@/state/use-weather-store";

export default function WeatherSettings(): React.ReactElement {
  const { showFeelsLike, setTemperatureUnits, temperatureUnits, setShowFeelsLike, twentyFourHourTime, setTwentyFourHourTime } =
    useWeatherStore();

  const {
    locationName,
    latitude,
    longitude,
    setLocationName,
    getLocation,
    getLocationName,
    getLocationCoords,
    locating,
    couldNotLocate,
    locationError,
  } = useLocationStore();

  const onBlurLocationName = (): void => {
    if (locationName) {
      getLocationCoords();
    }
  };

  const onChangeLocationName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocationName(e.target.value);
  };

  return (
    <main className="flex flex-col items-start w-full font-[family-name:var(--font-inter)]">
      <div className="flex flex-col w-full">
        <div
          className={`flex flex-row-reverse items-start align-middle justify-center bg-black border-neutral-500 py-1 px-2 border-[1px] ${
            locating ? `text-neutral-500` : `text-white`
          }`}
        >
          <input
            disabled={locating}
            className={`appearance-none w-full bg-transparent border-none text-5xl font-[family-name:var(--font-inter)] font-extralight ${
              locating ? `text-neutral-500` : `text-white`
            } text-right uppercase ml-4 border-l-neutral-500 border-l-[1px]`}
            type="text"
            placeholder="Location"
            value={locationName}
            onChange={onChangeLocationName}
            onBlur={onBlurLocationName}
          />
          <button className="ml-auto my-auto" disabled={locating || couldNotLocate} onClick={getLocation}>
            <CiLocationArrow1 size="50px" className="text-neutral-500 hover:text-white" />
            <span className="sr-only">Locate Me</span>
          </button>
        </div>
        {locationError || couldNotLocate ? (
          <p className="text-neutral-500">
            <span className="text-red-400">Error: </span>Please enter the name of the city you'd like the weather for.
          </p>
        ) : latitude && longitude ? (
          <p className="text-neutral-500">
            {latitude}, {longitude}
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-row items-center justify-center w-full mt-5">
        <div className="flex flex-row items-center mt-2 mr-4">
          <label htmlFor="temperature-units" className="mr-2">
            <input
              type="checkbox"
              id="temperature-units"
              className="appearance-none w-[15px] h-[15px] focus:border-white hover:border-white checked:bg-white border-neutral-500 border-[1px] mr-2 bg-black text-white"
              onChange={(e) => setTemperatureUnits(e.target.checked ? "imperial" : "metric")}
              p
              checked={temperatureUnits === "imperial"}
            />
            Imperial Units
          </label>
        </div>
        <div className="flex flex-row items-center mt-2 mr-4">
          <label htmlFor="show-feels-like" className="mr-2">
            <input
              type="checkbox"
              id="show-feels-like"
              className="appearance-none w-[15px] h-[15px] focus:border-white hover:border-white checked:bg-white border-neutral-500 border-[1px] mr-2 bg-black text-white"
              checked={showFeelsLike}
              onChange={(e) => setShowFeelsLike(e.target.checked)}
            />
            Feels Like
          </label>
        </div>
        <div className="flex flex-row items-center mt-2">
          <label htmlFor="twenty-four-hour-time" className="mr-2">
            <input
              type="checkbox"
              id="twenty-four-hour-time"
              className="appearance-none w-[15px] h-[15px] focus:border-white hover:border-white checked:bg-white border-neutral-500 border-[1px] mr-2 bg-black text-white"
              checked={twentyFourHourTime}
              onChange={(e) => setTwentyFourHourTime(e.target.checked)}
            />
            24hr Time
          </label>
        </div>
      </div>
    </main>
  );
}
