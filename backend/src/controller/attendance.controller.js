import { validationResult } from "express-validator";
import Attendance from "../model/attendance.model.js";
import User from "../model/user.model.js";

import { config } from "../config/config.js";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const calcWorkingHours = (punchIn, punchOut) => {
  const diff = new Date(punchOut) - new Date(punchIn);
  return parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
};

export const punchIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { selfie, location } = req.body;
    const userId = req.user._id;
    const date = getTodayDate();

    const existing = await Attendance.findOne({ userId, date });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: existing.punchOut?.time
          ? "Already completed attendance for today"
          : "Already punched in for today",
      });
    }

    const attendance = await Attendance.create({
      userId,
      date,
      punchIn: {
        time: new Date(),
        selfie,
        location,
      },
    });

    return res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const punchOut = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { selfie, location } = req.body;
    const userId = req.user._id;
    const date = getTodayDate();

    const attendance = await Attendance.findOne({ userId, date });
    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "You have not punched in today",
      });
    }

    if (attendance.punchOut?.time) {
      return res.status(400).json({
        success: false,
        message: "Already punched out for today",
      });
    }

    const workingHours = calcWorkingHours(attendance.punchIn.time, new Date());

    attendance.punchOut = { time: new Date(), selfie, location };
    attendance.workingHours = workingHours;
    attendance.status = workingHours >= 8 ? "completed" : "incomplete";

    await attendance.save();

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id }).sort({
      date: -1,
    });
    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamAttendance = async (req, res) => {
  try {
    const teamMembers = await User.find({ managerId: req.user._id }).select(
      "_id"
    );
    const teamIds = teamMembers.map((m) => m._id);

    const records = await Attendance.find({ userId: { $in: teamIds } })
      .populate("userId", "name email department")
      .sort({ date: -1 });

    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("userId", "name email role department")
      .sort({ date: -1 });

    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const validateAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { validationStatus, validationRemark } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    attendance.validationStatus = validationStatus;
    attendance.validationRemark = validationRemark || "";
    attendance.validatedBy = req.user._id;

    await attendance.save();

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const { date } = req.query;
    const reportDate = date || getTodayDate();

    let filter = { date: reportDate };

    if (req.user.role === "employee") {
      filter.userId = req.user._id;
    } else if (req.user.role === "manager") {
      const teamMembers = await User.find({
        managerId: req.user._id,
      }).select("_id");
      const teamIds = teamMembers.map((m) => m._id);
      filter.userId = { $in: teamIds };
    }

    const records = await Attendance.find(filter)
      .populate("userId", "name email department role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: records,
      reportDate,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};