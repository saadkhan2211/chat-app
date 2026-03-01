import { Platform } from "react-native";

export const Constants = {
  colors: {
    primary: "#7B29AA",
    background: "#282828",
    lightBackground: "#404040",
    title: "#C7C7C7",
    subtitle: "#E3E3E3",
    error: "#E11B19",
    success: "#03CA45",
  },
  size: {
    xs: Platform.OS === "android" ? 11 : 14,
    sm: Platform.OS === "android" ? 14 : 16,
    md: Platform.OS === "android" ? 18 : 20,
    lg: Platform.OS === "android" ? 24 : 26,
    xl: Platform.OS === "android" ? 32 : 34,
  },
  font: {
    regular: "Regular",
    semiBold: "SemiBold",
    bold: "Bold",
  },
};
