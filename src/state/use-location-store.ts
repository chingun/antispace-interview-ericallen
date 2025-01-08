"use client";

import { json } from "stream/consumers";
import { create } from "zustand";

export type LocationStoreState = {
  latitude?: number;
  longitude?: number;
  locationName?: string;
  locationError?: string;
  couldNotLocate: boolean;
  locating: boolean;
};

export type LocationStoreActions = {
  setLocation: (latitude: number, longitude: number) => void;
  setLocationName: (locationName: string) => void;
  getLocation: () => void;
  getLocationName: () => void;
  getLocationCoords: () => void;
};

export type LocationStore = LocationStoreState & LocationStoreActions;

const initialState: LocationStoreState = {
  latitude: 37.779477,
  longitude: -122.41762,
  locationName: "San Francisco",
  locationError: "",
  couldNotLocate: false,
  locating: false,
};

export const useLocationStore = create<LocationStore>((set, get) => ({
  ...initialState,
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setLocationName: (locationName) => set({ locationName }),
  getLocation: () => {
    set({ locating: true });

    if (!navigator?.geolocation) {
      set({ couldNotLocate: true, locationError: "Could not use browser location." });

      return;
    }

    navigator?.geolocation?.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = await fetch(`/api/geolocate?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();

      if (data.error) {
        set({ locationError: data.error, couldNotLocate: true, locating: false });

        return;
      }

      set({
        latitude,
        longitude,
        locationName: data.features[0].properties.name,
        locationError: "",
        couldNotLocate: false,
        locating: false,
      });
    });

    set({ locating: false });
  },
  getLocationName: async () => {
    set({ locating: true });

    const { latitude, longitude } = get();

    const response = await fetch(`/api/geolocate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    });
    const data = await response.json();

    if (data.error) {
      set({ locationError: data.error, couldNotLocate: true, locating: false });

      return;
    }

    set({ locationName: data.features[0].properties.name, locationError: "", couldNotLocate: false, locating: false });
  },
  getLocationCoords: async () => {
    set({ locating: true });

    const { locationName } = get();

    const response = await fetch(`/api/geolocate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationName,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (data.error) {
      set({ locationError: data.error, couldNotLocate: true, locating: false });

      return;
    }

    set({
      latitude: data.features[0].geometry.coordinates[1],
      longitude: data.features[0].geometry.coordinates[0],
      locating: false,
    });
  },
}));
