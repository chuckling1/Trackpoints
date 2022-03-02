import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    detailsContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsContainer: {
        flex: 0.8,
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
    trackpointButtonBarContainer: {
        paddingTop: 50, 
    },
    trackpointButtonContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default styles;
