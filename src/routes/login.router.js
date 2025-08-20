import express from "express";
import login from '../controllers/login.controller.js'

const router = express.Router();

router.post("/login", (req, res) => {
  return new login(req, res).logar();
});

export default router;