import express from "express";
import { loginUser, registerUser } from "./controllers/users";
import upload from "./utils/file_upload";
import {
  getArtistDetails,
  getCountry,
  getGenre,
  getSearch,
  getSongs,
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
  .post("/", loginUser)
  .post("/signup", upload.single("image"), registerUser)
  .post("/login", loginUser)
  .get("/get-songs", getSongs)
  .get("/discover", getSongs)
  .get("/around-you", getCountry)
  .get("/genre-code", getGenre)
  .get("/artist-details", getArtistDetails)
  .get("/song", getSearch)
  .get("/country", getCountry)
  .get("/getPlaylists", getPlaylists)
  .get("/playlist/:playlistId", getPlaylistDetails)
  .post("/newPlaylist", addNewPlaylist)
  .post("/addSongToPlaylist", addSongToPlaylist)
  .delete("/deletePlaylist/:playlistId", deletePlaylist)
  .delete("/playlist/:playlistId/song/:songId", deleteSongFromPlaylist);

export default router;
