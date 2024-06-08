import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  playlistId: { type: String },
  playlistName: { type: String },
  songs: [],
  userId: { type: String, ref: "userModel" },
});

export const PlaylistModel = mongoose.model("PlaylistsModel", playlistSchema);

export interface PlaylistData {
  playlistId: string;
  playlistName: string;
  songs: any[];
}
