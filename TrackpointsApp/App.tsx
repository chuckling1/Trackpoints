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
import SongDetails from './Interfaces/SongDetailsInterface';
import TrackPointButton from './Components/TrackPointButton';
import TrackPointButtonInterface from './Interfaces/TrackPointButtonInterface';

const updateOptions = {
  stopWithApp: true,
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpForward,
    Capability.JumpBackward,
  ],
};

const songDetails: SongDetails = {
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
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackPointTimes, setTrackPointTimes] = useState([] as number[]);
  const [trackPoints, setTrackPoints] = useState([] as TrackPointButtonInterface[]);
  const { position } = useProgress(100);

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
      setTrackDuration(songFile.getDuration());
      setTrackPoints([{ id: 'id_0', title: 'title_0', width: 100 }]);
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

      let points = trackPointTimes;
      console.log('points before', points);
      points.push(sliderValue);
      points.sort();
      console.log('points after sort', points);
      setTrackPointTimes(points);
      console.log('trackPoints after setTrackPoints', trackPoints);
    }
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value: number) => {
    await TrackPlayer.seekTo(value * trackDuration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  useTrackPlayerEvents([Event.PlaybackState], event => {
    if (event.state === State.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });

  useEffect(() => {
    if (!isSeeking && position && trackDuration) {
      setSliderValue(position / trackDuration);
    }
  }, [position, trackDuration, isSeeking]);

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
        <View style={styles.trackpointButtonContainer}>
          <TrackPointButton id="id_0" title="title_0" width={33} />
          <TrackPointButton id="id_1" title="title_1" width={33} />
          <TrackPointButton id="id_2" title="title_2" width={33} />
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
