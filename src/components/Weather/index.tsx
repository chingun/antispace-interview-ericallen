import {
  WiDaySunny,
  WiDaySunnyOvercast,
  WiDayCloudy,
  WiCloudy,
  WiFog,
  WiShowers,
  WiRain,
  WiSprinkle,
  WiSnow,
  WiThunderstorm,
  WiRainMix,
  WiHail,
} from "react-icons/wi";

import type { IconType } from "react-icons";
export interface WeatherProps {
  weatherCode?: number;
  type?: "symbol" | "description";
}

const weatherCodes: Record<number, string> = {
  0: "Clear",
  1: "Mostly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Icy Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  80: "Light Showers",
  81: "Showers",
  82: "Heavy Showers",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  56: "Light Freezing Drizzle",
  57: "Freezing Drizzle",
  66: "Light Freezing Rain",
  67: "Freezing Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  85: "Light Snow Showers",
  86: "Snow Showers",
  95: "Thunderstorm",
  96: "Light T-storm w/ Hail",
  99: "T-storm w/ Hail",
};

const WeatherIcon = (weatherCode: number): IconType => {
  switch (weatherCode) {
    case 0:
    case 1:
      return WiDaySunny;
    case 2:
      return WiDayCloudy;
    case 3:
      return WiCloudy;
    case 45:
      return WiFog;
    case 51:
    case 53:
    case 55:
      return WiSprinkle;
    case 80:
    case 81:
    case 82:
      return WiShowers;
    case 61:
    case 63:
    case 65:
      return WiRain;
    case 56:
    case 57:
    case 66:
    case 67:
      return WiRainMix;
    case 71:
    case 73:
    case 75:
    case 77:
      return WiSnow;
    case 85:
    case 86:
      return WiSnow;
    case 95:
      return WiThunderstorm;
    case 96:
    case 99:
      return WiHail;
    default:
      return WiDaySunnyOvercast;
  }
};

export default function Weather({ weatherCode = 0, type = "symbol" }: WeatherProps): React.ReactElement {
  const description = weatherCodes[weatherCode];

  if (type === "description") {
    return <>{description}</>;
  }

  const Component = WeatherIcon(weatherCode);

  return <Component title={description} size="64px" />;
}
