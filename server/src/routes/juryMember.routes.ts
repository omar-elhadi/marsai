import express from "express";
import {
  list,
  getOne,
  create,
  update,
  remove,
} from "../controllers/juryMember.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", list);
router.get("/:id", getOne);
router.post("/", verifyToken, isAdmin, create);
router.put("/:id", verifyToken, isAdmin, update);
router.delete("/:id", verifyToken, isAdmin, remove);

export default router;
