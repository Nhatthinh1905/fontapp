import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { getTracksbyArtistIdApi } from "../service/artist";

const ArtistDetailScreen = ({ route, navigation }) => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { artist } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTracksbyArtistIdApi(artist.id);
        setTracks(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTrackPress = (track:Track) => {
    navigation.navigate("PlayScreen", { track,tracks });
  };

  const renderTrack = ({ item }) => {
    return (
      <Pressable
        style={styles.trackContainer}
        onPress={() => handleTrackPress(item)}
      >
        <Image style={styles.trackImage} source={{ uri: item.imageUrl }} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{item.title}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#232323", "#121212"]} 
    style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity
        style={styles.customBackButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      </View>

      <View style={styles.artistInfo}>
        <Image style={styles.artistImage} source={{ uri: artist.imageUrl }} />
        <Text style={styles.artistName}>{artist.name}</Text>
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
  artistInfo: {
    flexDirection: "column", 
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  artistImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  artistName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  titleContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom:20
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
    backgroundColor : "#232323",
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
    marginTop: 20,
  },
});

export default ArtistDetailScreen;
