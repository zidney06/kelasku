import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String }, // Foto profil dari Google
    tier: { type: String, enum: ["free", "subscription"], default: "free" },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;
