// Store active connections (you might want to move this to a service later)
const connections = new Map();

export default async function websocketRoutes(fastify, opts) {
  // WebSocket endpoint
  fastify.get("/ws", { websocket: true }, async (connection, request) => {
    const { socket } = connection;

    // extract user info from query params or headers
    const connectionId = Date.now() + Math.random();

    // Store the connection
    connections.set(connectionId, socket);

    console.log(`WebSocket connected: ${connectionId}`);

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received:", data);

        // Echo back or handle different message types
        socket.send(
          JSON.stringify({
            type: "echo",
            data: data,
          })
        );
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    });

    socket.on("close", () => {
      connections.delete(connectionId);
      console.log(`WebSocket disconnected: ${connectionId}`);
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
      connections.delete(connectionId);
    });
  });

  // Helper function to broadcast notifications
  fastify.decorate("broadcastNotification", (notification) => {
    connections.forEach((socket) => {
      if (socket.readyState === 1) {
        // WebSocket.OPEN
        socket.send(
          JSON.stringify({
            type: "notification",
            data: notification,
          })
        );
      }
    });
  });
}
