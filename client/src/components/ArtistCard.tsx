import { useNavigate } from "react-router-dom";

const ArtistCard = ({ track }: any) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      id="artist-card"
      onClick={() => navigate(`/artists/${track?.artists[0].adamid}`)}
    >
      <img
        alt="song_img"
        src={track?.images?.coverart}
        className="w-full h-56 rounded-lg"
        id="artist-card-img"
      />

      <p
        className="mt-4 font-semibold text-lg text-white truncate"
        id="artist-card-text"
      >
        {track?.subtitle}
      </p>
    </div>
  );
};

export default ArtistCard;
