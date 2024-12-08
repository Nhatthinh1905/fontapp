import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { removeTrackToPlaylist } from '../service/playlist';

const DeleteFromPlaylistModal = ({
  isDeleteFromPlaylistModalVisible,
  hideDeleteFromPlaylistModal,
  track,
  onDeleteFromPlaylistSuccess,
  playlistId, // Thêm tham số playlistId vào props
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const removeTrackFromPlaylist = async () => {
    setIsDeleting(true);
    try {
      // Sử dụng tham số playlistId để gọi hàm removeTrackToPlaylist
      await removeTrackToPlaylist(playlistId, track.id); 
      setIsDeleting(false);
      onDeleteFromPlaylistSuccess();
      hideDeleteFromPlaylistModal();
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      visible={isDeleteFromPlaylistModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={hideDeleteFromPlaylistModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideDeleteFromPlaylistModal}
          >
            <Entypo name="cross" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Remove from Playlist</Text>
          <Text style={styles.modalText}>
            Are you sure you want to remove this track from the playlist?
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={removeTrackFromPlaylist}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={hideDeleteFromPlaylistModal}
            disabled={isDeleting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
  modalText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'white',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default DeleteFromPlaylistModal;
