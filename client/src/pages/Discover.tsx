import { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../utils/apiClient";
import { AuthContext } from "../context/AuthProvider";
import { genres } from "../utils/constants";
import { selectGenreListId } from "../utils/playerSlice";
import usePlaylists from "../components/UsePlaylists";
import PageWrapper from "../context/PageWrapper";
import SongCard from "../components/SongCard";
import PlaylistDropdown from "../components/PlaylistDropdown";
import Loader from "../utils/Loader";
import Error from "../utils/Error";
import "../index.css";

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

const Discover = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const { state: authState } = useContext(AuthContext);
  const { playlists, setPlaylists, fetchPlaylists } = usePlaylists(
    authState.userId!
  );
  const [genreCode, setGenreCode] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const genreTitle =
    genres.find(({ value }) => value === genreCode)?.title || "Pop";

  useEffect(() => {
    const fetchSongs = async () => {
      setIsFetching(true);
      setError("");

      try {
        const endpoint = genreCode ? `/genre-code` : `/get-songs`;
        const params = genreCode
          ? { genreCode, countryCode: "US" }
          : { country_code: "US" };

        const response = await axiosClient.get(endpoint, { params });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError("Error fetching songs.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchSongs();
  }, [genreCode]);

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

  const closeWindow = () => {
    setShowCreateForm(false);
  };

  const showMessage = (text: any) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  if (isFetching) return <Loader title={"Loading Songs..."} />;
  if (error) return <Error />;

  return (
    <>
      <PageWrapper>
        <div className="w-full">
          <div
            className="w-full flex justify-between items-center flex-row mt-10 mb-10"
            id="discover-header"
          >
            <h2
              className="text-4xl text-left font-thin md:ml-10"
              id="dis-header"
            >
              Discover {genreTitle}
            </h2>

            <button
              onClick={() => setShowCreateForm(true)}
              className="absolute right-44 top-30 p-2 bg-lowOpacity rounded-lg hover:bg-background"
            >
              +
            </button>

            {showCreateForm && (
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
            )}

            <select
              onChange={(e) => {
                const selectedGenre = e.target.value;
                setGenreCode(selectedGenre);
                dispatch(selectGenreListId(selectedGenre));
              }}
              value={genreCode || ""}
              className="custom-select"
            >
              <option value="">Select Genre</option>

              {genres.map((genre) => (
                <option key={genre.value} value={genre.value}>
                  {genre.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pb-28 animate-slideup">
            {data?.map((song: any, i: any) => (
              <div key={`searchResult_${song.key}_${i}`}>
                <PlaylistDropdown
                  key={`playlist_${song.key}_${i}`}
                  song={song}
                  playlists={playlists}
                  setPlaylists={setPlaylists}
                />

                <SongCard
                  key={`song_${song.key}_${i}_${song.id}`}
                  song={song}
                  i={i}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  data={data}
                />
              </div>
            ))}
          </div>
        </div>

        {message && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-lowOpacity">
            <div className="bg-black text-white p-4 rounded-lg">{message}</div>
          </div>
        )}
      </PageWrapper>
    </>
  );
};

export default Discover;
