import mongoose, { Schema, model, models } from "mongoose";

interface AsesmentResult {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  score: number;
}

const AsesmentResultSchema = new Schema<AsesmentResult>({
  studentId: { type: mongoose.Types.ObjectId, required: true },
  studentName: { type: String, required: true },
  score: { type: Number, required: true },
});

const AsesmentResult =
  models.AsesmentResult ||
  model<AsesmentResult>("AsesmentResult", AsesmentResultSchema);

export default AsesmentResult;
