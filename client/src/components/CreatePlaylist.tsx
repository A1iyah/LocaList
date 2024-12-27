import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { axiosClient } from "../utils/apiClient";

interface SongData {
  id: string;
  title: string;
  artist: string;
}

interface PlaylistData {
  playlistId: string;
  playlistName: string;
  songs: SongData[];
}

const CreatePlaylist = () => {
  const { state: authState } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchPlaylists = async () => {
    try {
      const { data } = await axiosClient.get("/getPlaylists", {
        params: { userId: authState.userId },
      });

      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists (create playlist).", error);
      setError("Error fetching playlists (create playlist)." + error);
    }
  };
};
