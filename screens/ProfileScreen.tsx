import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { removeAccessToken } from "../service/token";
import { UserProfile } from "../interface/UserProfile";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { profileApi } from "../service/user";
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await profileApi();
      setUser(data);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await removeAccessToken();
    navigation.navigate("Login");
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileImageSource = user.imageUrl
    ? { uri: user.imageUrl }
    : require("../assets/17300521786072.jpeg");

  return (
    <LinearGradient colors={['#232323', '#121212']} style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={profileImageSource} style={styles.profileImage} />
          <Text style={styles.username}>{user.name}</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.infoItem}>
            <AntDesign name="mail" size={20} color="white" />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <AntDesign name="calendar" size={20} color="white" />
            <Text style={styles.infoLabel}>Ngày sinh:</Text>
            <Text style={styles.infoText}>{user.birthDay}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.changePasswordButton} 
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  userInfo: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "white",
  },
  changePasswordButton: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 20,
  },
  changePasswordText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 40,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
  },
});

export default ProfileScreen;
