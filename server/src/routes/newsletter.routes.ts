import express from "express";
import {
  subscribe,
  unsubscribe,
} from "../controllers/newsletter.controller.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe/:token", unsubscribe);

export default router;
