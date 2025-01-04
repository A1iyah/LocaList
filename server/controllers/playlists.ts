import { PlaylistModel } from "../models/playlistsModel";
import { UserModel } from "../models/userModel";
import { v4 as uuidv4 } from "uuid";

export const getPlaylists = async (req: any, res: any) => {
  try {
    const { userId } = req.query;

    const playlists = await PlaylistModel.find({ userId });

    if (!playlists) {
      return res.status(404).send("Playlist not found.");
    }

    res.json(playlists);
  } catch (error) {
    console.error("Server error - getPlaylists : ", error);
    return res.status(500).send("Internal server error.");
  }
};

export const getPlaylistDetails = async (req: any, res: any) => {
  try {
    const { playlistId } = req.params;

    if (!playlistId) {
      return res.status(400).send("Missing playlistId in request parameters.");
    }

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
    const { playlistName, songs = [], userId } = req.body;
    // const playlistId = uuidv4();

    if (!playlistName || !userId) {
      return res.status(400).send("Missing playlist name or user ID.");
    }

    let newPlaylist = new PlaylistModel({
      userId,
      playlistId: uuidv4(),
      playlistName,
      songs: songs || [],
    });

    const savedPlaylist = await newPlaylist.save();

    const userUpdateResult = await UserModel.updateOne(
      { userId },
      { $push: { playlists: savedPlaylist._id } }
    );

    if (!userUpdateResult.modifiedCount) {
      throw new Error("Failed to link playlist to user.");
    }

    res.status(200).send({ ok: true, playlistId: savedPlaylist.playlistId });
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
      { $addToSet: { songs: song } },
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
  try {
    const { playlistId } = req.params;
    const { songId } = req.query;

    console.log("Deleting song:", songId, "from playlist:", playlistId);

    const updateResult = await PlaylistModel.updateOne(
      { playlistId },
      { $pull: { songs: { id: songId } } }
    );

    console.log("Update Result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      return res.status(404).send("Song not found in the playlist.");
    }

    return res.status(200).send("Song deleted successfully.");
  } catch (error) {
    console.log("Server error", error);
    return res.status(500).send("Internal server error.");
  }
};
