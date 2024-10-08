import { useSelector } from "react-redux";
import SongBar from "./SongBar";
import "../index.css";

const RelatedSongs = ({ data, artistId }: any) => {
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);

  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-semibold text-white">Related Songs:</h3>

      <div className="mt-6 w-full flex flex-col mb-[100px] animate-slideup">
        {data?.map((song: any, i: any) => (
          <SongBar
            key={`song_${song.key}_${i}`}
            song={song}
            i={i}
            artistId={artistId}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedSongs;
