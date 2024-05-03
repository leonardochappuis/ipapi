const canvas = document.querySelector("#glcanvas");
const ctx = canvas.getContext('2d');

// Draw server circle
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI);
ctx.fillStyle = 'red';
ctx.fill();

// Set up WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const clientColor = data.color;
  const distance = data.distance;
  const position = data.position;

  // Draw client circle
  ctx.beginPath();
  ctx.arc(position.x + canvas.width / 2, position.y + canvas.height / 2, 5, 0, 2 * Math.PI);
  ctx.fillStyle = clientColor;
  ctx.fill();

  // Draw connecting line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2);
  ctx.lineTo(position.x + canvas.width / 2, position.y + canvas.height / 2);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
};