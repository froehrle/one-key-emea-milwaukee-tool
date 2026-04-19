import express from "express";
import { log } from "../services/logger";

export default function createApiRouter() {
  const router = express.Router();

  router.get("/health", (_, res) => {
    res.json({ ok: true });
  });

  router.get("/auth/token", (req, res) => {
    log.info("[Server] Received request: /auth/token");

    res.json("Token");
  });

  router.get("/tools", (req, res) => {
    res.json([]);
  });

  router.patch("/transfer", (req, res) => {
    const { toolId, demoAccountId } = req.body ?? {};

    if (!toolId || !demoAccountId) {
      return res.status(400).json("Missing toolId and/or demoAccountId");
    }

    res.json("Transfer successful");
  });

  return router;
}
