import React, { useState, useEffect, useMemo } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check localStorage for persisted auth state
    const saved = localStorage.getItem("isAuthenticated");
    return saved === "true";
  });

  const [user, setUser] = useState<bff.UserInfo | undefined>(() => {
    // Check localStorage for persisted user data
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : undefined;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const getUser = async () => {
    // If we already have user data and are authenticated, don't make another call
    if (isAuthenticated && user) {
      return;
    }

    // If we're already loading, don't make another call
    if (isLoading) {
      return;
    }

    // Check if we have cached data that's still valid (within last hour)
    const lastAuthCheck = localStorage.getItem("lastAuthCheck");
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (lastAuthCheck && isAuthenticated && user && now - parseInt(lastAuthCheck) < fifteenMinutes) {
      return; // Use cached data if it's less than 15 minutes old
    }

    setIsLoading(true);
    try {
      const response = await callBff((baseUrl) => bff.AuthApiFactory(undefined, baseUrl).authGetUserGet());
      const data = response.data;

      const authenticated = data.isAuthenticated ?? false;
      setIsAuthenticated(authenticated);

      // Persist authentication state
      localStorage.setItem("isAuthenticated", authenticated.toString());
      localStorage.setItem("lastAuthCheck", now.toString());

      if (authenticated && data) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        setUser(undefined);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to get user info:", error);
      // On error, clear auth state
      setIsAuthenticated(false);
      setUser(undefined);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("lastAuthCheck");
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  };

  useEffect(() => {
    // Only fetch user data if we haven't initialized yet
    if (!hasInitialized) {
      getUser();
    }
  }, [hasInitialized]);

  const login = () => {
    window.location.href = "/auth/login";
  };

  const logout = () => {
    // Clear all auth data before redirecting
    setIsAuthenticated(false);
    setUser(undefined);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("lastAuthCheck");
    window.location.href = "/auth/logout";
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, user, isLoading],
  );

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};
