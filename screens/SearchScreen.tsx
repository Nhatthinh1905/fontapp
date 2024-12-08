import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Artist } from '../interface/Artist';
import { Album } from '../interface/Album';
import { Track } from '../interface/Track';
import { getAllArtistApi } from '../service/artist';
import { getAllAlbumApi } from '../service/album';
import { getAllTrackApi } from '../service/track';
import Voice from '@react-native-community/voice';

const SearchScreen = ({ navigation }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [input, setInput] = useState('');
  const [searchedArtists, setSearchedArtists] = useState<Artist[]>([]);
  const [searchedAlbums, setSearchedAlbums] = useState<Album[]>([]);
  const [searchedTracks, setSearchedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState<'artist' | 'album' | 'track'>('artist');
  const [isListening, setIsListening] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    const artistsData = await getAllArtistApi();
    setArtists(artistsData);

    const albumsData = await getAllAlbumApi();
    setAlbums(albumsData);

    const tracksData = await getAllTrackApi();
    setTracks(tracksData);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(input);
  }, [input]);

  const onSpeechResults = (e: any) => {
    if (e.value && e.value.length > 0) {
      const searchText = e.value[0];
      setInput(searchText);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
  };

  const handleSearch = (text: string) => {
    if (text === '') {
      setSearchedArtists(artists);
      setSearchedAlbums(albums);
      setSearchedTracks(tracks);
    } else {
      const filteredArtists = artists.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      const filteredAlbums = albums.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      const filteredTracks = tracks.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );

      setSearchedArtists(filteredArtists);
      setSearchedAlbums(filteredAlbums);
      setSearchedTracks(filteredTracks);
    }
  };

  const handleItemPress = (item: Artist | Album | Track) => {
    if (searchType === 'artist') {
      navigation.navigate('ArtistDetail', { artist: item });
    } else if (searchType === 'album') {
      navigation.navigate('AlbumDetail', { album: item });
    } else if (searchType === 'track') {
      navigation.navigate('PlayScreen', { track: item, tracks });
    }
  };

  const startListening = () => {
    setIsListening(true);
    Voice.start('vi-VN');
  };

  const stopListening = () => {
    setIsListening(false);
    Voice.stop();
  };

  const renderArtist = ({ item }: { item: Artist }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleItemPress(item)}>
      <Image style={styles.itemImage} source={{ uri: item.imageUrl }} />
      <View style={styles.itemInfo}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </Pressable>
  );

  const renderAlbum = ({ item }: { item: Album }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleItemPress(item)}>
      <Image style={styles.itemImage} source={{ uri: item.imageUrl }} />
      <View style={styles.itemInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.itemInfoText}>{item.releaseDate}</Text>
      </View>
    </Pressable>
  );

  const renderTrack = ({ item }: { item: Track }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleItemPress(item)}>
      <Image style={styles.itemImage} source={{ uri: item.imageUrl }} />
      <View style={styles.itemInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.itemInfoText}>{item.artist}</Text>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#1e1e1e', '#131313']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Pressable style={styles.searchIconContainer}>
            <AntDesign name="search1" size={20} color="white" />
            <TextInput
              value={input}
              onChangeText={handleInputChange}
              placeholder={`Search for ${searchType}s`}
              placeholderTextColor={'#888'}
              style={styles.searchInput}
            />
          </Pressable>
          <TouchableOpacity onPress={isListening ? stopListening : startListening}>
            <FontAwesome name={isListening ? 'pause-circle' : 'microphone'} size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.typeSwitchContainer}>
        <TouchableOpacity
          style={[styles.typeSwitchButton, searchType === 'artist' && styles.activeTypeButton]}
          onPress={() => setSearchType('artist')}
        >
          <Text style={styles.typeSwitchText}>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeSwitchButton, searchType === 'album' && styles.activeTypeButton]}
          onPress={() => setSearchType('album')}
        >
          <Text style={styles.typeSwitchText}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeSwitchButton, searchType === 'track' && styles.activeTypeButton]}
          onPress={() => setSearchType('track')}
        >
          <Text style={styles.typeSwitchText}>Tracks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{`All ${searchType}s`}</Text>
      </View>

      <View style={styles.itemListContainer}>
        {searchType === 'artist' && (
          <FlatList
            data={searchedArtists.length > 0 ? searchedArtists : artists}
            renderItem={renderArtist}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="gray" /> : null}
          />
        )}
        {searchType === 'album' && (
          <FlatList
            data={searchedAlbums.length > 0 ? searchedAlbums : albums}
            renderItem={renderAlbum}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="gray" /> : null}
          />
        )}
        {searchType === 'track' && (
          <FlatList
            data={searchedTracks.length > 0 ? searchedTracks : tracks}
            renderItem={renderTrack}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="gray" /> : null}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#1e1e1e',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 30,
    padding: 10,
    paddingHorizontal: 15,
  },
  searchIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchInput: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  typeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  typeSwitchButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#444',
  },
  activeTypeButton: {
    backgroundColor: '#ff6f61',
  },
  typeSwitchText: {
    color: 'white',
    fontWeight: 'bold',
  },
  titleContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemListContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemInfoText: {
    color: '#888',
    fontSize: 14,
  },
});

export default SearchScreen;
