import React from 'react';
import { Text, View } from 'react-native';
import globalStyles from '../styles';

const TrackDetails = (props: any) => {
    const { title, artist } = props;

    return (
        <View style={globalStyles.detailsContainer}>
            <Text style={globalStyles.songTitle}>{title}</Text>
            <Text style={globalStyles.artist}>{artist}</Text>
        </View>
    );
};

export default TrackDetails;
