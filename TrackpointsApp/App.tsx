/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import TrackPlayer from 'react-native-track-player';

//function to initialize the Track Player 
const trackPlayerInit = async () => {
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

  //state to manage whether track player is initialized or not
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);

  //initialize the TrackPlayer when the App component is mounted
  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    }
    startPlayer();
  }, []);

  //start playing the TrackPlayer when the button is pressed 
  const onButtonPressed = () => {
    TrackPlayer.play();
  };


  return (
    <>
      <Text>Music Player</Text>
      <Button
        title="Play"
        onPress={onButtonPressed}
        disabled={!isTrackPlayerInit}
      />
    </>
  );
};

export default App;
