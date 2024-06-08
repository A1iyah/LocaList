import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { links } from "../utils/constants";
import CountrySearchBar from "./CountrySearchBar";
import SearchBar from "./SearchBar";

import { RiCloseLine } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import { FaSignOutAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const NavLinks = ({ handleClick }: any) => (
  <div className="flex items-center mr-[50px]" id="nav-links">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        className="flex items-center ml-5 text-l font-medium text-white hover:text-mainBlue"
        onClick={() => handleClick && handleClick()}
      >
        <div className="flex flex-row mt-8 w-[110px] justify-center">
          {item.icon && <item.icon className="w-6 h-6 mr-1 mb-4" />}
          {item.name}
        </div>
      </NavLink>
    ))}
  </div>
);

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState("country");
  const { state: authState, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="w-full flex justify-between items-center px-6 text-white"
      id="navbar"
    >
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="logo"
          className="block h-[50px] object-contain mt-3"
          id="navbar-img"
        />

        <div className="flex" id="navbar-links">
          <NavLinks />
        </div>

        <FiSearch aria-hidden="true" className="w-5 h-5 mr-2 mt-4" />

        <div id="search-form">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-btn"
          >
            <option value="country" className="text-black">
              Country
            </option>
            <option value="song" className="text-black">
              Song / Artist
            </option>
          </select>

          {searchType === "country" ? <CountrySearchBar /> : <SearchBar />}
        </div>

        <div className="absolute right-5 top-3">
          <div className="flex items-center space-x-2">
            <div className="user-info">
              <p>{authState.username}</p>

              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt className="inline w-4 h-4" /> Logout
              </button>
            </div>

            {authState.image && !authState.image.includes("undefined") ? (
              <img
                src={authState.image}
                alt="user"
                className="w-14 h-14 rounded-full object-cover border-2"
              />
            ) : (
              <img
                src="../../public/avatar.png"
                alt="user"
                className="w-14 h-14 rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center w-[60px] mt-3" id="mobile-menu-div">
        <div className="hidden ml-2" id="mobile-menu-buttons">
          {!mobileMenuOpen ? (
            <HiOutlineMenu
              className="w-6 h-6 text-white hover:cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            />
          ) : (
            <RiCloseLine
              className="w-6 h-6 text-white hover:cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Mobile menu for small screens */}
      <div
        className={`fixed top-0 left-0 h-screen w-1/2 bg-gradient-to-tl from-white/10 to-[#48c1c6] backdrop-blur-lg z-50 p-6 flex flex-col items-center md:hidden ${
          mobileMenuOpen ? "flex" : "hidden"
        } `}
      >
        <img
          src="../../public/mobile-logo.png"
          alt="logo"
          className="w-[100px] h-[120px] mb-10 absolute top-10"
        />

        <div className="flex flex-col w-full mb-8 mt-[200px]">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className="text-lg text-white hover:text-mainBlue mb-4"
              onClick={() => {
                navigate(item.to);
                setMobileMenuOpen(false);
              }}
            >
              <div className="flex flex-row justify-left">
                {item.icon && <item.icon className="w-6 h-6 mr-2 mb-4" />}
                {item.name}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
