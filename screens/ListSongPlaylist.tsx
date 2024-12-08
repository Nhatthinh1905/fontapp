import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; 
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getTrackinPlaylistApi } from "../service/playlist";
import { Track } from "../interface/Track";
import DeleteFromPlaylistModal from "../components/DeleteFromPlaylistModal";


const ListSongPlaylist = ({ route, navigation }) => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for DeleteFromPlaylistModal
  const { playlist } = route.params;
  const [trackToDelete, setTrackToDelete] = useState(null); // Track to delete

  const fetchData = async () => {
    try {
      const data = await getTrackinPlaylistApi(playlist.id); 
      setTracks(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
  

    fetchData();
  }, [playlist]);

  const handleTrackPress = (track: Track) => {
    navigation.navigate("PlayScreen", { track,tracks });
  };

  // Function to open DeleteFromPlaylistModal
  const openDeleteModal = (track: Track) => {
    setTrackToDelete(track);
    setIsDeleteModalVisible(true);
  };

  // Function to close DeleteFromPlaylistModal
  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setTrackToDelete(null);
  };

  const renderTrack = ({ item }: { item: Track }) => {
    return (
      <Pressable
        style={styles.trackContainer}
        onPress={() => handleTrackPress(item)}
      >
        <Image style={styles.trackImage} source={{ uri: item.imageUrl }} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{item.title}</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={() => openDeleteModal(item)}> 
          <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
        </TouchableOpacity>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#232323", "#121212"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.customBackButton}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.playlistInfo}>
        <Image style={styles.playlistImage} source={require('../assets/image1.png')} />
        <Text style={styles.playlistTitle}>{playlist.name}</Text>
        <Text style={styles.playlistDescription}>{playlist.description}</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Songs</Text>
      </View>

      <View style={styles.trackListContainer}>
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="large" color="gray" /> : null
          }
        />
      </View>

      <DeleteFromPlaylistModal
        isDeleteFromPlaylistModalVisible={isDeleteModalVisible}
        hideDeleteFromPlaylistModal={closeDeleteModal}
        track={trackToDelete}
        playlistId={playlist.id}
        onDeleteFromPlaylistSuccess={() => {
          fetchData();
        }}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    marginHorizontal: 10,
  },
  playlistInfo: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  playlistImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  playlistTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  playlistDescription: {
    fontSize: 16,
    color: "white",
  },
  titleContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  trackListContainer: {
    flex: 1,
  },
  trackContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#232323",
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginLeft: 20,
  },
  customBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default ListSongPlaylist;
