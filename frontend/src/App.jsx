import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import SupplierFormPage from './pages/SupplierFormPage';
import ScreeningPage from './pages/ScreeningPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/suppliers/new" element={<SupplierFormPage />} />
          <Route path="/suppliers/edit/:id" element={<SupplierFormPage />} />
          <Route path="/screening/:id" element={<ScreeningPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
