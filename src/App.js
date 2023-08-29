import logo from './logo.svg';
import './App.css';

import GoogleMapReact from 'google-map-react';
import React, { useState }from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import tasks from "../src/tasks.json";
import Info from "./Info"

// {defaultProps.center}

function App() {

  const [id, setId] = useState(0);

  return (
    <div className="App">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
      <header className="App-header">
        <p>
          Prototyp
        </p>
        <div id="wrapper">
        <div id="div1">
        <Info id={id}></Info>
        </div>

          <div id="div2">
          <MapContainer center={[48.137154, 11.576124]} zoom={16} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {tasks.map((task) => (
            <Marker 
              position={task.loc} 
              eventHandlers={{
                click: (e) => {
                  setId(task.id)
                },
              }}
              >
              <Popup>
                {task.name}
              </Popup>
              
            </Marker>
            ))}
          </MapContainer>
          </div>
          </div>
      </header>
    </div>
  );
}

export default App;
