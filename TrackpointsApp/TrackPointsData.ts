import TrackPointInterface from './Interfaces/TrackPointInterface';

const trackDuration = 113;

export const TrackPointsData: TrackPointInterface[] = [
    {
        id: 'id_0',
        title: 'title_0',
        isRepeating: false,
        startTime: 0.0,
        endTime: 1.0,
        width: 1,
    },
    {
        id: 'id_1',
        title: 'title_1',
        isRepeating: true,
        startTime: 1.01,
        endTime: 10.0,
        width: 9,
    },
    {
        id: 'id_2',
        title: 'title_2',
        isRepeating: false,
        startTime: 10.01,
        endTime: trackDuration,
        width: 90,
    },
];
