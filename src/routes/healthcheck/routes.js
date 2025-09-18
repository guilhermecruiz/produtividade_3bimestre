import express from "express";

const router = express.Router();

/**
 * Healthcheck da API
 */
router.get("/", (_req, res) => res.json({ ok: true, service: "API 3º Bimestre" }));

export default router;
