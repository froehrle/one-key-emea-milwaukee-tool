import http from "http";
import { WebSocketServer } from "ws";

import { log } from "../services/logger";
import { register, unregister } from "./registry";

export default function initWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    log.info("[WebSocket] Client connected");

    // Demo: userId als Query param (?userId=123)
    const url = new URL(req.url!, process.env.HOST ?? "http://localhost");
    // TODO: Oder clientId wird hier serverseitig zugewiesen; z. B. const clientId = generateId();
    // Register client
    const clientId = url.searchParams.get("userId"); // TODO: Oder const correlationId = extractCorrelationId(req); ...

    if (!clientId) {
      ws.terminate();
      return;
    }

    register(clientId, ws);

    ws.on("error", log.error);

    ws.on("close", () => {
      unregister(clientId, ws);
      log.info("[WebSocket] Client disconnected");
    });
  });

  return {
    webSocketServer: wss,
    closeServer: () => closeWebSocketServer(wss),
  };
}

function closeWebSocketServer(wss: WebSocketServer) {
  return new Promise<void>((resolve, reject) => {
    wss.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
