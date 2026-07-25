"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type ParkingMapSpot = {
  id: number;
  area: string;
  leavingIn: string;
  latitude: number;
  longitude: number;
  exactLocationUnlocked: boolean;
};

type ParkingSpotsMapProps = {
  spots: ParkingMapSpot[];
  selectedSpotId: number | null;
  onSelectSpot: (spotId: number) => void;
};

const SHABIA_CENTER: [number, number] = [54.517, 24.359];

export default function ParkingSpotsMap({
  spots,
  selectedSpotId,
  onSelectSpot,
}: ParkingSpotsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const onSelectSpotRef = useRef(onSelectSpot);

  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState(
    "Approximate pins protect the leaver until you reserve."
  );

  useEffect(() => {
    onSelectSpotRef.current = onSelectSpot;
  }, [onSelectSpot]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token || !mapContainerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: SHABIA_CENTER,
      zoom: 12.5,
      attributionControl: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      }),
      "top-right"
    );

    map.on("load", () => {
      setIsMapReady(true);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      userMarkerRef.current?.remove();
      userMarkerRef.current = null;

      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const validSpots = spots.filter(
      (spot) =>
        Number.isFinite(spot.latitude) &&
        Number.isFinite(spot.longitude)
    );

    const bounds = new mapboxgl.LngLatBounds();

    validSpots.forEach((spot) => {
      const markerButton = document.createElement("button");
      const isSelected = selectedSpotId === spot.id;

      markerButton.type = "button";
      markerButton.title = `${spot.area} · Leaving ${spot.leavingIn}`;
      markerButton.setAttribute(
        "aria-label",
        `${spot.area}, leaving ${spot.leavingIn}`
      );

      markerButton.textContent = spot.exactLocationUnlocked ? "P" : "≈";

      markerButton.style.width = isSelected ? "46px" : "40px";
      markerButton.style.height = isSelected ? "46px" : "40px";
      markerButton.style.borderRadius = "9999px";

      markerButton.style.border = isSelected
        ? "3px solid #ffffff"
        : "2px solid rgba(255,255,255,0.85)";

      markerButton.style.background = spot.exactLocationUnlocked
        ? "#10b981"
        : "#f59e0b";

      markerButton.style.color = "#020617";
      markerButton.style.fontWeight = "900";

      markerButton.style.fontSize = spot.exactLocationUnlocked
        ? "15px"
        : "20px";

      markerButton.style.cursor = "pointer";

      markerButton.style.boxShadow = isSelected
        ? "0 0 0 6px rgba(16,185,129,0.25), 0 12px 28px rgba(0,0,0,0.45)"
        : "0 10px 24px rgba(0,0,0,0.4)";

      markerButton.style.transition = "transform 160ms ease";

      markerButton.addEventListener("mouseenter", () => {
        markerButton.style.transform = "scale(1.08)";
      });

      markerButton.addEventListener("mouseleave", () => {
        markerButton.style.transform = "scale(1)";
      });

      markerButton.addEventListener("click", () => {
        onSelectSpotRef.current(spot.id);

        mapRef.current?.easeTo({
          center: [spot.longitude, spot.latitude],
          zoom: spot.exactLocationUnlocked ? 17 : 15,
          duration: 700,
        });
      });

      const popupContent = document.createElement("div");
      popupContent.style.minWidth = "170px";

      const title = document.createElement("p");
      title.textContent = spot.area;
      title.style.fontWeight = "800";
      title.style.margin = "0";
      title.style.color = "#0f172a";

      const leaving = document.createElement("p");
      leaving.textContent = `Leaving: ${spot.leavingIn}`;
      leaving.style.margin = "6px 0 0";
      leaving.style.fontSize = "13px";
      leaving.style.color = "#475569";

      const privacy = document.createElement("p");

      privacy.textContent = spot.exactLocationUnlocked
        ? "Exact reserved location"
        : "Approximate area";

      privacy.style.margin = "6px 0 0";
      privacy.style.fontSize = "12px";
      privacy.style.fontWeight = "700";

      privacy.style.color = spot.exactLocationUnlocked
        ? "#047857"
        : "#b45309";

      popupContent.append(title, leaving, privacy);

      const marker = new mapboxgl.Marker({
        element: markerButton,
        anchor: "bottom",
      })
        .setLngLat([spot.longitude, spot.latitude])
        .setPopup(
          new mapboxgl.Popup({
            offset: 28,
            closeButton: false,
          }).setDOMContent(popupContent)
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);

      bounds.extend([spot.longitude, spot.latitude]);
    });

    if (validSpots.length === 1) {
      mapRef.current.easeTo({
        center: [
          validSpots[0].longitude,
          validSpots[0].latitude,
        ],
        zoom: validSpots[0].exactLocationUnlocked ? 16 : 14,
        duration: 700,
      });
    } else if (validSpots.length > 1) {
      mapRef.current.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15,
        duration: 700,
      });
    }
  }, [isMapReady, selectedSpotId, spots]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by this browser."
      );

      return;
    }

    setIsLocating(true);
    setLocationMessage("Finding your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        userMarkerRef.current?.remove();

        userMarkerRef.current = new mapboxgl.Marker({
          color: "#38bdf8",
        })
          .setLngLat(coordinates)
          .setPopup(
            new mapboxgl.Popup({
              offset: 24,
              closeButton: false,
            }).setText("You are here")
          )
          .addTo(mapRef.current!);

        mapRef.current?.flyTo({
          center: coordinates,
          zoom: 15,
          essential: true,
        });

        setLocationMessage(
          "Your location is shown in blue. Parking pins stay privacy-safe."
        );

        setIsLocating(false);
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Location permission was denied. You can still browse the map manually.",
          2: "Your location could not be determined.",
          3: "Location request timed out. Try again.",
        };

        setLocationMessage(
          messages[error.code] ||
            "Could not get your current location."
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
        Mapbox token missing. Add
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in Vercel and your local
        .env.local file.
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Live map
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Nearby handovers
          </h2>
        </div>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={isLocating}
          className="shrink-0 rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-bold text-sky-300 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLocating ? "Locating..." : "Show my location"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
        <div
          ref={mapContainerRef}
          className="h-[420px] w-full sm:h-[500px]"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs leading-5 text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>{locationMessage}</p>

        <p className="shrink-0">
          <span className="font-bold text-amber-400">≈</span>{" "}
          Approximate ·{" "}
          <span className="font-bold text-emerald-400">P</span>{" "}
          Exact after reservation
        </p>
      </div>
    </div>
  );
}