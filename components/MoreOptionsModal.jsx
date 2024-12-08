import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Track } from '../interface/Track';
import { addTrackToPlaylist, getAllPlaylistApi } from '../service/playlist';
import { deleteTrackApi } from '../service/track';

const MoreOptionsModal = ({
  isMoreOptionsModalVisible,
  hideMoreOptionsModal,
  track,
  onDeleteSuccess,
}) => {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistsData = await getAllPlaylistApi();
        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const toggleOptions = () => {
    setOptionsVisible(!isOptionsVisible);
  };

  const addToPlaylist = async (playlistId) => {
    setIsAddingToPlaylist(true);
    try {
      await addTrackToPlaylist(playlistId, track.id);
      setSuccessMessage(`Added to ${playlists.find((p) => p.id === playlistId).name} successfully.`);
      setTimeout(() => {
        hideMoreOptionsModal();
        setIsAddingToPlaylist(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setSuccessMessage("Track already exists in the playlist.");
        setIsAddingToPlaylist(false);
      } else {
        console.error('Error adding track to playlist:', error);
        setIsAddingToPlaylist(false);
      }
    }
  };
  
  
  

  const deleteTrack = async () => {
    setIsDeleting(true);
    try {
      await deleteTrackApi(track.id);
      setIsDeleting(false);
      onDeleteSuccess();
      hideMoreOptionsModal();
    } catch (error) {
      console.error('Error deleting track:', error);
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      visible={isMoreOptionsModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={hideMoreOptionsModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideMoreOptionsModal}
          >
            <Entypo name="cross" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>More Options</Text>
          <TouchableOpacity style={styles.optionButton} onPress={toggleOptions}>
            <Text style={styles.optionText}>Add to Playlist</Text>
            {isOptionsVisible ? (
              <Entypo name="chevron-up" size={20} color="white" />
            ) : (
              <Entypo name="chevron-down" size={20} color="white" />
            )}
          </TouchableOpacity>
          {isOptionsVisible && (
            <View style={styles.optionsList}>
              {playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.optionItem}
                  onPress={() => addToPlaylist(playlist.id)}
                >
                  <Text style={styles.optionItemText}>{playlist.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {isAddingToPlaylist && <Text style={styles.successMessage}>Adding to playlist...</Text>}
          {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
          <TouchableOpacity style={styles.optionButton} onPress={deleteTrack}>
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity>
          {isDeleting && <Text style={styles.successMessage}>Deleting...</Text>}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={hideMoreOptionsModal}
          >
            <Text style={styles.optionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1ED760',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignItems: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 18,
    color: 'white',
  },
  optionsList: {
    marginTop: 10,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  optionItemText: {
    fontSize: 16,
    color: 'white',
  },
  successMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MoreOptionsModal;
