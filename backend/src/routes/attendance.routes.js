import express from "express";
import {
  punchIn,
  punchOut,
  getMyAttendance,
  getTeamAttendance,
  getAllAttendance,
  validateAttendance,
  getReport,
} from "../controller/attendance.controller.js";
import {
  punchInValidator,
  punchOutValidator,
  validateAttendanceValidator,
} from "../validator/attendance.validator.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/punch-in", roleMiddleware(["employee"]), punchInValidator, punchIn);
router.post("/punch-out", roleMiddleware(["employee"]), punchOutValidator, punchOut);
router.get("/my", roleMiddleware(["employee"]), getMyAttendance);
router.get("/team", roleMiddleware(["manager", "admin"]), getTeamAttendance);
router.get("/all", roleMiddleware(["admin"]), getAllAttendance);
router.patch("/:id/validate", roleMiddleware(["admin", "manager"]), validateAttendanceValidator, validateAttendance);
router.get("/report", getReport);

export default router;