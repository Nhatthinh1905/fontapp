import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Modal, Button } from 'react-native';
import { getAllPlaylistApi, createNewPlaylistApi, deletePlaylistApi } from '../service/playlist';
import { Playlist } from '../interface/Playlist';
import { Swipeable } from 'react-native-gesture-handler';

const LibraryScreen = ({navigation}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState<Playlist>({
    id: '',
    name: '',
    description: '',
  });

  const fetchPlaylists = async () => {
    const data = await getAllPlaylistApi();
    setPlaylists(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleSwipeLeft = async(playlist: Playlist) => {
    await deletePlaylistApi(playlist.id)
    fetchPlaylists();
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => handleSwipeLeft(item)}
            style={styles.deleteButton}
          >
            <Text style= {styles.deleteButtonText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <TouchableOpacity style={styles.playlistItem} onPress={() => handlePlaylistPress(item)}>
        <Image source={require('../assets/image1.png')} style={styles.playlistImage} />
        <Text style={styles.playlistTitle}>{item.name}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  const handlePlaylistPress = (playlist: Playlist) => {
    navigation.navigate("ListSongPlaylist", { playlist });
  };

  const handleNewPlaylist = () => {
    if (!newPlaylist.name || !newPlaylist.description) {
      console.log('Vui lòng điền đầy đủ thông tin');
      return;
    }

    createNewPlaylistApi(newPlaylist)
      .then(() => {
        toggleModal();
        setNewPlaylist({
          id: '',
          name: '',
          description: '',
        });
        fetchPlaylists();
      })
      .catch((error) => {
        console.error('Error creating new playlist:', error);
      });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Library</Text>
        <TouchableOpacity style={styles.newPlaylistButton} onPress={toggleModal}>
          <Text style={styles.newPlaylistText}>+</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="gray"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylist}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Playlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Playlist Name"
              placeholderTextColor="gray"
              value={newPlaylist.name}
              onChangeText={(text) => setNewPlaylist({ ...newPlaylist, name: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              placeholderTextColor="gray"
              value={newPlaylist.description}
              onChangeText={(text) => setNewPlaylist({ ...newPlaylist, description: text })}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleNewPlaylist}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  newPlaylistButton: {
    backgroundColor: '#1ED760',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPlaylistText: {
    fontSize: 24,
    color: 'white',
  },
  searchInput: {
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  playlistImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 20,
  },
  playlistTitle: {
    fontSize: 18,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1ED760',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#121212',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default LibraryScreen;
