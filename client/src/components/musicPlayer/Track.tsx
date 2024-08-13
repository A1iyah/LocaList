import { useEffect, useState } from "react";
import Loader from "../../utils/Loader";
import { getSongDetails } from "../../utils/songDetails";

interface TrackProps {
  isPlaying: boolean;
  isActive: boolean;
  activeSong: any;
}

const Track = ({ isPlaying, isActive, activeSong }: TrackProps) => {
  const [loading, setLoading] = useState(true);
  const { coverArtUrl, songTitle, artistName } = getSongDetails(activeSong);

  useEffect(() => {
    if (activeSong) {
      setLoading(false);
    }
  }, [activeSong]);

  if (loading) {
    return <Loader title="Loading Song..." />;
  }

  return (
    <>
      <div className="flex-1 flex items-center justify-start">
        <div
          className={`${
            isPlaying && isActive ? "animate-[spin_3s_linear_infinite]" : ""
          } hidden sm:block h-16 w-16 mr-4`}
        >
          <img src={coverArtUrl} alt="cover art" className="rounded-full" />
        </div>

        <div className="w-[50%]">
          <p className="truncate text-white font-bold text-lg">
            {songTitle ? songTitle : "No active Song"}
          </p>

          <p className="truncate text-gray-300">
            {artistName ? artistName : "No active Song"}
          </p>
        </div>
      </div>
    </>
  );
};

export default Track;
