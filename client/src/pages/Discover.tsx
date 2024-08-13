import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../utils/apiClient";
import { genres } from "../utils/constants";
import { selectGenreListId } from "../utils/playerSlice";
import PageWrapper from "../context/PageWrapper";
import SongCard from "../components/SongCard";
import PlaylistDropdown from "../components/PlaylistDropdown";
import Loader from "../utils/Loader";
import Error from "../utils/Error";
import "../index.css";

const Discover = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const [genreCode, setGenreCode] = useState("");
  const genreTitle = genres.find(({ value }) => value === genreCode)?.title;
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      setIsFetching(true);

      try {
        const response = await axiosClient.get(`/get-songs`, {
          params: { country_code: "US" },
        });

        setData(response.data);
        setIsFetching(false);
      } catch (error) {
        setError("Error fetching songs");
        setIsFetching(false);
      }
    };

    const fetchSongsByGenre = async () => {
      setIsFetching(true);

      try {
        if (!genreCode) {
          fetchSongs();
          return;
        }
        const response = await axiosClient.get(
          `/genre-code?genreCode=${genreCode}`
        );

        setData(response.data);
        setIsFetching(false);
      } catch (error) {
        setError("discover client error");
        setIsFetching(false);
      }
    };

    fetchSongsByGenre();
  }, [genreCode]);

  if (isFetching) return <Loader title="Loading Songs..." />;
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
                />

                <SongCard
                  key={`song_${song.key}_${i}`}
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
      </PageWrapper>
    </>
  );
};

export default Discover;
