import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import logo from "../assets/logo.png";
import Toast from "react-native-toast-message";
import URL from "../url";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Registration = ({ navigation }) => {
  const [user, setUser] = useState({
    username: "",
    phone: null,
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getId = async () => {
      const storedId = await AsyncStorage.getItem("userId");
      if (storedId) {
        setUserId(storedId);
        navigation.navigate("chatList");
      }
    };
    getId();
  }, []);

  const handleSubmit = async () => {
    // SignUp
    if (user.username === "" || user.phone === null) {
      Toast.show({
        type: "error",
        text1: "Fill the required fields",
        visibilityTime: 3000,
        autoHide: true,
        position: "bottom",
      });
    } else {
      fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          phone: user.phone,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (!data.success) {
            Toast.show({
              type: "error",
              text1: data.message,
              visibilityTime: 3000,
              autoHide: true,
            });
          } else {
            const userId = data.userId;
            await AsyncStorage.setItem("userId", userId.toString());
            Toast.show({
              type: "success",
              text1: "Welcome",
              text2: data.message,
              visibilityTime: 3000,
              autoHide: true,
            });
            navigation.navigate("chatList");
          }
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: error.message,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    }
    setUser({ username: "", phone: null });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={user.username}
              onChangeText={(text) => setUser({ ...user, username: text })}
              placeholder="e.g. Saad Saifullah"
              placeholderTextColor="#BBBBBB"
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              value={user.phone}
              onChangeText={(text) => setUser({ ...user, phone: text })}
              placeholder="e.g. 03xxxxxxxxx"
              keyboardType="numeric"
              placeholderTextColor="#BBBBBB"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Resgister</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  bodyContainer: {
    flex: 1,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginVertical: 80,
    alignSelf: "center",
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#00C209",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    marginTop: 8,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: "#00C209",
    marginHorizontal: 5,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#00D50A",
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: "100%",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
});
