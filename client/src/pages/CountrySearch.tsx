import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosClient } from "../utils/apiClient";
import PageWrapper from "../context/PageWrapper";
import SongCard from "../components/SongCard";
import PlaylistDropdown from "../components/PlaylistDropdown";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

const CountrySearch = () => {
  const { countryCode } = useParams();
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const [searchData, setSearchData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      setIsFetching(true);

      try {
        const response = await axiosClient.get(`/country`, {
          params: { country_code: countryCode },
        });

        const responseData = response.data ? response.data : response;
        setSearchData(responseData);

        setIsFetching(false);
      } catch (error) {
        setError("Error fetching songs from the country");
        setIsFetching(false);
      }
    };

    if (countryCode) {
      fetchSongs();
    }
  }, [countryCode]);

  if (isFetching) return <Loader title={`Searching for - ${countryCode}`} />;
  if (error) return <Error />;

  return (
    <PageWrapper>
      <div className="w-full" id="search-page">
        <h2 className="text-4xl text-left font-thin ml-10 mb-10 mt-10">
          Popular
          <span className="text-3xl pl-2"> {countryCode} </span>
          Songs
        </h2>

        <div className="flex flex-wrap justify-center gap-8 pb-28 animate-slideup">
          {searchData.map((song: any, i) => (
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

export default CountrySearch;
