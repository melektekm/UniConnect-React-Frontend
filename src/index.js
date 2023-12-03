import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import routes from './routes'; // Import your route configuration

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from './context';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <HashRouter>
    <MaterialUIControllerProvider>
      <App routes={routes} /> 
    </MaterialUIControllerProvider>
  </HashRouter>
);
