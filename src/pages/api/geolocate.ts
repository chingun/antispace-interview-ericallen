// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type GeoLocationRequest = {
  latitude?: number;
  longitude?: number;
  locationName?: string;
};

export type GeoLocationResponse = {
  type: string;
  // TODO: add GeoJSON types for the features array
  features: Array<Record<string, unknown>>;
  attribution: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<GeoLocationResponse | { error: string }>) {
  const geocoderUrl = new URL("https://api.mapbox.com");

  const { latitude, longitude, locationName }: GeoLocationRequest = req.body;

  if (!latitude && !longitude && locationName) {
    // get lat and long from locationName
    geocoderUrl.pathname = "/search/geocode/v6/forward";
    geocoderUrl.searchParams.append("q", locationName);
    geocoderUrl.searchParams.append("autocomplete", "false");
    geocoderUrl.searchParams.append("limit", "1");
  } else if (latitude && longitude) {
    // get locationName from lat and long
    geocoderUrl.pathname = "/search/geocode/v6/reverse";
    geocoderUrl.searchParams.append("longitude", `${longitude}`);
    geocoderUrl.searchParams.append("latitude", `${latitude}`);
  }

  geocoderUrl.searchParams.append("types", "place");
  geocoderUrl.searchParams.append("access_token", process.env.MAPBOX_API_KEY ?? "");

  try {
    const response: GeoLocationResponse = await fetch(geocoderUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .catch((err) => {
        console.error(err);
      });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the location" });
  }
}
