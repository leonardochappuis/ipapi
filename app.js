const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Generate a random color for the client
  const color = getRandomColor();

  // Add the client to the list of clients
  clients.push({ ws, color, x: Math.random() * 500, y: Math.random() * 500 });

  // Send the initial list of clients to the new client
  ws.send(JSON.stringify(clients));

  // Broadcast the new client to all other clients
  broadcast(clients);

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove the client from the list of clients
    clients = clients.filter((client) => client.ws !== ws);

    // Broadcast the updated list of clients to all other clients
    broadcast(clients);
  });
});

// Function to broadcast a message to all clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Function to generate a random color
function getRandomColor() {
  const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
}