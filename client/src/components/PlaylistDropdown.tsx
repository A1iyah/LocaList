import { useState, useEffect, useContext } from "react";
import { axiosClient } from "../utils/apiClient";
import { AuthContext } from "../context/AuthProvider";
import { HiDotsHorizontal } from "react-icons/hi";
import "../index.css";

interface Song {
  key: any;
  id: string;
  title: string;
  subtitle: string;
  track?: Song;
}

interface PlaylistDropdownProps {
  song: Song;
}

const PlaylistDropdown = ({ song }: PlaylistDropdownProps) => {
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [message, setMessage] = useState("");
  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    if (authState.userId) {
      fetchPlaylists();
    }
  }, [authState.userId]);

  const fetchPlaylists = async () => {
    try {
      const response = await axiosClient.get("/getPlaylists", {
        params: { userId: authState.userId },
      });

      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      showMessage("Please enter a playlist name.");
      return;
    }

    const userId = authState.userId;

    try {
      await axiosClient.post("/newPlaylist", {
        playlistName: newPlaylistName,
        songs: [],
        userId,
      });

      showMessage("Playlist Created.");
      fetchPlaylists();
      setNewPlaylistName("");
      setShowPlaylists(false);
    } catch (error) {
      console.log("Create playlist client error", error);
    }
  };

  const addSongToPlaylist = async (playlistId: string) => {
    const songToAdd = song.track || song;

    const playlistIndex = playlists.findIndex(
      (p: any) => p.playlistId === playlistId
    );
    if (playlistIndex === -1) return;

    const existingPlaylist: any = playlists[playlistIndex];
    if (existingPlaylist.songs.some((s: any) => s.key === songToAdd.key)) {
      showMessage("X Song Was Already Added X");
      setShowPlaylists(false);
      return;
    }

    try {
      await axiosClient.post("/addSongToPlaylist", {
        playlistId,
        song: songToAdd,
      });

      const updatedPlaylist = {
        ...existingPlaylist,
        songs: [...existingPlaylist.songs, songToAdd],
      };

      const newPlaylists: any = [...playlists];
      newPlaylists[playlistIndex] = updatedPlaylist;
      setPlaylists(newPlaylists);
      showMessage("Song Added to Playlist");
      setShowPlaylists(false);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const showMessage = (text: any) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 1000);
  };

  return (
    <div className="relative animate-slideup">
      <button
        onClick={() => setShowPlaylists(!showPlaylists)}
        className="absolute z-10 right-2"
      >
        <HiDotsHorizontal size={23} />
      </button>

      {showPlaylists && (
        <div className="absolute top-5 right-3 bg-background rounded-lg shadow-lg z-20 p-4">
          {playlists.length > 0 &&
            playlists.map(
              (playlist: {
                playlistId: string;
                playlistName: string;
                songs: Song[];
              }) => (
                <div
                  key={playlist.playlistId}
                  className="dropdown-playlists rounded-lg mb-2"
                  onClick={() => addSongToPlaylist(playlist.playlistId)}
                >
                  <button>{playlist.playlistName}</button>
                </div>
              )
            )}

          <div>
            <input
              type="text"
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="dropdown-input rounded-lg"
            />
            <button
              onClick={handleCreatePlaylist}
              className="dropdown-playlists rounded-lg"
            >
              Create a playlist
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-lowOpacity">
          <div className="bg-black text-white p-4 rounded-lg">{message}</div>
        </div>
      )}
    </div>
  );
};
export default PlaylistDropdown;
