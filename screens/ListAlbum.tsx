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
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Album } from "../interface/Album";
import { getAllAlbumApi } from "../service/album";

const ListAlbum = ({ navigation }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const data = await getAllAlbumApi();
    setAlbums(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAlbumPress = (album: Album) => {
    // Navigate to the AlbumDetail screen when an album is pressed
    navigation.navigate("AlbumDetail", { album });
  };

  const renderAlbum = ({ item }: { item: Album }) => {
    return (
      <Pressable
        style={styles.albumContainer}
        onPress={() => handleAlbumPress(item)}
      >
        <Image style={styles.albumImage} source={{ uri: item.imageUrl }} />
        <View style={styles.albumInfo}>
          <Text style={styles.albumName}>{item.title}</Text>
          <Text style={styles.albumArtist}>{item.artistName}</Text>
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
        <Text style={styles.titleText}>All Albums</Text>
      </View>

      <View style={styles.albumListContainer}>
        <FlatList
          data={albums}
          renderItem={renderAlbum}
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
  albumListContainer: {
    flex: 1,
  },
  albumContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 20,
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  albumArtist: {
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

export default ListAlbum;
