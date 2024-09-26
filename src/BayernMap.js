// src/BayernMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importiere die Standardicon-Bilder
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Erstelle das Standardicon
const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Setze das Standardicon für alle Marker
L.Marker.prototype.options.icon = defaultIcon;

function BayernMap() {
  return (
    <MapContainer center={[48.7904, 11.4979]} zoom={7} style={{ width: '100%', height: '600px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap-Mitwirkende'
      />
      <Marker position={[48.137154, 11.576124]}>
        <Popup>
          <strong>München</strong><br />Dies ist ein Marker mit dem Standardicon.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default BayernMap;
