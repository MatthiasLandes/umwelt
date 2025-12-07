import React, { useState, useEffect } from "react";
import { Marker, Popup, useMap } from 'react-leaflet';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ForestIcon from '@mui/icons-material/Forest';

import BayernMap from "./BayernMap";
import tasks from "../src/tasks.json";
import Info from "./Info";
import theme from "./theme";
import './App.css';

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

const drawerWidth = 350;

function App() {
  const [id, setId] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <ForestIcon sx={{ mr: 2 }} />
            <Typography variant="h6" noWrap component="div">
              Umweltaktion Bayern
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', mt: '64px', height: 'calc(100% - 64px)' },
          }}
        >
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Typography variant="overline" display="block" gutterBottom>
              Aktuelle Aktionen
            </Typography>
            <List disablePadding>
              {tasks.map((task) => (
                <ListItem key={task.id} disablePadding sx={{ mb: 2 }}>
                  <ListItemButton
                    selected={task.id === id}
                    onClick={() => setId(task.id)}
                    sx={{
                      p: 0,
                      borderRadius: 2,
                      border: task.id === id ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                      overflow: 'hidden'
                    }}
                  >
                    <Info id={task.id} compact={true} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Toolbar />
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <BayernMap>
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
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
