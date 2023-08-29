import logo from './logo.svg';
import './App.css';

import GoogleMapReact from 'google-map-react';
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from "leaflet";
import tasks from "../src/tasks.json";

// {defaultProps.center}

function App() {

  const AnyReactComponent = ({ text }) => <div>{text}</div>;

  const defaultProps = {
    center: {
      lat: 48.137154,
      lng: 11.576124
    },
    zoom: 13
  };

  const state = {
    center: [51.505, -0.091],
    zoom: 13,
  };

  return (
    <div className="App">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          2000 Euro Fördergeld
        </p>

        // (Important! Always set the container height explicitly)
          <div style={{ height: '100vh', width: '100%' }}>
          <MapContainer center={[48.137154, 11.576124]} zoom={16} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {tasks.map((task) => (
            <Marker position={task.loc}>
              <Popup>
                {task.name}
              </Popup>
            </Marker>
            ))}
          </MapContainer>
          </div>
      </header>
    </div>
  );
}

export default App;
