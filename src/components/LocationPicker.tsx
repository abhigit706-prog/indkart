
"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LocationPickerProps = {
  onSelect: (latitude: number, longitude: number) => void;
};

const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({
  onSelect,
}: LocationPickerProps) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapResizer() {
  const map = useMap();

  useState(() => {
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => cancelAnimationFrame(frame);
  });

  return null;
}

export default function LocationPicker({
  onSelect,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([
    17.385,
    78.4867,
  ]);

  function selectLocation(latitude: number, longitude: number) {
    setPosition([latitude, longitude]);
    onSelect(latitude, longitude);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      alert("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const latitude = result.coords.latitude;
        const longitude = result.coords.longitude;

        selectLocation(latitude, longitude);
      },
      () => {
        alert(
          "Unable to access your location. Allow browser permission or select a point on the map.",
        );
      },
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={useMyLocation}
        className="rounded-xl bg-[var(--primary)] px-4 py-2.5 font-semibold text-white"
      >
        Use my current location
      </button>

      <p className="text-sm text-[var(--text-secondary)]">
        Click the map to select your delivery location.
      </p>

      <div className="h-[380px] overflow-hidden rounded-xl border border-[var(--border)]">
        <MapContainer
          center={[17.385, 78.4867]}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onSelect={selectLocation} />
          <MapResizer />

          <Marker position={position} icon={markerIcon} />
        </MapContainer>
      </div>

      <p className="text-sm">
        Selected coordinates: {position[0].toFixed(6)},{" "}
        {position[1].toFixed(6)}
      </p>
    </div>
  );
}
