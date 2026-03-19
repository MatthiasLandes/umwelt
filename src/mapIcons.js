import L from 'leaflet';

// Event pin: green teardrop shape (primary, dominant)
export const eventIcon = L.divIcon({
  html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.716 23.284 0 15 0z" fill="#2e7d32"/>
    <circle cx="15" cy="14" r="6" fill="white"/>
  </svg>`,
  className: 'event-marker',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

// Organization pin: brown circle dot (secondary, subordinate)
export const orgIcon = L.divIcon({
  html: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" fill="#795548" fill-opacity="0.75" stroke="white" stroke-width="2"/>
  </svg>`,
  className: 'org-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});
