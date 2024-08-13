import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
// import TopPlay from "../components/TopPlay";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";

const PageWrapper = ({ children }: any) => {
  const { activeSong } = useSelector((state: any) => state.player);

  return (
    <div className="relative flex text-white " id="page-wrapper">
      <div className="flex-1 flex flex-col bg-gradient-to-r from-black via-[#00334f] to-background ">
        <Navbar />

        <div
          className="px-6 h-[calc(100vh)] overflow-y-scroll flex xl:flex-row flex-col-reverse"
          id="children"
        >
          {children}

          {/* <div className="xl:sticky relative top-0 h-fit" id="top-play">
            <TopPlay />
          </div> */}
        </div>
      </div>

      {activeSong?.id && (
        <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/20 to-sky-700 backdrop-blur-lg rounded-t-3xl z-50">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default PageWrapper;
