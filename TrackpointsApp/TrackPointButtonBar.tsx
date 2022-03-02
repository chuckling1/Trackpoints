import React, { useContext } from 'react';
import { View } from 'react-native';
import AppContext from './AppContext';
import styles from './styles';
import TrackPointButton from './TrackPointButton';

export const TrackPointButtonBar = (): JSX.Element => {
    const { trackPoints } = useContext(AppContext);
    const trackPointButtonBarView: JSX.Element[] = [];

    trackPoints.map((time: number, index: number) => {
        if (index !== trackPoints.length - 1) {
            trackPointButtonBarView.push(
                <TrackPointButton
                    key={`button_${index}`}
                    startTime={trackPoints[index]}
                    endTime={trackPoints[index + 1]}
                />,
            );
        }
    });

    return (
        <View
            key="TrackPointsButtonBar"
            style={styles.trackpointButtonContainer}>
            {trackPointButtonBarView}
        </View>
    );
};

export default TrackPointButtonBar;
