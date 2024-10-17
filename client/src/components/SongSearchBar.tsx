import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SongSearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    if (searchTerm) {
      navigate(`/song/${searchTerm}`);
    } else {
      alert("Please enter a search term");
    }
  };

  console.log("Search term before navigating:", searchTerm);

  return (
    <form onSubmit={handleSubmit} className="mt-3" id="search-form">
      <div className="flex flex-row justify-start items-center">
        <input
          name="search-field"
          id="search-field"
          className="flex rounded-md"
          placeholder="Search"
          type="search"
          value={searchTerm}
          onChange={(evt) => setSearchTerm(evt.target.value)}
        />
      </div>

      <button
        type="submit"
        className="ml-2 hover:text-mainBlue text-white font-bold py-2 px-4 rounded"
      >
        Search
      </button>
    </form>
  );
};

export default SongSearchBar;
