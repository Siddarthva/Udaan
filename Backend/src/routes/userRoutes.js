import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getMe,
  getPublicProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);
router.put("/me/password", auth, changePassword);

router.get("/:id", getPublicProfile); // public route

export default router;
