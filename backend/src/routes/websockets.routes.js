// Store active connections (you might want to move this to a service later)
const connections = new Map();

export default async function websocketRoutes(fastify, opts) {
  // WebSocket endpoint
  fastify.get("/ws", { websocket: true }, (connection, request) => {
    // ✅ connection *is* the socket
    connection.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received:", data);

        connection.send(
          JSON.stringify({
            type: "echo",
            data: data,
          })
        );
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    });

    connection.on("close", () => {
      console.log("WebSocket disconnected");
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
