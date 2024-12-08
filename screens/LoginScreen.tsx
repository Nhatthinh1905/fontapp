import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { addTokenToAxios, getAccessToken, setAccessToken } from "../service/token";
import { loginApi } from "../service/user";
import { validateEmail, validatePassword } from "../utils/validation";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        addTokenToAxios(accessToken);
        navigation.navigate("Main");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    const emailValidationResult = validateEmail(email);
    const passwordValidationResult = validatePassword(password);

    if (emailValidationResult) {
      setEmailError(emailValidationResult);
      return;
    }
    if (passwordValidationResult) {
      setPasswordError(passwordValidationResult);
      return;
    }

    try {
      const response = await loginApi({ email, password });
      const { data } = response.data;
      const result = setAccessToken(response.data.token);

      if (result) {
        Alert.alert("Login Success", "You have successfully logged in.");
        navigation.navigate("Main");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Login Failed", "Incorrect email or password.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image source={require("../assets/spo.png")} style={styles.logo} />
        <Text style={styles.title}>Login to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#B0B0B0"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#B0B0B0"
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.dontHaveAccount}>
            Don't have an account? <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 10,
    backgroundColor: "#1F1F1F",
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  forgotPassword: {
    color: "#1ED760",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#1ED760",
    borderRadius: 25,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  dontHaveAccount: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  registerLink: {
    color: "#1ED760",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
