import loader from "/load.svg";

const Loader = ({ title }: any) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col  bg-gradient-to-r  from-black via-[#00334f] to-background ">
      <img src={loader} alt="loader" className="w-42 h-42 object-contain" />

      <h1 className="font-bold text-xl text-white mt-2">
        {title || "Loading..."}
      </h1>
    </div>
  );
};

export default Loader;
