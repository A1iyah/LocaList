import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countries } from "../utils/constants";

const CountrySearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const country = countries.find(
      (c) => c.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (!country) {
      alert("Country not found");
      return;
    }

    console.log("search bar", country);
    navigate(`/country/${country.code}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3" id="search-form">
      <div className="flex flex-row justify-start">
        <input
          name="country-field"
          id="country-field"
          className="flex rounded-md"
          placeholder="Search Country"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 hover:text-mainBlue text-white font-bold pt-1 px-1 rounded"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default CountrySearchBar;
