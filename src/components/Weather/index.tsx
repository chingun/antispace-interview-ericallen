"use client";

import { useEffect, useState, useRef } from "react";

import { RiSettings5Fill } from "react-icons/ri";
import { WiThermometer } from "react-icons/wi";

import WeatherSettings from "@/components/Weather/settings";
import { useLocationStore } from "@/state/use-location-store";

export default function Weather(): React.ReactElement {
  const { locationName, latitude, longitude } = useLocationStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(!locationName);

  const onSettingsClick = (): void => {
    setShowSettings((previousValue) => !previousValue);
  };

  // set min-height for widget so switching to settings doesn't resize height
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      container.style.height = `${container.scrollHeight}px`;
    }
  }, []);

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
                  <span className="sr-only">Temperature: </span>13&deg;
                </div>
                <div className="flex flex-col align-middle justify-center">
                  <div className="text-xl font-medium leading-none">Partly Cloudy</div>
                  <ul className="flex flex-row text-neutral-500 text-xl font-medium">
                    <li className="mr-2 leading-none">
                      <span aria-hidden>H</span>
                      <span className="sr-only">Today's High</span>: 16&deg;
                    </li>
                    <li className="leading-none">
                      <span aria-hidden>L</span>
                      <span className="sr-only">Today's Low</span>: 8&deg;
                    </li>
                  </ul>
                </div>
              </div>
              <div className="ml-auto">
                <h3 className="uppercase text-5xl font-extralight">{locationName}</h3>
              </div>
            </main>
            <hr className="w-1/5 mx-auto mt-10 mb-10 border-neutral-500" />
            <footer className="flex flex-row items-center w-full align-middle justify-center">Hourly Weather</footer>
          </>
        )}
      </div>
    </section>
  );
}
