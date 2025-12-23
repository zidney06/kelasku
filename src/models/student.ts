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
  },
);

StudentSchema.pre("save", async function () {
  // 'this' merujuk pada dokumen siswa yang sedang diproses
  if (this.scores && this.scores.length > 0) {
    // Menghitung total nilai
    const totalSum = this.scores.reduce((acc, current) => acc + current, 0);
    // Menghitung rata-rata dan menyimpannya ke field 'average'
    this.average = totalSum / this.scores.length;
  } else {
    this.average = 0;
  }
});

const Student = models.Student || model<IStudent>("Student", StudentSchema);

export default Student;
