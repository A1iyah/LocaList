import { createContext, useCallback, useMemo, useState } from "react";
import { parseJwt } from "../utils/tokens";
import axios from "axios";

type UserData = {
  isLoggedIn?: boolean;
  userId?: string;
  email?: string;
  name?: string;
  username?: string;
  image?: string;
};

type AuthContextType = {
  state: UserData;
  dispatch: (action: UserData) => void;
  logout: () => void;
};

export const getUserDataFromToken = (accessToken?: string | null): UserData => {
  let userData: UserData = {
    isLoggedIn: false,
  };

  if (!accessToken) {
    accessToken = window.localStorage.getItem("accessToken");
  }

  if (accessToken) {
    const userDetails = parseJwt(accessToken);
    if (userDetails) {
      userData = {
        isLoggedIn: true,
        userId: userDetails.userId,
        email: userDetails.email,
        name: userDetails.name,
        username: userDetails.username,
        image: userDetails.image,
      };
    }
  }

  return userData;
};

const AuthContext = createContext<AuthContextType>({
  state: {
    isLoggedIn: false,
  },
  dispatch: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(getUserDataFromToken());

  const logout = useCallback(async () => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await axios.post(
          "http://localhost:3000/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Logout error", error);
      }
    }

    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    setUserData({
      isLoggedIn: false,
    });

    window.location.pathname = "/";
  }, []);

  const contextValue = useMemo(
    () => ({
      state: userData,
      dispatch: setUserData,
      logout,
    }),
    [userData, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
