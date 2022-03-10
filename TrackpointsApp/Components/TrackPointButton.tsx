import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPointButtonInterface from '../Interfaces/TrackPointInterface';
import globalStyles from '../styles';

export const TrackPointButton = (
    props: TrackPointButtonInterface,
): JSX.Element => {
    const { id, width, title, isRepeating } = props;

    const [isStateRepeating, setIsStateRepeating] = useState(
        isRepeating ? true : false,
    );

    const trackPointButtonStyle = StyleSheet.create({
        buttonView: {
            width: `${width}%`,
            height: 35,
            backgroundColor: isStateRepeating ? 'green' : 'blue',
        },
    });

    const buttonStyleSheet = StyleSheet.flatten([
        globalStyles.button,
        trackPointButtonStyle.buttonView,
    ]);

    const toggleIsRepeating = () => {
        setIsStateRepeating(!isStateRepeating);
    };

    return (
        <View key={`but_view_${id}`} style={buttonStyleSheet}>
            <TouchableOpacity
                key={`but_${id}`}
                onPress={() => {
                    toggleIsRepeating();
                }}>
                <Text style={globalStyles.textStyle}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TrackPointButton;
