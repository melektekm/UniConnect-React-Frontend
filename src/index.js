import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import routes from './routes'; // Import your route configuration

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from './context';
import { Provider } from 'react-redux';
import store from './stateManagment/store';
const { ipcRenderer } = window.require('electron');
const container = document.getElementById('app');
const root = createRoot(container);


// Listen for 'update-colors' message from main process
ipcRenderer.on('update-colors', (event, colors) => {
  // Use the updated colors to style your UI components
  document.body.style.backgroundColor = colors.background;
  // Update other UI components with the new colors
});

root.render(
  <Provider store={store}>
   <HashRouter>
    <MaterialUIControllerProvider>
      <App routes={routes} /> 
    </MaterialUIControllerProvider>
  </HashRouter>
  </Provider>
  
);
