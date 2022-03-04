import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

export const TrackPointButton = (props: any): JSX.Element => {
    const { width, title } = props;
    const w = `${width}%`;

    const style = StyleSheet.create({
        buttonStyle: {
            width: w,
            height: 50,
        },
    });

    return (
        <View key={`tpb_${title}`} style={style.buttonStyle}>
            <Button
                title={title}
                onPress={() => {
                    Alert.alert('Width: ' + w);
                }}
            />
        </View>
    );
};

export default TrackPointButton;
