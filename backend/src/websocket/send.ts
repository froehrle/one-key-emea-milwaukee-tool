import { findOpenWebSocketConnections } from "./registry";
import { log } from "../services/logger";

export default function sendMessage(clientId: string, message: any) {
  const connections = findOpenWebSocketConnections(clientId);

  if (connections.length === 0) {
    console.debug(`[WebSocket] No connections for client ${clientId}`);
    return false;
  }

  for (const ws of connections) {
    ws.send(JSON.stringify(message), (error) => {
      if (error) {
        log.debug(["[WebSocket] Sending message failed:", error]);
      }
    });
  }

  return true;
}
