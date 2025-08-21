import express from "express";
import consultarPagamento from '../controllers/consult-payment.controller.js'

const router = express.Router();

router.post("/payment", (req, res) => {
  return new consultarPagamento(req, res).consult();
});

export default router;