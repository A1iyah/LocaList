import { useState, useEffect } from "react";
import { axiosClient } from "../utils/apiClient";

export interface SongData {
  id: string;
  title: string;
  artist: string;
}

export interface PlaylistData {
  playlistId: string;
  playlistName: string;
  songs: SongData[];
}

const usePlaylists = (userId: string) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchPlaylists = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axiosClient.get("/getPlaylists", {
        params: { userId },
      });
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setError("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [userId]);

  return {
    playlists,
    setPlaylists,
    loading,
    error,
    fetchPlaylists,
  };
};

export default usePlaylists;
