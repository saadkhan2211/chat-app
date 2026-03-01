import { loadToken, useAuthSate } from "@/store/authStore";
import React, { createContext, useContext, useEffect } from "react";

type AuthContextType = {
  authState: ReturnType<typeof useAuthSate>;
  // userState: ReturnType<typeof useUserState>
};
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuthSate();

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ authState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
