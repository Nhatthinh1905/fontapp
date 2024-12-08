import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; 
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Artist } from "../interface/Artist";
import { getAllArtistApi } from "../service/artist";

const ListArtistScreen = ({ navigation }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const data = await getAllArtistApi();
    setArtists(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleArtistPress = (artist: Artist) => {
    // Xử lý khi người dùng chọn một nghệ sĩ
    navigation.navigate("ArtistDetail", { artist });
  };

  const renderArtist = ({ item }: { item: Artist }) => {
    return (
      <Pressable
        style={styles.artistContainer}
        onPress={() => handleArtistPress(item)}
      >
        <Image style={styles.artistImage} source={{ uri: item.imageUrl }} />
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{item.name}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#131313", "#121212"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.customBackButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>All Artists</Text>
      </View>

      <View style={styles.artistListContainer}>
        <FlatList
          data={artists}
          renderItem={renderArtist}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="large" color="gray" /> : null
          }
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    padding: 10,
  },
  titleContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  artistListContainer: {
    flex: 1,
  },
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  artistInfoText: {
    marginTop: 5,
    color: "#D3D3D3",
  },
  customBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ListArtistScreen;
