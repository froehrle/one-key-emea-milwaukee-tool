import { log } from "../services/logger";
import { WebSocket } from "ws";

const connectionsByClientId = new Map<string, Set<WebSocket>>(); // TODO: Oder nach correlationId mappen?

function register(clientId: string, ws: WebSocket) {
  const connections = connectionsByClientId.get(clientId) ?? new Set();
  connections.add(ws);

  connectionsByClientId.set(clientId, connections);

  log.debug(
    `Client '${clientId}' registered. Total clients: ${connectionsByClientId.size}`
  );
}

function unregister(clientId: string, ws: WebSocket) {
  const connections = connectionsByClientId.get(clientId);

  if (!connections) return;

  connections.delete(ws);

  log.debug(
    `[WebSocket] Connection unregistered for client '${clientId}'. Connections left: ${connections.size}`
  );

  if (connections.size === 0) {
    connectionsByClientId.delete(clientId);
  }
}

function unregisterAll(clientId: string) {
  const connections = connectionsByClientId.get(clientId);

  if (!connections) return;

  connectionsByClientId.delete(clientId);

  log.debug(
    `[WebSocket] Client '${clientId}' unregistered. Clients left: ${connectionsByClientId.size}`
  );
}

function findOpenWebSocketConnections(clientId: string) {
  const connections = connectionsByClientId.get(clientId);

  if (connections) {
    return Array.from(connections).filter((ws) => ws.readyState === ws.OPEN);
  }
  return [];
}

export { register, unregister, unregisterAll, findOpenWebSocketConnections };
