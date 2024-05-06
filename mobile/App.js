import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Registration from "./screens/registration";
import Login from "./screens/login";
import ChatList from "./screens/chatList";
import Logo from "react-native-vector-icons/FontAwesome";
import ChatScreen from "./screens/chat";

const Stack = createStackNavigator();

export default function App() {
  const navigationOptions = (navigation, route) => ({
    headerTitle: () => (
      <Logo
        name="whatsapp"
        size={38}
        color="#00C209"
        style={{
          alignSelf: "flex-start",
          marginLeft:
            route.name !== "chatList" && Platform.OS === "android" ? 30 : 0,
          marginBottom: Platform.OS === "ios" ? 10 : 0,
        }}
      />
    ),
    headerStyle: {
      shadowColor: "#00D50A",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 4,
      backgroundColor: "#1C1C1C",
      height: Platform.OS === "ios" ? hp(12) : 60,
    },
    headerLeft: route.name === "chatList" ? null : undefined,
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    headerBackTitleVisible: false,
  });
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="registration">
        <Stack.Screen
          name="registration"
          component={Registration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="chatList"
          component={ChatList}
          options={({ navigation, route }) =>
            navigationOptions(navigation, route)
          }
        />
        <Stack.Screen
          name="chat"
          component={ChatScreen}
          options={({ navigation, route }) =>
            navigationOptions(navigation, route)
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
