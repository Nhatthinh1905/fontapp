import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { registerApi } from "../service/user";
import { validateEmail, validateName, validatePassword } from "../utils/validation";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [birthdayError, setBirthdayError] = useState("");

  const handleRegister = () => {
    // Reset all error messages
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setBirthdayError("");

    // Validate inputs
    const nameValidationResult = validateName(name);
    if (nameValidationResult) {
      setNameError(nameValidationResult);
      return;
    }
    const emailValidationResult = validateEmail(email);
    if (emailValidationResult) {
      setEmailError(emailValidationResult);
      return;
    }
    const passwordValidationResult = validatePassword(password);
    if (passwordValidationResult) {
      setPasswordError(passwordValidationResult);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Password and confirm password do not match.");
      return;
    }

    // Date of Birth Validation (simple format check: dd/mm/yyyy)
    const birthdayPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!birthdayPattern.test(birthday)) {
      setBirthdayError("Please enter a valid date (dd/mm/yyyy).");
      return;
    }

    // API call for registration
    registerApi({ name, email, password, birthday })
      .then(() => {
        Alert.alert("Registration Success", "You have successfully registered.");
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        Alert.alert("Registration Failed", "An error occurred during registration. Please try again.");
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/spo.png")} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
        placeholderTextColor="#9E9E9E"
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholderTextColor="#9E9E9E"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholderTextColor="#9E9E9E"
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
        placeholderTextColor="#9E9E9E"
      />
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (dd/mm/yyyy)"
        onChangeText={(text) => setBirthday(text)}
        value={birthday}
        placeholderTextColor="#9E9E9E"
      />
      {birthdayError ? <Text style={styles.errorText}>{birthdayError}</Text> : null}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.haveAccount}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#555",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: "#1F1F1F",
    color: "#ffffff",
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#1ED760",
    borderRadius: 25,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    elevation: 5, // Add shadow effect for better appearance
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  haveAccount: {
    color: "#1ED760",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#FF4F4F",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default RegisterScreen;
