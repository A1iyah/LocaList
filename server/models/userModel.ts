import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  image: { type: String },
  name: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  playlists: [{ type: Schema.Types.ObjectId, ref: "PlaylistsModel" }],
});

export const UserModel = mongoose.model("userModel", userSchema);

export interface UserData {
  image?: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  playlists?: [];
}
