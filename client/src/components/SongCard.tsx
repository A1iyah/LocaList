import { useDispatch } from "react-redux";
import {
  setPlaylistContext,
  playPause,
  setActiveSong,
} from "../utils/playerSlice";
import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";

const SongCard = ({ song, isPlaying, activeSong, data, i }: any) => {
  const dispatch = useDispatch();

  const handlePlayClick = () => {
    if (data.songs) {
      dispatch(setPlaylistContext({ song, playlist: data.songs, index: i }));
    } else {
      dispatch(setActiveSong({ song, data, i }));
    }
    dispatch(playPause(true));
  };

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  return (
    <div className="relative flex flex-col md:w-[250px] p-5 bg-white/15 backdrop-blur-sm rounded-lg cursor-pointer">
      <div className="relative w-full h-66 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-60 group-hover:flex ${
            activeSong?.title === song.title
              ? "flex bg-black bg-opacity-70"
              : "hidden"
          }`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>

        {song.images?.coverart ? (
          <img alt="song_img" src={song.images.coverart} />
        ) : (
          <img alt="song_img" src="/vinyl.png" />
        )}
      </div>

      <div className="mt-4 flex flex-col cursor-pointer">
        <Link
          to={
            song.artists && song.artists.length > 0
              ? `/artists/${song.artists[0].adamid}`
              : "/top-artists"
          }
        >
          <p className="font-semibold text-lg text-white truncate">
            {song.title}
          </p>

          <p className="text-sm truncate text-gray-300 mt-1">{song.subtitle}</p>
        </Link>
      </div>
    </div>
  );
};

export default SongCard;
