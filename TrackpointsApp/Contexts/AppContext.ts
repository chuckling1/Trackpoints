import React from 'react';

const AppContext = React.createContext({
    trackPoints: [] as number[],
});

export default AppContext;
