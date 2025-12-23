import { Schema, model, models } from "mongoose";

interface AsesmentResult {
  studentName: string;
  score: number;
}

const AsesmentResultSchema = new Schema<AsesmentResult>({
  studentName: { type: String, required: true },
  score: { type: Number, required: true },
});

const AsesmentResult =
  models.AsesmentResult ||
  model<AsesmentResult>("AsesmentResult", AsesmentResultSchema);

export default AsesmentResult;
