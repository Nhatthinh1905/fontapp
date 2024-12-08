import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getAllArtistApi } from '../service/artist';
import { getAllAlbumApi } from '../service/album'; // Thêm import cho album
import { Picker } from '@react-native-picker/picker';

const UploadModal = ({
  isModalVisible,
  setModalVisible,
  newTrack,
  setNewTrack,
  isUploading,
  handleNewTrack,
  pickImage,
  pickAudio,
}) => {
  const [artists, setArtists] = useState([]); // State for storing artists
  const [albums, setAlbums] = useState([]); // State for storing albums
  const [loading, setLoading] = useState(true); // Loading state for fetching artists and albums

  // Fetch the list of artists and albums when the modal is opened
  useEffect(() => {
    if (isModalVisible) {
      const fetchData = async () => {
        const artistsData = await getAllArtistApi();
        const albumsData = await getAllAlbumApi();
        if (artistsData) {
          setArtists(artistsData); // Assuming the response is an array of artists
        }
        if (albumsData) {
          setAlbums(albumsData); // Assuming the response is an array of albums
        }
        setLoading(false); // Stop loading after fetching
      };

      fetchData();
    }
  }, [isModalVisible]); // Only fetch when modal is visible

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(!isModalVisible)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload New Track</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Title"
            value={newTrack.title}
            onChangeText={(text) => setNewTrack({ ...newTrack, title: text })}
          />

          <Text style={styles.inputLabel}>Artist</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTrack.artist}
                onValueChange={(itemValue) =>
                  setNewTrack({ ...newTrack, artist: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select an artist" value="" />
                {artists.map((artist, index) => (
                  <Picker.Item key={index} label={artist.name} value={artist.name} />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.inputLabel}>Album</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTrack.album}
                onValueChange={(itemValue) =>
                  setNewTrack({ ...newTrack, album: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select an album" value="" />
                {albums.map((album, index) => (
                  <Picker.Item key={index} label={album.title} value={album.title} />
                ))}
              </Picker>
            </View>
          )}

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
          {newTrack.imageFile && (
            <Text style={styles.uploadedFile}>Image: {newTrack.imageFile.name}</Text>
          )}

          <TouchableOpacity style={styles.uploadButton} onPress={pickAudio}>
            <Text style={styles.uploadButtonText}>Upload Audio</Text>
          </TouchableOpacity>
          {newTrack.mp3File && (
            <Text style={styles.uploadedFile}>Audio: {newTrack.mp3File.name}</Text>
          )}

          <TouchableOpacity style={styles.modalButton} onPress={handleNewTrack}>
            {isUploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.modalButtonText}>Create</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  inputLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  uploadButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadedFile: {
    color: 'white',
    marginBottom: 10,
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
  uploadButtonText: {
    color: 'black',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    justifyContent: 'center', 
  },
  picker: {
    width: '100%',
    height: 30,
  },
});

export default UploadModal;
