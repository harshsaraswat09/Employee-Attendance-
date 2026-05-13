import { body } from "express-validator";

export const overtimeRequestValidator = [
  body("attendanceId").notEmpty().withMessage("Attendance ID is required"),
  body("requestedHours")
    .isNumeric()
    .withMessage("Requested hours must be a number")
    .custom((val) => val > 0)
    .withMessage("Requested hours must be greater than 0"),
  body("reason").trim().notEmpty().withMessage("Reason is required"),
];

export const overtimeReviewValidator = [
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be approved or rejected"),
];