import React, { useContext } from 'react';
import { View } from 'react-native';
import AppContext from './AppContext';
import styles from './styles';
import TrackPointButton from './TrackPointButton';

export const TrackPointButtonBar = (): JSX.Element => {
    const { trackPoints } = useContext(AppContext);
    let trackPointButtonBarView: JSX.Element[] = [];

    console.log(trackPoints.length);

    if (trackPoints.length === 2) {
        const buttonName = `but_${0}`;
        return (
            <View
                key="TrackPointsButtonBar"
                style={styles.trackpointButtonContainer}>
                <TrackPointButton title={buttonName} width={100} />
            </View>
        );
    } else {
        trackPointButtonBarView = [];
        let buttonWidths = [] as number[];
        trackPoints.sort();
        trackPoints.map((time: number, index: number) => {
            if (index !== trackPoints.length - 1) {
                buttonWidths.push(
                    (trackPoints[index + 1] / 100 - trackPoints[index] / 100) *
                    100,
                );
            }
        });
        buttonWidths.map((width: number | undefined, index: number) => {
            if (width && index !== trackPoints.length - 1) {
                const buttonName = `but_${0}`;
                trackPointButtonBarView.push(
                    <TrackPointButton
                        key={buttonName}
                        title={buttonName}
                        width={width}
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
    }
};

export default TrackPointButtonBar;
