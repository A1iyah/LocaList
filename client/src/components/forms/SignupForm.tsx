import axios from "axios";
import { axiosClient } from "../../utils/apiClient";
import { ChangeEvent, useRef, useState } from "react";
import { formRegisterValidation } from "../../utils/validations";
import LoginForm from "./LoginForm";
import "../../index.css";
import "./forms.css";

export type Props = {
  switchForm: () => void;
};

const SignupForm = ({ switchForm }: Props) => {
  const [image, setImage] = useState<File | string>();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formVisibility, setFormVisibility]: any = useState(false);
  const [errors, setErrors] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  function loadImage(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormVisibility = () => {
    setFormVisibility(false);
  };

  const submit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const validationErrors = formRegisterValidation({
      name,
      username,
      email,
      password,
      confirmPassword,
    });
    setErrors("");
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );
    if (hasErrors) return;

    const formData = new FormData();

    if (image) {
      formData.append("image", image as File);
    }
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axiosClient.post("/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Signup successful:", response.data);

      if (response.data) {
        setShowLoginForm(true);
      }

      if (!hasErrors) {
        console.log({
          image,
          name,
          username,
          email,
          password,
        });
      }
    } catch (error) {
      console.log("Signup form error : " + error);

      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        setErrors("Email / Username is already taken.");
      } else {
        setErrors("Error signing up");
      }
    }
  };

  return (
    <div className="formContainer">
      {showLoginForm ? (
        <LoginForm switchForm={() => {}} />
      ) : (
        <form
          className="absolute top-0 left-0 bg-[#5a5a5a7e] h-screen w-[300px]"
          id="form"
          onSubmit={submit}
        >
          <button
            onClick={handleFormVisibility}
            value={formVisibility}
            className="absolute top-3 right-5 text-white text-xl"
          >
            X
          </button>

          <h1 className="flex flex-col items-center mt-5 text-white text-[40px] tracking-wide">
            Signup
          </h1>

          <div className="absolute top-[75px] w-[100%] text-center text-red text-3xl tracking-wider">
            <div className="error">{errors}</div>
          </div>

          <div className="flex flex-col pt-[35px] pb-[20px]" id="all-inputs">
            <div className="relative pb-1">
              {image ? (
                <img
                  className="avatar"
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Upload a photo."
                />
              ) : (
                <img className="avatar" src="/avatar.png" alt="avatar" />
              )}

              <button
                type="button"
                className="flex bg-transparent bg-opacity-0 border-none ml-[57%] mt-[-10px] text-mainBlue cursor-pointer hover:text-white"
                onClick={selectImg}
              >
                <span
                  id="add-photo"
                  className="material-symbols-outlined text-[27px]"
                >
                  add_a_photo
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                name="image"
                className="form__file"
                style={{ display: "none" }}
                onChange={loadImage}
              />
            </div>

            <div
              className="flex flex-row justify-center items-center pb-5 bg-transparent mt-[30px]"
              id="first-input"
            >
              <span className="material-symbols-outlined ml-[-35px] pr-2 text-mainBlue text-[18px]">
                FN
              </span>
              <input
                className="bg-mainBlue bg-opacity-0 p-1 border-b-2 border-mainBlue focus:bg-opacity-10 hover:bg-opacity-10 placeholder:text-white text-center tracking-widest"
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Full Name"
                name="name"
                id="name"
              />
            </div>

            <div className="flex flex-row justify-center items-center pb-5 my-3">
              <span className="material-symbols-outlined ml-[-20px] pr-2 text-mainBlue">
                person
              </span>
              <input
                className="bg-mainBlue bg-opacity-0 p-1 border-b-2 border-mainBlue focus:bg-opacity-10 hover:bg-opacity-10 placeholder:text-white text-center tracking-widest"
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder="Username"
                name="username"
                id="username"
              />
            </div>

            <div className="flex flex-row justify-center items-center pb-5">
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

            <div className="flex flex-row justify-center items-center pb-5 my-3">
              <span className="material-symbols-outlined ml-[-20px] pr-2 text-mainBlue">
                lock
              </span>
              <input
                className="bg-mainBlue bg-opacity-0 p-1 border-b-2 border-mainBlue focus:bg-opacity-10 hover:bg-opacity-10 placeholder:text-white text-center tracking-widest"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
                name="password"
                id="password"
              />
            </div>

            <div className="flex flex-row justify-center items-center pb-5 my-3">
              <button
                type="button"
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <span className="material-symbols-outlined ml-[-20px] pr-2 text-mainBlue">
                    visibility
                  </span>
                ) : (
                  <span className="material-symbols-outlined ml-[-20px] pr-2 text-mainBlue">
                    visibility_off
                  </span>
                )}
              </button>

              <input
                className="bg-mainBlue bg-opacity-0 p-1 border-b-2 border-mainBlue focus:bg-opacity-10 hover:bg-opacity-10 placeholder:text-white text-center tracking-widest"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Verify Password"
                name="confirmPassword"
                id="confirmPassword"
              />
            </div>
          </div>

          <div className="buttonSection">
            <button className="submitBtn" type="submit">
              Signup
            </button>

            <button type="button" className="linkBtn" onClick={switchForm}>
              Already have an account? Log in
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
