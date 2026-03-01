import { URL } from "@/config/url";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface LoginState {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;

  signup: (input: LoginState) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: (id: string) => Promise<void>;
  setToken: (token: string | null) => void;
}

export const useAuthSate = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,

  signup: async (input: LoginState) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(URL + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Signup failed");
      }

      await AsyncStorage.setItem("accessToken", result.token);

      set({
        token: result.token,
        isAuthenticated: true,
        loading: false,
      });

      Toast.show({
        type: "success",
        text1: "Account Created 🎉",
        text2: "Welcome aboard!",
      });

      return true;
    } catch (error: any) {
      set({ loading: false, error: error.message });

      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: error.message,
      });

      return false;
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      await AsyncStorage.setItem("accessToken", result.token);

      set({
        token: result.token,
        isAuthenticated: true,
        loading: false,
      });

      Toast.show({
        type: "success",
        text1: "Welcome Back 👋",
        text2: "Successfully logged in",
      });

      return true;
    } catch (error: any) {
      set({ loading: false, error: error.message });

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });

      return false;
    }
  },

  logout: async (id: string) => {
    try {
      await fetch(URL + "/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id }),
      });

      await AsyncStorage.removeItem("accessToken");

      set({ token: null, isAuthenticated: false });

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "See you soon 👋",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
      });
    }
  },

  setToken: (token: string | null) => {
    if (token) {
      set({ token, isAuthenticated: true });
    } else {
      set({ token: null, isAuthenticated: false });
    }
  },
}));
