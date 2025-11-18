import './App.css';

import React, { useState, useEffect } from "react";
import { Marker, Popup, useMap } from 'react-leaflet';
import BayernMap from "./BayernMap";
import tasks from "../src/tasks.json";
import Info from "./Info"

// MapController component to handle map focus changes
function MapController({ selectedId }) {
  const map = useMap();

  useEffect(() => {
    // Find the selected task
    const selectedTask = tasks[selectedId];
    if (selectedTask && selectedTask.loc) {
      // Pan to the location with animation and appropriate zoom level
      map.flyTo(selectedTask.loc, 12, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedId, map]);

  return null; // This component doesn't render anything
}

function App() {

  const [id, setId] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Prototyp
        </p>
        <div id="wrapper">
          <div id="div1" className="sidebar-container">
            {/* Replace single Info with a mapped list of all entries */}
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`sidebar-item ${task.id === id ? 'selected' : ''}`}
                onClick={() => setId(task.id)}
              >
                <Info id={task.id} compact={true} />
              </div>
            ))}
          </div>

          <div id="div2">
            <BayernMap>
              {/* Add the MapController component to handle focus changes */}
              <MapController selectedId={id} />
              {tasks.map((task) => (
                <Marker
                  key={task.id}
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
            </BayernMap>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
