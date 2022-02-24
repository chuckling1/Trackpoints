/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  State,
} from 'react-native-track-player';
import {
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player/lib/hooks';
import styles from './styles';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPointButtonBar from './TrackPointButtonBar';

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
  url: require('../TrackpointsApp/android/app/src/main/res/raw/full_mix_come_on_get_happy.mp3'),
  fileName: 'full_mix_come_on_get_happy.mp3',
  title: 'The Greatest Song',
  album: 'Great Album',
  artist: 'A Great Dude',
};

const songFile = new Sound(songDetails.fileName, Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

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
  //const [getPoints, setPoints] = useState('');
  const { position } = useProgress(100);
  const duration = songFile.getDuration();

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    };

    removeItem(pointsStorageKey);
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

  let points = '0.000';
  const pointsStorageKey = 'points';

  const onTrackPointButtonPressed = () => {
    if (isPlaying) {
      getItem(pointsStorageKey)
        .then((data: any) => {
          if (data) {
            points = data;
          }
        })
        .catch((error: string) => {
          console.log(error);
        })
        .finally(() => {
          points += '|' + position;
          putItem(pointsStorageKey, points);
          //setPoints(points);
        });
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

  let getItem = async (key: string) => {
    return await AsyncStorage.getItem(key);
  };

  let putItem = async (key: string, item: any) => {
    return await AsyncStorage.setItem(key, item);
  };

  let removeItem = async (key: string) => {
    return await AsyncStorage.removeItem(key);
  };

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
        <View>
          <TrackPointButtonBar timeStamps="0|100|200" />
        </View>
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
    </View>
  );
};

export default App;
