import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/apiClient";
import { AuthContext, getUserDataFromToken } from "../../context/AuthProvider";
import { Props } from "./SignupForm";
import "./forms.css";
import "../../index.css";

const LoginForm = ({ switchForm }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const { dispatch: dispatchAuthContext } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const closeButton = document.getElementById("closeButton");

    if (closeButton) {
      closeButton.addEventListener("click", handleFormVisibility);
    }

    return () => {
      if (closeButton) {
        closeButton.removeEventListener("click", handleFormVisibility);
      }
    };
  }, []);

  const handleFormVisibility = () => {
    const form = document.getElementById("form");

    if (form) {
      form.classList.add("hidden");
    }
  };

  const submit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      const response = await axiosClient.post("/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        const refreshToken = response.data?.refreshToken;

        window.localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("refreshToken", refreshToken);

        dispatchAuthContext(getUserDataFromToken(accessToken));

        navigate("/discover");
      } else {
        setErrors("Invalid info");
      }
    } catch (error: any) {
      setErrors("Invalid info");
      console.error("Login form error:", error.response.data);
    }
  };

  return (
    <div className="formContainer">
      <form
        className="absolute top-0 left-0 bg-[#5a5a5a7e] h-screen w-[300px]"
        id="form"
        onSubmit={submit}
      >
        <button
          id="closeButton"
          className="absolute top-3 right-5 text-white text-2xl"
        >
          X
        </button>

        <h1 className="flex flex-col items-center mt-20 text-white text-[40px] tracking-wide">
          Login
        </h1>

        <div className="absolute top-[150px] w-[100%] text-center text-red text-3xl tracking-wider">
          <div className="error">{errors}</div>
        </div>

        <div className="flex flex-col pt-[40px] pb-[20px]">
          <div className="flex flex-row justify-center items-center pb-5 bg-transparent mt-[40px]">
            <span className="material-symbols-outlined ml-[-20px] pr-2 text-mainBlue">
              alternate_email
            </span>
            <input
              className="bg-mainBlue bg-opacity-0 p-1 border-b-2 border-mainBlue focus:bg-opacity-10 hover:bg-opacity-10 placeholder:text-white text-center tracking-widest"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
              name="email"
              id="email"
            />
          </div>

          <div className="flex flex-row justify-center items-center pb-5 my-[30px]">
            <span className="material-symbols-outlined ml-[-20px] pr-2 text-mainBlue">
              lock
            </span>
            <input
              className="bg-mainBlue bg-opacity-0 p-1 border-b-2 border-mainBlue focus:bg-opacity-10 hover:bg-opacity-10 placeholder:text-white text-center tracking-widest"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              name="password"
              id="password"
            />
          </div>

          <div className="buttonSection mt-5">
            <button className="submitBtn" type="submit">
              Login
            </button>

            <button
              type="button"
              className="linkBtn mt-14"
              onClick={switchForm}
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
