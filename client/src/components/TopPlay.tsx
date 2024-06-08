import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../utils/apiClient";
import { playPause, setActiveSong } from "../utils/playerSlice";
import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "../index.css";

const TopChartCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}: any) => (
  <div
    className="relative w-full flex flex-row items-center hover:bg-background p-3 rounded-lg cursor-pointer"
    id="top-charts"
  >
    <h3 className="font0bold text-base text-white mr-3">{i + 1}.</h3>

    <div className="flex-1 flex flex-row justify-between items-center">
      <img
        src={song.images.coverart}
        alt={song.title}
        className="w-20 h-20 rounded-lg"
      />

      <div className="flex-1 flex flex-col justify-center mx-3 truncate">
        <Link to={`/artists/${song.artists[0].adamid}`}>
          <p
            className="text-l font-bold text-white truncate"
            id="top-charts-text"
          >
            {song.title}
          </p>

          <p className="text-sm text-gray-300 mt-1" id="top-charts-text">
            {song.subtitle}
          </p>
        </Link>
      </div>
    </div>

    <div className="play-pause text-sm">
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={handlePlayClick}
      />
    </div>
  </div>
);

const TopPlay = () => {
  const dispatch = useDispatch();
  const divRef: any = useRef(null);
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const topPlays = data?.slice(0, 6) || [];

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem("topPlayData");

      if (cachedData) {
        setData(JSON.parse(cachedData));
      } else {
        setIsFetching(true);
        try {
          const response = await axiosClient.get("/discover");

          localStorage.setItem("topPlayData", JSON.stringify(response.data));
          setData(response.data);
          setIsFetching(false);
        } catch (error) {
          setError("discover client error");
          setIsFetching(false);
        }
      }
    };

    fetchData();
  }, []);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song: any, i: any) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div
      ref={divRef}
      className="md:w-[400px] flex flex-col md:ml-10 md:mr-[-20px]"
      id="top-play"
    >
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center mt-5">
          <h2 className="text-white font-bold text-2xl pl-4">Top Charts</h2>

          <Link to="/top-artists">
            <p className="text-gray-300 cursor-pointer pr-4">See More</p>
          </Link>
        </div>

        <div className="mt-1 flex flex-col gap-1 mr-5">
          {topPlays.map((song: any, i: any) => (
            <TopChartCard
              key={song.key}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick(song, i)}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col mt-2" id="topArtists">
        <div className="flex flex-row justify-between items-center mb-2">
          <Link to="/top-artists">
            <h2 className="text-white font-bold text-2xl pl-4">Top Artists</h2>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode={true}
          centeredSlides={true}
          centeredSlidesBounds={true}
          className="h-full"
        >
          {topPlays.map((song: any) => (
            <SwiperSlide
              key={song.key}
              style={{ width: "25%", height: "auto" }}
              className="shadow-lg rounded-full animate-slideright"
            >
              <Link to={`/artists/${song.artists[0].adamid}`}>
                <img
                  src={song.images.background}
                  alt="name"
                  className="rounded-full w-full object-cover"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopPlay;
