import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { axiosClient } from "../utils/apiClient";
import { AuthContext } from "../context/AuthProvider";
import usePlaylists from "../components/UsePlaylists";
import PageWrapper from "../context/PageWrapper";
import SongCard from "../components/SongCard";
import PlaylistDropdown from "../components/PlaylistDropdown";
import Loader from "../utils/Loader";
import Error from "../utils/Error";
import { useNavigate } from "react-router-dom";

const AroundYou = () => {
  const navigate = useNavigate();
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const { state: authState } = useContext(AuthContext);
  const { playlists, setPlaylists } = usePlaylists(authState.userId!);
  const [country, setCountry] = useState("");
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://geo.ipify.org/api/v2/country?apiKey=at_7jCgTXmDUka7oSV2stXnDEyxHoPoO"
      )
      .then((res) => setCountry(res?.data?.location.country))
      .catch((err) => console.log(err))
      .finally(() => setIsFetching(false));

    setIsFetching(true);
  }, []);

  useEffect(() => {
    if (country) {
      const fetchSongsByCountry = async () => {
        setIsFetching(true);

        try {
          const response = await axiosClient.get(
            `/around-you?country_code=${country}`
          );
          setData(response.data);
        } catch (error) {
          setError("Error fetching songs around you");
        } finally {
          setIsFetching(false);
        }
      };

      fetchSongsByCountry();
    }
  }, [country]);

  const handleReturn = () => {
    navigate("/discover");
  };

  if (isFetching) return <Loader title="Loading Songs Around You..." />;
  if (error) return <Error />;

  return (
    <PageWrapper>
      <div className="w-full">
        <h2 className="text-4xl text-left font-thin ml-10 mt-10 mb-10">
          <button onClick={handleReturn}>
            <span className="material-symbols-outlined hover:text-[--mainBlue] transform hover:scale-110">
              arrow_back_ios
            </span>
          </button>
          Around You - <span className="text-3xl">{country}</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-8 pb-28 animate-slideup">
          {data?.map((song: any, i: any) => {
            const keyPrefix = `song_${song.key}_${i}`;
            return (
              <div key={keyPrefix}>
                <PlaylistDropdown
                  key={`${keyPrefix}_playlist`}
                  song={song}
                  playlists={playlists}
                  setPlaylists={setPlaylists}
                />
                <SongCard
                  key={`${keyPrefix}_card`}
                  song={song}
                  i={i}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  data={data}
                />
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AroundYou;
