
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import LibraryPage from './pages/LibraryPage';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PlayerProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<PrivateRoute />}>
                <Route path="/library" element={<LibraryPage />} />
              </Route>
              <Route path="/" element={<Navigate to="/library" />} />
            </Routes>
          </Router>
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
