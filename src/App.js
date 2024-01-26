import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './assets/theme';
import { Routes, Route } from 'react-router-dom';
import routes from './routes'; // Import your routes
import getLayoutComponent from './getLayoutComponent';

function App() {
  const currentRoute = window.location.pathname;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.route}
            element={getLayoutComponent(route.route, currentRoute === route.route)}
          />
        ))}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
