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
import { AppModes } from './AppModes';

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
  const [trackPointData, setTrackPointData] = useState(TrackPointsData);
  const [appMode, setAppMode] = useState(AppModes.Playback);
  const { position } = useProgress(100);
  const trackDuration = songFile.getDuration();

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

  const updateTrackPointData = (points: TrackPointInterface[]) => {
    if (points.length > 1) {
      points.map((current: TrackPointInterface, index: number) => {
        let currentPoint = points[index];
        if (index < points.length - 1) {
          let nextPoint = points[index + 1];
          nextPoint.endTime = currentPoint.endTime;
          currentPoint.endTime = nextPoint.startTime;
          currentPoint.width = (currentPoint.endTime - currentPoint.startTime) * 100;
          nextPoint.width = (nextPoint.endTime - nextPoint.startTime) * 100;
        } else if (index === points.length - 1) {
          current.endTime = 1.0;
          currentPoint.width = (currentPoint.endTime - currentPoint.startTime) * 100;
        }
      });
    }

    return points;
  };

  const onTrackPointButtonPressed = () => {
    if (isPlaying) {
      let points = trackPointData;
      points.push({
        id: `id_${points.length}`,
        title: `title_${points.length}`,
        isRepeating: false,
        startTime: sliderValue,
        endTime: 0,
        width: 0,
      });
      points.sort((a, b) => a.startTime - b.startTime);
      points = updateTrackPointData(points);
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

  const switchModes = () => {
    switch (appMode) {
      case AppModes.Playback:
        setAppMode(AppModes.Edit);
        break;
      case AppModes.Edit:
        setAppMode(AppModes.Playback);
    }
  };

  return (
    <View style={globalStyles.mainContainer}>
      <TrackDetails title={TrackMetaData.title} artist={TrackMetaData.artist} />
      <Text>{sliderValue}</Text>
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
        {(appMode === AppModes.Edit
          ? <>
            <Button
              color="purple"
              title="Save Track Points"
              onPress={switchModes}
            />
            <Button
              color="red"
              title="Add Track Point"
              onPress={onTrackPointButtonPressed}
              disabled={appMode === AppModes.Edit && !isPlaying} />
          </>
          : <Button
            color="orange"
            title="Edit Track Points"
            onPress={switchModes}
          />)
        }
      </View>
    </View>
  );
};

export default App;
