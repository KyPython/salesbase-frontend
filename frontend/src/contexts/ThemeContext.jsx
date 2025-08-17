import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import api from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [loading, setLoading] = useState(true);

  // Create Material-UI themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
      },
      divider: '#e0e0e0',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1976d2',
            color: '#ffffff',
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#f48fb1',
        light: '#f8bbd9',
        dark: '#ec407a',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
      },
      divider: '#333333',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
            color: '#ffffff',
          },
        },
      },
    },
  });

  // Load theme from database on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/user-settings');
          const savedTheme = response.data.settings?.theme || 'light';
          setMode(savedTheme);
        } else {
          // Fallback to localStorage if no token
          const savedTheme = localStorage.getItem('theme') || 'light';
          setMode(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from database:', error);
        // Fallback to localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        setMode(savedTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme to database and localStorage
  const saveTheme = async (newMode) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Save to database
        await api.patch('/user-settings/theme', { value: newMode });
      }
      // Always save to localStorage as backup
      localStorage.setItem('theme', newMode);
      setMode(newMode);
    } catch (error) {
      console.error('Failed to save theme to database:', error);
      // Still save to localStorage
      localStorage.setItem('theme', newMode);
      setMode(newMode);
    }
  };

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    saveTheme(newMode);
  };

  // Set specific theme
  const setTheme = (newMode) => {
    if (['light', 'dark'].includes(newMode)) {
      saveTheme(newMode);
    }
  };

  const value = {
    mode,
    toggleTheme,
    setTheme,
    loading,
  };

  if (loading) {
    return <div>Loading theme...</div>;
  }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
