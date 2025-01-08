"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useLocationStore = create(
  persist<LocationStore>(
    (set, get) => ({
      ...initialState,
      setLocation: (latitude, longitude) => set({ latitude, longitude }),
      setLocationName: (locationName) => set({ locationName }),
      getLocation: () => {
        set({ locating: true });

        if (!navigator?.geolocation) {
          set({
            couldNotLocate: true,
            locationError: "Could not use browser location.",
            latitude: undefined,
            longitude: undefined,
            locating: false,
            locationName: "",
          });

          return;
        }

        navigator?.geolocation?.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            fetch(`/api/geolocate?latitude=${latitude}&longitude=${longitude}`)
              .then(async (response) => {
                if (response.ok) {
                  return await response.json();
                }
              })
              .then((data) => {
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
              })
              .catch((error) => {
                console.error(error);

                set({
                  couldNotLocate: true,
                  latitude: undefined,
                  longitude: undefined,
                  locating: false,
                  locationName: "",
                });
              })
              .finally(() => {
                set({ locating: false });
              });
          },
          (error) => {
            console.error(error);

            set({
              couldNotLocate: true,
              locationError: "Could not get geolocation from browser.",
              latitude: undefined,
              longitude: undefined,
              locating: false,
              locationName: "",
            });
          }
        );

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

        const { properties } = data.features[0];
        const { coordinates } = data.features[0].properties;
        const { name_preferred } = properties;
        const { latitude, longitude } = coordinates;

        if (data.error) {
          set({ locationError: data.error, couldNotLocate: true, locating: false, latitude: undefined, longitude: undefined });

          return;
        }

        set({
          locationName: name_preferred,
          latitude,
          longitude,
          locating: false,
        });
      },
    }),
    {
      name: "antispace_weather-widget_location",
      // @ts-expect-error partialize doesn't seem to like partial types; investigate
      partialize: (state) => ({ latitude: state.latitude, longitude: state.longitude, locationName: state.locationName }),
    }
  )
);
