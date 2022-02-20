/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import TrackPlayer, { Capability, Event, State } from 'react-native-track-player';
import { useProgress, useTrackPlayerEvents } from 'react-native-track-player/lib/hooks';
import styles from './styles';
import Slider from '@react-native-community/slider';

const updateOptions = {
  stopWithApp: true,
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpForward,
    Capability.JumpBackward,
  ],
};

const songDetails = {
  id: '1',
  url:
    'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
  title: 'The Greatest Song',
  album: 'Great Album',
  artist: 'A Great Dude',
};

const trackPlayerInit = async () => {
  TrackPlayer.updateOptions(updateOptions);
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(songDetails);
  return true;
};

const App = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const { position, duration } = useProgress(100);

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    };

    startPlayer();
  }, []);

  const onPlayButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
    }
  };

  const onTrackPointButtonPressed = () => {
    if (isPlaying) {

    }
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value: number) => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
  }, [position, duration, isSeeking]);

  useTrackPlayerEvents([Event.PlaybackState], event => {
    if (event.state === State.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.songTitle}>{songDetails.title}</Text>
        <Text style={styles.artist}>{songDetails.artist}</Text>
      </View>
      <View style={styles.controlsContainer}>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={1}
          value={sliderValue}
          minimumTrackTintColor="#111000"
          maximumTrackTintColor="#000000"
          onSlidingStart={slidingStarted}
          onSlidingComplete={slidingCompleted}
          thumbTintColor="#000"
        />
        <View style={styles.buttonsContainer}>
          <View>
            <Button
              title={isPlaying ? 'Pause' : 'Play'}
              onPress={onPlayButtonPressed}
              disabled={!isTrackPlayerInit}
            />
          </View>
          <View style={styles.trackpointButtonContainer}>
            <Button
              color="red"
              title="Add Track Point"
              onPress={onTrackPointButtonPressed}
              disabled={!isPlaying}
            />
          </View>
        </View>
      </View>
    </View >
  );
};

export default App;
