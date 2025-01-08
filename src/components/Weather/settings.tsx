import { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";

import { useLocationStore } from "@/state/use-location-store";
import type { GeoLocationResponse, GeoLocationRequest } from "@/pages/api/geolocate";

export default function WeatherSettings(): React.ReactElement {
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
    </main>
  );
}
