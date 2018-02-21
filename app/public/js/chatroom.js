const socket = io('/tech');

socket.on('connect', () => {
  // Emiting to everyone
  socket.emit('systemLog', "A new user connected"); // Emiting to server
});