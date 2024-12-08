
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';

const UploadAvatarModal = ({
  isModalVisible,
  setModalVisible,
  isUploading,
  imgFile,
  handleUploadAvatar
}) => {
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(!isModalVisible)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        {imgFile && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imgFile.uri }} // Use imgFile.uri for preview
                style={styles.imagePreview}
              />
            </View>
          )}
          <TouchableOpacity style={styles.modalButton} onPress={handleUploadAvatar}>
            {isUploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.modalButtonText}>Upload</Text>
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
    backgroundColor: '#696969',
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
 
  imagePreviewContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5
  },
});

export default UploadAvatarModal;
