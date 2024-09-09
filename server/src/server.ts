import app from "@/src/app";
import MongoDBConnector from "@/src/database/connection";
import configs from "@/src/config";
import http from 'http';
import setupSocketIO from "@/src/socket/socket"; // Import the chatSocket function
import { Server } from 'socket.io';

async function run() {
  try {
    
    // Activate MongoDB
    const mongodb = MongoDBConnector.getInstance(configs.env);
    await mongodb.connect({ url: configs.mongodbUrl });

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Set up Socket.io
    const io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000', // Adjust to your client origin
        methods: ['GET', 'POST'],
      },
    });

    // Initialize chatSocket with Socket.IO server instance
    setupSocketIO(io);

    // Start the HTTP server
    httpServer.listen(configs.port, () => {
      console.log(`Server running on Port: ${configs.port}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1); // Exit with failure code
  }
}

run();
