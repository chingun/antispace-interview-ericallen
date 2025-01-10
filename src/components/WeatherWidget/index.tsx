"use client";

import { useEffect, useState, useRef } from "react";

import { RiSettings5Fill } from "react-icons/ri";
import { WiThermometer } from "react-icons/wi";

import WeatherSettings from "@/components/WeatherWidget/settings";
import WeatherDisplay from "@/components/WeatherWidget/display";

import { useWeatherStore } from "@/state/use-weather-store";

export default function WeatherWidget(): React.ReactElement {
  const { weatherData } = useWeatherStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);

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
  }, [weatherData?.forecast?.length]);

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
        {showSettings ? <WeatherSettings /> : <WeatherDisplay />}
      </div>
    </section>
  );
}
