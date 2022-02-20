import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  detailsContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flex: 0.75,
    justifyContent: 'flex-start',
  },
  progressBar: {
    height: 20,
    paddingBottom: 90,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
  },
  buttonsContainer: {
    padding: 10,
  },
  trackpointButtonContainer: {
    paddingTop: 50,
  },
});

export default styles;
