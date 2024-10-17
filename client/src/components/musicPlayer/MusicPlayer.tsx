import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Controls from "./Controls";
import Player from "./Player";
import SeekBar from "./SeekBar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import {
  playPause,
  nextSong,
  prevSong,
  toggleShuffle,
} from "../../utils/playerSlice";

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const {
    currentSongs,
    currentIndex,
    activeSong,
    isPlaying,
    shuffle,
    isActive,
  } = useSelector((state: any) => state.player);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (currentSongs && currentSongs.length) {
      setAppTime(0);
      dispatch(playPause(true));
    }
  }, [currentIndex, currentSongs, dispatch]);

  const handlePlayPause = () => {
    if (!isActive) return;

    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
  };

  const handleNextSong = () => {
    if (!shuffle) {
      dispatch(nextSong());
    } else {
      let randomIndex = currentIndex;

      do {
        randomIndex = Math.floor(Math.random() * currentSongs.length);
      } while (randomIndex === currentIndex);
      dispatch(nextSong(randomIndex));
    }
  };

  const handlePrevSong = () => {
    if (currentIndex === 0) {
      dispatch(prevSong());
    } else if (shuffle) {
      let randomIndex = currentIndex;

      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * currentSongs.length);
      }

      dispatch(prevSong(randomIndex));
    } else {
      dispatch(prevSong());
    }
  };

  const handleEnded = () => {
    if (!repeat) {
      handleNextSong();
    } else {
      dispatch(playPause(true));
    }
  };

  const handleTimeUpdate = (event: any) => {
    if (isPlaying) {
      setAppTime(event.target.currentTime);
    }
  };

  const handleSeek = (newTime: any) => {
    setSeekTime(newTime);
    setAppTime(newTime);
  };

  return (
    <div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
      <Track
        isPlaying={isPlaying}
        isActive={isActive}
        activeSong={activeSong}
      />

      <div className="flex-1 flex flex-col items-center justify-center">
        <Controls
          isPlaying={isPlaying}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={() => dispatch(toggleShuffle())}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />

        <SeekBar
          value={appTime}
          min={0}
          max={duration}
          onInput={(event) => handleSeek(parseInt(event.target.value, 10))}
          setSeekTime={setSeekTime}
          appTime={appTime}
        />

        <Player
          activeSong={activeSong}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          currentIndex={currentIndex}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={(event: any) => setDuration(event.target.duration)}
        />
      </div>

      <VolumeBar
        value={volume}
        min={0}
        max={1}
        onChange={(event) => setVolume(parseFloat(event.target.value))}
        setVolume={setVolume}
      />
    </div>
  );
};

export default MusicPlayer;
