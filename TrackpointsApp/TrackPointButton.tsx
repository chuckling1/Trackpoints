import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

export const TrackPointButton = (props: any): JSX.Element => {
    const { startTime, endTime } = props;
    const w = parseFloat(endTime) - parseFloat(startTime);

    const style = StyleSheet.create({
        buttonStyle: {
            width: 100,
            height: 50,
        },
    });

    return (
        <View key={'trackPoint_' + startTime} style={style.buttonStyle}>
            <Button
                title={'b_' + startTime}
                onPress={() => {
                    Alert.alert('Width: ' + w);
                }}
            />
        </View>
    );
};

export default TrackPointButton;
