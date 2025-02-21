import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SongSearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (searchTerm) {
      navigate(`/song/${searchTerm}`);
    } else {
      alert("Please enter a search term");
    }

    console.log("search bar", searchTerm);
  };

  console.log("Search term before navigating:", searchTerm);

  return (
    <form onSubmit={handleSubmit} className="mt-3" id="search-form">
      <div className="flex flex-row justify-start">
        <input
          name="search-field"
          id="search-field"
          className="flex rounded-md"
          placeholder="Search"
          type="search"
          value={searchTerm}
          onChange={(evt) => setSearchTerm(evt.target.value)}
        />
        <button
          type="submit"
          className="ml-2 hover:text-mainBlue text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SongSearchBar;
