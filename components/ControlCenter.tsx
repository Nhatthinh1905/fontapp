import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import TrackPlayer, { State, usePlaybackState, RepeatMode } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ControlCenter = () => {
  const playBackState = usePlaybackState();
  const [isRepeatOne, setIsRepeatOne] = useState(false);

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  }

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  }

  const togglePlayback = async (playback: State) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      if (playback === State.Paused || playback === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  }

  const toggleRepeat = async () => {
    const repeatMode = await TrackPlayer.getRepeatMode();

    if (isRepeatOne) {
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
    } else {
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
    }

    setIsRepeatOne(!isRepeatOne);
  }

  const toggleShuffle = async () => {
    let queue = await TrackPlayer.getQueue();
    await TrackPlayer.reset();
    queue.sort(() => Math.random() - 0.5);
    await TrackPlayer.add(queue);
  }

  const rewind = async () => {
    const position = await TrackPlayer.getPosition();
    const newPosition = position - 10; // Tua lại 10 giây
    if (newPosition > 0) {
      await TrackPlayer.seekTo(newPosition);
    } else {
      await TrackPlayer.seekTo(0);
    }
  }

  const fastForward = async () => {
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    const newPosition = position + 10; // Tua tới 10 giây
    if (newPosition < duration) {
      await TrackPlayer.seekTo(newPosition);
    } else {
      await TrackPlayer.seekTo(duration);
    }
  }

  return (
    <View style={styles.container}>
      {/* Shuffle */}
      <Pressable onPress={toggleShuffle}>
        <FontAwesome5
          style={styles.icon}
          name={"random"}
          size={30}
        />
      </Pressable>

      {/* Skip Previous - Trở lại bài trước */}
      <Pressable onPress={skipToPrevious}>
        <Icon style={styles.icon} name="skip-previous" size={30} />
      </Pressable>

      {/* Rewind */}
      <Pressable onPress={rewind}>
        <Icon style={styles.icon} name="replay-10" size={30} />
      </Pressable>

      {/* Play/Pause */}
      <Pressable onPress={() => togglePlayback(playBackState)}>
        <Icon 
          style={styles.icon} 
          name={playBackState === State.Playing ? "pause" : "play-arrow"} 
          size={75} 
        />
      </Pressable>

      {/* Fast Forward */}
      <Pressable onPress={fastForward}>
        <Icon style={styles.icon} name="forward-10" size={30} />
      </Pressable>

      {/* Skip Next */}
      <Pressable onPress={skipToNext}>
        <Icon style={styles.icon} name="skip-next" size={30} />
      </Pressable>

      {/* Repeat */}
      <Pressable onPress={toggleRepeat}>
        <Icon style={styles.icon} name={isRepeatOne ? "repeat-one" : "repeat"} size={30} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 56,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#FFFFFF',
    padding: 5,
    margin: 2
  },
  playButton: {
    marginHorizontal: 24,
  },
});

export default ControlCenter;
