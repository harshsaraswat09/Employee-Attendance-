import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const punchSchema = new mongoose.Schema({
  time: { type: Date },
  selfie: { type: String },
  location: { type: locationSchema },
});

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    punchIn: { type: punchSchema },
    punchOut: { type: punchSchema },
    workingHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "incomplete"],
      default: "incomplete",
    },
    validationStatus: {
      type: String,
      enum: ["pending", "valid", "invalid"],
      default: "pending",
    },
    validationRemark: {
      type: String,
      default: "",
    },
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    overtimeStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;