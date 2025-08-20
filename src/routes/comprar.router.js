import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import comprar from '../controllers/comprar.controller.js'

const router = express.Router();

router.post("/comprar", authMiddleware, (req, res) => {
  return new comprar(req, res).comprar_soft();
});

export default router;