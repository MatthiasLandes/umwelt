import React, { useState, useEffect, useMemo } from "react";
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

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

// Controls map flyTo for arbitrary coordinates (e.g., geocoded search)
function MapSearchController({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target && target.lat && target.lon) {
      map.flyTo([target.lat, target.lon], 12, { animate: true, duration: 1.2 });
    }
  }, [target, map]);

  return null;
}

const drawerWidth = 350;

function App() {
  const [id, setId] = useState(0);
  const [query, setQuery] = useState('');
  const [mapQuery, setMapQuery] = useState('');
  const [mapTarget, setMapTarget] = useState(null);
  const [mapSearching, setMapSearching] = useState(false);
  const [mapSearchError, setMapSearchError] = useState('');

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((task) => {
      const haystack = [task.name, task.sidebarInfo, task.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const handleSelect = (taskId) => {
    setId(taskId);
  };

  const handleSubmit = () => {
    if (filteredTasks.length === 0) return;
    handleSelect(filteredTasks[0].id);
  };

  const handleMapSearch = async () => {
    const q = mapQuery.trim();
    if (!q) return;
    setMapSearching(true);
    setMapSearchError('');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=0&limit=1`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setMapSearchError('Kein Treffer');
        return;
      }
      const hit = data[0];
      setMapTarget({ lat: parseFloat(hit.lat), lon: parseFloat(hit.lon), label: hit.display_name });
    } catch (err) {
      setMapSearchError('Suche fehlgeschlagen');
    } finally {
      setMapSearching(false);
    }
  };

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
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Suche nach Ort oder Aktion"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton aria-label="Suche leeren" size="small" onClick={() => setQuery('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
            <List disablePadding>
              {filteredTasks.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  Keine Treffer
                </Typography>
              )}
              {filteredTasks.map((task) => (
                <ListItem key={task.id} disablePadding sx={{ mb: 2 }}>
                  <ListItemButton
                    selected={task.id === id}
                    onClick={() => handleSelect(task.id)}
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
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1200,
                p: 1,
                width: 300,
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <TextField
                value={mapQuery}
                onChange={(e) => setMapQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleMapSearch();
                  }
                }}
                placeholder="Ort suchen (z.B. Regensburg)"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {mapSearching ? (
                        <CircularProgress size={18} />
                      ) : (
                        <IconButton aria-label="Suche leeren" size="small" onClick={() => { setMapQuery(''); setMapSearchError(''); }}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  )
                }}
              />
              <IconButton color="primary" onClick={handleMapSearch} aria-label="Ort suchen">
                <SearchIcon />
              </IconButton>
              {mapSearchError && (
                <Typography variant="caption" color="error" sx={{ position: 'absolute', bottom: -18, left: 8 }}>
                  {mapSearchError}
                </Typography>
              )}
            </Paper>
            <BayernMap>
              <MapController selectedId={id} />
              <MapSearchController target={mapTarget} />
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
