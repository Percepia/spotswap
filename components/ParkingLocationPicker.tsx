"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type ParkingCoordinates = {
  latitude: number;
  longitude: number;
};

type ParkingLocationPickerProps = {
  value: ParkingCoordinates | null;
  onChange: (coordinates: ParkingCoordinates) => void;
};

const SHABIA_CENTER: [number, number] = [54.517, 24.359];

export default function ParkingLocationPicker({
  value,
  onChange,
}: ParkingLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const onChangeRef = useRef(onChange);

  const [locationMessage, setLocationMessage] = useState(
    "Use your current location, tap the map, or drag the pin."
  );
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token || !mapContainerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = token;

    const initialCenter: [number, number] = value
      ? [value.longitude, value.latitude]
      : SHABIA_CENTER;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: initialCenter,
      zoom: value ? 17 : 13,
      attributionControl: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    const marker = new mapboxgl.Marker({
      color: "#10b981",
      draggable: true,
    })
      .setLngLat(initialCenter)
      .addTo(map);

    marker.on("dragend", () => {
      const coordinates = marker.getLngLat();

      onChangeRef.current({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });

      setLocationMessage("Pin updated. Drag it again for a more exact position.");
    });

    map.on("click", (event) => {
      const nextCoordinates = {
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      };

      marker.setLngLat(event.lngLat);
      onChangeRef.current(nextCoordinates);
      setLocationMessage("Pin placed. Drag it if you need to fine-tune it.");
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      marker.remove();
      map.remove();
      markerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!value || !mapRef.current || !markerRef.current) {
      return;
    }

    markerRef.current.setLngLat([value.longitude, value.latitude]);
  }, [value]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported by this browser.");
      return;
    }

    setIsLocating(true);
    setLocationMessage("Finding your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        onChangeRef.current(coordinates);
        markerRef.current?.setLngLat([
          coordinates.longitude,
          coordinates.latitude,
        ]);

        mapRef.current?.flyTo({
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 18,
          essential: true,
        });

        setLocationMessage(
          "Location found. Drag the pin onto your exact parking position."
        );
        setIsLocating(false);
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Location permission was denied. Allow location access or place the pin manually.",
          2: "Your location could not be determined. Place the pin manually.",
          3: "Location request timed out. Try again or place the pin manually.",
        };

        setLocationMessage(
          messages[error.code] ||
            "Could not get your location. Place the pin manually."
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 15000,
      }
    );
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
        Mapbox token missing. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local
        and restart the development server.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">
            Exact parking location
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            This exact pin will only be shown to the driver who reserves.
          </p>
        </div>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={isLocating}
          className="shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLocating ? "Locating..." : "Use my location"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
        <div
          ref={mapContainerRef}
          className="h-[340px] w-full sm:h-[390px]"
        />
      </div>

      <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <p className="text-xs leading-5 text-slate-400">{locationMessage}</p>

        {value && (
          <p className="mt-1 text-xs font-medium text-emerald-400">
            Parking pin selected
          </p>
        )}
      </div>
    </div>
  );
}