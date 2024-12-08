import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Track} from '../interface/Track';
import {getAllTrackApi, uploadTrackApi} from '../service/track';
import DocumentPicker from 'react-native-document-picker';
import UploadModal from '../components/UploadModal';
import MoreOptionsModal from '../components/MoreOptionsModal'; // Import modal for more options


const ListSongScreen = ({navigation}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    imageFile: {
      uri: '',
      name: '',
      type: '',
    },
    mp3File: {
      uri: '',
      name: '',
      type: '',
    },
    album:'',
  });
  const [isUploading, setIsUploading] = useState(false);

  const [isSortingAscending, setIsSortingAscending] = useState(true);

  const toggleSortingOrder = () => {
    const sortedData = [...tracks].sort((a, b) =>
      isSortingAscending
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title),
    );
    setTracks(sortedData);
    setIsSortingAscending(!isSortingAscending);
  };

  const [isMoreOptionsModalVisible, setMoreOptionsModalVisible] =
    useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const fetchData = async () => {
    const data = await getAllTrackApi();
    const sortedData = [...data].sort((a, b) => a.title.localeCompare(b.title));
    setTracks(sortedData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTrackPress = (track: Track) => {
    navigation.navigate('PlayScreen', {track, tracks});
  };

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const uri = result[0].uri;
      const name = result[0].name;
      const type = result[0].type;
      setNewTrack({...newTrack, imageFile: {uri, name, type}});
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        throw error;
      }
    }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      const uri = result[0].uri;
      const name = result[0].name;
      const type = result[0].type;
      setNewTrack({...newTrack, mp3File: {uri, name, type}});
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        throw error;
      }
    }
  };

  const handleNewTrack = async () => {
    if (
      !newTrack.title ||
      !newTrack.artist ||
      !newTrack.imageFile ||
      !newTrack.mp3File
    ) {
      console.log('Please fill in all required information.');
      return;
    }

    setIsUploading(true);

    try {
      await uploadTrackApi(newTrack);
      setUploadModalVisible(false);
      setNewTrack({
        title: '',
        artist: '',
        imageFile: { uri: '', name: '', type: '' },
        mp3File: { uri: '', name: '', type: '' },
        album:'',
      });
      fetchData();
      Alert.alert('Success', 'Track added successfully!');
    } catch (error) {
      console.error('Error creating a new track:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const openMoreOptions = (track: Track) => {
    setSelectedTrack(track);
    setMoreOptionsModalVisible(true);
  };
  const handleDeleteSuccess = () => {
    fetchData(); 
    Alert.alert('Deleted', 'Track has been deleted successfully');
  };
  

  const renderTrack = ({item}: {item: Track}) => {
    return (
      <TouchableOpacity
        style={styles.trackContainer}
        onPress={() => handleTrackPress(item)}>
        <Image style={styles.trackImage} source={{uri: item.imageUrl}} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{item.title}</Text>
          <Text style={styles.artistName}>{item.artist}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => openMoreOptions(item)} // Open more options modal
        >
          <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#131313', '#121212']} style={styles.container}>
      <TouchableOpacity
        style={styles.customBackButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>All Tracks</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.sortButton} onPress={toggleSortingOrder}>
          <AntDesign
            name={isSortingAscending ? 'arrowdown' : 'arrowup'}
            size={20}
            color="white"
          />
        </Pressable>
        <View style={styles.playControls}>
          <Pressable
            style={styles.playButton}
            onPress={() => setUploadModalVisible(true)}>
            <Entypo name="plus" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      <View style={styles.trackListContainer}>
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={
            isLoading ? <ActivityIndicator size="large" color="gray" /> : null
          }
        />
      </View>

      <UploadModal
        isModalVisible={isUploadModalVisible}
        setModalVisible={setUploadModalVisible}
        newTrack={newTrack}
        setNewTrack={setNewTrack}
        isUploading={isUploading}
        handleNewTrack={handleNewTrack}
        pickImage={pickImage}
        pickAudio={pickAudio}
      />
      <MoreOptionsModal
        isMoreOptionsModalVisible={isMoreOptionsModalVisible}
        hideMoreOptionsModal={() => setMoreOptionsModalVisible(false)}
        track={selectedTrack}
        onDeleteSuccess={handleDeleteSuccess} // Đảm bảo bạn đã thêm onDeleteSuccess và truyền hàm xử lý vào đây
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  titleContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DB954',
  },
  trackListContainer: {
    flex: 1,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    fontWeight: 'bold',
    color: 'white',
  },
  artistName: {
    marginTop: 5,
    color: '#D3D3D3',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 20,
  },
});

export default ListSongScreen;
