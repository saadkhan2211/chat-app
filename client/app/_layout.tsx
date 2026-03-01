import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        initialRouteName="index"
        screenOptions={() => ({
          headerShown: false,
          animation: "flip",
          statusBarStyle: "light",
        })}
      >
        <Stack.Screen name="authScreen" />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
