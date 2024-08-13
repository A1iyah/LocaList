import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosClient } from "../utils/apiClient";
import PageWrapper from "../context/PageWrapper";
import DetailsHeader from "../components/DetailsHeader";
import RelatedSongs from "../components/RelatedSongs";

import Loader from "../utils/Loader";
import Error from "../utils/Error";

const ArtistDetails = () => {
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state: any) => state.player);
  const [artistData, setArtistData] = useState<any>({});
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setIsFetching(true);

      try {
        const response = await axiosClient.get(
          `/artist-details?artist_id=${artistId}`,
          {
            params: {
              artistId,
            },
          }
        );

        setArtistData(response.data);
        setIsFetching(false);
      } catch (error) {
        setError("Error fetching artist details");
        setIsFetching(false);
      }
    };

    if (artistId) {
      fetchArtistDetails();
    }
  }, [artistId]);

  if (isFetching) return <Loader title="Loading Artist Details..." />;
  if (error) return <Error />;

  return (
    <PageWrapper>
      <div
        className="relative flex flex-col w-[75%] pb-40 px-10"
        id="artist-detail"
      >
        {artistData?.data && artistData?.data.length > 0 && (
          <>
            <DetailsHeader
              artistId={artistId}
              artistData={artistData.data[0]}
            />

            <RelatedSongs
              data={artistData.data[0].views["top-songs"]?.data}
              artistId={artistId}
              isPlaying={isPlaying}
              activeSong={activeSong}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default ArtistDetails;
