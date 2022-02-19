/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import TrackPlayer, { Capability, Event, State } from 'react-native-track-player';
import { useProgress, useTrackPlayerEvents } from 'react-native-track-player/lib/hooks';
import Slider from '@react-native-community/slider';

const trackPlayerInit = async () => {
  TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.JumpForward,
      Capability.JumpBackward,
    ],
  });

  await TrackPlayer.setupPlayer();
  await TrackPlayer.add({
    id: '1',
    url:
      'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
    title: 'My Title',
    album: 'My Album',
    artist: 'Rohan Bhatia',
    artwork: 'https://picsum.photos/100',
  });

  return true;
};

const App = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPLaying, setIsPlaying] = useState(false);
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

  const onButtonPressed = () => {
    if (!isPLaying) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
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
    <>
      <Text>Music Player</Text>
      <Button
        title={isPLaying ? 'Pause' : 'Play'}
        onPress={onButtonPressed}
        disabled={!isTrackPlayerInit}
      />
      <Slider
        style={{ width: 400, height: 40 }}
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        minimumTrackTintColor="#111000"
        maximumTrackTintColor="#000000"
        onSlidingStart={slidingStarted}
        onSlidingComplete={slidingCompleted}
      />
    </>
  );
};

export default App;
