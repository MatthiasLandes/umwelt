// src/BayernMap.js

import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

function BayernMap({ geoData }) {
  return (
    <MapContainer center={[48.7904, 11.4979]} zoom={7} style={{ width: '100%', height: '600px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geoData} />
    </MapContainer>
  );
}

export default BayernMap;
