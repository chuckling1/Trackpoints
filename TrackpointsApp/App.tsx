/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  State,
} from 'react-native-track-player';
import {
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player/lib/hooks';
import globalStyles from './styles';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import SongDetails from './Interfaces/SongDetailsInterface';
import TrackPointButton from './Components/TrackPointButton';

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

// const getTestTrackPoints = () => {
//   return [
//     { id: 'id_0', title: 'title_0', isRepeating: false, startTime: 0, endTime: 33, width: 33 },
//     { id: 'id_1', title: 'title_1', isRepeating: false, startTime: 34, endTime: 67, width: 33 },
//     { id: 'id_2', title: 'title_2', isRepeating: false, startTime: 68, endTime: 100, width: 34 }] as TrackPointInterface[];
// };

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
  //const [trackPoints, setTrackPoints] = useState([] as TrackPointInterface[]);
  const { position } = useProgress(100);

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      //let points = await getTestTrackPoints();
      setIsTrackPlayerInit(isInit);
      setTrackDuration(songFile.getDuration());
      //setTrackPoints(points);
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
      //console.log('trackPoints after setTrackPoints', trackPoints);
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
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.detailsContainer}>
        <Text style={globalStyles.songTitle}>{songDetails.title}</Text>
        <Text style={globalStyles.artist}>{songDetails.artist}</Text>
      </View>
      <View style={globalStyles.controlsContainer}>
        <Slider
          style={globalStyles.progressBar}
          minimumValue={0}
          maximumValue={1}
          value={sliderValue}
          minimumTrackTintColor="#111000"
          maximumTrackTintColor="#000000"
          onSlidingStart={slidingStarted}
          onSlidingComplete={slidingCompleted}
          thumbTintColor="#000"
        />
        <View style={globalStyles.trackpointButtonContainer}>
          <TrackPointButton id="id_0" title="title_0" width={30} startTime={0} endTime={0} isRepeating={true} />
          <TrackPointButton id="id_1" title="title_1" width={10} startTime={0} endTime={0} isRepeating={false} />
          <TrackPointButton id="id_2" title="title_2" width={60} startTime={0} endTime={0} isRepeating={false} />
        </View>
        <View key={'but_view_play_pause'} style={globalStyles.buttonsContainer}>
          <View style={globalStyles.button}>
            <TouchableOpacity
              key={'but_play_pause'}
              onPress={onPlayButtonPressed}
              disabled={!isTrackPlayerInit}>
              <Text style={globalStyles.textStyle}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={globalStyles.trackpointButtonContainer}>
        <Button
          color="red"
          title="Add Track Point"
          onPress={onTrackPointButtonPressed}
          disabled={!isPlaying}
        />
      </View>
    </View>
  );
};

export default App;
