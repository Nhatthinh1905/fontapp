import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    // Gửi yêu cầu thay đổi mật khẩu đến API
    Alert.alert("Thành công", "Mật khẩu đã được thay đổi!");
    navigation.navigate("Profile"); // Quay lại màn hình Profile sau khi thành công
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Nút Quay lại */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.backButtonText}>{"<"} Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Đổi mật khẩu</Text>

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu cũ"
          secureTextEntry
          placeholderTextColor="#B0B0B0"
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          placeholderTextColor="#B0B0B0"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
          placeholderTextColor="#B0B0B0"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
          <Text style={styles.changeButtonText}>Xác nhận</Text>
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#1F1F1F",
    borderRadius: 5,
  },
  backButtonText: {
    color: "#1ED760",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: "#1F1F1F",
    color: "#fff",
    fontSize: 16,
  },
  changeButton: {
    backgroundColor: "#1ED760",
    borderRadius: 25,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  changeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ChangePasswordScreen;
