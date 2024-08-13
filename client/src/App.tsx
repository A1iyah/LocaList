import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useEffect, useRef } from "react";
import LoginForm from "./components/forms/LoginForm";
import SignupForm from "./components/forms/SignupForm";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import AroundYou from "./pages/AroundYou";
// import TopArtists from "./pages/TopArtists";
import Search from "./pages/Search";
import CountrySearch from "./pages/CountrySearch";
import PlaylistPage from "./pages/PlaylistsPage";
import ArtistDetails from "./pages/ArtistDetails";
import PlaylistDetails from "./pages/PlaylistDetails";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentFormRef = useRef<"login" | "signup">("login");

  const toggleForm = (formName: "login" | "signup") => {
    currentFormRef.current = formName;
  };

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<LoginForm switchForm={() => toggleForm("signup")} />}
            />
            <Route
              path="/signup"
              element={<SignupForm switchForm={() => toggleForm("login")} />}
            />
            <Route path="/discover" element={<Discover />} />
            <Route path="/around-you" element={<AroundYou />} />
            {/* <Route path="/top-artists" element={<TopArtists />} /> */}
            <Route path="/artists/:id" element={<ArtistDetails />} />

            <Route path="/playlists" element={<PlaylistPage />} />
            <Route
              path="/playlistsDetails/:playlistId"
              element={<PlaylistDetails />}
            />

            <Route path="/search/:searchTerm" element={<Search />} />
            <Route path="/country/:countryCode" element={<CountrySearch />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
