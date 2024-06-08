import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosClient } from "../utils/apiClient";
import { MdOutlineDeleteForever } from "react-icons/md";
import PageWrapper from "../context/PageWrapper";
import SongCard from "../components/SongCard";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
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
    try {
      await axiosClient.delete(`/playlist/${playlistId}/song/${songId}`);

      const updatedSongs = playlist.songs.filter(
        (song: any) => song.key !== songId
      );

      showMessage("Song Was Deleted.");
      setPlaylist({ ...playlist, songs: updatedSongs });
    } catch (error) {
      console.log("Error deleting a song from playlist: ", error);
    }
  };

  if (loading) return <Loader title="Loading songs..." />;
  if (error) return <Error />;

  return (
    <PageWrapper>
      <div className="w-full">
        <h2 className="text-4xl text-left font-thin md:ml-10 my-10">
          {playlist.playlistName}
        </h2>

        <div className="flex flex-wrap justify-center gap-8 pb-28">
          {playlist &&
            playlist.songs.map((song: any, index: any) => (
              <div
                key={`searchResult_${song.key}_${index}`}
                className="relative animate-slideup"
              >
                <button
                  key={`delete_${song.key}_${index}`}
                  onClick={() => handleDeleteSong(song.key)}
                  className="delete-song-playlist"
                >
                  <MdOutlineDeleteForever size={24} />
                </button>

                <SongCard
                  key={`song_${song.key}_${index}`}
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
