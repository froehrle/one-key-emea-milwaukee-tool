import cors from "cors";
import express from "express";
import http from "http";

import createApiRouter from "./api-router";
import initWebSocketServer from "../websocket";
import { log } from "../services/logger";

const PORT = 3000;
const CLIENT_URL = "http://localhost:8080";

export default function bootstrapServer() {
  const app = express();

  app.use(cors({ origin: CLIENT_URL }));
  app.use(express.json());

  app.use("/api", createApiRouter());

  const server = http.createServer(app);

  initWebSocketServer(server);

  server.listen(PORT, () => log.info(`[Server] Running on port ${PORT}`));

  return {
    server,
    closeServer: () => closeServer(server),
  };
}

const closeServer = (server: http.Server) => {
  return new Promise<void>((resolve, reject) => {
    if (!server) return resolve();
    server.close((error) => (error ? reject(error) : resolve()));
  });
};
