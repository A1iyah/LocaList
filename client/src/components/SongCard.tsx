import { useDispatch } from "react-redux";
import {
  setPlaylistContext,
  playPause,
  setActiveSong,
} from "../utils/playerSlice";
import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";
import { getDifferentSongDetails, getSongDetails } from "../utils/songDetails";

const SongCard = ({ song, isPlaying, activeSong, data, i }: any) => {
  const dispatch = useDispatch();

  const { coverArtUrl, songTitle, artistName, songKey } = song.track
    ? getDifferentSongDetails(song)
    : getSongDetails(song);

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
            activeSong?.attributes?.name === songTitle
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

        {coverArtUrl ? (
          <img alt="song_img" src={coverArtUrl} />
        ) : (
          <img alt="song_img" src="/vinyl.png" />
        )}
      </div>

      <div className="mt-4 flex flex-col cursor-pointer">
        <Link to={`/songs/${songKey}`}>
          {" "}
          <p className="font-semibold text-lg text-white truncate">
            {songTitle}
          </p>
          <p className="text-sm truncate text-gray-300 mt-1">{artistName}</p>
        </Link>
      </div>
    </div>
  );
};

export default SongCard;
