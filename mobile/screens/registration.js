import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";
import logo from "../assets/logo.png";

const Registration = () => {
  const [user, setUser] = useState({
    username: "",
    phone: null,
    pin: "",
  });
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            placeholder="e.g. 03xxxxxxxxx"
            inputMode="numpad"
            keyboardType="numpad"
            placeholderTextColor="#707070"
          />
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
            placeholder="Your Name"
            inputMode="numpad"
            keyboardType="numpad"
            placeholderTextColor="#707070"
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Resgister</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    width: 150,
    height: 150,
    marginTop: 50,
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
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    marginTop: 8,
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
