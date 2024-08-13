// import { useEffect, useState } from "react";
// import { axiosClient } from "../utils/apiClient";
// import PageWrapper from "../context/PageWrapper";
// import ArtistCard from "../components/ArtistCard";
// import Loader from "../utils/Loader";
// import Error from "../utils/Error";

// const TopArtists = () => {
//   const [data, setData] = useState([]);
//   const [isFetching, setIsFetching] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchSongs = async () => {
//       setIsFetching(true);

//       try {
//         const response = await axiosClient.get(`/get-songs`);

//         setData(response.data);
//         setIsFetching(false);
//       } catch (error) {
//         setError("Error fetching songs");
//         setIsFetching(false);
//       }
//     };

//     fetchSongs();
//   }, []);

//   if (isFetching) return <Loader title="Loading Top Artists..." />;
//   if (error) return <Error />;

//   return (
//     <PageWrapper>
//       <div className="w-full">
//         <h2 className="text-4xl text-left font-thin ml-10 mb-10 mt-10">
//           Top Artists
//         </h2>

//         <div className="flex flex-wrap justify-center gap-8 pb-28 animate-slideup">
//           {data?.map((track: any) => (
//             <ArtistCard key={`${track.key}-${track.id}`} track={track} />
//           ))}
//         </div>
//       </div>
//     </PageWrapper>
//   );
// };

// export default TopArtists;
