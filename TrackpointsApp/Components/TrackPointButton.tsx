import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import TrackPointButtonInterface from '../Interfaces/TrackPointButtonInterface';

export const TrackPointButton = (
    props: TrackPointButtonInterface,
): JSX.Element => {
    const { id, width, title } = props;

    const style = StyleSheet.create({
        buttonStyle: {
            width: `${width}%`,
            height: 50,
        },
    });

    return (
        <View key={`but_view_${id}`} style={style.buttonStyle}>
            <Button
                key={`but_${id}`}
                title={title}
                onPress={() => {
                    Alert.alert(title);
                }}
            />
        </View>
    );
};

export default TrackPointButton;
