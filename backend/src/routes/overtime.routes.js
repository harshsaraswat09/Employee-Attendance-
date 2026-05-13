import express from "express";
import {
  requestOvertime,
  getMyOvertimes,
  getPendingOvertimes,
  reviewOvertime,
} from "../controller/overtime.controller.js";
import {
  overtimeRequestValidator,
  overtimeReviewValidator,
} from "../validator/overtime.validator.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/request", roleMiddleware(["employee"]), overtimeRequestValidator, requestOvertime);
router.get("/my", roleMiddleware(["employee"]), getMyOvertimes);
router.get("/pending", roleMiddleware(["manager", "admin"]), getPendingOvertimes);
router.patch("/:id/review", roleMiddleware(["manager", "admin"]), overtimeReviewValidator, reviewOvertime);

export default router;