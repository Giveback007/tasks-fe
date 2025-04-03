export function test() {
    // Create a new WebSocket connection to your server
    const socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    socket.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server');

        // You can send a message to the server
        socket.send('Hello from the client!');
    });

    // Listen for messages from the server
    socket.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
    });

    // Listen for errors
    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });

    // Listen for connection close
    socket.addEventListener('close', (event) => {
        console.log('Connection closed', event.code, event.reason);
    });
}