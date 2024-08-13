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
      ref.current.pause();

      if (isPlaying) {
        ref.current.play();
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
    if (ref.current) {
      if (isPlaying && ref.current.readyState >= 2) {
        ref.current.play();
      } else if (!isPlaying) {
        ref.current.pause();
      } else {
        const playAfterLoadedData = () => {
          if (isPlaying) {
            ref.current?.play();
          }
          ref.current?.removeEventListener("loadeddata", playAfterLoadedData);
        };
        ref.current.addEventListener("loadeddata", playAfterLoadedData);
      }
    }
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
