import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { axiosClient } from "../utils/apiClient";
import usePlaylists from "../components/UsePlaylists";
import PageWrapper from "../context/PageWrapper";
import SongCard from "../components/SongCard";
import PlaylistDropdown from "../components/PlaylistDropdown";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const { state: authState } = useContext(AuthContext);

  const { playlists, setPlaylists, fetchPlaylists } = usePlaylists(
    authState.userId!
  );

  console.log("Search data before mapping:", searchData);

  useEffect(() => {
    const fetchSongData = async () => {
      setIsFetching(true);
      try {
        console.log("Fetching songs with searchTerm:", searchTerm);

        const response = await axiosClient.get(`/song`, {
          params: { searchTerm },
        });

        console.log("Raw API Response:", response);

        const responseData = response.data ? response.data : response;
        console.log("Processed API Response:", responseData);

        setSearchData(responseData);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError("Error fetching songs");
        setIsFetching(false);
      }
    };

    if (searchTerm) {
      fetchSongData();
    }
  }, [searchTerm]);

  if (isFetching) return <Loader title={`Searching for - ${searchTerm}`} />;
  if (error) return <Error />;

  return (
    <PageWrapper>
      <div className="w-full" id="search-page">
        <h2 className="text-4xl text-left font-thin ml-10 mb-10 mt-10">
          {searchData.length > 0 ? "Popular" : "No results found for"}
          <span className="text-3xl pl-2"> {searchTerm} </span>
          {searchData.length > 0 ? "Songs" : ""}
        </h2>

        <div className="flex flex-wrap justify-center gap-8 pb-28 animate-slideup">
          {searchData.map((song: any, i: number) => {
            console.log("Current song data:", song);
            const track = song.track || song;
            return (
              <div key={`searchResult_${track?.key || i}`}>
                <PlaylistDropdown
                  key={`playlist_${song.key}_${i}`}
                  song={song}
                  playlists={playlists}
                  setPlaylists={setPlaylists}
                />
                <SongCard
                  key={`song_${track?.key || i}`}
                  song={track}
                  i={i}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  data={searchData}
                />
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Search;
