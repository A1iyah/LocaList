import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countries } from "../utils/constants";

const CountrySearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (evt: any) => {
    evt.preventDefault();

    const country = countries.find(
      (c) => c.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (!country) {
      alert("Country not found");
      return;
    } else {
      console.log("search bar", country);

      navigate(`/country/${country.code}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3" id="search-form">
      <div className="flex flex-row justify-start items-center">
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
          className="ml-2 hover:text-mainBlue text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default CountrySearchBar;
