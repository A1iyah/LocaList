import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosClient } from "../utils/apiClient";
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

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setIsFetching(true);

      try {
        const response = await axiosClient.get(`/search`, {
          params: {
            searchTerm,
          },
        });

        setSearchData(response.data.tracks.hits);

        setIsFetching(false);
      } catch (error) {
        setError("Error fetching artist details");
        setIsFetching(false);
      }
    };

    if (searchTerm) {
      fetchArtistDetails();
    }
  }, [searchTerm]);

  if (isFetching) return <Loader title={`Searching for - ${searchTerm}`} />;
  if (error) return <Error />;

  return (
    <PageWrapper>
      <div className="w-full" id="search-page">
        <h2 className="text-4xl text-left font-thin ml-10 mb-10 mt-10">
          Showing results for -
          <span className="text-3xl pl-2">" {searchTerm} "</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-8 pb-28 animate-slideup">
          {searchData.map((song: any, i: any) => (
            <div key={`searchResult_${song.key}_${i}`}>
              <PlaylistDropdown key={`playlist_${song.key}_${i}`} song={song} />

              <SongCard
                key={`song_${song.key}_${i}`}
                song={song.track || song}
                i={i}
                isPlaying={isPlaying}
                activeSong={activeSong}
                data={searchData}
              />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Search;
