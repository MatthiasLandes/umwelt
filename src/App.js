import React, { useState, useEffect, useMemo, useRef } from "react";
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
import ListItemText from '@mui/material/ListItemText';
import ForestIcon from '@mui/icons-material/Forest';
import BusinessIcon from '@mui/icons-material/Business';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';

import BayernMap from "./BayernMap";
import tasks from "../src/tasks.json";
import organizations from "./organizations.json";
import Info from "./Info";
import theme from "./theme";
import { eventIcon, orgIcon } from "./mapIcons";
import './App.css';

// MapController component to handle map focus changes for tasks
function MapController({ selectedId }) {
  const map = useMap();

  useEffect(() => {
    const selectedTask = tasks[selectedId];
    if (selectedTask && selectedTask.loc) {
      map.flyTo(selectedTask.loc, 12, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedId, map]);

  return null;
}

// MapOrgController component to handle map focus changes for organizations
function MapOrgController({ selectedOrg }) {
  const map = useMap();

  useEffect(() => {
    if (selectedOrg && selectedOrg.loc) {
      map.flyTo(selectedOrg.loc, 12, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedOrg, map]);

  return null;
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
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [expandedOrgId, setExpandedOrgId] = useState(null);
  const [showAktionen, setShowAktionen] = useState(true);
  const [showOrganisationen, setShowOrganisationen] = useState(false);
  const itemRefs = useRef({});
  const orgItemRefs = useRef({});
  const selectionSource = useRef('sidebar');

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

  const filteredOrgs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return organizations;
    return organizations.filter((org) => {
      const haystack = [org.name, org.type, org.address, org.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  useEffect(() => {
    if (selectionSource.current === 'map' && itemRefs.current[id]) {
      itemRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [id]);

  useEffect(() => {
    if (selectionSource.current === 'map' && selectedOrg && orgItemRefs.current[selectedOrg.id]) {
      orgItemRefs.current[selectedOrg.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedOrg]);

  const handleSelect = (taskId) => {
    selectionSource.current = 'sidebar';
    setSelectedOrg(null);
    setExpandedOrgId(null);
    setId(taskId);
  };

  const handleOrgSelect = (org) => {
    selectionSource.current = 'sidebar';
    setSelectedOrg(org);
    setExpandedOrgId(org.id);
  };

  const handleOrgMapClick = (org) => {
    selectionSource.current = 'map';
    setSelectedOrg(org);
    setExpandedOrgId(org.id);
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
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Umweltaktion Bayern
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {tasks.length} Aktionen &middot; {organizations.length} Organisationen
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
                <ListItem key={task.id} disablePadding sx={{ mb: 2 }} ref={(el) => { itemRefs.current[task.id] = el; }}>
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

            {/* Organizations collapsible section */}
            <Divider sx={{ my: 2 }} />
            <Accordion
              defaultExpanded={false}
              disableGutters
              elevation={0}
              sx={{
                '&:before': { display: 'none' },
                backgroundColor: 'transparent',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon fontSize="small" color="secondary" />
                  <Typography variant="overline">
                    Organisationen ({filteredOrgs.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0 }}>
                <List disablePadding>
                  {filteredOrgs.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                      Keine Treffer
                    </Typography>
                  )}
                  {filteredOrgs.map((org) => (
                    <ListItem
                      key={org.id}
                      disablePadding
                      sx={{ mb: 0.5, flexDirection: 'column', alignItems: 'stretch' }}
                      ref={(el) => { orgItemRefs.current[org.id] = el; }}
                    >
                      <ListItemButton
                        selected={selectedOrg && selectedOrg.id === org.id}
                        onClick={() => handleOrgSelect(org)}
                        sx={{
                          borderRadius: 1,
                          border: selectedOrg && selectedOrg.id === org.id
                            ? `2px solid ${theme.palette.secondary.main}`
                            : '2px solid transparent',
                          py: 1,
                        }}
                      >
                        <ListItemText
                          primary={org.name}
                          secondary={org.type}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItemButton>
                      <Collapse in={expandedOrgId === org.id}>
                        <Box sx={{ px: 2, pb: 1.5, pt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {org.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {org.address && (
                              <Chip
                                icon={<LocationOnIcon />}
                                label={org.address}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {org.website && (
                              <Chip
                                icon={<LinkIcon />}
                                label="Website"
                                size="small"
                                variant="outlined"
                                component="a"
                                href={org.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                clickable
                              />
                            )}
                          </Box>
                        </Box>
                      </Collapse>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
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
            <Paper
              elevation={2}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                zIndex: 1200,
                display: 'flex',
                gap: 0.75,
                borderRadius: 2,
                p: 0.75,
                backgroundColor: 'rgba(255,255,255,0.92)',
              }}
            >
              <Button
                size="small"
                variant={showAktionen ? 'contained' : 'outlined'}
                onClick={() => setShowAktionen((v) => !v)}
                startIcon={<ForestIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: 1.5,
                  ...(showAktionen
                    ? { backgroundColor: 'primary.main', color: '#fff', '&:hover': { backgroundColor: 'primary.dark' } }
                    : { color: 'text.disabled', borderColor: 'divider' }),
                }}
              >
                Aktionen
              </Button>
              <Button
                size="small"
                variant={showOrganisationen ? 'contained' : 'outlined'}
                onClick={() => setShowOrganisationen((v) => !v)}
                startIcon={<BusinessIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: 1.5,
                  ...(showOrganisationen
                    ? { backgroundColor: 'secondary.main', color: '#fff', '&:hover': { backgroundColor: 'secondary.dark' } }
                    : { color: 'text.disabled', borderColor: 'divider' }),
                }}
              >
                Organisationen
              </Button>
            </Paper>
            <BayernMap>
              <MapController selectedId={id} />
              <MapOrgController selectedOrg={selectedOrg} />
              <MapSearchController target={mapTarget} />
              {showAktionen && tasks.map((task) => (
                <Marker
                  key={task.id}
                  position={task.loc}
                  icon={eventIcon}
                  eventHandlers={{
                    click: () => {
                      selectionSource.current = 'map';
                      setId(task.id);
                    },
                  }}
                >
                  <Popup>
                    {task.name}
                  </Popup>
                </Marker>
              ))}
              {showOrganisationen && organizations.map((org) => (
                <Marker
                  key={`org-${org.id}`}
                  position={org.loc}
                  icon={orgIcon}
                  eventHandlers={{
                    click: () => handleOrgMapClick(org),
                  }}
                >
                  <Popup>
                    <strong>{org.name}</strong><br />
                    <small>{org.type}</small>
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
