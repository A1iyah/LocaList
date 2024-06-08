import { FaCirclePause } from "react-icons/fa6";
import { FaRegPlayCircle } from "react-icons/fa";

const PlayPause = ({
  isPlaying,
  activeSong,
  song,
  handlePause,
  handlePlay,
}: any) =>
  isPlaying && activeSong.title === song.title ? (
    <FaCirclePause size={30} onClick={handlePause} />
  ) : (
    <FaRegPlayCircle size={30} onClick={handlePlay} />
  );

export default PlayPause;
