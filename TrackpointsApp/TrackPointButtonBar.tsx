import React from 'react';
import { Button, View } from 'react-native';
import styles from './styles';

export const TrackPointButtonBar = (props: any): JSX.Element => {
    const times = props.timeStamps.split('|');
    const trackPointButtonBarView: JSX.Element[] = [];

    times.map((time: string, index: number) => {
        if (index !== times.length - 1) {
            let w = parseInt(times[index + 1], 10) - parseInt(times[index], 10);

            console.log(index);
            trackPointButtonBarView.push(
                <View
                    key={index + '_key'}
                    style={{
                        width: w,
                        flexDirection: 'column',
                    }}>
                    <Button title={'b' + time} onPress={() => { }} />
                </View>,
            );
        }
    });

    return (
        <View style={styles.buttonsContainer}>{trackPointButtonBarView}</View>
    );
};

export default TrackPointButtonBar;
