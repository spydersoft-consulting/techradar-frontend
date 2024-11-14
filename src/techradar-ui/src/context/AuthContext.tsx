import React, { useState, useEffect } from "react";
import { callBff } from "../utils/ApiFunctions";
import * as bff from "../api/Bff";

interface IAuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: bff.UserInfo;
  login?: () => void;
  logout?: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoading: false,
  isAuthenticated: false,
});

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<bff.UserInfo | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
    const response = await callBff((baseUrl) => bff.AuthApiFactory(undefined, baseUrl).authGetUserGet());
    const data = response.data;

    setIsAuthenticated(data.isAuthenticated ?? false);
    setIsLoading(false);
    if (data.isAuthenticated) setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  const login = () => {
    window.location.href = "/auth/login";
  };

  const logout = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
