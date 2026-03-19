// src/BayernMap.js
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function BayernMap({ children }) {
  return (
    <MapContainer center={[48.7904, 11.4979]} zoom={7} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap-Mitwirkende'
      />
      {children}
    </MapContainer>
  );
}

export default BayernMap;
