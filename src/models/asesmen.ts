import { Schema, model, models } from "mongoose";

interface Asesmen {
  name: string;
  date: Date;
  description: string;
  asesmentResults: string[];
}

const AsesmenSchema = new Schema<Asesmen>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  description: {
    type: String,
    default: "Tugas untuk meningkatkan keterampilan dan kemampuan siswa",
    maxlength: [150, "Deskripsi terlalu panjang"],
    trim: true,
    set: (val: string) =>
      val.trim() === ""
        ? "Tugas untuk meningkatkan keterampilan dan kemampuan siswa"
        : val,
  },
  asesmentResults: [{ type: Schema.Types.ObjectId, ref: "AsesmentResult" }],
});

const Asesmen = models.Asesmen || model<Asesmen>("Asesmen", AsesmenSchema);

export default Asesmen;
