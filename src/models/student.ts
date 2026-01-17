import { Schema, model, models } from "mongoose";

export interface IStudent {
  name: string;
  absence: number;
  permission: number;
  attendance: number;
  total: number;
  scores: number[];
  average: number;
  isDeleted: boolean;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: [true, "Nama harus diisi"] },
    absence: { type: Number, default: 0 },
    permission: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    scores: { type: [Number], default: [] },
    average: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Otomatis buat field createdAt & updatedAt
    versionKey: false, // Menghilangkan field __v bawaan MongoDB
  }
);

const Student = models.Student || model<IStudent>("Student", StudentSchema);

export default Student;
