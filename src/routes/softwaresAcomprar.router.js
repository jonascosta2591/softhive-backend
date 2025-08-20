import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import softwaresAComprar from '../controllers/softwareAcomprar.controller.js'

const router = express.Router();

router.get("/softwares", (req, res) => {
  return new softwaresAComprar(req, res).allSoftwares();
});

export default router;