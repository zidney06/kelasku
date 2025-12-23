import mongoose, { Schema, model, models } from "mongoose";

interface Class {
  owner: mongoose.Types.ObjectId;
  className: string;
  subjectName: string;
  semester: string;
  students: mongoose.Types.ObjectId[];
  attendanceHistory: [{ type: string }];
  asesments: mongoose.Types.ObjectId[];
}

const ClassSchema = new Schema<Class>({
  owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  className: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: String, required: true },
  students: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  attendanceHistory: [{ type: String }],
  asesments: [{ type: mongoose.Types.ObjectId, ref: "Asesmen" }],
});

const ClassModel = models.Class || model<Class>("Class", ClassSchema);

export default ClassModel;
