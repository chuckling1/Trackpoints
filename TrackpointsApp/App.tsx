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
import TrackPointButton from './Components/TrackPointButton';
import TrackPointInterface from './Interfaces/TrackPointInterface';
import TrackDetails from './Components/TrackDetails';
import { TrackMetaData } from './TrackMetaData';
import { TrackPointsData } from './TrackPointsData';

const updateOptions = {
  stopWithApp: true,
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpForward,
    Capability.JumpBackward,
    Capability.SeekTo,
  ],
};

const songFile = new Sound(TrackMetaData.fileName, Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const trackPlayerInit = async () => {
  TrackPlayer.updateOptions(updateOptions);
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(TrackMetaData);
  return true;
};

const App = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackPointData, setTrackPointData] = useState(TrackPointsData);
  const { position } = useProgress(100);

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
      setTrackDuration(songFile.getDuration());
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

  const updateButtonWidths = (points: TrackPointInterface[]) => {
    if (points.length > 0) {
      let w = 100 / points.length;
      points.map((point: TrackPointInterface) => {
        point.width = w;
      });
    }
    return points;
  };

  const onTrackPointButtonPressed = () => {
    if (isPlaying) {
      let points = trackPointData;
      points.push({
        id: `id_${trackPointData.length}`,
        title: `title_${trackPointData.length}`,
        isRepeating: false,
        startTime: sliderValue,
        endTime: sliderValue + 5,
        width: 10,
      });
      points.sort();
      points = updateButtonWidths(points);
      setTrackPointData(points);
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
      <TrackDetails title={TrackMetaData.title} artist={TrackMetaData.artist} />
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
          {trackPointData.map((point: TrackPointInterface) => {
            return (
              <TrackPointButton key={point.id} {...point} />);
          })}
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
