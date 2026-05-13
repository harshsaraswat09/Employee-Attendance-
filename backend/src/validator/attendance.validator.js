import { body } from "express-validator";

export const punchInValidator = [
  body("selfie").notEmpty().withMessage("Selfie is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("location.lat").isNumeric().withMessage("Valid latitude is required"),
  body("location.lng").isNumeric().withMessage("Valid longitude is required"),
];

export const punchOutValidator = [
  body("selfie").notEmpty().withMessage("Selfie is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("location.lat").isNumeric().withMessage("Valid latitude is required"),
  body("location.lng").isNumeric().withMessage("Valid longitude is required"),
];

export const validateAttendanceValidator = [
  body("validationStatus")
    .isIn(["valid", "invalid"])
    .withMessage("Status must be valid or invalid"),
  body("validationRemark").optional().trim(),
];