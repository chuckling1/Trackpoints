import React from 'react';

const AppContext = React.createContext({
    trackPoints: [] as number[],
    trackDuration: 0,
});

export default AppContext;
