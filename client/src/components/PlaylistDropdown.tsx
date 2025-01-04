import { useState, useEffect, useContext, useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { AuthContext } from "../context/AuthProvider";
import { axiosClient } from "../utils/apiClient";
import { PlaylistData } from "../pages/Discover";
import usePlaylists from "./UsePlaylists";
import "../index.css";

interface Song {
  key: string;
  id: string;
  title: string;
  subtitle: string;
  track?: Song;
}

interface PlaylistDropdownProps {
  song: Song;
  playlists: PlaylistData[];
  setPlaylists: React.Dispatch<React.SetStateAction<PlaylistData[]>>;
}

const PlaylistDropdown = ({ song }: PlaylistDropdownProps) => {
  const { state: authState } = useContext(AuthContext);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");

  // Use the usePlaylists hook
  const { playlists, setPlaylists } = usePlaylists(authState.userId!);

  const handleDropdownToggle = () => {
    setCurrentOpenDropdown((prev) => (prev === song.key ? null : song.key));
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setCurrentOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const addSongToPlaylist = async (playlistId: string) => {
    const generateUniqueKey = (song: Song) => `${song.id}-${song.title}`;

    const songToAdd = {
      ...(song.track || song),
      key: song.key || generateUniqueKey(song.track || song),
    };

    const playlistIndex = playlists.findIndex(
      (p) => p.playlistId === playlistId
    );
    if (playlistIndex === -1) return;

    const existingPlaylist = playlists[playlistIndex];

    if (existingPlaylist.songs.some((s: any) => s.key === songToAdd.key)) {
      showMessage("X Song Was Already Added X");
      setCurrentOpenDropdown(null);
      return;
    }

    try {
      const response = await axiosClient.post("/addSongToPlaylist", {
        playlistId,
        song: songToAdd,
      });

      const updatedPlaylist = {
        ...existingPlaylist,
        songs: [...existingPlaylist.songs, songToAdd],
      };

      setPlaylists((prev) =>
        prev.map((p: any) =>
          p.playlistId === playlistId ? updatedPlaylist : p
        )
      );

      showMessage("Song Added to Playlist");
      setCurrentOpenDropdown(null);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const showMessage = (text: any) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 1000);
  };

  return (
    <div className="relative animate-slideup" ref={dropdownRef}>
      <button onClick={handleDropdownToggle} className="absolute z-10 right-2">
        <HiDotsHorizontal size={23} />
      </button>

      {currentOpenDropdown === song.key && (
        <div className="absolute top-5 right-3 bg-background rounded-lg shadow-lg z-20 p-4 w-40 h-40 overflow-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-babyblue [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent ">
          <p className="font-bold underline sticky text-slate-700">
            Add to Playlist
          </p>

          {playlists.length > 0 &&
            playlists.map((playlist: any) => (
              <div
                key={playlist.playlistId}
                className="dropdown-playlists rounded-lg mb-2"
                onClick={() => addSongToPlaylist(playlist.playlistId)}
              >
                <button>{playlist.playlistName}</button>
              </div>
            ))}
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
