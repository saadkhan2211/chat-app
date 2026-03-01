import { Constants } from "@/config/styles";
import { useAuthSate } from "@/store/authStore";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Data = {
  name: string;
  email: string;
  password: string;
};

const AuthScreen = () => {
  const login = useAuthSate((s) => s.login);
  const signup = useAuthSate((s) => s.signup);

  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState<Data>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (key: keyof Data, text: string) => {
    setData((prev) => ({ ...prev, [key]: text }));
  };

  const handleSubmit = async () => {
    if (isLogin) {
      await login(data.email.trim(), data.password.trim());
    } else {
      await signup(data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.bodyContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? "Login to continue" : "Sign up to get started"}
            </Text>
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#888"
                value={data.name}
                onChangeText={(text) => handleChange("name", text)}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={data.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#888"
              secureTextEntry
              value={data.password}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isLogin ? "Login" : "Create Account"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.colors.background,
  },
  flex: {
    flex: 1,
    justifyContent: "center",
  },
  bodyContainer: {
    paddingHorizontal: 28,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: Constants.size.xl,
    fontFamily: Constants.font.bold,
    color: Constants.colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Constants.size.sm,
    fontFamily: Constants.font.regular,
    color: Constants.colors.subtitle,
    textAlign: "center",
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 22,
  },
  label: {
    fontSize: Constants.size.xs,
    fontFamily: Constants.font.regular,
    color: Constants.colors.subtitle,
    marginBottom: 6,
  },
  input: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: Constants.colors.lightBackground,
    borderWidth: 1,
    borderColor: Constants.colors.lightBackground,
    fontSize: Constants.size.sm,
    color: Constants.colors.subtitle,
  },
  button: {
    marginTop: 10,
    height: 50,
    borderRadius: 16,
    backgroundColor: Constants.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: Constants.size.md,
    fontFamily: Constants.font.semiBold,
    color: Constants.colors.subtitle,
  },
  switchContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  switchText: {
    fontSize: Constants.size.sm,
    fontFamily: Constants.font.semiBold,
    color: Constants.colors.primary,
  },
});
