import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../utils/apiClient";
import { AuthContext } from "../context/AuthProvider";
import { MdOutlineDeleteForever } from "react-icons/md";
import PageWrapper from "../context/PageWrapper";
import Loader from "../utils/Loader";
import Error from "../utils/Error";
import "../index.css";

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

const PlaylistsPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (showCreateForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCreateForm]);

  const showMessage = (text: any) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  const fetchPlaylists = async () => {
    try {
      const { data } = await axiosClient.get("/getPlaylists", {
        params: { userId: authState.userId },
      });
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setError("Error fetching playlists: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (isCreating || !newPlaylistName.trim()) return;
    setIsCreating(true);

    try {
      await axiosClient.post("/newPlaylist", {
        playlistName: newPlaylistName,
        songs: [],
        userId: authState.userId,
      });
      showMessage("Playlist Created.");
      fetchPlaylists();
      setNewPlaylistName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Create playlist client error", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreatePlaylistOnEnter = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleCreatePlaylist();
    }
  };

  const handleDeletePlaylist = async (
    playlistId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    try {
      await axiosClient.delete(`/deletePlaylist/${playlistId}`, {
        params: { userId: authState.userId },
      });
      showMessage("Playlist Deleted.");
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.playlistId !== playlistId)
      );
    } catch (error) {
      console.error("Delete playlist error", error);
      setError("Error deleting playlist");
    }
  };

  const moveToPlaylistDetails = (playlistId: string) => {
    console.log("moved to playlist details", playlistId);
    navigate(`/playlistsDetails/${playlistId}`);
  };

  const handleReturn = () => {
    navigate("/discover");
  };

  const closeWindow = () => {
    setShowCreateForm(false);
  };

  if (loading) return <Loader title="Loading Playlists..." />;
  if (error) return <Error />;

  return (
    <>
      <PageWrapper>
        <div className="relative w-full text-white">
          <div className="justify-between items-center  flex-row mt-10 mb-10">
            <h2 className="text-4xl text-left font-thin md:ml-10">
              <button onClick={handleReturn}>
                <span className="material-symbols-outlined hover:text-[--mainBlue] transform hover:scale-110">
                  arrow_back_ios
                </span>
              </button>
              Playlists
            </h2>

            <button
              onClick={() => setShowCreateForm(true)}
              className="absolute right-10 top-10 p-2 bg-lowOpacity rounded-lg hover:bg-background"
            >
              Create a Playlist
            </button>

            <div className="playlists-container">
              {playlists.length > 0 ? (
                playlists.map((playlist: PlaylistData) => (
                  <div
                    key={playlist.playlistId}
                    className="mt-6 w-[90%] animate-slideup"
                  >
                    <div
                      onClick={() => moveToPlaylistDetails(playlist.playlistId)}
                      className="playlist-item relative w-full flex flex-row hover:bg-darkerBlue bg-darker py-2 p-4 rounded-lg cursor-pointer mb-2"
                    >
                      <button
                        className="hover:text-red pr-10 z-50"
                        onClick={(e) =>
                          handleDeletePlaylist(playlist.playlistId, e)
                        }
                      >
                        <MdOutlineDeleteForever size={24} />
                      </button>

                      <h3 className="playlistName">{playlist.playlistName}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Playlists Yet.</p>
              )}
            </div>
          </div>

          {/* {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="relative bg-darker p-5 rounded-lg">
                <button
                  onClick={closeWindow}
                  className="absolute right-5 hover:text-red"
                >
                  X
                </button>

                <h2 className="text-xl mb-4">Create New Playlist</h2>

                <div className="mt-2 mb-10 mx-4">
                  <input
                    type="text"
                    placeholder="Playlist name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    onKeyDown={handleCreatePlaylistOnEnter}
                    ref={inputRef}
                    className="border p-2 w-full text-black rounded-lg text-center"
                  />
                </div>

                <button
                  className="bg-transparent hover:text-mainBlue text-white font-bold py-2 px-4 rounded absolute right-5 bottom-2"
                  onClick={handleCreatePlaylist}
                >
                  Create
                </button>
              </div>
            </div>
          )} */}

          {message && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-lowOpacity">
              <div className="bg-black text-white p-4 rounded-lg">
                {message}
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
};

export default PlaylistsPage;
