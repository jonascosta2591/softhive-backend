import express from "express";
import register from '../controllers/register.controller.js'

const router = express.Router();

router.post("/registrar", (req, res) => {
  return new register(req, res).registrar();
});

export default router;