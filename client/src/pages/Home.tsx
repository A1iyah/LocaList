import { useState } from "react";
import LoginForm from "../components/forms/LoginForm";
import SignupForm from "../components/forms/SignupForm";
import "../index.css";

const Home = () => {
  const [isFormShown, setIsFormShown] = useState(false);
  const [currentForm, setCurrentForm] = useState<"login" | "signup">("login");

  const toggleForm = (formName: "login" | "signup") => {
    setCurrentForm(formName);
    setIsFormShown(true);
  };

  const toggleVisibility = () => {
    setIsFormShown(!isFormShown);
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen">
      <video
        className="home-page__bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/globe.mp4" type="video/mp4" />
      </video>

      <div className="home-page__content">
        <h1>LocaList</h1>

        <button
          className="home-page__initialLoginBtn"
          onClick={toggleVisibility}
        >
          <p> Login </p>
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>

      {isFormShown && (
        <div className="formsVisibility">
          {currentForm === "login" ? (
            <LoginForm switchForm={() => toggleForm("signup")} />
          ) : (
            <SignupForm switchForm={() => toggleForm("login")} />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
