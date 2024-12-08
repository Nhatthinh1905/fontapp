import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getAllTrackApi } from "../service/track";
import { getAllArtistApi } from "../service/artist";
import { getAllAlbumApi } from "../service/album";
import TrackPlayer, { useTrackPlayerEvents, Event } from "react-native-track-player";

const HomeScreen = ({ navigation }) => {
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const artistsData = await getAllArtistApi();
      setArtists(artistsData.slice(4, 8));

      const tracksData = await getAllTrackApi();
      setTracks(tracksData.slice(8, 12));

      const albumsData = await getAllAlbumApi();
      setAlbums(albumsData);

      const hours = new Date().getHours();
      if (hours >= 0 && hours < 12) {
        setGreeting("Good Morning");
      } else if (hours >= 12 && hours < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    fetchData();
  }, []);

  const handleTrackPress = (track) => {
    navigation.navigate("PlayScreen", { track, tracks });
  };

  const handleArtistPress = (artist: Artist) => {
    navigation.navigate("ArtistDetail", { artist });
  };

  const handleAlbumPress = (album: Album) => {
    navigation.navigate("AlbumDetail", { album });
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = async () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    await TrackPlayer.skip(nextIndex);
    const nextTrack = await TrackPlayer.getTrack(nextIndex);
    setCurrentTrack(nextTrack);
    if (!isPlaying) {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  const handlePreviousTrack = async () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    await TrackPlayer.skip(prevIndex);
    const prevTrack = await TrackPlayer.getTrack(prevIndex);
    setCurrentTrack(prevTrack);
    if (!isPlaying) {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], (event) => {
    if (event.type === Event.PlaybackTrackChanged) {
      TrackPlayer.getTrack(event.nextTrack).then((track) => setCurrentTrack(track));
    }
    if (event.type === Event.PlaybackState) {
      setIsPlaying(event.state === TrackPlayer.STATE_PLAYING);
    }
  });

  const renderArtist = ({ item }) => {
    return (
      <Pressable onPress={() => handleArtistPress(item)} style={styles.itemContainer}>
        <Image style={styles.imageArtist} source={{ uri: item.imageUrl }} />
        <Text style={styles.artistName}>{item.name}</Text>
      </Pressable>
    );
  };

  const renderTrack = ({ item }) => {
    return (
      <Pressable onPress={() => handleTrackPress(item)} style={styles.itemContainer}>
        <Image style={styles.imageArtist} source={{ uri: item.imageUrl }} />
        <Text style={styles.artistName}>{item.title}</Text>
      </Pressable>
    );
  };

  const renderAlbum = ({ item }) => {
    return (
      <Pressable onPress={() => handleAlbumPress(item)} style={styles.itemContainer}>
        <Image style={styles.imageArtist} source={{ uri: item.imageUrl }} />
        <Text style={styles.artistName}>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#131313", "#121212"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>

        <View style={styles.navigationButtons}>
          <Pressable style={styles.navButton} onPress={() => navigation.navigate("ListArtist")}>
            <MaterialCommunityIcons name="account-group" size={24} color="white" />
            <Text style={styles.navButtonText}>Artists</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => navigation.navigate("ListSong")}>
            <MaterialCommunityIcons name="music" size={24} color="white" />
            <Text style={styles.navButtonText}>Tracks</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => navigation.navigate("ListAlbum")}>
            <MaterialCommunityIcons name="album" size={24} color="white" />
            <Text style={styles.navButtonText}>Albums</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Artists</Text>
        </View>
        <FlatList
          data={artists}
          renderItem={renderArtist}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Tracks</Text>
        </View>
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Albums</Text>
        </View>
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>

      {currentTrack && (
        <View style={styles.musicControlContainer}>
          <Image source={{ uri: currentTrack.artwork }} style={styles.trackArt} />
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity onPress={handlePreviousTrack}>
              <MaterialCommunityIcons name="skip-previous" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
              <MaterialCommunityIcons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={40}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextTrack}>
              <MaterialCommunityIcons name="skip-next" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  navButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  navButtonText: {
    color: "white",
    marginTop: 5,
    fontSize: 14,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  itemContainer: {
    marginRight: 15,
    alignItems: "center",
  },
  imageArtist: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 5,
  },
  artistName: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  musicControlContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#131313",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  trackArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  trackInfo: {
    marginLeft: 10,
    flex: 1,
  },
  trackTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackArtist: {
    color: "white",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  playPauseButton: {
    marginHorizontal: 15,
  },
});
