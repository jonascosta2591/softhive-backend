import express from "express";
import consultarPagamento from '../controllers/consult-payment.controller.js'
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/payment", authMiddleware, (req, res) => {
  return new consultarPagamento(req, res).consult();
});

export default router;