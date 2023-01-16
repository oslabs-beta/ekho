import React from 'react';
import reactDom from 'react-dom';

import App from './pages/App';

// mount our React app to the index.html at root element. 
// The || is because React Testing Library doesn't load index.html and therefore can't find #root
reactDom.render(<App/>, document.querySelector('#root') || document.createElement('div'));
