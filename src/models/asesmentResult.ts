import mongoose, { Schema, model, models } from "mongoose";

interface AsesmentResult {
  studentData: mongoose.Types.ObjectId;
  score: number;
}

const AsesmentResultSchema = new Schema<AsesmentResult>({
  studentData: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  score: { type: Number, required: true },
});

const AsesmentResult =
  models.AsesmentResult ||
  model<AsesmentResult>("AsesmentResult", AsesmentResultSchema);

export default AsesmentResult;
