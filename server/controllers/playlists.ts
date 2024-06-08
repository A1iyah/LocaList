import { PlaylistModel } from "../models/playlistsModel";
import { UserModel } from "../models/userModel";
import { uuid } from "uuidv4";

export const getPlaylists = async (req: any, res: any) => {
  try {
    const { userId } = req.query;

    const playlists = await PlaylistModel.find({ userId });

    res.json(playlists);
  } catch (error) {
    console.error("Server error - getPlaylists : ", error);
    return res.status(500).send("Internal server error.");
  }
};

export const getPlaylistDetails = async (req: any, res: any) => {
  try {
    const playlistId = req.params.playlistId;

    const playlist = await PlaylistModel.findOne({ playlistId: playlistId });

    if (!playlist) {
      return res.status(404).send("Playlist not found.");
    }

    res.json(playlist);
  } catch (error) {
    console.error("Server error - getPlaylistDetails : ", error);
    return res.status(500).send("Internal server error.");
  }
};

export const addNewPlaylist = async (req: any, res: any) => {
  try {
    const { playlistName, songs, userId } = req.body;
    const playlistId = uuid();

    if (!playlistName || !userId) {
      return res.status(400).send("Missing playlist name or user ID.");
    }

    let newPlaylist = new PlaylistModel({
      userId,
      playlistId,
      playlistName,
      songs: songs || [],
    });

    const savedPlaylist = await newPlaylist.save();

    const userUpdateResult = await UserModel.updateOne(
      { userId: userId },
      { $push: { playlists: savedPlaylist._id } }
    );

    if (userUpdateResult.modifiedCount === 0) {
      throw new Error("Failed to link playlist to user.");
    }

    res.status(200).send({ ok: true, playlistId: savedPlaylist._id });
  } catch (error) {
    console.error("Server error - addNewPlaylist : ", error);
    return res.status(500).send("Internal server error.");
  }
};

export const addSongToPlaylist = async (req: any, res: any) => {
  const { playlistId, song } = req.body;
  try {
    const playlist = await PlaylistModel.findOneAndUpdate(
      { playlistId },
      { $push: { songs: song } },
      { new: true }
    );

    return res.status(200).json(playlist);
  } catch (error) {
    console.error("Server error - addSongToPlaylist : ", error);
    return res.status(500).send("Internal server error.");
  }
};

export const deletePlaylist = async (req: any, res: any) => {
  try {
    const { playlistId } = req.params;
    const { userId } = req.query;

    const deletedPlaylist = await PlaylistModel.findOneAndDelete({
      playlistId,
    });

    if (!deletedPlaylist) {
      return res.status(404).send("Playlist not found.");
    }

    await UserModel.updateOne(
      { userId },
      { $pull: { playlists: deletedPlaylist._id } }
    );

    res.status(200).send("Playlist deleted successfully");
  } catch (error) {
    console.error("Server error - deletePlaylist : ", error);
    return res.status(500).send("Internal server error.");
  }
};

export const deleteSongFromPlaylist = async (req: any, res: any) => {
  const { playlistId, songId } = req.params;

  try {
    const playlist = await PlaylistModel.findOne({ playlistId });
    if (!playlist) {
      return res.status(404).send("Playlist not found.");
    }

    const updatedSongs = playlist.songs.filter((song) => song.key !== songId);

    playlist.songs = updatedSongs;

    await playlist.save();

    res.send("Song deleted successfully.");
  } catch (error) {
    console.error("Server error - deleteSongFromPlaylist : ", error);
    return res.status(500).send("Internal server error.");
  }
};
