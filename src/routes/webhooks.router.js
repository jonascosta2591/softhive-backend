import express from "express";
import Webhooks from '../controllers/webhooks.controller.js'

const router = express.Router();

router.get("/webhooks", (req, res) => {
  return new Webhooks(req, res).recebe();
});

export default router;