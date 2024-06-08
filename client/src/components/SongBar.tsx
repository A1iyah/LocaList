import { useDispatch } from "react-redux";
import { playPause, setActiveSong } from "../utils/playerSlice";
import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";
import "../index.css";

const SongBar = ({ song, i, artistId, isPlaying, activeSong, data }: any) => {
  const dispatch = useDispatch();

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  return (
    <div
      id="song-bar"
      className={`relative w-full flex flex-row items-center hover:bg-darkerBlue ${
        activeSong?.title === song?.title ? "bg-darker" : "bg-transparent"
      } py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>

      <div className="flex-1 flex flex-row justify-between items-center">
        <img
          className="w-20 h-20 rounded-lg"
          src={
            artistId
              ? song?.attributes?.artwork?.url
                  .replace("{w}", "125")
                  .replace("{h}", "125")
              : song?.images?.coverart
          }
          alt={song?.title}
        />

        <div className="flex-1 flex flex-col justify-center mx-3">
          {!artistId ? (
            <Link to={`/songs/${song.key}`}>
              <p className="text-xl font-bold text-white">{song?.title}</p>
            </Link>
          ) : (
            <p className="text-xl font-bold text-white">
              {song?.attributes?.name}
            </p>
          )}

          <p className="text-base text-gray-300 mt-1">
            {artistId ? song?.attributes?.albumName : song?.subtitle}
          </p>

          <div className="absolute right-6">
            <PlayPause
              isPlaying={isPlaying}
              activeSong={activeSong}
              song={song}
              handlePause={handlePauseClick}
              handlePlay={handlePlayClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongBar;
