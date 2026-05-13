import express from "express";
import {
  getAllUsers,
  getUserById,
} from "../controller/user.controller.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleMiddleware(["admin"]), getAllUsers);
router.get("/:id", roleMiddleware(["admin", "manager"]), getUserById);

export default router;