import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.jsx';
import {MantineProvider} from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
