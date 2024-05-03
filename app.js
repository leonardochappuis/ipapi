const WebSocket = require('ws');
const ipapi = require('ipapi');

const wss = new WebSocket.Server({ port: 8080 });

const serverLocation = {
  lat: 37.7749,
  lon: -122.4194,
};

wss.on('connection', (ws) => {
  const clientColor = getRandomColor();
  const clientLocation = ipapi.location(ws._socket.remoteAddress);
  const distance = calculateDistance(serverLocation, clientLocation);
  const normalizedDistance = normalizeDistance(distance);

  ws.send(JSON.stringify({
    color: clientColor,
    distance: normalizedDistance,
    position: getRandomPosition(normalizedDistance),
  }));
});

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function calculateDistance(loc1, loc2) {
  // Haversine formula to calculate distance between two points on a sphere
  const R = 6371; // km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lon - loc1.lon) * Math.PI / 180;
  const lat1 = loc1.lat * Math.PI / 180;
  const lat2 = loc2.lat * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function normalizeDistance(distance) {
  return Math.min(distance / 1000, 200); // normalize to 200 pixels
}

function getRandomPosition(distance) {
  const angle = Math.random() * 2 * Math.PI;
  const x = distance * Math.cos(angle);
  const y = distance * Math.sin(angle);
  return { x, y };
}