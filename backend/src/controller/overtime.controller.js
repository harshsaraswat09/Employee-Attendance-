import { validationResult } from "express-validator";
import Overtime from "../model/overtime.model.js";
import Attendance from "../model/attendance.model.js";

export const requestOvertime = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { attendanceId, requestedHours, reason } = req.body;

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    if (attendance.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "This attendance record does not belong to you",
      });
    }

    const existing = await Overtime.findOne({ attendanceId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Overtime already requested for this attendance",
      });
    }

    const overtime = await Overtime.create({
      userId: req.user._id,
      attendanceId,
      requestedHours,
      reason,
    });

    attendance.overtimeStatus = "pending";
    await attendance.save();

    return res.status(201).json({
      success: true,
      data: overtime,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOvertimes = async (req, res) => {
  try {
    const records = await Overtime.find({ userId: req.user._id })
      .populate("attendanceId", "date workingHours status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingOvertimes = async (req, res) => {
  try {
    const records = await Overtime.find({ status: "pending" })
      .populate("userId", "name email department")
      .populate("attendanceId", "date workingHours status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewOvertime = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { status } = req.body;

    const overtime = await Overtime.findById(req.params.id);
    if (!overtime) {
      return res.status(404).json({
        success: false,
        message: "Overtime request not found",
      });
    }

    if (overtime.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Overtime request already reviewed",
      });
    }

    overtime.status = status;
    overtime.reviewedBy = req.user._id;
    overtime.reviewedAt = new Date();
    await overtime.save();

    const attendance = await Attendance.findById(overtime.attendanceId);
    if (attendance) {
      attendance.overtimeStatus = status;
      await attendance.save();
    }

    return res.status(200).json({ success: true, data: overtime });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};