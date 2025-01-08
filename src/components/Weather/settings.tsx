import { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";

import { useLocationStore } from "@/state/use-location-store";
import { useWeatherStore } from "@/state/use-weather-store";

export default function WeatherSettings(): React.ReactElement {
  const { temperatureUnits, showFeelsLike, setTemperatureUnits, setShowFeelsLike } = useWeatherStore();

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

  const onChangeLocationName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocationName(e.target.value);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <main className="flex flex-col items-start w-full font-[family-name:var(--font-inter)]">
      <div className="flex flex-col">
        <div
          className={`flex flex-row items-start align-middle justify-center bg-black border-neutral-500 py-1 px-2 border-[1px] ${
            locating ? `text-neutral-500` : `text-white`
          }`}
        >
          <input
            disabled={locating}
            className={`appearance-none bg-transparent border-none ${locating ? `text-neutral-500` : `text-white`}`}
            type="text"
            placeholder="Location"
            value={locationName}
            onChange={onChangeLocationName}
          />
          <button className="ml-auto" disabled={locating} onClick={locationName ? getLocationCoords : getLocationName}>
            <CiLocationArrow1 size="25px" />
            <span className="sr-only">Locate Me</span>
          </button>
        </div>
        {locationError ? (
          <p className="text-red-500">{locationError}</p>
        ) : couldNotLocate ? (
          <p className="text-red-500">Please enter the name of the city you'd like the weather for.</p>
        ) : latitude && longitude ? (
          <p className="text-neutral-500">
            {latitude}, {longitude}
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col items-center mt-2">
        <select
          name="temperature-units"
          id="temperature-units"
          className="border-neutral-500 border-[1px] bg-black text-white py-1 px-2"
          value={temperatureUnits}
          onChange={(e) => setTemperatureUnits(e.target.value as "imperial" | "metric")}
        >
          <option value="imperial">Imperial</option>
          <option value="metric">Metric</option>
        </select>
      </div>
      <div className="flex flex-row items-center mt-2">
        <label htmlFor="show-feels-like" className="mr-2">
          <input
            type="checkbox"
            id="show-feels-like"
            className="mr-2 border-neutral-500 border-[1px] bg-black text-white"
            checked={showFeelsLike}
            onChange={(e) => setShowFeelsLike(e.target.checked)}
          />
          Feels Like
        </label>
      </div>
    </main>
  );
}
