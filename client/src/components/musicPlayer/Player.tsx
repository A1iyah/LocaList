import { useRef, useEffect } from "react";

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
}: any) => {
  const ref = useRef<HTMLAudioElement | null>(null);
  const isRendering = useRef(true);

  useEffect(() => {
    if (isRendering.current) {
      isRendering.current = false;
      return;
    }

    if (ref.current) {
      if (isPlaying) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [activeSong, isPlaying]);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  useEffect(() => {
    const handleLoadedData = () => {
      if (isPlaying) {
        ref.current?.play();
      }
    };

    if (ref.current) {
      ref.current.addEventListener("loadeddata", handleLoadedData);
    }

    // Cleanup on unmount
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("loadeddata", handleLoadedData);
      }
    };
  }, [isPlaying]);

  return (
    <audio
      src={activeSong?.attributes?.previews[0]?.url}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;
