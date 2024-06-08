import express from "express";
import upload from "./utils/file_upload";
import { loginUser, registerUser } from "./controllers/users";
import {
  getCountry,
  getSongs,
  getGenre,
  getArtistDetails,
  getSearch,
} from "./controllers/songs";
import {
  addNewPlaylist,
  addSongToPlaylist,
  deletePlaylist,
  deleteSongFromPlaylist,
  getPlaylistDetails,
  getPlaylists,
} from "./controllers/playlists";

const router = express.Router();

router
  .post("/signup", upload.single("image"), registerUser)
  .post("/login", loginUser)
  .get("/get-songs", getSongs)
  .get("/discover", getSongs)
  .get("/around-you", getCountry)
  .get("/genre-code", getGenre)
  .get("/artist-details", getArtistDetails)
  .get("/search", getSearch)
  .get("/country", getCountry)
  .get("/getPlaylists", getPlaylists)
  .get("/playlist/:playlistId", getPlaylistDetails)
  .post("/newPlaylist", addNewPlaylist)
  .post("/addSongToPlaylist", addSongToPlaylist)
  .delete("/deletePlaylist/:playlistId", deletePlaylist)
  .delete("/playlist/:playlistId/song/:songId", deleteSongFromPlaylist);

export default router;
