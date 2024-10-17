import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosClient } from "../utils/apiClient";
import { MdOutlineDeleteForever } from "react-icons/md";
import PageWrapper from "../context/PageWrapper";
import SongCard from "../components/SongCard";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const [playlist, setPlaylist]: any = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const showMessage = (text: any) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const { data } = await axiosClient.get(`/playlist/${playlistId}`);

        setPlaylist(data);
        console.log("Fetched playlist:", data);
      } catch (err) {
        setError("Failed to fetch playlist details");
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistDetails();
    }
  }, [playlistId]);

  const handleDeleteSong = async (songId: any) => {
    console.log("Deleting song:", songId, "from playlist:", playlistId);

    if (!songId) {
      console.error("No song ID provided for deletion.");
      return;
    }

    try {
      const response = await axiosClient.delete(
        `/playlist/${playlistId}/song/${songId}`,
        {
          params: { songId },
        }
      );

      if (response.status === 200) {
        const { data } = await axiosClient.get(`/playlist/${playlistId}`);

        setPlaylist(data);
        showMessage("Song was deleted.");
      } else {
        setError("Failed to delete song. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting a song from playlist: ", error);
      setError("Failed to delete song. Please try again.");
    }
  };

  const handleReturn = () => {
    navigate("/playlists");
  };

  if (loading) return <Loader title="Loading songs..." />;
  if (error) return <Error />;

  return (
    <PageWrapper>
      <div className="w-full">
        <h2 className="text-4xl text-left font-thin md:ml-10 my-10">
          <button onClick={handleReturn}>
            <span className="material-symbols-outlined hover:text-[--mainBlue] transform hover:scale-110">
              arrow_back_ios
            </span>
          </button>
          {playlist.playlistName}
        </h2>

        <div className="flex flex-wrap justify-center gap-8 pb-28">
          {playlist &&
            playlist.songs.map((song: any, index: any) => (
              <div
                key={`searchResult_${song.id}_${index}`}
                className="relative animate-slideup"
              >
                <button
                  key={`delete_${song.id}_${index}`}
                  onClick={() => handleDeleteSong(song.id)}
                  className="delete-song-playlist"
                >
                  <MdOutlineDeleteForever size={24} />
                </button>

                <SongCard
                  key={`song_${song.id}_${index}`}
                  song={song}
                  i={index}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  data={playlist.songs}
                />
              </div>
            ))}
        </div>

        {message && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-lowOpacity">
            <div className="bg-black text-white p-4 rounded-lg">{message}</div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default PlaylistDetails;
